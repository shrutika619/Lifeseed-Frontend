import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// import axios from "axios";
// import { Constants } from "@/app/utils/constants"; 

export async function POST() {
  const cookieStore = await cookies();
  
  // Optional: Call Backend Logout (If you implement server-side token blacklisting later)
  // try {
  //   const refreshToken = cookieStore.get("refreshToken")?.value;
  //   if (refreshToken) {
  //      await axios.post(Constants.urlEndPoints.LOGOUT, {}, { 
  //         headers: { 'Cookie': `refreshToken=${refreshToken}` } 
  //      });
  //   }
  // } catch (e) { console.error("Backend logout failed", e); }

  // Clear both cookies
  cookieStore.delete("refreshToken");
  cookieStore.delete("user_role");

  return NextResponse.json({ success: true, message: "Logged out" });
}