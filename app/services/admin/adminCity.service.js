import api from "@/lib/axios";

export const adminCityService = {
  getAllCities: async (signal) => {
    try {
      const response = await api.get(`/cities/admin/all`, { signal });
      return response.data;
    } catch (error) {
      if (error.name === 'CanceledError' || error.message === 'canceled') {
        return { canceled: true };
      }
      throw error.response?.data || error;
    }
  },

  createCity: async (payload) => {
    try {
      const response = await api.post(`/cities`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✅ Changed to PUT
  updateCity: async (id, payload) => {
    try {
      const response = await api.put(`/cities/${id}`, payload); 
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};