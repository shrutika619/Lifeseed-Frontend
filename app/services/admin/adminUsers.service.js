import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";
import axios from "axios";

/**
 * Register a new Team Member / Admin
 */
export const registerTeamMember = async (adminData) => {
  try {
    const response = await api.post(Constants.urlEndPoints.REGISTER_TEAM, adminData);
    if (response.data.success) {
      return { success: true, data: response.data.data, message: response.data.message };
    }
    return { success: false, message: response.data.message || "Registration failed" };
  } catch (error) {
  return { 
    success: false, 
    message: error.response?.data?.message || "Request failed",
    status: error.response?.status // <-- Make sure to pass the status back!
  };
}
};

/**
 * Get all Admins with optional Search and Pagination
 */
export const getAllAdmins = async ({ search = "", page = 1, limit = 10, signal }) => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_ALL_ADMINS, {
      params: { search, page, limit },
      signal,
    });
    
    if (response.data.success) {
      // Handle Backend Quirk: Object might be inside `message` instead of `data`
      const resultData = typeof response.data.message === 'object' ? response.data.message : response.data.data;
      return { success: true, data: resultData };
    }
    return { success: false, message: "Failed to fetch admins" };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') return { canceled: true };
    console.error("Get All Admins Error:", error);
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

/**
 * Get all available Module Permissions for the UI Toggle
 */
export const getModulePermissions = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_MODULES);
    if (response.data.success) {
       // Handle Backend Quirk
      const modules = typeof response.data.message === 'object' ? response.data.message : response.data.data;
      return { success: true, data: modules };
    }
    return { success: false, message: "Failed to fetch modules" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

/**
 * Get a specific Admin by ID
 */
export const getAdminById = async (userId) => {
  try {
    const response = await api.get(Constants.urlEndPoints.ADMIN_ACTION(userId));
    const resData = response.data; // This is the full JSON from the backend

    if (resData.success) {
      // Backend Quirk: The actual object is sometimes inside 'message' instead of 'data'
      const extractedData = (typeof resData.message === 'object' && resData.message !== null) 
        ? resData.message 
        : resData.data;

      return { 
        success: true, 
        data: extractedData 
      }; 
    }
    
    return { success: false, message: resData.message || "Failed to fetch admin details" };
  } catch (error) {
    console.error("Error fetching Admin by ID:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Server error" 
    };
  }
};

/**
 * Update Admin Profile Details (Name, Email, Address, etc.)
 */
export const updateAdminProfile = async (userId, profileData) => {
  try {
    const response = await api.put(Constants.urlEndPoints.ADMIN_PROFILE(userId), profileData);
    if (response.data.success) {
      return { success: true, message: "Profile updated successfully" };
    }
    return { success: false, message: response.data.message || "Failed to update profile" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

/**
 * Update Admin Module Permissions
 */
export const updateAdminPermissions = async (userId, modulesArray) => {
  try {
    const response = await api.put(Constants.urlEndPoints.ADMIN_PERMISSIONS(userId), { modules: modulesArray });
    if (response.data.success) {
      return { success: true, message: "Permissions updated successfully" };
    }
    return { success: false, message: response.data.message || "Failed to update permissions" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};

/**
 * Delete an Admin
 */
export const deleteAdmin = async (userId) => {
  try {
    const response = await api.delete(Constants.urlEndPoints.ADMIN_ACTION(userId));
    if (response.data.success) {
      return { success: true, message: "Admin deleted successfully" };
    }
    return { success: false, message: response.data.message || "Failed to delete admin" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
};