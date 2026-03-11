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