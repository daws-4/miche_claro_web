import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

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
      return verified.payload as { username: string; rol: string };
    } catch (error) {
      return null;
    }
  }

  if (pathname.startsWith("/login")) {
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    try {
      const payload = await verifyJWT(token);
      if (payload) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
