import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

// Helper function to sanitize payloads (turns undefined/null into "")
const sanitizePayload = (data) => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined || sanitized[key] === null) {
      sanitized[key] = "";
    }
  });
  return sanitized;
};

export const adminAddressService = {
  getAllUserAddresses: async (userId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching addresses for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  getSingleUserAddress: async (userId, addressId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}/single/${addressId}`);
      return response.data; 
    } catch (error) {
      console.error(`Error fetching address ${addressId} for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  createUserAddress: async (userId, addressData) => {
    try {
      // Apply Sanitization here
      const safeData = sanitizePayload(addressData);
      const response = await api.post(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}`, safeData);
      return response.data; 
    } catch (error) {
      console.error(`Error creating address for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  updateUserAddress: async (userId, addressId, updateData) => {
    try {
      // Apply Sanitization here
      const safeData = sanitizePayload(updateData);
      const response = await api.patch(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}/${addressId}`, safeData);
      return response.data; 
    } catch (error) {
      console.error(`Error updating address ${addressId} for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  deleteUserAddress: async (userId, addressId) => {
    try {
      const response = await api.delete(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}/${addressId}`);
      return response.data; 
    } catch (error) {
      console.error(`Error deleting address ${addressId} for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  }
};