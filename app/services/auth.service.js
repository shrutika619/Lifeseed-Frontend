import axios from "axios"; // Use standard axios for Proxy calls to avoid interceptors
import api from "@/lib/axios"; // Use your configured instance for direct backend calls
import { Constants } from "@/app/utils/constants";

// ✅ Define Proxy Endpoint Constant
// We define this locally because it points to Next.js (Client Side), not the External Backend.
const LOGIN_PROXY_ROUTE = "/api/auth/login";

/**
 * Send OTP for Login
 * Calls backend directly (no auth needed)
 */
export const sendLoginOtp = async (mobileNo) => {
  try {
    const response = await api.post(Constants.urlEndPoints.SEND_OTP, {
      mobileNo
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Send OTP error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send OTP"
    };
  }
};

/**
 * ✅ CRITICAL: Verify OTP and Login
 * Calls Next.js Proxy to set HTTP-Only cookie
 */
export const verifyLoginOtp = async (mobileNo, otp) => {
  try {
    // ⚠️ Call Next.js API Route (Proxy), NOT the backend directly
    const response = await axios.post(LOGIN_PROXY_ROUTE, {
      type: 'otp', // 👈 Flag for Proxy
      mobileNo,
      otp
    });
    
    // Proxy returns: { success: true, accessToken, user }
    return response.data;

  } catch (error) {
    console.error("Verify OTP error:", error);
    throw error.response?.data || error;
  }
};

/**
 * ✅ Admin Login
 * Calls Next.js Proxy to set HTTP-Only cookie
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(LOGIN_PROXY_ROUTE, {
      type: 'password', // 👈 Flag for Proxy
      username,
      password
    });
    
    return response.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error.response?.data || error;
  }
};