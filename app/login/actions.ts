"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE_NAME,
  AUTH_MAX_AGE_SECONDS,
  signToken,
} from "@/lib/auth";

function safeRedirectPath(from: string | null | undefined): string {
  if (!from) return "/";
  // Only allow same-origin paths to prevent open-redirect abuse.
  if (!from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
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
    redirect(`/login?error=invalid&from=${encodeURIComponent(from)}`);
  }

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
