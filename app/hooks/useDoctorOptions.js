import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

// Assuming you have a simple storage utility, or you can just use state if you don't want to cache
// import { storage } from "@/app/utils/storage"; 

const initialState = {
  ugDegrees: [],
  pgDegrees: [],
  superSpecs: [],
  specialties: [],
};

export const useDoctorOptions = () => {
  const [options, setOptions] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        // Fetch all 4 endpoints at the same time for performance
        const [ugRes, pgRes, superRes, specRes] = await Promise.allSettled([
          api.get(Constants.urlEndPoints.GET_UG_DEGREES),
          api.get(Constants.urlEndPoints.GET_PG_DEGREES),
          api.get(Constants.urlEndPoints.GET_SUPER_SPECIALIZATIONS),
          api.get(Constants.urlEndPoints.GET_PRIMARY_SPECIALTIES)
        ]);

        // Assuming your backend returns { success: true, data: [...] }
        setOptions({
          ugDegrees: ugRes.status === "fulfilled" ? ugRes.value.data.data : [],
          pgDegrees: pgRes.status === "fulfilled" ? pgRes.value.data.data : [],
          superSpecs: superRes.status === "fulfilled" ? superRes.value.data.data : [],
          specialties: specRes.status === "fulfilled" ? specRes.value.data.data : [],
        });
      } catch (error) {
        console.error("Failed to fetch doctor master data options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { options, isLoading };
};