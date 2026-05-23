import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const userPanel = pathname.startsWith("/user");
  const adminPanel = pathname.startsWith("/admin");

  if (!session && (adminPanel || userPanel)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session) {
    const role = session.role;

    if (adminPanel && role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (userPanel && role !== "user") {
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
