import api from "@/lib/axios"; // ✅ Use the new engine
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
        const response = await api.get(`${Constants.urlEndPoints.GET_CLINICS}`, {
            params: { city: cityId }
        });

        if (response.data && response.data.success) {
            return {
                success: true,
                clinics: response.data.data.clinics,
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
        const response = await api.get(Constants.urlEndPoints.GET_CLINICS_city);
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        return { success: false, data: [] };
    }
};