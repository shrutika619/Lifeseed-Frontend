import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { decodeJwt } from "jose"; 
import { Constants } from "@/app/utils/constants";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // 🚨 FIX 1: If no token exists, ensure cookies are fully cleared before returning 401
    if (!refreshToken) {
      cookieStore.delete("refreshToken");
      cookieStore.delete("user_role");
      return NextResponse.json(
        { message: "No refresh token cookie found" }, 
        { status: 401 }
      );
    }

    // 1. Decode Token to Identify Role
    let role = 'patient';
    try {
        const payload = decodeJwt(refreshToken);
        role = payload.role || 'patient';
    } catch (e) {
        console.error("Token decode failed", e);
    }

    // 2. Select Endpoint using Constants
    let refreshEndpoint;
    // 🛡️ Helper to ensure absolute URL on the server side
    const getAbsoluteUrl = (endpoint) => {
        if (endpoint.startsWith("http")) return endpoint;
        return `${Constants.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    };

    if (role === 'super_admin' || role === 'admin') {
        refreshEndpoint = getAbsoluteUrl(Constants.urlEndPoints.ADMIN_REFRESH_TOKEN); 
    } else {
        refreshEndpoint = getAbsoluteUrl(Constants.urlEndPoints.REFRESH_TOKEN); 
    }

    // 3. Call Backend
    const response = await axios.post(
      refreshEndpoint, 
      {}, 
      {
        headers: {
          'Cookie': `refreshToken=${refreshToken}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      }
    );

    // 4. Process Response
    const responseData = response.data.data || response.data;
    const { accessToken } = responseData;

    if (!accessToken) {
      throw new Error("No access token returned from refresh");
    }

    // 5. Reconstruct User (if missing)
    let user = responseData.user;
    if (!user) {
      try {
        const payload = decodeJwt(accessToken);
        user = {
          id: payload._id || payload.id,
          mobileNo: payload.mobileNo,
          username: payload.username,
          role: payload.role, 
          ...payload 
        };
      } catch (e) {}
    }

    // 6. Update Cookie on Browser
    if (responseData.refreshToken) {
      cookieStore.set("refreshToken", responseData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return NextResponse.json({
      success: true,
      accessToken,
      user 
    });

  } catch (error) {
    console.error("❌ Refresh Proxy Error:", error.response?.data || error.message);
    
    // 🚨 FIX 2: THE MAGIC WIPE (Corrected)
    // ONLY delete cookies if the backend specifically says the token is invalid/expired (401 or 403).
    // The previous code had a typo: `if(error.response.status = 401)` which assigned 401 and ALWAYS wiped cookies.
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      const cookieStore = await cookies();
      cookieStore.delete("refreshToken");
      cookieStore.delete("user_role");
    }
    
    return NextResponse.json(
      error.response?.data || { message: "Session expired" },
      { status: status || 401 }
    );
  }
}