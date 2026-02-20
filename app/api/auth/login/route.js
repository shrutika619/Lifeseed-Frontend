import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Constants } from "@/app/utils/constants"; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, mobileNo, otp, username, password } = body;

    let response;
    
    // 🛡️ Helper to ensure absolute URL on the server side
    // (If Constants already includes the base URL, this won't break it)
    const getAbsoluteUrl = (endpoint) => {
      if (endpoint.startsWith("http")) return endpoint;
      return `${Constants.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    };
    
    // 🔀 SWITCH ENDPOINT BASED ON LOGIN TYPE
    if (type === 'password') {
      response = await axios.post(getAbsoluteUrl(Constants.urlEndPoints.ADMIN_LOGIN), { 
        username, 
        password 
      });
    } else {
      response = await axios.post(getAbsoluteUrl(Constants.urlEndPoints.VERIFY_OTP), { 
        mobileNo, 
        otp 
      });
    }

    // Handle Response Data
    const resData = response.data.data || response.data;
    const { accessToken, refreshToken, user, isNewUser } = resData;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ success: false, message: "Tokens missing from backend response" }, { status: 401 });
    }

    const cookieStore = await cookies();

    // Set Refresh Token Cookie (Secure, HttpOnly)
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    // Set User Role Cookie (Accessible by Client/Middleware for UI rendering)
    const roleToSave = user?.role || (type === 'password' ? 'super_admin' : 'patient');
    cookieStore.set("user_role", roleToSave, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ 
      success: true, 
      accessToken, 
      user: {
        ...user,
        role: roleToSave 
      },
      isNewUser: isNewUser || false 
    });

  } catch (error) {
    console.error("❌ Login Proxy Error:", error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || "Login failed on server proxy" 
      },
      { status: error.response?.status || 500 }
    );
  }
}