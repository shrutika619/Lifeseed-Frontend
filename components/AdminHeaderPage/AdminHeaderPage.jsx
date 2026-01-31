"use client";
import React from "react";
import { Bell, Menu } from "lucide-react";

const AdminHeaderPage = ({ role = "Admin", title = "Dashboard", onMenuToggle }) => {
  const handleMenuClick = () => {
    console.log("Hamburger clicked");
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left: Hamburger Menu (Mobile) + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            aria-label="Toggle menu"
            type="button"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
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

          {/* Profile Icon */}
          <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition-colors">
            {role.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeaderPage;