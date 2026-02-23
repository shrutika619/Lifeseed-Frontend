import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const ClinicDoctorService = {
  // Existing function
  getDoctorsByClinicId: async (clinicId) => {
    if (!clinicId) throw new Error("Clinic ID is required");
    try {
      const response = await api.get(
        `${Constants.urlEndPoints.GET_CLINIC_DOCTORS}/${clinicId}/doctors`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctors:`, error);
      throw error?.response?.data || error;
    }
  },

  // Fetch Slots/Availability for a specific Doctor
  getDoctorAvailability: async (doctorId) => {
    if (!doctorId) throw new Error("Doctor ID is required");
    try {
      const response = await api.get(
        `${Constants.urlEndPoints.GET_DOCTOR_AVAILABILITY}/${doctorId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching availability for doctor ${doctorId}:`, error);
      throw error?.response?.data || error;
    }
  },

  // ✅ NEW: Create a new doctor (Supports FormData for profileImage)
  createDoctor: async (formData) => {
    try {
      const response = await api.post("/doctors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      throw error?.response?.data || error;
    }
  },

  // ✅ NEW: Update an existing doctor (Supports FormData for profileImage)
  updateDoctor: async (doctorId, formData) => {
    if (!doctorId) throw new Error("Doctor ID is required");
    try {
      const response = await api.patch(`/doctors/${doctorId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating doctor ${doctorId}:`, error);
      throw error?.response?.data || error;
    }
  },
  
  // ✅ NEW: Get all doctors for the logged-in clinic
  getAllDoctors: async () => {
    try {
      const response = await api.get("/doctors");
      return response.data;
    } catch (error) {
      console.error("Error fetching all doctors:", error);
      throw error?.response?.data || error;
    }
  },
  // Fetch the master clinic slots (the JSON you just showed me)
  getClinicSlots: async () => {
    try {
      const response = await api.get("/clinic-profile/clinic-slots"); // Adjust path if needed
      return response.data;
    } catch (error) {
      console.error("Error fetching clinic slots:", error);
      throw error?.response?.data || error;
    }
  },
};