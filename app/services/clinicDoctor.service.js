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

  // ✅ NEW: Fetch Slots/Availability for a specific Doctor
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
};