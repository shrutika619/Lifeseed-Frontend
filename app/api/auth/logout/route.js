import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Constants } from "@/app/utils/constants"; 

export async function POST(request) {
  const cookieStore = await cookies();
  
  try {
    // 1. Grab the Bearer token sent from the frontend Axios interceptor
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      // 2. Call the Express Backend to unset the token in MongoDB
      // Make sure Constants.API_BASE_URL points to your backend (e.g., http://localhost:8000/api/v1)
      await fetch(Constants.urlEndPoints.LOGOUT, {
        method: "POST",
        headers: {
          "Authorization": authHeader, // Pass token to backend so verifyJWT succeeds
          "Content-Type": "application/json"
        }
      });
    }
  } catch (e) { 
    // We catch the error but don't throw it, because we STILL want to clear 
    // the frontend cookies even if the backend fails (force logout).
    console.error("Backend logout failed", e); 
  }

  // 3. Clear Next.js HttpOnly Cookies
  cookieStore.delete("refreshToken");
  cookieStore.delete("user_role");
  
  // If you also store the accessToken in cookies, delete it here:
  cookieStore.delete("accessToken"); 

  return NextResponse.json({ success: true, message: "Logged out completely" });
}