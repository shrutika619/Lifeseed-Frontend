"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronDown, 
  Plus,
  Bell
} from "lucide-react";

const AdminInClinicConsultationPage = () => {
  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [primaryDate, setPrimaryDate] = useState("Today");
  const [secondaryDate, setSecondaryDate] = useState("Today");
  const [tertiaryDate, setTertiaryDate] = useState("Today");

  // --- Sample Data based on image ---
  const bookingData = [
    {
      id: "#AMB2914",
      bookingDate: "Today, 10:30 AM",
      paymentMode: "Cash",
      customer: { name: "Sheetal Dayal", age: 50, phone: "9973827100", email: "sheetald@xyz.com", location: "Nagpur" },
      agent: "Pranjal - 0012",
      hospital: "Care Hospital",
      doctor: "Dr Sudhir Jain",
      price: "RS:299 RS",
      status: "New",
      appointment: "25 Apr, 10:30 AM"
    },
    {
      id: "#AMB2915",
      bookingDate: "Today, 10:30 AM",
      paymentMode: "PrePaid",
      customer: { name: "Kunal Joshi", age: 36, phone: "9973827100", email: "kunal@xyz.com", location: "Pune" },
      agent: "Self",
      hospital: "Care Hospital",
      doctor: "Dr Sudhir Jain",
      price: "RS:299 RS",
      status: "New",
      appointment: "25 Apr, 10:30 AM"
    },
    {
      id: "#AMB2916",
      bookingDate: "Today, 10:30 AM",
      paymentMode: "Cash",
      customer: { name: "Rajesh Kumar", age: 45, phone: "9973827100", email: "rajesh@xyz.com", location: "Mumbai" },
      agent: "Alfiya - 0011",
      hospital: "Care Hospital",
      doctor: "Dr Sudhir Jain",
      price: "RS:299 RS",
      status: "New",
      appointment: "25 Apr, 10:30 AM"
    }
  ];

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return bookingData.filter(item => {
      const matchesSearch = 
        item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agent.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = activeFilter === "All" || item.status === activeFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans">
      
      {/* --- Top Row: Date Selector & Status Badges --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-auto">
          <select 
            value={primaryDate}
            onChange={(e) => setPrimaryDate(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <StatusBadge count="06" label="New" color="bg-slate-50 text-slate-600" active={activeFilter === "New"} onClick={() => setActiveFilter("New")} />
          <StatusBadge count="03" label="Accept" color="bg-cyan-50 text-cyan-600 border-cyan-100" active={activeFilter === "Accept"} onClick={() => setActiveFilter("Accept")} />
          <StatusBadge count="00" label="Pending" color="bg-orange-50 text-orange-600 border-orange-100" active={activeFilter === "Pending"} onClick={() => setActiveFilter("Pending")} />
          <StatusBadge count="00" label="Patient Absent" color="bg-yellow-50 text-yellow-600 border-yellow-100" active={activeFilter === "Patient Absent"} onClick={() => setActiveFilter("Patient Absent")} />
          <StatusBadge count="00" label="Canceled" color="bg-pink-50 text-pink-600 border-pink-100" active={activeFilter === "Canceled"} onClick={() => setActiveFilter("Canceled")} />
          <StatusBadge count="03" label="Complete" color="bg-emerald-50 text-emerald-600 border-emerald-100" active={activeFilter === "Complete"} onClick={() => setActiveFilter("Complete")} />
          <StatusBadge count="00" label="Sell" color="bg-green-100 text-green-700" active={activeFilter === "Sell"} onClick={() => setActiveFilter("Sell")} />
        </div>
      </div>

      {/* --- Middle Row: Search, Add Booking, Notifications --- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 w-full md:flex-1">
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <button className="w-full sm:flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Booking
          </button>
          <button className="w-full sm:flex-1 md:flex-none bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            <Bell className="w-4 h-4" /> 03 Notification
          </button>
        </div>
      </div>

      {/* --- Third Row: Secondary Filters --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 w-full sm:flex-1">
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm">
            <Filter className="w-5 h-5 text-slate-500" />
          </div>
          <div className="relative flex-1">
            <select 
              value={secondaryDate}
              onChange={(e) => setSecondaryDate(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm focus:outline-none"
            >
              <option>Today</option>
              <option>Tomorrow</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="relative w-full sm:flex-1">
          <select 
            value={tertiaryDate}
            onChange={(e) => setTertiaryDate(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm focus:outline-none"
          >
            <option>Today</option>
            <option>Select Range</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Id</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request by</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500 leading-relaxed">
                      <p>{item.bookingDate.split(", ")[0]}</p>
                      <p>{item.bookingDate.split(", ")[1]}</p>
                      <p className="font-semibold text-slate-600">{item.paymentMode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="font-bold text-slate-800 text-sm">{item.customer.name} Age {item.customer.age}</p>
                      <p className="text-slate-500">{item.customer.phone}</p>
                      <p className="text-slate-400 italic">{item.customer.email}</p>
                      <p className="text-slate-500">{item.customer.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.agent}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="font-bold text-slate-700">{item.hospital}</p>
                      <p className="text-slate-500">{item.doctor}</p>
                      <p className="font-black text-slate-800 mt-1 uppercase">{item.price}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[10px] font-black uppercase border border-slate-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
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
        {filteredData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-600">{item.id}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-slate-200">
                    {item.status}
                  </span>
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                    {item.paymentMode}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">
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

            {/* Grid Info - Booking & Agent */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
              {/* Booking Date */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Booking Date</span>
                <p className="text-xs text-slate-600 font-medium">{item.bookingDate.split(", ")[0]}</p>
                <p className="text-xs text-slate-500">{item.bookingDate.split(", ")[1]}</p>
              </div>

              {/* Agent */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Agent</span>
                <p className="text-sm text-slate-700 font-medium">{item.agent}</p>
              </div>
            </div>

            {/* Hospital Details */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hospital</span>
              <p className="text-sm text-slate-700 font-bold">{item.hospital}</p>
              <p className="text-sm text-slate-600">{item.doctor}</p>
              <p className="text-sm text-slate-800 font-black uppercase mt-1">{item.price}</p>
            </div>

            {/* Appointment Details */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Appointment</span>
              <p className="text-sm text-slate-700 font-bold">{item.appointment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Helper Component ---
const StatusBadge = ({ count, label, color, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all border ${
      active ? 'ring-2 ring-blue-400 border-transparent shadow-md' : 'border-transparent'
    } ${color}`}
  >
    <span className="text-sm leading-none">{count}</span>
    <span className="whitespace-nowrap uppercase tracking-tight">{label}</span>
  </button>
);

export default AdminInClinicConsultationPage;