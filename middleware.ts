import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes: login page and its server action endpoint, plus the
  // robots/sitemap files so search engines can still see the site exists
  // (without indexing anything behind the gate).
  if (
    pathname.startsWith("/login") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    // Fail closed if the server is misconfigured.
    return new NextResponse("Auth is not configured on this server.", {
      status: 500,
    });
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (token && (await verifyToken(token, secret))) {
    return NextResponse.next();
  }

  // Redirect to login, preserving the original destination so we can send
  // them back after a successful sign-in.
  const loginUrl = new URL("/login", req.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("from", pathname + req.nextUrl.search);
  }
  return NextResponse.redirect(loginUrl);
}

// Run on every route except Next's own assets and the favicon. This means
// images and videos under /public also require a valid cookie, which is
// what we want for a private portfolio.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
