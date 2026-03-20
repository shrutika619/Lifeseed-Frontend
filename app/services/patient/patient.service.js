import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const getPatientProfile = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_PATIENT_PROFILE);
    
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        success: false,
        isNotFound: true, 
        data: null,
        message: "New user - Profile not setup yet"
      };
    }

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