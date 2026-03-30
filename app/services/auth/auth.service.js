import axios from "axios"; // Use standard axios for Proxy calls to avoid interceptors
import api from "@/lib/axios"; // Use your configured instance for direct backend calls
import { Constants } from "@/app/utils/constants";

// ✅ Define Proxy Endpoint Constants
// We define these locally because they point to Next.js (Client Side), not the External Backend.
const LOGIN_PROXY_ROUTE = "/api/auth/login";
const LOGOUT_PROXY_ROUTE = "/api/auth/logout";

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

    // ✅ Explicitly handle 400 Bad Request
    if (error.response?.status === 400) {
      return {
        success: false,
        isWarning: true, // Custom flag you can check in the UI
        message: error.response?.data?.message || "Invalid request. Please check the details provided."
      };
    }

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

    // ✅ Explicitly handle 400 Bad Request
    if (error.response?.status === 400) {
      // Throw a structured object so the UI catch block knows it's a 400
      throw {
        success: false,
        isWarning: true, // Custom flag
        message: error.response?.data?.message || "Invalid OTP or request data."
      };
    }

    throw error.response?.data || error;
  }
};

/**
 * ✅ Admin Login
 * Calls Next.js Proxy to set HTTP-Only cookie
 */
export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_PROXY_ROUTE, {
      type: 'password', // 👈 Flag for Proxy
      username: email,  // API expects 'username'
      password: password
    });
    
    if (response.data.success) {
      return { success: true, data: response.data };
    }

    return { success: false, message: response.data.message || "Login failed" };
  } catch (error) {
    console.error("Admin login error:", error);

    // ✅ Explicitly handle 400 Bad Request
    if (error.response?.status === 400) {
      return {
        success: false,
        isWarning: true, // Custom flag
        message: error.response?.data?.message || "Invalid credentials format."
      };
    }

    return {
      success: false,
      message: error.response?.data?.message || "Invalid credentials. Access Denied."
    };
  }
};

/**
 * ✅ Logout
 * Calls the Next.js API route to clear HttpOnly cookies,
 * which in turn forwards the request to the backend to clear the refresh token.
 */
export const logoutUser = async () => {
  try {
    // We use `api` so the interceptor attaches the Authorization header (from Redux),
    // but we override the `baseURL` to "/" so it hits the Next.js proxy instead of the backend.
    const response = await api.post(LOGOUT_PROXY_ROUTE, {}, { 
      baseURL: "/" 
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Logout error:", error);

    // ✅ Explicitly handle 400 Bad Request
    if (error.response?.status === 400) {
      return {
        success: false,
        isWarning: true, // Custom flag
        message: error.response?.data?.message || "Bad request during logout."
      };
    }

    return {
      success: false,
      message: error.response?.data?.message || "Failed to logout completely",
    };
  }
};