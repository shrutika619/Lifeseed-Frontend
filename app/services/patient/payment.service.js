import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const bookingService = {
  createCashBooking: async (payload) => {
    try {
      const response = await api.post(Constants.urlEndPoints.CREATE_CASH_BOOKING, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};