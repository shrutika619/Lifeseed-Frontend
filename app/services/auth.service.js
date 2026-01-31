import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";
/**
 * Send OTP for Login
 * Calls backend directly (no auth needed)
 */
export const sendLoginOtp = async (mobileNo) => {
  try {
    // Import Constants dynamically to avoid issues
    
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
 * Must use Next.js API proxy (/api/login) to set HTTP-Only cookie
 */
export const verifyLoginOtp = async (mobileNo, otp) => {
  try {
    // ✅ Call Next.js API Route (not backend directly)
    // This route will set the HTTP-Only refreshToken cookie
    const response = await api.post(  Constants.urlEndPoints.VERIFY_OTP, {
      mobileNo,
      otp
    }, {
      withCredentials: true // Important for cookie handling
    });
    
    const resData = response.data;

if (!resData.success) {
  throw new Error(resData.message || "Login failed");
}

const { accessToken, user } = resData.data;

if (!accessToken) {
  throw new Error("Login failed - no access token");
}

return {
  accessToken,
  user,
};

  } catch (error) {
    console.error("Verify OTP error:", error);
    throw error;
  }
};

/**
 * ✅ Admin Login (if needed)
 * Also uses Next.js proxy to set cookie
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post("/api/login", {
      username,
      password
    }, {
      withCredentials: true
    });
    
    const data = response.data;
    
    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }
    
    return {
      accessToken: data.accessToken,
      user: data.user
    };
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};