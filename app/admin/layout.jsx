"use client";

import { useState } from "react";
import AdminSidebarPage from "@/components/AdminSidebarPage/AdminSidebarPage";
import AdminHeaderPage from "@/components/AdminHeaderPage/AdminHeaderPage";

export default function AdminLayout({ children }) {
  const role = "ADMIN"; // later auth / context se
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <AdminSidebarPage
        role={role}
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1">

        {/* HEADER (TOP) */}
        <AdminHeaderPage
          role={role}
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
