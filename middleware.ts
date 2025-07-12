import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.SECRET_KEY ;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("loginCookie")?.value;
  const { pathname } = request.nextUrl;

  // Function to verify the JWT token
  async function verifyJWT(token: string) {
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(SECRET_KEY)
      );
      return verified.payload as { username: string; rol?: string };
    } catch (error) {
      return null;
    }
  }

  // Si el usuario NO está logeado, bloquea /admin/dashboard/:path* y /dashboard/:path*
  if (!token) {
    if (
      pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Si el usuario está logeado
  const payload = await verifyJWT(token);

  // Si el usuario está logeado pero NO tiene valor en la propiedad rol
  if (payload && !payload.rol) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Si el usuario está logeado y tiene algún valor en la propiedad rol
  if (payload && payload.rol) {
    if (
      pathname.startsWith("/admin/login") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/login")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Si la cookie existe pero no tiene payload válido, redirige a inicio
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/login",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
  ],
};