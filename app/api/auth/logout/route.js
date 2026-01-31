import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // ✅ FIX: Await cookies()
  const cookieStore = await cookies();
  
  // Delete the cookie
  cookieStore.delete("refreshToken");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}