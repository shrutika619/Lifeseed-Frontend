import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const getPatientProfile = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_PATIENT_PROFILE);
    
    const profileData = response.data.data || response.data;

    // ✅ Handle case where backend returns 200 OK, but profile is completely empty
    if (!profileData || Object.keys(profileData).length === 0) {
      console.warn("Profile is empty. User needs to setup profile.");
      return {
        success: false,
        isNotFound: true,
        data: null,
        message: "New user - Profile not setup yet"
      };
    }

    return {
      success: true,
      data: profileData
    };
  } catch (error) {
    // ✅ Gracefully handle 404 as a WARNING, not an ERROR, since it's expected for new users
    if (error.response?.status === 404) {
      console.warn("Profile not found (404) - Expected for new users.");
      return {
        success: false,
        isNotFound: true, 
        data: null,
        message: "New user - Profile not setup yet"
      };
    }

    // Only log actual unexpected errors as errors
    console.error("Get profile error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch profile"
    };
  }
};

export const savePatientProfile = async (profileData) => {
  try {
    const response = await api.post(Constants.urlEndPoints.SAVE_PATIENT_PROFILE, profileData);
    
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

export const updatePatientProfile = async (profileData) => {
  try {
    const response = await api.put(Constants.urlEndPoints.UPDATE_PATIENT_PROFILE, profileData);
    
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