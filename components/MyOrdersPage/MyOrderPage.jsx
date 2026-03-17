"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Settings,
  ShoppingBag,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  User,
  Calendar,
  Phone,
  MapPin,
  Navigation,
} from "lucide-react";

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ userName, phone }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Settings", icon: Settings, href: "/profile" },
    { label: "My Orders", icon: ShoppingBag, href: "/profile/myorders" },
    { label: "Help", icon: HelpCircle, href: "/profile/help" },
    { label: "Privacy Policy", icon: Shield, href: "/profile/privacy" },
    { label: "Terms & Conditions", icon: FileText, href: "/profile/terms" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-1 w-full">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{userName}</p>
          <p className="text-xs text-slate-500">{phone}</p>
        </div>
      </div>

      {/* Nav Items */}
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <item.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            {item.label}
          </button>
        );
      })}

      {/* Logout */}
      <button className="mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors w-full">
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};

// ─── Orders Data ───────────────────────────────────────────────────────────────
const orders = [
  {
    id: "TC-98765",
    type: "Teleconsultation",
    status: "Upcoming",
    timeSlot: "Nov 25, 2024 · 11:30 AM – 12:00 PM",
    bookedOn: "Booked on Nov 20, 2024, 8:15 PM",
    amountPaid: "₹499",
    actions: ["cancel", "callNow"],
  },
  {
    id: "IC-67890",
    type: "In-Clinic Consultation",
    status: "Upcoming",
    doctorName: "Dr. Rohan Gupta",
    specialization: "General Physician",
    timeSlot: "Nov 28, 2024 · 5:00 PM – 5:30 PM",
    clinicName: "MEN10 SEXUAL HEALTH CLINIC – Kothrud",
    clinicAddress:
      "Shop No.3, Satara Heights, Paud Road, Near Chandani Chowk, Kothrud, Pune – 411038",
    bookedOn: "Booked on Nov 21, 2024, 10:05 AM",
    amountPaid: "₹699",
    actions: ["cancel", "callNow"],
  },
  {
    id: "MED-12908",
    type: "Medicine Order",
    status: "Delivered",
    medicineName: "Paracetamol (1 strip)",
    moreItems: "+2 more items",
    deliveredOn: "Delivered on Nov 1, 2024",
    orderedOn: "Ordered on Oct 29, 2024, 3:20 PM",
    amountPaid: "₹285",
    actions: ["reorder", "details"],
  },
];

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles =
    status === "Upcoming"
      ? "bg-blue-50 text-blue-600 border border-blue-100"
      : "bg-green-50 text-green-700 border border-green-100";
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles}`}>
      {status}
    </span>
  );
};

// ─── Time Slot ─────────────────────────────────────────────────────────────────
const TimeSlot = ({ slot }) => (
  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3">
    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
    <span className="text-sm font-medium text-blue-700">{slot}</span>
  </div>
);

// ─── My Orders Page ────────────────────────────────────────────────────────────
const MyOrderPage = () => {
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">

          {/* ── Left Sidebar ── */}
          <div className="w-72 flex-shrink-0">
            <Sidebar userName="abc" phone="9532545452" />
          </div>

          {/* ── Right Content ── */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-800 mb-5">My Orders</h1>

            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-base font-semibold text-slate-800">
                      {order.type}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-slate-400 mb-3">#{order.id}</p>

                  {/* Doctor Info */}
                  {order.doctorName && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {order.doctorName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.specialization}
                      </p>
                    </div>
                  )}

                  {/* Time Slot */}
                  {order.timeSlot && <TimeSlot slot={order.timeSlot} />}

                  {/* Clinic Info */}
                  {order.clinicName && (
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {order.clinicName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.clinicAddress}
                        </p>
                        <button
                          onClick={() => showToast("Opening directions...")}
                          className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          Get Directions
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Medicine Info */}
                  {order.medicineName && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {order.medicineName}
                      </p>
                      <p className="text-xs text-slate-500">{order.moreItems}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {order.deliveredOn}
                      </p>
                      <p className="text-xs text-slate-500">{order.orderedOn}</p>
                    </div>
                  )}

                  <hr className="border-slate-100 my-3" />

                  {/* Booking Meta */}
                  {order.bookedOn && (
                    <p className="text-xs text-slate-400 mb-3">{order.bookedOn}</p>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">Amount Paid</p>
                      <p className="text-base font-semibold text-slate-800">
                        {order.amountPaid}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* Cancel / Reorder — outlined */}
                      {order.actions.includes("cancel") && (
                        <button
                          onClick={() => showToast("Cancellation requested")}
                          className="text-sm font-medium px-5 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {order.actions.includes("reorder") && (
                        <button
                          onClick={() => showToast("Reorder placed!")}
                          className="text-sm font-medium px-5 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          Reorder
                        </button>
                      )}

                      {/* Call Now — solid blue */}
                      {order.actions.includes("callNow") && (
                        <button
                          onClick={() => showToast("Calling now...")}
                          className="text-sm font-medium px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call Now
                        </button>
                      )}

                      {/* Details — solid blue */}
                      {order.actions.includes("details") && (
                        <button
                          onClick={() => showToast("Opening order details...")}
                          className="text-sm font-medium px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg transition-all duration-300 ${
          toastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {toast}
      </div>
    </div>
  );
};

export default MyOrderPage;