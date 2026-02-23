"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Settings,
  Users,
  HelpCircle,
  FileText,
  LogOut,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/slices/authSlice"; 
import { toast } from "sonner"; 

// ✅ Import Services
import { logoutUser } from "@/app/services/auth.service"; 
import { getMeClinicProfile } from "@/app/services/hospitalProfile.service"; // ⬅️ NEW IMPORT

const menuItems = [
  { label: "Time Table", icon: Clock, path: "time-table" },
  { label: "Settings", icon: Settings, path: "settings" },
  { label: "Doctors", icon: Users, path: "doctors" },
  { label: "Help", icon: HelpCircle, path: "help" },
  { label: "Terms & Conditions", icon: FileText, path: "terms-conditions" },
];

const HospitalDashboardSidebarPage = ({ isMobileOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const basePath = "/hospitaldashboard";

  // ✅ State to hold the dynamically fetched clinic info
  const [clinicInfo, setClinicInfo] = useState({
    name: "Loading...",
    location: "Loading...",
    initial: "C"
  });

  // ✅ Fetch Clinic Data on Mount
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

  const handleNavigation = (path) => {
    router.push(`${basePath}/${path}`);
    onClose?.();
  };

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        toast.success("Logged out successfully");
      } else {
        console.warn("Server logout returned false, forcing local logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.info("Logging out locally..."); 
    } finally {
      dispatch(logoutSuccess());
      router.push("/");
      router.refresh();
    }
  };

  const isActive = (path) => pathname.startsWith(`${basePath}/${path}`);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          h-screen w-72
          bg-white border-r border-gray-200
          z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          overflow-y-auto
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <img
            src="/Images/MEN10.svg"
            alt="MEN10 Logo"
            className="h-8 w-auto cursor-pointer"
            onClick={() => router.push("/hospitaldashboard/profile")}
          />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => router.push("/hospitaldashboard/profile")}
          >
            {/* ✅ Dynamic Initial */}
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-lg">
                {clinicInfo.initial}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              {/* ✅ Dynamic Name */}
              <h3 className="font-semibold text-gray-900 truncate">
                {clinicInfo.name}
              </h3>
              {/* ✅ Dynamic Location (Area, City) */}
              <p className="text-sm text-gray-500 truncate">
                {clinicInfo.location}
              </p>
            </div>
            
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left
                transition-all duration-200 font-medium
                ${
                  isActive(path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              <svg
                className="w-4 h-4 ml-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {/* ✅ Dynamic Initial for Logout button too */}
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {clinicInfo.initial}
              </span>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default HospitalDashboardSidebarPage;