import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Constants } from "@/app/utils/constants"; // ✅ Import Constants

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, mobileNo, otp, username, password } = body;

    let response;
    
    // 🔀 SWITCH ENDPOINT BASED ON LOGIN TYPE
    if (type === 'password') {
      // ✅ Use Constant for Admin Login
      response = await axios.post(Constants.urlEndPoints.ADMIN_LOGIN, { username, password });
    } else {
      // ✅ Use Constant for OTP Verify
      response = await axios.post(Constants.urlEndPoints.VERIFY_OTP, { mobileNo, otp });
    }

    // 2. Handle Response Data
    const resData = response.data.data || response.data;
    const { accessToken, refreshToken, user, isNewUser } = resData;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ success: false, message: "Tokens missing" }, { status: 401 });
    }

    const cookieStore = await cookies();

    // 3. Set Refresh Token Cookie
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, 
    });

    // 4. Set User Role Cookie
    const roleToSave = user.role || (type === 'password' ? 'super_admin' : 'patient');

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
        message: error.response?.data?.message || "Login failed" 
      },
      { status: error.response?.status || 500 }
    );
  }
}