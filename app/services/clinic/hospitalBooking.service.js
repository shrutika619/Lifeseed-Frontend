import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const clinicBookingService = {
  /**
   * Fetches bookings for the logged-in clinic.
   * Supports: ?date, ?status, ?paymentStatus, ?doctorId, ?search
   */
  getClinicBookings: async (queryParams = "") => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.GET_INCLINIC_BOOKINGS}${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBookingStatus: async (bookingId, payload) => {
    try {
      const response = await api.patch(Constants.urlEndPoints.UPDATE_INCLINIC_BOOKING_STATUS(bookingId), payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};