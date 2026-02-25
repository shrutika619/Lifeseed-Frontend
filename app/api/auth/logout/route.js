// 📂 app/api/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Constants } from "@/app/utils/constants"; 

export async function POST(request) {
  const cookieStore = await cookies();
  
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      const backendLogoutUrl = `${Constants.API_BASE_URL}${Constants.urlEndPoints.LOGOUT}`;
      
      await fetch(backendLogoutUrl, {
        method: "POST",
        headers: {
          "Authorization": authHeader, 
          "Content-Type": "application/json"
        }
      });
    }
  } catch (e) { 
    console.error("Backend logout failed", e); 
  }

  // Clear Next.js HttpOnly Cookies
  cookieStore.delete("refreshToken");
  
  if (cookieStore.has("user_role")) {
      cookieStore.delete("user_role");
  }

  return NextResponse.json({ success: true, message: "Logged out completely" });
}