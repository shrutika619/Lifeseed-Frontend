import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { mobileNo, otp, username, password } = body;

    // ✅ Use the correct backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    
    let response;
    
    // 1. Call Backend - Choose endpoint based on login type
    if (username && password) {
      // Admin login
      response = await axios.post(`${backendUrl}/adminlogin`, { 
        username, 
        password 
      });
    } else {
      // Patient OTP login
      response = await axios.post(`${backendUrl}/auth/verify-otp`, { 
        mobileNo, 
        otp 
      });
    }

    // 2. Handle Response Data
    const resData = response.data.data || response.data;
    const { accessToken, refreshToken, user, isNewUser } = resData;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ 
        success: false, 
        message: "Tokens missing from backend response" 
      }, { status: 401 });
    }

    // 3. ✅ Set HTTP-Only Cookie with correct settings
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false in dev, true in prod
      sameSite: "lax", // Better for redirect flows than 'strict'
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("✅ [Login Proxy] Cookie set successfully");

    // 4. Return access token and user to frontend
    return NextResponse.json({ 
      success: true, 
      accessToken, 
      user, 
      isNewUser: isNewUser || false 
    });

  } catch (error) {
    console.error("❌ Login Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      },
      { status: error.response?.status || 500 }
    );
  }
}