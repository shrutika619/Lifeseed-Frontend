"use client";
import { useState, useEffect } from "react";
import HospitalDashboardSidebarPage from "@/components/HospitalDashboardSidebarPage/HospitalDashboardSidebarPage";
import HospitalDashboardHeaderPage from "@/components/HospitalDashboardHeaderPage/HospitalDashboardHeaderPage";

export default function HospitalDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hospitalData, setHospitalData] = useState({
    name: "Care Hospital",
    location: "Sitaburdi, Nagpur"
  });

  // Fetch hospital data on mount (optional)
  useEffect(() => {
    // You can fetch hospital data from API or localStorage here
    const storedHospitalData = localStorage.getItem("hospital_data");
    if (storedHospitalData) {
      setHospitalData(JSON.parse(storedHospitalData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <HospitalDashboardSidebarPage
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        hospitalData={hospitalData}
      />

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1">

        {/* HEADER (TOP) */}
        <HospitalDashboardHeaderPage
          hospitalName={hospitalData.name}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}