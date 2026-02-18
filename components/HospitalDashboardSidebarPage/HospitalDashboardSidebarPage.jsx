"use client";

import React from "react";
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


import axios from "axios";

const menuItems = [
  { label: "Time Table", icon: Clock, path: "time-table" },
  { label: "Settings", icon: Settings, path: "settings" },
  { label: "Doctors", icon: Users, path: "doctors" },
  { label: "Help", icon: HelpCircle, path: "help" },
  { label: "Terms & Conditions", icon: FileText, path: "terms-conditions" },
];

const HospitalDashboardSidebarPage = ({ isMobileOpen, onClose, hospitalData }) => {
  const router = useRouter();
  const pathname = usePathname();
    const dispatch = useDispatch();


  const basePath = "/hospitaldashboard";

  const handleNavigation = (path) => {
    router.push(`${basePath}/${path}`);
    onClose?.();
  };

   const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });

      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error("Logout API call failed", error);
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
          <h1 className="text-blue-600 font-bold text-2xl">MEN10</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {hospitalData?.name?.charAt(0) || "C"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {hospitalData?.name || "Care Hospital"}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {hospitalData?.location || "Sitaburdi, Nagpur"}
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
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default HospitalDashboardSidebarPage;