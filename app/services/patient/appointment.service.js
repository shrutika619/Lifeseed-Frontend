import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const bookTeleconsultation = async (payload) => {
  try {
    const response = await api.post(Constants.urlEndPoints.BOOK_TELECONSULTATION, payload);
    return response.data;
  } catch (error) {
    console.error("Booking failed:", error);
    return { 
      success: false, 
      message: error?.response?.data?.message || "Failed to book appointment" 
    };
  }
};