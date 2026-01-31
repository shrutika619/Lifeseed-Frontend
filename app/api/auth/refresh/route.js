import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // 🔍 DETAILED LOGGING
    console.log("=" .repeat(60));
    console.log("🔍 [REFRESH PROXY] Starting refresh attempt");
    console.log("=" .repeat(60));
    console.log("📋 Cookie Check:", refreshToken ? "✅ Present" : "❌ MISSING");
    
    if (refreshToken) {
      console.log("📝 Token Preview:", refreshToken.substring(0, 20) + "...");
      console.log("📏 Token Length:", refreshToken.length);
    }

    if (!refreshToken) {
      console.log("❌ [FAIL] No refresh token in cookies");
      return NextResponse.json(
        { message: "No refresh token cookie found on server" }, 
        { status: 401 }
      );
    }

    // ✅ Backend configuration
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    const refreshEndpoint = `${backendUrl}/auth/refresh-access-token`;
    
    console.log("🎯 Backend URL:", backendUrl);
    console.log("🚀 Full Endpoint:", refreshEndpoint);
    console.log("🍪 Sending Cookie Header:", `refreshToken=${refreshToken.substring(0, 20)}...`);

    // ✅ Make request to backend
    const response = await axios.post(refreshEndpoint, {}, {
      headers: {
        'Cookie': `refreshToken=${refreshToken}`
      }
    });

    console.log("✅ Backend Response Status:", response.status);
    console.log("📦 Response Data:", JSON.stringify(response.data, null, 2));

    // ✅ Extract data from response
    const responseData = response.data.data || response.data;
    const { accessToken, refreshToken: newRefreshToken, user } = responseData;

    console.log("🔑 Access Token Received:", accessToken ? "✅ Yes" : "❌ No");
    console.log("🔄 New Refresh Token:", newRefreshToken ? "✅ Yes" : "❌ No");
    console.log("👤 User Data:", user ? "✅ Yes" : "❌ No");

    // ✅ Update cookie if backend sent new refresh token
    if (newRefreshToken) {
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      console.log("🔄 Refresh token cookie updated");
    }

    console.log("=" .repeat(60));
    console.log("✅ [SUCCESS] Refresh completed successfully");
    console.log("=" .repeat(60));

    return NextResponse.json({
      success: true,
      accessToken,
      user
    });

  } catch (error) {
    console.log("=" .repeat(60));
    console.error("❌ [ERROR] Refresh failed");
    console.log("=" .repeat(60));
    console.error("Error Type:", error.constructor.name);
    console.error("Error Message:", error.message);
    
    if (error.code) {
      console.error("Error Code:", error.code);
    }
    
    if (error.response) {
      console.error("HTTP Status:", error.response.status);
      console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
      console.error("Response Headers:", JSON.stringify(error.response.headers, null, 2));
    } else {
      console.error("No Response Received (Network/Connection Error)");
    }
    
    console.log("=" .repeat(60));
    
    // Handle specific error cases
    if (error.code === "ECONNREFUSED") {
        return NextResponse.json(
            { message: "Backend connection refused! Is server running on port 5000?" },
            { status: 500 }
        );
    }

    if (error.code === "ENOTFOUND") {
        return NextResponse.json(
            { message: "Backend host not found! Check NEXT_PUBLIC_API_BASE_URL" },
            { status: 500 }
        );
    }

    return NextResponse.json(
      error.response?.data || { message: error.message },
      { status: error.response?.status || 401 }
    );
  }
}