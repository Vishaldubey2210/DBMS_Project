// src/middleware.ts
import { auth } from "@/shared/lib/auth";
import { NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/users":    ["SUPER_ADMIN"],
  "/audit":    ["SUPER_ADMIN", "AUDITOR"],
  "/reports":  ["SUPER_ADMIN", "REGIONAL_ADMIN", "AUDITOR"],
  "/requests/approve": ["SUPER_ADMIN", "REGIONAL_ADMIN"],
  "/transfers":["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"],
  "/inventory":["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER", "AUDITOR"],
  "/alerts":   ["SUPER_ADMIN", "REGIONAL_ADMIN", "BASE_OFFICER"],
};

export default auth((req) => {
  const session = req.auth;
  const path    = req.nextUrl.pathname;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const userRole = (session.user as any)?.role;

  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (path.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|login|unauthorized|_next|favicon.ico).*)"],
};
