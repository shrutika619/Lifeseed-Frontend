import api from "@/lib/axios";

/**
 * Fetches all available doctors for walk-in appointments.
 * GET: /api/v1/walkin/doctors
 */
export const getWalkInDoctors = async () => {
  try {
    const response = await api.get('/walkin/doctors');
    return response.data;
  } catch (error) {
    console.error("Error fetching walk-in doctors:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Failed to fetch doctors" };
  }
};

/**
 * Fetches available slots for a specific doctor on a specific date.
 * GET: /api/v1/walkin/slots/:doctorId?date=YYYY-MM-DD
 * * @param {string} doctorId - The ID of the selected doctor.
 * @param {string} date - The date string (e.g., '2026-03-17').
 */
export const getWalkInSlots = async (doctorId, date) => {
  try {
    const response = await api.get(`/walkin/slots/${doctorId}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching walk-in slots:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Failed to fetch slots" };
  }
};

/**
 * Searches for existing patients by phone number.
 * GET: /api/v1/walkin/search?phone=9172486346
 * * @param {string} phone - The phone number to search for (min 4 digits recommended for debounce).
 */
export const searchWalkInPatients = async (phone) => {
  try {
    const response = await api.get(`/walkin/search?phone=${phone}`);
    return response.data;
  } catch (error) {
    console.error("Error searching walk-in patients:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Search failed" };
  }
};

/**
 * Fetches prefill data for an existing patient to populate the booking form.
 * GET: /api/v1/walkin/prefill?patientUserId=...
 * * @param {string} patientUserId - The ID of the patient found via search.
 */
export const getWalkInPatientPrefill = async (patientUserId) => {
  try {
    const response = await api.get(`/walkin/prefill?patientUserId=${patientUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching prefill data:", error);
    return { success: false, data: null, message: error.response?.data?.message || "Failed to fetch patient details" };
  }
};

/**
 * Submits the final walk-in booking.
 * POST: /api/v1/walkin/book
 * * @param {Object} payload 
 * @param {string} payload.availabilityId - From the slot selection.
 * @param {string} payload.slotGroupId - From the slot selection.
 * @param {string} payload.slotId - From the slot selection.
 * @param {string} payload.fullName - Patient's name.
 * @param {string} payload.contactNo - Patient's phone number.
 * @param {number} payload.age - Patient's age.
 * @param {string} payload.gender - Patient's gender ('male', 'female', 'other').
 */
export const bookWalkInAppointment = async (payload) => {
  try {
    const response = await api.post('/walkin/book', payload);
    return response.data;
  } catch (error) {
    console.error("Error creating walk-in booking:", error);
    throw error.response?.data || { success: false, message: "Booking failed" };
  }
};