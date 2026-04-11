import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Joe Hsia",
  description: "Private portfolio",
  robots: { index: false, follow: false },
};

function safeRedirectPath(from: string | undefined): string {
  if (!from) return "/";
  if (!from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const params = await searchParams;
  const from = safeRedirectPath(params.from);
  const error = params.error ?? null;

  // If already authenticated, skip the form and go straight to the target.
  const secret = process.env.AUTH_SECRET;
  if (secret) {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (token && (await verifyToken(token, secret))) {
      redirect(from);
    }
  }

  return <LoginForm from={from} error={error} />;
}
