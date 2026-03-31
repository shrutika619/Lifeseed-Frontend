import api from "@/lib/axios"; // Adjust this import if your axios instance is located elsewhere
import { Constants } from "@/app/utils/constants"; // Adjust this import based on where your Constants file is

export const addressService = {
  /**
   * 1. Get All Addresses
   * @returns {Promise<Object>} Response containing the array of addresses
   */
  getAllAddresses: async () => {
    try {
      const response = await api.get(Constants.urlEndPoints.ADDRESS);
      return response.data; // Returns { statusCode, data: { total, addresses }, message, success }
    } catch (error) {
      console.error("Error fetching all addresses:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 2. Get Single Address
   * @param {string} addressId 
   * @returns {Promise<Object>} Single address details
   */
  getSingleAddress: async (addressId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADDRESS_SINGLE}/${addressId}`);
      return response.data; // Returns { statusCode, data: { ...address }, message, success }
    } catch (error) {
      console.error(`Error fetching address ${addressId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 3. Create Address
   * @param {Object} addressData { label, flatNo, streetArea, landmark, pinCode, contactNumber }
   * @returns {Promise<Object>} Created address response
   */
  createAddress: async (addressData) => {
    try {
      const response = await api.post(Constants.urlEndPoints.ADDRESS, addressData);
      return response.data; // Returns { statusCode, data: { addressId, ... }, message, success }
    } catch (error) {
      console.error("Error creating address:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 4. Update Address
   * @param {string} addressId 
   * @param {Object} updateData Partial data e.g., { flatNo: "302222" }
   * @returns {Promise<Object>} Updated address response
   */
  updateAddress: async (addressId, updateData) => {
    try {
      const response = await api.patch(`${Constants.urlEndPoints.ADDRESS}/${addressId}`, updateData);
      return response.data; // Returns { statusCode, data: { addressId, ... }, message, success }
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 5. Delete Address
   * @param {string} addressId 
   * @returns {Promise<Object>} Deletion success response
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`${Constants.urlEndPoints.ADDRESS}/${addressId}`);
      return response.data; // Returns { statusCode, data: { addressId, deleted: true }, message, success }
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error.response?.data || error.message;
    }
  }
};