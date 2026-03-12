"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Building2,
  Video,
  Stethoscope,
  Settings,
  ScrollText,
  Users,
  X,
  Truck, 
  UserCheck 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import { getAdminById } from "@/app/services/admin/adminUsers.service";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "dashboard", moduleKey: "dashboard" },
  { label: "First Time User", icon: MessageSquare, path: "first-time-user", moduleKey: "first_time" },
  { label: "Log In User", icon: UserCheck, path: "log-in-user", moduleKey: "login_users" },
  { label: "In-clinic Consultation", icon: Building2, path: "in-clinic-consultation", moduleKey: "inclinic" },
  { label: "Teleconsultation", icon: Video, path: "teleconsultation", moduleKey: "teleconsultation" },
  { label: "Delivery Manager", icon: Truck, path: "delivery-manager", moduleKey: "delivery_manager" },
  { label: "Clinics", icon: Stethoscope, path: "clinics", moduleKey: "clinic" }, 
  { label: "Setup", icon: Settings, path: "setup", moduleKey: "setup" }, 
  { label: "Audit Logs", icon: ScrollText, path: "auditlogs", moduleKey: "audit_logs" },
  { label: "Team", icon: Users, path: "team", moduleKey: "team" },
];

const AdminSidebarPage = ({ role = "SUPER_ADMIN", isMobileOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentUser = useSelector(selectUser);

  const [activePermissions, setActivePermissions] = useState([]);

  const isSuperAdmin = role === "SUPER_ADMIN" || role === "super_admin";
  const basePath = isSuperAdmin ? "/super-admin" : "/admin";

  useEffect(() => {
    if (isSuperAdmin) return;
    if (!currentUser?._id) return;

    const fetchFreshPermissions = async () => {
      try {
        const res = await getAdminById(currentUser._id);
        if (res.success && res.data?.admin?.modulePermissions) {
          setActivePermissions(res.data.admin.modulePermissions);
        }
      } catch (error) {
        console.error("Failed to fetch fresh permissions", error);
      }
    };

    fetchFreshPermissions();
  }, [currentUser?._id, isSuperAdmin]);

  const filteredMenu = menuItems.filter((item) => {
    if (isSuperAdmin) return true;
    if (item.moduleKey === "super_admin_only") return false; 
    return activePermissions.includes(item.moduleKey);
  });

  const handleNavigation = (path) => {
    router.push(`${basePath}/${path}`);
    onClose?.();
  };

  const isActive = (path) => pathname.startsWith(`${basePath}/${path}`);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <img
            src="/Images/Logo.svg"
            alt="MEN10 Logo"
            className="h-20 w-auto cursor-pointer"
            onClick={() => router.push("/")}
          />

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3">
          {filteredMenu.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              className={`
                w-full flex items-center gap-6 px-4 py-3.5 rounded-lg text-left
                transition-all duration-200 font-medium
                ${
                  isActive(path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}

          {filteredMenu.length === 0 && !isSuperAdmin && (
            <div className="text-sm text-gray-500 text-center py-4 px-2">
              Loading modules...
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebarPage;