import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const adminAddressService = {
  /**
   * 1. Get All Addresses for a Specific User
   * @param {string} userId 
   * @returns {Promise<Object>} Response containing the array of addresses
   */
  getAllUserAddresses: async (userId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}`);
      return response.data; // { statusCode, data: { total, addresses }, message, success }
    } catch (error) {
      console.error(`Error fetching addresses for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 2. Get Single Address for a Specific User
   * @param {string} userId 
   * @param {string} addressId 
   * @returns {Promise<Object>} Single address details
   */
  getSingleUserAddress: async (userId, addressId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}/single/${addressId}`);
      return response.data; // { statusCode, data: { ...address }, message, success }
    } catch (error) {
      console.error(`Error fetching address ${addressId} for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 3. Create Address for a Specific User
   * @param {string} userId 
   * @param {Object} addressData { label, flatNo, streetArea, landmark, pinCode, contactNumber }
   * @returns {Promise<Object>} Created address response
   */
  createUserAddress: async (userId, addressData) => {
    try {
      const response = await api.post(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}`, addressData);
      return response.data; // { statusCode, data: { addressId, ... }, message, success }
    } catch (error) {
      console.error(`Error creating address for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 4. Update Address for a Specific User
   * @param {string} userId 
   * @param {string} addressId 
   * @param {Object} updateData Partial data e.g., { flatNo: "302222" }
   * @returns {Promise<Object>} Updated address response
   */
  updateUserAddress: async (userId, addressId, updateData) => {
    try {
      const response = await api.patch(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}/${addressId}`, updateData);
      return response.data; // { statusCode, data: { addressId, ... }, message, success }
    } catch (error) {
      console.error(`Error updating address ${addressId} for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 5. Delete Address for a Specific User
   * @param {string} userId 
   * @param {string} addressId 
   * @returns {Promise<Object>} Deletion success response
   */
  deleteUserAddress: async (userId, addressId) => {
    try {
      const response = await api.delete(`${Constants.urlEndPoints.ADMIN_ADDRESS_BASE}/${userId}/${addressId}`);
      return response.data; // { statusCode, data: { addressId, deleted: true }, message, success }
    } catch (error) {
      console.error(`Error deleting address ${addressId} for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  }
};