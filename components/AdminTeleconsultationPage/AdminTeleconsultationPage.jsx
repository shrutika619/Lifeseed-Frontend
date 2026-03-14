"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Phone,
  User,
  MoreVertical,
  Calendar,
  Download,
  FileText,
  MapPin,
  X,
  PhoneCall,
  Video,
  CheckCircle,
  Settings,
  ArrowLeft,
  Stethoscope,
} from "lucide-react";

/* ─────────────────────────────────────────────
   MODALS
───────────────────────────────────────────── */

const CallModal = ({ patient, onClose }) => {
  if (!patient) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Call Patient</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{patient.name}</p>
            <p className="text-sm text-slate-500">Age {patient.age}</p>
            <p className="text-base font-bold text-blue-600 mt-0.5">{patient.phone}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={`tel:${patient.phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   THREE-DOT DROPDOWN
───────────────────────────────────────────── */

const ActionDropdown = ({ item, onClose, onCancel, onReschedule }) => {

  const handleDownload = () => {
    const content = [
      `Booking ID: ${item.id}`,
      `Patient: ${item.customer.name}, Age ${item.customer.age}`,
      `Phone: ${item.customer.phone}`,
      `Email: ${item.customer.email}`,
      `Location: ${item.customer.location}`,
      `Agent: ${item.agent}`,
      `Doctor: ${item.doctor}`,
      `Consultation Status: ${item.consultationStatus}`,
      `Sell Response: ${item.sellResponse}`,
      `Appointment: ${item.appointment}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `booking-${item.id.replace("#", "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const actions = [
    {
      icon: X, label: "Cancel", color: "text-red-600", bg: "hover:bg-red-50",
      onClick: () => { onCancel && onCancel(); onClose(); },
    },
    {
      icon: Stethoscope, label: "Doctor Panel", color: "text-violet-600", bg: "hover:bg-violet-50",
      href: "/super-admin/teleconsultation/doctorpanal",
    },
    {
      icon: PhoneCall, label: "Call Clinic", color: "text-slate-600", bg: "hover:bg-slate-50",
      onClick: () => { window.location.href = "tel:+911800000000"; onClose(); },
    },
    {
      icon: FileText, label: "Profile & CRM", color: "text-indigo-600", bg: "hover:bg-indigo-50",
      href: "/super-admin/teleconsultation/customerprofile",
    },
    {
      icon: Calendar, label: "Reschedule", color: "text-orange-600", bg: "hover:bg-orange-50",
      onClick: () => { onReschedule && onReschedule(); onClose(); },
    },
    {
      icon: Phone, label: "Call Patient", color: "text-blue-600", bg: "hover:bg-blue-50",
      onClick: () => { window.location.href = `tel:${item.customer.phone}`; onClose(); },
    },
    {
      icon: Download, label: "Download", color: "text-emerald-600", bg: "hover:bg-emerald-50",
      onClick: handleDownload,
    },
    {
      icon: MapPin, label: "Tracking", color: "text-purple-600", bg: "hover:bg-purple-50",
      onClick: () => { window.open(`https://maps.google.com/?q=${item.customer.location}`, "_blank"); onClose(); },
    },
    {
      icon: FileText, label: "Ticket", color: "text-cyan-600", bg: "hover:bg-cyan-50",
      onClick: () => { alert(`Ticket raised for ${item.id}`); onClose(); },
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-40 min-w-[185px] py-1">
      {actions.map(({ icon: Icon, label, color, bg, onClick, href }) =>
        href ? (
          <a
            key={label}
            href={href}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </a>
        ) : (
          <button
            key={label}
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        )
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   HYBRID ACTION CELL  📞 👤 ⋮
───────────────────────────────────────────── */

const ActionCell = ({ item }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [callModal,    setCallModal]    = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {callModal && <CallModal patient={item.customer} onClose={() => setCallModal(false)} />}

      <div className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => setCallModal(true)}
          title="Call Patient"
          className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-blue-200 shadow-sm"
        >
          <Phone className="w-4 h-4" />
        </button>

        <a
          href={`/super-admin/teleconsultation/customerprofile`}
          title="View Profile"
          className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-indigo-200 shadow-sm"
        >
          <User className="w-4 h-4" />
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((p) => !p)}
            title="More Actions"
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-sm"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && (
            <ActionDropdown
              item={item}
              onClose={() => setShowDropdown(false)}
              onCancel={() => alert(`Booking ${item.id} canceled`)}
              onReschedule={() => alert(`Reschedule ${item.id}`)}
            />
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

const AdminTeleconsultationPage = () => {
  const router = useRouter();
  const [searchTerm,   setSearchTerm]   = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTime, setSelectedTime] = useState("Today");

  const bookingData = [
    {
      id: "#AMB2914",
      customer: { name: "Sheetal Dayal", age: 50, phone: "9973827100", email: "sheetald@xyz.com", location: "Nagpur" },
      agent: "ABC", doctor: "Dr. Aditya Aswar",
      consultationStatus: "Complete",   sellResponse: "Interested",    appointment: "25 Apr, 10:30 AM",
    },
    {
      id: "#AMB2915",
      customer: { name: "Kunal Joshi", age: 36, phone: "9973827100", email: "kunal@xyz.com", location: "Pune" },
      agent: "ABC", doctor: "Dr. Aditya Aswar",
      consultationStatus: "Pending/Upcoming", sellResponse: "Not-Interested", appointment: "25 Apr, 10:30 AM",
    },
    {
      id: "#AMB2916",
      customer: { name: "Rajesh Kumar", age: 45, phone: "9973827100", email: "rajesh@xyz.com", location: "Mumbai" },
      agent: "ABC", doctor: "Dr. Aditya Aswar",
      consultationStatus: "Canceled",   sellResponse: "Future",        appointment: "25 Apr, 10:30 AM",
    },
    {
      id: "#AMB2917",
      customer: { name: "Priya Sharma", age: 38, phone: "9973827100", email: "priya@xyz.com", location: "Delhi" },
      agent: "ABC", doctor: "Dr. Aditya Aswar",
      consultationStatus: "Complete",   sellResponse: "Placed",        appointment: "25 Apr, 10:30 AM",
    },
  ];

  const filteredData = useMemo(() => {
    return bookingData.filter((item) => {
      const matchesSearch =
        item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        activeFilter === "All" ||
        item.sellResponse === activeFilter ||
        item.consultationStatus === activeFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans">

      {/* ── Row 1: Back + Date + Consultation Status Badges + Configure Slot ── */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 mb-4">

        {/* ── BACK BUTTON ── */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="relative w-full sm:w-auto">
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Custom Range</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill count="06" label="Reschedule" color="bg-slate-100 text-slate-600 border border-slate-200"        onClick={() => setActiveFilter("Reschedule")} />
          <StatusPill count="03" label="Complete"   color="bg-emerald-50 text-emerald-700 border border-emerald-200"  onClick={() => setActiveFilter("Complete")} />
          <StatusPill count="00" label="Canceled"   color="bg-red-50 text-red-600 border border-red-200"              onClick={() => setActiveFilter("Canceled")} />
          <StatusPill count="06" label="Follow UP"  color="bg-blue-50 text-blue-700 border border-blue-200"           onClick={() => setActiveFilter("Follow UP")} />
          <StatusPill count="00" label="Time out"   color="bg-orange-50 text-orange-600 border border-orange-200"     onClick={() => setActiveFilter("Time out")} />
        </div>

        {/* ── Configure Slot Button ── */}
        <Link
          href="/super-admin/teleconsultation/configureslot"
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          <Settings className="w-4 h-4" />
          Configure Slot
        </Link>
      </div>

      {/* ── Row 2: Sell Status ── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest py-1.5 px-2 bg-slate-100 rounded-md">
          Sell Status
        </span>
        <StatusPill count="06" label="May be"        color="bg-slate-100 text-slate-700 border border-slate-200"    onClick={() => setActiveFilter("May be")} />
        <StatusPill count="03" label="Placed"        color="bg-emerald-50 text-emerald-700 border border-emerald-200" onClick={() => setActiveFilter("Placed")} />
        <StatusPill count="03" label="Interested"    color="bg-cyan-50 text-cyan-700 border border-cyan-200"        onClick={() => setActiveFilter("Interested")} />
        <StatusPill count="00" label="Not-Interested" color="bg-pink-50 text-pink-700 border border-pink-200"       onClick={() => setActiveFilter("Not-Interested")} />
        <StatusPill count="00" label="Future"        color="bg-orange-50 text-orange-700 border border-orange-200"  onClick={() => setActiveFilter("Future")} />
        <StatusPill count="00" label="50-50"         color="bg-yellow-50 text-yellow-700 border border-yellow-200"  onClick={() => setActiveFilter("50-50")} />
        <StatusPill count="06" label="Time pass"     color="bg-slate-50 text-slate-500 border border-slate-200"     onClick={() => setActiveFilter("Time pass")} />
      </div>

      {/* ── Row 3: Search + Action Buttons ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">

        <div className="flex items-center gap-2 w-full lg:flex-1">
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg">
            <Plus className="w-4 h-4" />
            Add Booking
          </button>
          <button className="relative bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:border-emerald-400">
            <Video className="w-4 h-4" />
            Consult Now/Upcoming
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              03
            </span>
          </button>
          <button className="relative bg-white hover:bg-teal-50 text-teal-700 border border-teal-300 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:border-teal-400">
            <CheckCircle className="w-4 h-4" />
            Consultation Done
            <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              03
            </span>
          </button>
        </div>
      </div>

      {/* ─────────── DESKTOP TABLE ─────────── */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Booking Id</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Request by</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Consultation Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sell Response</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Appoint Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-slate-800">{item.customer.name} Age {item.customer.age}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.customer.phone}</p>
                      <p className="text-slate-400 text-xs italic">{item.customer.email}</p>
                      <p className="text-slate-400 text-xs">{item.customer.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.agent}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.doctor}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-[11px] font-bold border ${getConsultStyle(item.consultationStatus)}`}>
                      {item.consultationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-[11px] font-bold border ${getSellStyle(item.sellResponse)}`}>
                      {item.sellResponse}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                    {item.appointment}
                  </td>
                  <td className="px-6 py-4">
                    <ActionCell item={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────── MOBILE CARDS ─────────── */}
      <div className="lg:hidden space-y-4">
        {filteredData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-600">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getConsultStyle(item.consultationStatus)}`}>
                    {item.consultationStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSellStyle(item.sellResponse)}`}>
                    {item.sellResponse}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 text-base">
                  {item.customer.name}{" "}
                  <span className="text-slate-500 font-normal text-sm">Age {item.customer.age}</span>
                </h3>
              </div>
              <ActionCell item={item} />
            </div>

            <div className="space-y-1 mb-4 pb-4 border-b border-slate-100">
              <p className="text-sm text-slate-600">{item.customer.phone}</p>
              <p className="text-sm text-slate-500 italic">{item.customer.email}</p>
              <p className="text-sm text-slate-500">{item.customer.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Agent</span>
                <p className="text-sm text-slate-700 font-medium">{item.agent}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Doctor</span>
                <p className="text-sm text-slate-700 font-medium">{item.doctor}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Appointment</span>
              <p className="text-sm text-slate-700 font-bold">{item.appointment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const StatusPill = ({ count, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold hover:shadow-md transition-all active:scale-95 ${color}`}
  >
    <span className="text-sm leading-none">{count}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const getConsultStyle = (status) => {
  switch (status) {
    case "Complete":         return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Pending/Upcoming": return "bg-orange-50 text-orange-600 border-orange-100";
    case "Canceled":         return "bg-red-50 text-red-600 border-red-100";
    default:                 return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const getSellStyle = (status) => {
  switch (status) {
    case "Interested":     return "bg-cyan-50 text-cyan-600 border-cyan-100";
    case "Not-Interested": return "bg-pink-50 text-pink-600 border-pink-100";
    case "Future":         return "bg-orange-50 text-orange-600 border-orange-100";
    case "Placed":         return "bg-indigo-50 text-indigo-600 border-indigo-100";
    default:               return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

export default AdminTeleconsultationPage;