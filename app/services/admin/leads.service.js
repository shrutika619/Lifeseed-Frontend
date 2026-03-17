import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const getFirstTimeLeads = async (params) => {
  try {
    // ✅ Axios automatically converts the params object to ?date=today&search=sheetal
    const response = await api.get(Constants.urlEndPoints.ADMIN_FIRST_TIME_CUSTUMER, { 
      params: params 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching first-time leads:", error);
    return { success: false, data: { leads: [], count: 0, totalNew: 0 } };
  }
};


export const getLoginUsersLeads = async (params) => {
  try {
    const response = await api.get(Constants.urlEndPoints.ADMIN_LOGGED_IN_CUSTUMER, { 
      params: params 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching login users leads:", error);
    return { 
      success: false, 
      data: { leads: [], counts: { total: 0, New: 0, Interested: 0, "Follow-Up": 0, Future: 0, "N-Interested": 0, Cancel: 0, Regular: 0 } } 
    };
  }
};


export const getPatientDetailsById = async (userId) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.GET_PATIENT_DETAILS}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return { success: false, data: null, message: error?.message || "Failed to load profile" };
  }
};

export const submitCustomerProfile = async (userId, payload) => {
  try {
    const response = await api.patch(`${Constants.urlEndPoints.SUBMIT_CUSTOMER_PROFILE}/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting profile:", error);
    return { 
      success: false, 
      message: error?.response?.data?.message || "Failed to save profile" 
    };
  }
};


export const getCustomerActivities = async (userId, tab = "Upcoming") => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}?tab=${tab}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return { success: false, data: { logs: [] } };
  }
};


export const addCustomerActivity = async (userId, payload) => {
  try {
    const response = await api.post(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error adding activity:", error);
    return { 
      success: false, 
      message: error?.response?.data?.message || "Failed to add activity" 
    };
  }
};


export const updateCustomerActivity = async (userId, activityId, payload) => {
  try {
    const response = await api.patch(`${Constants.urlEndPoints.CUSTOMER_ACTIVITY}/${userId}/${activityId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating activity:", error);
    return { 
      success: false, 
      message: error?.response?.data?.message || "Failed to update activity status" 
    };
  }
};


export const createCustomerProfile = async (payload) => {
  try {
    const response = await api.post(`/customer/manual`, payload); 
    return response.data;
  } catch (error) {
    console.error("Error creating manual customer:", error);
    return { 
      success: false, 
      message: error?.response?.data?.message || "Failed to create user" 
    };
  }
};


export const getAdminDropdownData = async () => {
  return { 
    success: true, 
    data: { 
      currentAdmin: { fullName: "Auto-assigned to you", _id: "auto" }, 
      assignToDropdown: [] 
    } 
  };
};


export const getCustomerOrderHistory = async (userId) => {
  try {
    const response = await api.get(`${Constants.urlEndPoints.CUSTOMER_ORDER_HISTORY}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
