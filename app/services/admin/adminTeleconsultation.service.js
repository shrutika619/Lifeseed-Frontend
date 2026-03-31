import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const adminTeleconsultationService = {
  /**
   * 1. Get All Teleconsultation Bookings (with filters)
   * @param {Object} filters { date, consultationStatus, sellResponse, search }
   * @returns {Promise<Object>} List of bookings and counts
   */
  getAllBookings: async (filters = {}) => {
    try {
      // Build query string dynamically based on provided filters
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.consultationStatus) params.append("consultationStatus", filters.consultationStatus);
      if (filters.sellResponse) params.append("sellResponse", filters.sellResponse);
      if (filters.search) params.append("search", filters.search);

      const queryString = params.toString();
      const url = queryString 
        ? `${Constants.urlEndPoints.ADMIN_TELECONSULTATION_BOOKINGS}?${queryString}` 
        : Constants.urlEndPoints.ADMIN_TELECONSULTATION_BOOKINGS;

      const response = await api.get(url);
      return response.data; // { statusCode, data: { consultationCounts, sellResponseCounts, total, bookings }, success }
    } catch (error) {
      console.error("Error fetching teleconsultation bookings:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 2. Get Teleconsultation Booking Details by Record ID
   * @param {string} recordId 
   * @returns {Promise<Object>} Full booking details
   */
  getBookingDetails: async (recordId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_TELECONSULTATION_BOOKINGS}/${recordId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking details for ${recordId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 3. Update Tele Booking (Doctor Panel / Save Form)
   * Note: Uses FormData to handle the 'prescription' file upload.
   * @param {string} recordId 
   * @param {FormData} formData Must be a FormData object, not a standard JSON object
   * @returns {Promise<Object>} Updated record
   */
  updateDoctorPanelDetails: async (recordId, formData) => {
    try {
      const response = await api.patch(
        `${Constants.urlEndPoints.ADMIN_TELECONSULTATION_BOOKINGS}/${recordId}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating doctor panel for ${recordId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 4. Cancel Tele Booking
   * @param {string} recordId 
   * @returns {Promise<Object>} Cancellation success response
   */
  cancelBooking: async (recordId) => {
    try {
      const response = await api.patch(`${Constants.urlEndPoints.ADMIN_TELECONSULTATION_BOOKINGS}/${recordId}/cancel`);
      return response.data; 
    } catch (error) {
      console.error(`Error cancelling booking ${recordId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 5. Reschedule Tele Booking
   * @param {string} recordId 
   * @param {Object} rescheduleData { availabilityId, slotGroupId, slotId }
   * @returns {Promise<Object>} Reschedule success response
   */
  rescheduleBooking: async (recordId, rescheduleData) => {
    try {
      const response = await api.post(
        `${Constants.urlEndPoints.ADMIN_TELECONSULTATION_BOOKINGS}/${recordId}/reschedule`, 
        rescheduleData
      );
      return response.data; 
    } catch (error) {
      console.error(`Error rescheduling booking ${recordId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 6. Get Prefill Data for Appointment Booking
   * @param {string} patientUserId 
   * @returns {Promise<Object>} Prefill data (name, age, contact, etc.)
   */
  getAppointmentPrefill: async (patientUserId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.APPOINTMENT_PREFILL}?patientUserId=${patientUserId}`);
      return response.data; // { statusCode, data: { mobileNo, fullName, age, gender, profileComplete... }, success }
    } catch (error) {
      console.error(`Error fetching appointment prefill for patient ${patientUserId}:`, error);
      throw error.response?.data || error.message;
    }
  }
};

