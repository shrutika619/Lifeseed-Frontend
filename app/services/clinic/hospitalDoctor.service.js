import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";
import axios from "axios";

// 1. Get All Doctors
export const getDoctors = async (signal) => {
  try {
    const response = await api.get(Constants.urlEndPoints.HOSPITAL_DOCTORS, { signal });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') return { canceled: true };
    console.error("Error fetching doctors:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch doctors" };
  }
};

// 2. Get Single Doctor by ID
export const getDoctorById = async (id, signal) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.HOSPITAL_DOCTORS}/${id}`, { signal });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') return { canceled: true };
    console.error("Error fetching doctor:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch doctor details" };
  }
};

// 3. Create Doctor
export const createDoctor = async (formData) => {
  try {
    const response = await api.post(Constants.urlEndPoints.HOSPITAL_DOCTORS, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (response.data.success) {
      return { success: true, data: response.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error creating doctor:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create doctor" };
  }
};

// 4. Update Doctor (Full Edit)
export const updateDoctor = async (id, formData) => {
  try {
    const response = await api.patch(`${Constants.urlEndPoints.HOSPITAL_DOCTORS}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (response.data.success) {
      return { success: true, data: response.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error updating doctor:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update doctor" };
  }
};

// 5. Toggle Doctor Status (Active/Inactive)
export const toggleDoctorStatus = async (id, isActive) => {
  try {
    // Note: Backend route is PATCH /:id 
    const response = await api.patch(`${Constants.urlEndPoints.HOSPITAL_DOCTORS}/${id}`, { isActive });
    if (response.data.success) {
      return { success: true, message: "Status updated successfully" };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error toggling status:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update status" };
  }
};

// 6. ✅ NEW: Get Doctor Slot Configuration & Conflict Checking
export const getDoctorSlotConfig = async (id, signal) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.HOSPITAL_DOCTORS}/${id}/slot-config`, { signal });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') return { canceled: true };
    console.error("Error fetching doctor slot config:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch slot configuration" };
  }
};

// 7. Get Master Clinic Slots (For creating a new doctor)
export const getClinicSlots = async (signal) => {
  try {
    const endpoint = Constants?.urlEndPoints?.GET_CLINIC_SLOTS || '/doctors/clinic-slots';
    const response = await api.get(endpoint, { signal });
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') return { canceled: true };
    console.error("Error fetching clinic slots:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch clinic slots" };
  }
};