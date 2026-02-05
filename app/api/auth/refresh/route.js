import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { decodeJwt } from "jose"; 
import { Constants } from "@/app/utils/constants"; // ✅ Import Constants

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
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
    if (role === 'super_admin' || role === 'admin') {
        refreshEndpoint = Constants.urlEndPoints.ADMIN_REFRESH_TOKEN; // ✅ Use Constant
    } else {
        refreshEndpoint = Constants.urlEndPoints.REFRESH_TOKEN; // ✅ Use Constant
    }

    console.log(`🔄 Refreshing for [${role}] via: ${refreshEndpoint}`);

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
    
    const errorResponse = NextResponse.json(
      error.response?.data || { message: "Session expired" },
      { status: error.response?.status || 401 }
    );
    
    return errorResponse;
  }
}