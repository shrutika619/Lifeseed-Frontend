import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const AdminTeleconsultationSlotsService = {
  
  // 1. Get current saved availability (and empty template if none exists)
  getAvailability: async () => {
    try {
      const response = await api.get(Constants.urlEndPoints.TELECONSULTATION_AVAILABILITY);
      return response.data;
    } catch (error) {
      console.error("Error fetching teleconsultation availability:", error);
      throw error?.response?.data || error;
    }
  },

  // 2. Get duration options for the dropdown
  getDurationOptions: async () => {
    try {
      const response = await api.get(Constants.urlEndPoints.TELECONSULTATION_DURATION_OPTIONS);
      return response.data;
    } catch (error) {
      console.error("Error fetching duration options:", error);
      throw error?.response?.data || error;
    }
  },

  // 3. Get mathematically generated time slots based on a specific duration
  getTimeSlotsByDuration: async (duration) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.TELECONSULTATION_TIME_SLOTS}?duration=${duration}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching time slots for duration ${duration}:`, error);
      throw error?.response?.data || error;
    }
  },

  // 4. Save the global Weekly Availability configuration (Condition 5)
  saveAvailability: async (payload) => {
    try {
      const response = await api.post(Constants.urlEndPoints.TELECONSULTATION_AVAILABILITY, payload);
      return response.data;
    } catch (error) {
      console.error("Error saving teleconsultation availability:", error);
      throw error?.response?.data || error;
    }
  },

  // 5. Turn off a specific slot, optionally forcing it if patients are booked (Conditions 2, 3, 4)
  disableSpecificSlot: async (payload) => {
    try {
      const response = await api.patch(Constants.urlEndPoints.TELECONSULTATION_AVAILABILITY, payload);
      return response.data;
    } catch (error) {
      console.error("Error disabling specific slot:", error);
      throw error?.response?.data || error;
    }
  }
};