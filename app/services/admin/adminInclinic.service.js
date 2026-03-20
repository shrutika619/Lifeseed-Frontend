import api from "@/lib/axios"; // Your axios instance
import { Constants } from "@/app/utils/constants";

export const adminInclinicService = {
  /**
   * Fetches all in-clinic bookings with summary counts.
   * Add query parameters (e.g., ?page=1&limit=10&status=New) if your API supports pagination/filtering.
   */
  getAllInClinicBookings: async (queryParams = "") => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_INCLINIC_BOOKINGS}${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelInClinicBooking: async (bookingId, notes = "") => {
    try {
      const response = await api.patch(Constants.urlEndPoints.ADMIN_CANCEL_INCLINIC_BOOKING(bookingId), { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};