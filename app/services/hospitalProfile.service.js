import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";
import axios from "axios";

/**
 * Get the profile details of the currently logged-in clinic admin
 */
export const getMeClinicProfile = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_ME_CLINIC_PROFILE);
    if (response.data.success) {
      // Backend returns { clinic: { ... } } inside data
      return { success: true, data: response.data.data.clinic };
    }
    return { success: false, message: response.data.message || "Failed to fetch clinic details" };
  } catch (error) {
    console.error("Get Clinic Profile Error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to fetch clinic profile",
      status: error.response?.status
    };
  }
};

/**
 * Get approved clinics by city (Public Route)
 * @param {string} city - The city name to filter by
 */
export const getPublicClinicsByCity = async (city, signal) => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_PUBLIC_CLINICS, {
      params: { city },
      signal
    });
    if (response.data.success) {
      return { success: true, data: response.data.data.clinics };
    }
    return { success: false, message: response.data.message || "No clinics found" };
  } catch (error) {
    if (axios.isCancel(error)) return { canceled: true };
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to fetch clinics",
      status: error.response?.status
    };
  }
};

/**
 * Update Clinic Details (Includes Photos)
 * @param {FormData} formData - Must be a native FormData object because of file uploads
 */
export const updateClinicProfile = async (formData) => {
  try {
    const response = await api.patch(Constants.urlEndPoints.UPDATE_CLINIC_PROFILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    if (response.data.success) {
      return { success: true, data: response.data.data.clinic, message: "Profile updated successfully" };
    }
    return { success: false, message: response.data.message || "Failed to update profile" };
  } catch (error) {
    console.error("Update Clinic Profile Error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to update clinic profile",
      status: error.response?.status
    };
  }
};

/**
 * Update Clinic Timings
 * @param {Array} timingsArray - Array of timing objects
 */
export const updateClinicTimings = async (timingsArray) => {
  try {
    // Send as JSON. The backend expects { timings: [...] } or a stringified version
    const response = await api.patch(Constants.urlEndPoints.UPDATE_CLINIC_TIMINGS, {
      timings: timingsArray 
    });

    if (response.data.success) {
      return { success: true, data: response.data.data.timings, message: "Timings updated successfully" };
    }
    return { success: false, message: response.data.message || "Failed to update timings" };
  } catch (error) {
    console.error("Update Timings Error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to update timings",
      status: error.response?.status
    };
  }
};