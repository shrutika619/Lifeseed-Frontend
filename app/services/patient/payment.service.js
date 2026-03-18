// src/app/services/patient/payment.service.js (or similar)
import api from "@/lib/axios"; // Ensure you import your axios instance

export const bookingService = {
  createCashBooking: async (payload) => {
    try {
      const response = await api.post('/payment/create-cash-booking', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};