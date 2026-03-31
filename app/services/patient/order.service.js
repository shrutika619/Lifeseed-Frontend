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
  if (!recordId) throw new Error("Record ID is required to fetch booking details");
    const queryType = type || "tele"; 
  try {
    const response = await api.get(`${Constants.urlEndPoints.PATIENT_BOOKINGS}/${recordId}?type=${queryType}`);
    return response.data; 
    
  } catch (error) {
    console.error(`Error fetching ${queryType} booking details for ID ${recordId}:`, error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || "Failed to fetch booking details" 
    };
  }
};

// 5. Get HTML Receipt for Printing
export const getBookingReceiptHTML = async (bookingId) => {
  if (!bookingId) throw new Error("Booking ID is required");
  try {
    // Note: We specifically request the response as text because the backend returns raw HTML, not JSON
    const response = await api.get(`/patient-profile/${bookingId}/receipt`, {
      responseType: 'text'
    });
    return { success: true, html: response.data };
  } catch (error) {
    console.error(`Error fetching receipt for ID ${bookingId}:`, error);
    return { 
      success: false, 
      html: null, 
      message: error.response?.data?.message || "Failed to generate receipt" 
    };
  }
};