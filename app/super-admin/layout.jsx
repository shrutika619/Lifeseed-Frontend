"use client";

import { useState } from "react";
import AdminSidebarPage from "@/components/AdminSidebarPage/AdminSidebarPage";
import AdminHeaderPage from "@/components/AdminHeaderPage/AdminHeaderPage";

export default function SuperAdminLayout({ children }) {
  const role = "SUPER_ADMIN"; // later auth / context se
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── MOBILE BACKDROP ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🔹 SIDEBAR */}
      {/* On mobile: fixed overlay, slides in/out. On desktop: static in flow. */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto lg:h-auto lg:transition-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AdminSidebarPage
          role={role}
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* 🔹 RIGHT CONTENT */}
      <div className="flex flex-col flex-1 min-w-0">

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