"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function clearAuthCookies() {
  const cookieStore = await cookies();  
  cookieStore.delete("token");
  NextResponse.redirect('/login')
}
