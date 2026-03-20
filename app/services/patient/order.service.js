import api from "@/lib/axios";

// 1. Fetch Consultations (Tele & In-Clinic)
export const getMyBookingsHistory = async () => {
  try {
    const response = await api.get('/patient-profile/bookings');
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, data: null };
  }
};

// 2. Fetch Medicine Orders
export const getMyOrdersHistory = async () => {
  try {
    const response = await api.get('/patient-profile/orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, data: null };
  }
};

// 3. Cancel Booking
export const cancelMyBooking = async (recordId) => {
  try {
    const response = await api.patch(`/patient-profile/bookings/${recordId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error.response?.data || error;
  }
};