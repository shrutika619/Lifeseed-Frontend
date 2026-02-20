import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";
import axios from "axios";

/**
 * Fetch all clinics for the Admin Dashboard
 * Uses an AbortController signal for cleanup during unmounts.
 */
export const getAllClinics = async (signal) => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_ALL_CLINICS, { signal });
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    
    return { success: false, message: response.data.message || "Failed to fetch clinics" };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return { canceled: true };
    }
    console.error("Error fetching clinics:", error);
    return { success: false, message: error.response?.data?.message || "Internal server error" };
  }
};

/**
 * Fetch a single clinic by its ID for the Admin Dashboard
 * Endpoint: /admin/clinics/:clinicId
 */
export const getClinicById = async (clinicId, signal) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.GET_ALL_CLINICS}/${clinicId}`, { signal });
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    
    return { success: false, message: response.data.message || "Failed to fetch clinic details" };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return { canceled: true };
    }
    console.error(`Error fetching clinic ${clinicId}:`, error);
    return { success: false, message: error.response?.data?.message || "Internal server error" };
  }
};