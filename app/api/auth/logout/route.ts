import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("loginCookie");

    if (!token) {
      return NextResponse.json(
        {
          message: "Not logged in",
        },
        {
          status: 401,
        }
      );
    }

    cookieStore.delete("loginCookie");

    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
