"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE_NAME,
  AUTH_MAX_AGE_SECONDS,
  signToken,
} from "@/lib/auth";
import { getPostHogClient } from "@/lib/posthog-server";

function safeRedirectPath(from: string | null | undefined): string {
  if (!from) return "/";
  // Only allow same-origin paths to prevent open-redirect abuse.
  if (!from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

async function getPostHogDistinctId(): Promise<string> {
  const jar = await cookies();
  const phCookie = jar.get(`ph_${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN}_posthog`);
  if (phCookie?.value) {
    try {
      const parsed = JSON.parse(phCookie.value);
      if (parsed.distinct_id) return parsed.distinct_id as string;
    } catch {}
  }
  return 'anonymous';
}

export async function login(formData: FormData): Promise<void> {
  const password = (formData.get("password") ?? "").toString();
  const from = safeRedirectPath(formData.get("from")?.toString());

  const expected = process.env.SITE_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!expected || !secret) {
    redirect(`/login?error=config&from=${encodeURIComponent(from)}`);
  }

  if (password !== expected) {
    const distinctId = await getPostHogDistinctId();
    const posthog = getPostHogClient();
    posthog.capture({ distinctId, event: 'login_failed', properties: { reason: 'invalid_password' } });
    await posthog.shutdown();
    redirect(`/login?error=invalid&from=${encodeURIComponent(from)}`);
  }

  const distinctId = await getPostHogDistinctId();
  const posthog = getPostHogClient();
  posthog.capture({ distinctId, event: 'login_succeeded' });
  await posthog.shutdown();

  const token = await signToken(
    { exp: Date.now() + AUTH_MAX_AGE_SECONDS * 1000 },
    secret
  );

  const jar = await cookies();
  jar.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE_SECONDS,
  });

  redirect(from);
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
