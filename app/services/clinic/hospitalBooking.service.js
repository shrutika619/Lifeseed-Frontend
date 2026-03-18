import api from "@/lib/axios";

export const clinicBookingService = {
  /**
   * Fetches bookings for the logged-in clinic.
   * Supports: ?date, ?status, ?paymentStatus, ?doctorId, ?search
   */
  getClinicBookings: async (queryParams = "") => {
    try {
      const response = await api.get(`/inClinicBookings${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBookingStatus: async (bookingId, payload) => {
    try {
      const response = await api.patch(`/inClinicBookings/${bookingId}/status`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};