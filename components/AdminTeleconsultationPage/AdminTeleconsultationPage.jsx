"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronDown, 
  Plus,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

const AdminTeleconsultationPage = () => {
  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTime, setSelectedTime] = useState("Today");

  // --- Mock Data ---
  const bookingData = [
    {
      id: "#AMB2914",
      customer: { name: "Sheetal Dayal", age: 50, phone: "9973827100", email: "sheetald@xyz.com", location: "Nagpur" },
      agent: "ABC",
      doctor: "Dr. Aditya Aswar",
      consultationStatus: "Complete",
      sellResponse: "Interested",
      appointment: "25 Apr, 10:30 AM"
    },
    {
      id: "#AMB2915",
      customer: { name: "Kunal Joshi", age: 36, phone: "9973827100", email: "kunal@xyz.com", location: "Pune" },
      agent: "ABC",
      doctor: "Dr. Aditya Aswar",
      consultationStatus: "Pending/Upcoming",
      sellResponse: "Not-Interested",
      appointment: "25 Apr, 10:30 AM"
    },
    {
      id: "#AMB2916",
      customer: { name: "Rajesh Kumar", age: 45, phone: "9973827100", email: "rajesh@xyz.com", location: "Mumbai" },
      agent: "ABC",
      doctor: "Dr. Aditya Aswar",
      consultationStatus: "Canceled",
      sellResponse: "Future",
      appointment: "25 Apr, 10:30 AM"
    },
    {
      id: "#AMB2917",
      customer: { name: "Priya Sharma", age: 38, phone: "9973827100", email: "priya@xyz.com", location: "Delhi" },
      agent: "ABC",
      doctor: "Dr. Aditya Aswar",
      consultationStatus: "Complete",
      sellResponse: "Placed",
      appointment: "25 Apr, 10:30 AM"
    }
  ];

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return bookingData.filter(item => {
      const matchesSearch = item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeFilter === "All" || item.sellResponse === activeFilter || item.consultationStatus === activeFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans">
      
      {/* --- Top Header: Date and Primary Stats --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 mb-4">
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

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <StatusPill count="06" label="Reschedule" color="bg-slate-50 text-slate-600" onClick={() => setActiveFilter("Reschedule")} />
          <StatusPill count="03" label="Complete" color="bg-emerald-50 text-emerald-600 border-emerald-100" onClick={() => setActiveFilter("Complete")} />
          <StatusPill count="00" label="Canceled" color="bg-red-50 text-red-600 border-red-100" onClick={() => setActiveFilter("Canceled")} />
          <StatusPill count="06" label="Follow UP" color="bg-blue-50 text-blue-600 border-blue-100" onClick={() => setActiveFilter("Follow UP")} />
          <StatusPill count="00" label="Time out" color="bg-orange-50 text-orange-600 border-orange-100" onClick={() => setActiveFilter("Time out")} />
        </div>
      </div>

      {/* --- Secondary Stats: Sell Status --- */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold text-slate-500 uppercase mr-2 py-2">Sell Status</span>
        <StatusPill count="06" label="May be" color="bg-slate-100 text-slate-700" onClick={() => setActiveFilter("May be")} />
        <StatusPill count="03" label="Placed" color="bg-emerald-50 text-emerald-700" onClick={() => setActiveFilter("Placed")} />
        <StatusPill count="03" label="Interested" color="bg-cyan-50 text-cyan-700" onClick={() => setActiveFilter("Interested")} />
        <StatusPill count="00" label="Not-Interested" color="bg-pink-50 text-pink-700" onClick={() => setActiveFilter("Not-Interested")} />
        <StatusPill count="00" label="Future" color="bg-orange-50 text-orange-700" onClick={() => setActiveFilter("Future")} />
        <StatusPill count="00" label="50-50" color="bg-yellow-50 text-yellow-700" onClick={() => setActiveFilter("50-50")} />
        <StatusPill count="06" label="Time pass" color="bg-slate-50 text-slate-500 border-slate-200" onClick={() => setActiveFilter("Time pass")} />
      </div>

      {/* --- Action Bar --- */}
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all">
            <Plus className="w-4 h-4" /> Add Booking
          </button>
          <button className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            03 Consult Now/Upcoming
          </button>
          <button className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            03 Consultation Done
          </button>
        </div>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Booking Id</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Request by</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Agent</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Doctor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Consultation Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Sell Response</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Appoint Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-center">Actions</th>
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
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors inline-flex border border-slate-100 shadow-sm">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Mobile/Tablet Card View --- */}
      <div className="lg:hidden space-y-4">
        {filteredData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            {/* Header Row */}
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
                  {item.customer.name} <span className="text-slate-500 font-normal text-sm">Age {item.customer.age}</span>
                </h3>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 mb-4 pb-4 border-b border-slate-100">
              <p className="text-sm text-slate-600">{item.customer.phone}</p>
              <p className="text-sm text-slate-500 italic">{item.customer.email}</p>
              <p className="text-sm text-slate-500">{item.customer.location}</p>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Agent */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Agent</span>
                <p className="text-sm text-slate-700 font-medium">{item.agent}</p>
              </div>

              {/* Doctor */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Doctor</span>
                <p className="text-sm text-slate-700 font-medium">{item.doctor}</p>
              </div>
            </div>

            {/* Appointment Details */}
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

// --- Helper Components & Functions ---

const StatusPill = ({ count, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border border-transparent hover:shadow-md transition-all active:scale-95 ${color}`}
  >
    <span className="text-sm">{count}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const getConsultStyle = (status) => {
  switch (status) {
    case "Complete": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Pending/Upcoming": return "bg-orange-50 text-orange-600 border-orange-100";
    case "Canceled": return "bg-red-50 text-red-600 border-red-100";
    default: return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const getSellStyle = (status) => {
  switch (status) {
    case "Interested": return "bg-cyan-50 text-cyan-600 border-cyan-100";
    case "Not-Interested": return "bg-pink-50 text-pink-600 border-pink-100";
    case "Future": return "bg-orange-50 text-orange-600 border-orange-100";
    case "Placed": return "bg-indigo-50 text-indigo-600 border-indigo-100";
    default: return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

export default AdminTeleconsultationPage;