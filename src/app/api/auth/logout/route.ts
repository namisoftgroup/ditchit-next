import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    (await cookieStore).delete("token");

    const url = new URL("/login", request.url);
    const response = NextResponse.redirect(url);
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Failed to logout", error);
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 });
  }
}