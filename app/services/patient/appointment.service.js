import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";


export const getPatientTeleSlots = async (date) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.GET_PATIENT_TELE_SLOTS}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch slots:", error);
    return { success: false, slotGroups: [] };
  }
};


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