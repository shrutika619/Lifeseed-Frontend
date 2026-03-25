import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const adminTicketService = {
  /**
   * Fetch all tickets for a specific user.
   * Uses the activity endpoint with the tab query parameter.
   */
  getUserTickets: async (userId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}?tab=Ticket`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add a new activity log / ticket for a specific user.
   * POST /activity/:userId
   */
  addActivityLog: async (userId, activityData) => {
    try {
      // Note: Make sure Constants.urlEndPoints.CUSTOMER_ACTIVITY maps to "/activity" 
      // or adjust the string below to match your actual route prefix.
      const response = await api.post(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}`, activityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update the status of a specific ticket/activity.
   */
  updateTicketStatus: async (userId, activityId, statusData) => {
    try {
      // If your backend uses /customer/activity/:userId/:activityId
      // Adjust the URL string based on your exact backend route
      const response = await api.patch(`${Constants.urlEndPoints.TICKET_UPDATE}/${userId}/${activityId}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add a comment to a specific ticket.
   * POST /api/v1/customer/activity/:userId/:activityId/comment
   */
  addTicketComment: async (userId, activityId, commentData) => {
    try {
      const response = await api.post(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}/${activityId}/comment`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch specific ticket details including comments.
   * GET /api/v1/customer/activity/:userId/:activityId
   */
  getTicketDetail: async (userId, activityId) => {
    try {
      const response = await api.get(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}/${activityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};