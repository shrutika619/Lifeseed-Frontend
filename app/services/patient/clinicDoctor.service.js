import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const ClinicDoctorService = {
  
  // 1. Get all doctors for a specific clinic (Used when patient views a clinic profile)
  getDoctorsByClinicId: async (clinicId) => {
    if (!clinicId) throw new Error("Clinic ID is required");
    try {
      const response = await api.get(
        `${Constants.urlEndPoints.GET_CLINIC_DOCTORS}/${clinicId}/doctors`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctors for clinic ${clinicId}:`, error);
      throw error?.response?.data || error;
    }
  },

  // 2. Get Combined Doctor Profile, Clinic Info, & Booking Slots
  getDoctorDetailsById: async (doctorId) => {
    if (!doctorId) throw new Error("Doctor ID is required");
    try {
      const response = await api.get(`${Constants.urlEndPoints.GET_CLINIC_DOCTORS}/${doctorId}`);
      return response.data; 
    } catch (error) {
      console.error(`Error fetching details for doctor ${doctorId}:`, error);
      throw error?.response?.data || error;
    }
  },

  // 3. Book an Appointment (Used when patient confirms the slot)
  bookAppointment: async (bookingPayload) => {
    try {
      const response = await api.post(
        Constants.urlEndPoints.BOOK_APPOINTMENT,
        bookingPayload
      );
      return response.data;
    } catch (error) {
      console.error(`Error booking appointment:`, error);
      throw error?.response?.data || error;
    }
  }
};