"use client";
import React, { useEffect, useState } from "react";
// ❌ Remove useParams
// import { useParams } from "next/navigation"; 
import { getClinicById } from "@/app/services/clinic.service"; 

import HerosectionClinincseedetailsPage from "./HerosectionClinincseedetailsPage";
import SecondClinicseedetailsPage from "./SecondClinicseedetailsPage";
import ThirdClinicseedetailsPage from "./ThirdClinicseedetailsPage";

// ✅ Accept 'id' as a prop
const ClinicseedetailsPage = ({ id }) => {
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debugging: Confirm ID is received
  console.log("✅ Clinic ID Received:", id);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ Use the 'id' prop directly
      if (id) {
        try {
          const result = await getClinicById(id);
          
          if (result.success) {
            setClinicData(result.data);
          } else {
            console.error("Fetch failed:", result.message);
          }
        } catch (error) {
          console.error("Error in component:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]); // ✅ Dependency array watches 'id' prop

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  console.log(clinicData);
  
  if (!clinicData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <p className="text-xl text-gray-500">Clinic not found.</p>
        <button onClick={() => window.history.back()} className="text-indigo-600 underline">Go Back</button>
    </div>
  );

  return (
    <div>
      <HerosectionClinincseedetailsPage data={clinicData} />
      <SecondClinicseedetailsPage clinic={clinicData.clinic} doctors={clinicData.doctors} />
      <ThirdClinicseedetailsPage clinic={clinicData.clinic} />
    </div>
  );
};

export default ClinicseedetailsPage;