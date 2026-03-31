import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

/**
 * Fetches all available doctors for walk-in appointments.
 */
export const getWalkInDoctors = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_WALKIN_DOCTORS);
    return response.data;
  } catch (error) {
    console.error("Error fetching walk-in doctors:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Failed to fetch doctors" };
  }
};

/**
 * Fetches available slots for a specific doctor on a specific date.
 */
export const getWalkInSlots = async (doctorId, date) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.GET_WALKIN_SLOTS(doctorId)}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching walk-in slots:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Failed to fetch slots" };
  }
};

/**
 * Searches for existing patients by phone number.
 */
export const searchWalkInPatients = async (phone) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.SEARCH_WALKIN_PATIENTS}?phone=${phone}`);
    return response.data;
  } catch (error) {
    console.error("Error searching walk-in patients:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Search failed" };
  }
};

/**
 * Fetches prefill data for an existing patient to populate the booking form.
 */
export const getWalkInPatientPrefill = async (patientUserId) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.GET_WALKIN_PREFILL}?patientUserId=${patientUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching prefill data:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Failed to fetch patient details" };
  }
};

/**
 * Submits the final walk-in booking.
 */
export const bookWalkInAppointment = async (payload) => {
  try {
    const response = await api.post(Constants.urlEndPoints.BOOK_WALKIN_APPOINTMENT, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating walk-in booking:", error);
    throw error.response?.data || { success: false, message: "Booking failed" };
  }
};