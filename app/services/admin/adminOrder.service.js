import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const adminOrderService = {
  // Uses query param: ?teleRecordId=
  prefetchOrderDetails: async (teleRecordId) => {
    try {
      const response = await api.get(
        `${Constants.urlEndPoints.ADMIN_ORDER_PREFETCH}?teleRecordId=${teleRecordId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Uses query param: ?teleRecordId=
  placeOrder: async (teleRecordId, orderData) => {
    try {
      const response = await api.post(
        `${Constants.urlEndPoints.ADMIN_ORDER_PLACE}?teleRecordId=${teleRecordId}`, 
        orderData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assuming history still uses path params, or update it here if it also changed to ?userId=
  getOrderHistory: async (userId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.ADMIN_ORDER_HISTORY}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};