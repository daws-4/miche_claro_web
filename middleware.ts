import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.SECRET_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Function to verify the JWT token
  const token = request.cookies.get("loginCookie")?.value;
  async function verifyJWT(token: string) {
    if (!SECRET_KEY) {
      console.error("SECRET_KEY is not defined");
      return null;
    }
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(SECRET_KEY)
      );
      return verified.payload as {
        username: string;
        rol?: number;
        estado?: string;
        _id: string;
      };
    } catch (error) {
      return null;
    }
  }

  // If the user is NOT logged in, block protected routes
  if (!token) {
    if (
      pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If the user is logged in
  const payload = await verifyJWT(token);

  // If the token is invalid or expired
  if (!payload) {
    // Clear the invalid cookie and redirect
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("loginCookie");
    return response;
  }

  // If the user is logged in but is NOT an admin (no role)
  if (!payload.rol) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If the user is an admin (has a role)
  if (payload.rol) {
    // --- NUEVA REGLA ---
    // If the admin's role is less than 5, block access to the admin management page
    if (pathname.startsWith("/admin/dashboard/admin") && payload.rol < 5) {
      // Redirect them to the main dashboard or another appropriate page
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Prevent logged-in admins from accessing login pages
    if (pathname.startsWith("/admin/login") || pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Default case if something unexpected happens
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/login",
    "/dashboard/:path*",
    "/login",
  ],
};
