"use client";
import React, { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { getMeClinicProfile } from "@/app/services/clinic/hospitalProfile.service"; // ⬅️ NEW IMPORT

const HospitalDashboardHeaderPage = ({ onMenuToggle }) => {
  // 1. Setup local state for clinic data
  const [clinicInfo, setClinicInfo] = useState({
    name: "MEN10 Clinic",
    location: "Loading...",
    initial: "M",
  });

  // 2. Fetch data on component mount
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await getMeClinicProfile();
        if (response.success && response.data) {
          const clinic = response.data.clinic;
          
          // Clean up location format (e.g. "Sitaburdi, Nagpur")
          const area = clinic.areaName || "";
          const city = response.data.cityName || "";
          const formattedLocation = [area, city].filter(Boolean).join(", ");

          setClinicInfo({
            name: clinic.clinicName || "MEN10 Clinic",
            location: formattedLocation || "Location Unavailable",
            initial: (clinic.clinicName || "M").charAt(0).toUpperCase()
          });
        } else {
          setClinicInfo({ name: "MEN10 Clinic", location: "Location Unavailable", initial: "M" });
        }
      } catch (error) {
        console.error("Failed to load sidebar clinic data", error);
        setClinicInfo({ name: "MEN10 Clinic", location: "Location Unavailable", initial: "M" });
      }
    };

    fetchSidebarData();
  }, []);

  const handleMenuClick = () => {
    console.log("Hamburger clicked");
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left: Hamburger Menu (Mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            aria-label="Toggle menu"
            type="button"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <img
            src="/Images/MEN10.svg"
            alt="MEN10 Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              10
            </span>
          </button>

          {/* Profile Icon with Fetched Data */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-sm font-semibold text-gray-800 leading-none">
                {clinicInfo.name}
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide mt-1">
                {clinicInfo.location}
              </span>
            </div>
            <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
              {clinicInfo.initial}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HospitalDashboardHeaderPage;