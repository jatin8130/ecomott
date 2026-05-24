import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isUserRoute = pathname.startsWith("/user");
  const isAdminRoute = pathname.startsWith("/admin");

  // not logged in
  if (!token && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token?.role as string | undefined;

  if (token) {
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isUserRoute && role !== "user") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if ((pathname === "/login" || pathname === "/signup") && role === "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if ((pathname === "/login" || pathname === "/signup") && role === "admin") {
      return NextResponse.redirect(new URL("/admin/orders", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/login", "/signup"],
};