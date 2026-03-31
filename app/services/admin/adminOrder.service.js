import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const adminOrderService = {
  // Pass an object like { teleRecordId: "123" } or { userId: "456" }
  prefetchOrderDetails: async (queryParams) => {
    try {
      const response = await api.get(Constants.urlEndPoints.ADMIN_ORDER_PREFETCH, {
        params: queryParams // Axios automatically formats this into ?key=value
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  placeOrder: async (queryParams, orderData) => {
    try {
      const response = await api.post(Constants.urlEndPoints.ADMIN_ORDER_PLACE, orderData, {
        params: queryParams 
      });
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