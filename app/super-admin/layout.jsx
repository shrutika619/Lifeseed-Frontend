"use client";

import { useState } from "react";
import AdminSidebarPage from "@/components/AdminSidebarPage/AdminSidebarPage";
import AdminHeaderPage from "@/components/AdminHeaderPage/AdminHeaderPage";

export default function SuperAdminLayout({ children }) {
  const role = "SUPER_ADMIN"; // later auth / context se
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* 🔹 SIDEBAR */}
      <AdminSidebarPage
        role={role}
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 🔹 RIGHT CONTENT */}
      <div className="flex flex-col flex-1">

        {/* 🔹 HEADER */}
        <AdminHeaderPage
          role={role}
          title="Super Admin Dashboard"
          onMenuToggle={() => setIsSidebarOpen(true)}
        />

        {/* 🔹 PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
