import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

// 1. Fetch Consultations (Tele & In-Clinic)
export const getMyBookingsHistory = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.PATIENT_BOOKINGS);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, data: null };
  }
};

// 2. Fetch Medicine Orders
export const getMyOrdersHistory = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.PATIENT_ORDERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, data: null };
  }
};

// 3. Cancel Booking 
export const cancelMyBooking = async (recordId, type) => {
  try {
    const response = await api.patch(`${Constants.urlEndPoints.PATIENT_BOOKINGS}/${recordId}/cancel?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error.response?.data || error;
  }
};

// 4. Get Booking Details
export const getMyBookingDetails = async (recordId, type) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.PATIENT_BOOKINGS}/${recordId}?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error.response?.data || error;
  }
};