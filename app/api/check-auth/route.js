import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // ✅ Force this route to never be static

export async function GET(request) {
  try {
    // ✅ Use await cookies() to read the latest data
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    
    // Check if token exists
    if (accessToken && accessToken.value) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}