"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Filter, ChevronDown, Plus, Bell,
  Phone, User, MoreVertical, Calendar, Download,
  FileText, MapPin, X, PhoneCall,
} from "lucide-react";

/* ── CALL MODAL ── */
const CallModal = ({ patient, onClose }) => {
  if (!patient) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Call Patient</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><User className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="font-semibold text-slate-800">{patient.name}</p>
            <p className="text-sm text-slate-500">Age {patient.age}</p>
            <p className="text-base font-bold text-blue-600 mt-0.5">{patient.phone}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href={`tel:${patient.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ── THREE-DOT DROPDOWN ── */
const ActionDropdown = ({ item, onClose }) => {
  const handleDownload = () => {
    const content = [
      `Request ID: ${item.id}`,
      `Patient: ${item.customer.name}, Age ${item.customer.age}`,
      `Phone: ${item.customer.phone}`,
      `Email: ${item.customer.email}`,
      `Location: ${item.customer.location}`,
      `Agent: ${item.agent}`,
      `Hospital: ${item.hospital}`,
      `Doctor: ${item.doctor}`,
      `Price: ${item.price}`,
      `Payment: ${item.paymentMode}`,
      `Status: ${item.status}`,
      `Appointment: ${item.appointment}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `booking-${item.id.replace("#","")}.txt`; a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const actions = [
    { icon: X,         label: "Cancel",        color: "text-red-600",     bg: "hover:bg-red-50",     onClick: () => { alert(`Canceled ${item.id}`); onClose(); } },
    { icon: PhoneCall, label: "Call Clinic",    color: "text-slate-600",   bg: "hover:bg-slate-50",   onClick: () => { window.location.href = "tel:+911800000000"; onClose(); } },
    { icon: FileText,  label: "Profile & CRM", color: "text-indigo-600",  bg: "hover:bg-indigo-50",  href: "/super-admin/in-clinic-consultation/customerprofile" },
    { icon: Calendar,  label: "Reschedule",    color: "text-orange-600",  bg: "hover:bg-orange-50",  onClick: () => { alert(`Reschedule ${item.id}`); onClose(); } },
    { icon: Phone,     label: "Call Patient",  color: "text-blue-600",    bg: "hover:bg-blue-50",    onClick: () => { window.location.href = `tel:${item.customer.phone}`; onClose(); } },
    { icon: Download,  label: "Download",      color: "text-emerald-600", bg: "hover:bg-emerald-50", onClick: handleDownload },
    { icon: MapPin,    label: "Tracking",      color: "text-purple-600",  bg: "hover:bg-purple-50",  onClick: () => { window.open(`https://maps.google.com/?q=${item.customer.location}`,"_blank"); onClose(); } },
    { icon: FileText,  label: "Ticket",        color: "text-cyan-600",    bg: "hover:bg-cyan-50",    onClick: () => { alert(`Ticket raised for ${item.id}`); onClose(); } },
  ];

  return (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-40 min-w-[185px] py-1">
      {actions.map(({ icon: Icon, label, color, bg, onClick, href }) =>
        href ? (
          <a key={label} href={href} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}>
            <Icon className="w-4 h-4 shrink-0" />{label}
          </a>
        ) : (
          <button key={label} onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}>
            <Icon className="w-4 h-4 shrink-0" />{label}
          </button>
        )
      )}
    </div>
  );
};

/* ── ACTION CELL ── */
const ActionCell = ({ item }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [callModal,    setCallModal]    = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {callModal && <CallModal patient={item.customer} onClose={() => setCallModal(false)} />}
      <div className="flex items-center justify-center gap-1.5">
        <button onClick={() => setCallModal(true)} title="Call Patient"
          className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-blue-200 shadow-sm">
          <Phone className="w-4 h-4" />
        </button>
        {/* 👤 View Profile → redirect */}
        <a href="/super-admin/in-clinic-consultation/customerprofile" title="View Profile"
          className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-indigo-200 shadow-sm">
          <User className="w-4 h-4" />
        </a>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown((p) => !p)} title="More Actions"
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && <ActionDropdown item={item} onClose={() => setShowDropdown(false)} />}
        </div>
      </div>
    </>
  );
};

/* ── STATUS BADGE ── */
const StatusBadge = ({ count, label, color, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${active ? "ring-2 ring-blue-400 shadow-md" : ""} ${color}`}>
    <span className="text-sm leading-none">{count}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

/* ── MAIN PAGE ── */
const AdminInClinicConsultationPage = () => {
  const [searchTerm,    setSearchTerm]    = useState("");
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [primaryDate,   setPrimaryDate]   = useState("Today");
  const [secondaryDate, setSecondaryDate] = useState("Today");
  const [tertiaryDate,  setTertiaryDate]  = useState("Today");

  const bookingData = [
    { id: "#AMB2914", bookingDate: "Today, 10:30 AM", paymentMode: "Cash",    customer: { name: "Sheetal Dayal", age: 50, phone: "9973827100", email: "sheetald@xyz.com", location: "Nagpur" }, agent: "Pranjal -0012", hospital: "Care Hospital", doctor: "Dr Sudhir Jain", price: "RS:299 RS", status: "New", appointment: "25 Apr, 10:30 AM" },
    { id: "#AMB2915", bookingDate: "Today, 10:30 AM", paymentMode: "PrePaid", customer: { name: "Kunal Joshi",   age: 36, phone: "9973827100", email: "kunal@xyz.com",    location: "Pune"   }, agent: "Self",          hospital: "Care Hospital", doctor: "Dr Sudhir Jain", price: "RS:299 RS", status: "New", appointment: "25 Apr, 10:30 AM" },
    { id: "#AMB2916", bookingDate: "Today, 10:30 AM", paymentMode: "Cash",    customer: { name: "Rajesh Kumar",  age: 45, phone: "9973827100", email: "rajesh@xyz.com",   location: "Mumbai" }, agent: "Alfiya-0011",   hospital: "Care Hospital", doctor: "Dr Sudhir Jain", price: "RS:299 RS", status: "New", appointment: "25 Apr, 10:30 AM" },
  ];

  const filteredData = useMemo(() => bookingData.filter((item) => {
    const matchesSearch =
      item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeFilter === "All" || item.status === activeFilter;
    return matchesSearch && matchesStatus;
  }), [searchTerm, activeFilter]);

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans">

      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-auto">
          <select value={primaryDate} onChange={(e) => setPrimaryDate(e.target.value)} className="w-full sm:w-auto appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>Today</option><option>Yesterday</option><option>Last 7 Days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge count="06" label="New"            color="bg-amber-50 text-amber-700 border border-amber-200"       active={activeFilter==="New"}            onClick={()=>setActiveFilter("New")} />
          <StatusBadge count="03" label="Accept"         color="bg-cyan-50 text-cyan-700 border border-cyan-200"          active={activeFilter==="Accept"}         onClick={()=>setActiveFilter("Accept")} />
          <StatusBadge count="00" label="Pending"        color="bg-rose-50 text-rose-600 border border-rose-200"          active={activeFilter==="Pending"}        onClick={()=>setActiveFilter("Pending")} />
          <StatusBadge count="00" label="Patient Absent" color="bg-slate-100 text-slate-600 border border-slate-200"      active={activeFilter==="Patient Absent"} onClick={()=>setActiveFilter("Patient Absent")} />
          <StatusBadge count="00" label="Canceled"       color="bg-rose-100 text-rose-700 border border-rose-300"         active={activeFilter==="Canceled"}       onClick={()=>setActiveFilter("Canceled")} />
          <StatusBadge count="03" label="Complete"       color="bg-emerald-50 text-emerald-700 border border-emerald-200" active={activeFilter==="Complete"}       onClick={()=>setActiveFilter("Complete")} />
          <StatusBadge count="00" label="Sell"           color="bg-green-500 text-white border border-green-600"          active={activeFilter==="Sell"}           onClick={()=>setActiveFilter("Sell")} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 w-full md:flex-1">
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"><Filter className="w-5 h-5 text-slate-500" /></button>
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search patients, request ID, phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all"><Plus className="w-4 h-4" /> Add Booking</button>
          <button className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><Bell className="w-4 h-4" /> 03 Notification</button>
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 w-full sm:flex-1">
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm"><Filter className="w-5 h-5 text-slate-500" /></div>
          <div className="relative flex-1">
            <select value={secondaryDate} onChange={(e) => setSecondaryDate(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm focus:outline-none">
              <option>Today</option><option>Tomorrow</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="relative w-full sm:flex-1">
          <select value={tertiaryDate} onChange={(e) => setTertiaryDate(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm focus:outline-none">
            <option>Today</option><option>Select Range</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Id</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Date</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request by</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-blue-50/20 transition-colors">
                  <td className="px-5 py-5 text-sm font-bold text-slate-700 whitespace-nowrap">{item.id}</td>
                  <td className="px-5 py-5">
                    <p className="text-sm text-slate-700">Today,</p>
                    <p className="text-sm text-slate-700">10:30 AM</p>
                    <p className="text-sm text-slate-700">{item.paymentMode}</p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-sm text-slate-800">{item.customer.name} Age {item.customer.age}</p>
                    <p className="text-sm text-slate-600">{item.customer.phone}</p>
                    <p className="text-sm text-slate-500">{item.customer.email}</p>
                    <p className="text-sm text-slate-500">{item.customer.location}</p>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-700">{item.agent}</td>
                  <td className="px-5 py-5">
                    <p className="text-sm text-slate-700">{item.hospital}</p>
                    <p className="text-sm text-slate-700">{item.doctor}</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-1 uppercase">{item.price}</p>
                  </td>
                  <td className="px-5 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{item.status}</span>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-700 whitespace-nowrap">{item.appointment}</td>
                  <td className="px-5 py-5"><ActionCell item={item} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-4">
        {filteredData.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-700">{item.id}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">{item.status}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">{item.paymentMode}</span>
                </div>
                <p className="font-bold text-slate-800">{item.customer.name} <span className="text-slate-500 font-normal text-sm">Age {item.customer.age}</span></p>
              </div>
              <ActionCell item={item} />
            </div>
            <div className="space-y-0.5 mb-3 pb-3 border-b border-slate-100">
              <p className="text-sm text-slate-600">{item.customer.phone}</p>
              <p className="text-sm text-slate-500 italic">{item.customer.email}</p>
              <p className="text-sm text-slate-500">{item.customer.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-slate-100">
              <div><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Booking Date</p><p className="text-xs text-slate-700 font-medium">{item.bookingDate}</p></div>
              <div><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Agent</p><p className="text-sm text-slate-700">{item.agent}</p></div>
            </div>
            <div className="mb-3 pb-3 border-b border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Hospital</p>
              <p className="text-sm font-bold text-slate-700">{item.hospital}</p>
              <p className="text-sm text-slate-600">{item.doctor}</p>
              <p className="text-sm font-extrabold text-slate-800 uppercase mt-0.5">{item.price}</p>
            </div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Appointment</p><p className="text-sm font-bold text-slate-700">{item.appointment}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInClinicConsultationPage;