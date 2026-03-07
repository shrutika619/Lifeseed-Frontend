import api from "@/lib/axios";

/**
 * ✅ FIXED: Get Patient Profile
 * Backend extracts userId from JWT token in Authorization header
 * No need to pass userId as parameter
 */
export const getPatientProfile = async () => {
  try {
    // ✅ No userId in URL - backend uses JWT token
    // URL is constructed from api baseURL + relative path
    const response = await api.get('/patient-profile');
    
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Get profile error:", error);
    
    if (error.response?.status === 404) {
      return {
        success: false,
        isNotFound: true,
        message: "Profile not found"
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch profile"
    };
  }
};

/**
 * ✅ Save/Update Patient Profile
 * Backend extracts userId from JWT token in Authorization header
 */
export const savePatientProfile = async (profileData) => {
  try {
    // ✅ No userId in URL - backend uses JWT token
    const response = await api.post('/patient-profile/save', profileData);
    
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Save profile error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save profile"
    };
  }
};

/**
 * ✅ Update Patient Profile (if you have separate update endpoint)
 */
export const updatePatientProfile = async (profileData) => {
  try {
    // ✅ No userId in URL - backend uses JWT token
    const response = await api.put('/patient-profile', profileData);
    
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile"
    };
  }
};