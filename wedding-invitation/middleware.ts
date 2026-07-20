// middleware.ts
// Protect all /admin routes using Edge-compatible authConfig

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/login";

  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLoginRoute && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
