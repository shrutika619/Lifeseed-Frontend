import axios from "axios";
import { Constants } from "@/app/utils/constants";

export const getAllClinics = async (cityId) => {
    if (!cityId) {
        return { 
            success: false, 
            clinics: [], 
            message: "City not found. Please select a valid city." 
        };
    }

    try {
        const response = await axios.get(`${Constants.urlEndPoints.GET_CLINICS}`, {
            params: { city: cityId }
        });

        if (response.data && response.data.success) {
            return {
                success: true,
                clinics: response.data.data.filteredClinics || [], 
                total: response.data.data.total,
                message: response.data.message
            };
        }
        
        return { 
            success: false, 
            clinics: [], 
            message: response.data?.message || "Failed to fetch clinics" 
        };

    } catch (error) {
        console.error("Error fetching clinics:", error);
        return { 
            success: false, 
            clinics: [], 
            message: error.response?.data?.message || "Server Error" 
        };
    }
};

export const getAllCities = async () => {
    try {
        // 1. Debug the URL first
        const url = Constants.urlEndPoints.GET_CLINICS_city;

        if (!url) throw new Error("URL Constant is undefined!");

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        // 2. Log the specific error details
        console.error("Error fetching cities:", error.message);
        if (error.response) {
            console.error("Server Status:", error.response.status);
            console.error("Server Data:", error.response.data);
        }
        return []; // Return empty array so UI doesn't crash
    }
};

export const getClinicById = async (id) => {
  try {
    // Uses the existing GET_CLINICS endpoint + ID
    // Final URL: http://localhost:5000/api/v1/public/clinics/{id}
    const response = await axios.get(`${Constants.urlEndPoints.GET_CLINICS}/${id}`);
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error fetching clinic details:", error);
    return { success: false, message: "Failed to load clinic details" };
  }
};