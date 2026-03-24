"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CalendarClock,
  Monitor,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { adminTeleconsultationService } from "@/app/services/admin/adminTeleconsultation.service";

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
            <p className="text-sm text-slate-500">Age {patient.age || '--'}</p>
            <p className="text-base font-bold text-blue-600 mt-0.5">{patient.contact}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={`tel:${patient.contact}`}
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

const ConfirmCancelModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">Cancel Consultation?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone and the slot will be released.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50">
            Keep It
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:bg-red-400">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   THREE-DOT DROPDOWN & ACTION CELL
───────────────────────────────────────────── */

const ActionDropdown = ({ item, onClose, onCancel, onReschedule, dropUp }) => {
  const pathname = usePathname();
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';

  // Safely extract booking patient or account patient details
  const bookingPatient = item.bookingPatientDetails || {};
  const accountPatient = item.patientDetails || {};
  const displayContact = bookingPatient.contact || accountPatient.loginNumber;
  const patientId = accountPatient.userId;

  const handleDownload = () => {
    const content = [
      `Booking ID: ${item.bookingId}`,
      `Patient: ${bookingPatient.name}, Age ${bookingPatient.age}`,
      `Phone: ${displayContact}`,
      `Email: ${accountPatient.email || '--'}`,
      `Location: ${accountPatient.city || '--'}`,
      `Agent: ${item.agentName}`,
      `Doctor: ${item.doctor || '--'}`,
      `Consultation Status: ${item.consultationStatus}`,
      `Sell Response: ${item.sellResponse}`,
      `Appointment Date: ${item.appointDetails?.date ? new Date(item.appointDetails.date).toLocaleDateString() : '--'}`,
      `Time Slot: ${item.appointDetails?.timeSlot || '--'}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `booking-${item.bookingId.replace("#", "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const actions = [
    {
      icon: X, label: "Cancel", color: "text-red-600", bg: "hover:bg-red-50",
      onClick: () => { onCancel && onCancel(item.recordId); onClose(); },
      hide: item.consultationStatus === 'Cancelled' || item.consultationStatus === 'Complete'
    },
    {
      icon: Stethoscope, label: "Doctor Panel", color: "text-violet-600", bg: "hover:bg-violet-50",
      href: `${basePath}/teleconsultation/doctorpanel?recordId=${item.recordId}`,
    },
    {
      icon: ShoppingCart, label: "Place Order", color: "text-blue-600", bg: "hover:bg-blue-50",
      href: `${basePath}/teleconsultation/placeorder?recordId=${item.recordId}`,
    },
    {
      icon: PhoneCall, label: "Call Clinic", color: "text-slate-600", bg: "hover:bg-slate-50",
      onClick: () => { window.location.href = "tel:+911800000000"; onClose(); },
    },
    {
      icon: FileText, label: "Profile & CRM", color: "text-indigo-600", bg: "hover:bg-indigo-50",
      href: `${basePath}/log-in-user/customerprofile?patientId=${patientId}`,
    },
    {
      icon: Calendar, label: "Reschedule", color: "text-orange-600", bg: "hover:bg-orange-50",
      href: `/free-consultation?admin_booking=true&rescheduleRecordId=${item.recordId}&patientId=${patientId}`,
      hide: item.consultationStatus === 'Cancelled' || item.consultationStatus === 'Complete'
    },
    {
      icon: Phone, label: "Call Patient", color: "text-blue-600", bg: "hover:bg-blue-50",
      onClick: () => { window.location.href = `tel:${displayContact}`; onClose(); },
    },
    {
      icon: Download, label: "Download", color: "text-emerald-600", bg: "hover:bg-emerald-50",
      onClick: handleDownload,
    },
    {
      icon: MapPin, label: "Tracking", color: "text-purple-600", bg: "hover:bg-purple-50",
      onClick: () => { 
        if(accountPatient.city) {
          window.open(`http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(accountPatient.city)}`, "_blank"); 
        } else {
          toast.error("City not available for this patient.");
        }
        onClose(); 
      },
    },
  ];

  return (
    <div className={`absolute right-0 ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white rounded-xl shadow-xl border border-slate-100 z-[60] min-w-[185px] py-1`}>
      {actions.filter(a => !a.hide).map(({ icon: Icon, label, color, bg, onClick, href }) =>
        href ? (
          <a key={label} href={href} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </a>
        ) : (
          <button key={label} onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        )
      )}
    </div>
  );
};

const ActionCell = ({ item, onCancel, onReschedule, dropUp }) => {
  const pathname = usePathname();
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';

  const [showDropdown, setShowDropdown] = useState(false);
  const [callModal,    setCallModal]    = useState(false);
  const dropdownRef = useRef(null);

  const bookingPatient = item.bookingPatientDetails || {};
  const accountPatient = item.patientDetails || {};
  const displayContact = bookingPatient.contact || accountPatient.loginNumber;
  const patientId = accountPatient.userId;

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
      {callModal && <CallModal patient={{ name: bookingPatient.name || accountPatient.name, age: bookingPatient.age, contact: displayContact }} onClose={() => setCallModal(false)} />}

      <div className="flex items-center justify-center gap-1.5">
        <button onClick={() => setCallModal(true)} title="Call Patient" className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-blue-200 shadow-sm">
          <Phone className="w-4 h-4" />
        </button>

        <a
          href={`${basePath}/log-in-user/customerprofile?patientId=${patientId}`}
          title="View Profile"
          className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-indigo-200 shadow-sm"
        >
          <User className="w-4 h-4" />
        </a>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown((p) => !p)} title="More Actions" className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && (
            <ActionDropdown
              item={item}
              onClose={() => setShowDropdown(false)}
              onCancel={onCancel}
              onReschedule={onReschedule}
              dropUp={dropUp}
            />
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE WITH API INTEGRATION
───────────────────────────────────────────── */

const AdminTeleconsultationPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [counts, setCounts] = useState({ consult: {}, sell: {} });

  const [cancelModal, setCancelModal] = useState({ isOpen: false, recordId: null });
  const [isCancelling, setIsCancelling] = useState(false);

  const [searchTerm,   setSearchTerm]   = useState("");
  const [activeConsultFilter, setActiveConsultFilter] = useState("All");
  const [activeSellFilter, setActiveSellFilter] = useState("All");
  const [selectedTime, setSelectedTime] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const queryFilters = {
        date: selectedTime,
        consultationStatus: activeConsultFilter !== "All" ? activeConsultFilter : "",
        sellResponse: activeSellFilter !== "All" ? activeSellFilter : "",
        search: searchTerm,
      };

      const res = await adminTeleconsultationService.getAllBookings(queryFilters);
      console.log(res)
      
      if (res.success && res.data) {
        setBookings(res.data.bookings || []);
        setCounts({
          consult: res.data.consultationCounts || {},
          sell: res.data.sellResponseCounts || {}
        });
      } else {
        toast.error(res.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBookings();
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(delay);
  }, [selectedTime, activeConsultFilter, activeSellFilter, searchTerm]);

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const currentBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const executeCancelBooking = async () => {
    if (!cancelModal.recordId) return;
    
    setIsCancelling(true);
    try {
      const res = await adminTeleconsultationService.cancelBooking(cancelModal.recordId);
      if (res.success) {
        toast.success("Booking Cancelled Successfully");
        fetchBookings();
        setCancelModal({ isOpen: false, recordId: null });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const toggleConsultFilter = (status) => {
    setActiveConsultFilter(prev => prev === status ? "All" : status);
    setActiveSellFilter("All");
  };

  const toggleSellFilter = (status) => {
    setActiveSellFilter(prev => prev === status ? "All" : status);
    setActiveConsultFilter("All");
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "--";
    return new Date(isoDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans pb-24">
      
      <ConfirmCancelModal 
        isOpen={cancelModal.isOpen} 
        onClose={() => setCancelModal({ isOpen: false, recordId: null })} 
        onConfirm={executeCancelBooking}
        loading={isCancelling}
      />
      
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 mb-4">
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
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill active={activeConsultFilter === "Reschedule"} count={counts.consult?.Reschedule || "0"} label="Reschedule" color="bg-slate-100 text-slate-600 border border-slate-200" onClick={() => toggleConsultFilter("Reschedule")} />
          <StatusPill active={activeConsultFilter === "Complete"}   count={counts.consult?.Complete || "0"}   label="Complete"   color="bg-emerald-50 text-emerald-700 border border-emerald-200" onClick={() => toggleConsultFilter("Complete")} />
          <StatusPill active={activeConsultFilter === "Cancelled"}  count={counts.consult?.Cancelled || "0"}  label="Cancelled"  color="bg-red-50 text-red-600 border border-red-200" onClick={() => toggleConsultFilter("Cancelled")} />
          <StatusPill active={activeConsultFilter === "Follow UP"}  count={counts.consult?.["Follow UP"] || "0"} label="Follow UP"  color="bg-blue-50 text-blue-700 border border-blue-200" onClick={() => toggleConsultFilter("Follow UP")} />
          <StatusPill active={activeConsultFilter === "Time out"}   count={counts.consult?.["Time out"] || "0"}  label="Time out"   color="bg-orange-50 text-orange-600 border border-orange-200" onClick={() => toggleConsultFilter("Time out")} />
        </div>

        <Link
          href="/super-admin/teleconsultation/configureslot"
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          <Settings className="w-4 h-4" />
          Configure Slot
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest py-1.5 px-2 bg-slate-100 rounded-md">
          Sell Status
        </span>
        <StatusPill active={activeSellFilter === "May be"}         count={counts.sell?.["May be"] || "0"}         label="May be"         color="bg-slate-100 text-slate-700 border border-slate-200" onClick={() => toggleSellFilter("May be")} />
        <StatusPill active={activeSellFilter === "Placed"}         count={counts.sell?.Placed || "0"}             label="Placed"         color="bg-emerald-50 text-emerald-700 border border-emerald-200" onClick={() => toggleSellFilter("Placed")} />
        <StatusPill active={activeSellFilter === "Interested"}     count={counts.sell?.Interested || "0"}         label="Interested"     color="bg-cyan-50 text-cyan-700 border border-cyan-200" onClick={() => toggleSellFilter("Interested")} />
        <StatusPill active={activeSellFilter === "Not-Interested"} count={counts.sell?.["Not-Interested"] || "0"} label="Not-Interested" color="bg-pink-50 text-pink-700 border border-pink-200" onClick={() => toggleSellFilter("Not-Interested")} />
        <StatusPill active={activeSellFilter === "Future"}         count={counts.sell?.Future || "0"}             label="Future"         color="bg-orange-50 text-orange-700 border border-orange-200" onClick={() => toggleSellFilter("Future")} />
        <StatusPill active={activeSellFilter === "50-50"}          count={counts.sell?.["50-50"] || "0"}          label="50-50"          color="bg-yellow-50 text-yellow-700 border border-yellow-200" onClick={() => toggleSellFilter("50-50")} />
        <StatusPill active={activeSellFilter === "Time pass"}      count={counts.sell?.["Time pass"] || "0"}      label="Time pass"      color="bg-slate-50 text-slate-500 border border-slate-200" onClick={() => toggleSellFilter("Time pass")} />
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 w-full lg:flex-1">
          <button 
            onClick={() => { setActiveConsultFilter("All"); setActiveSellFilter("All"); setSearchTerm(""); }}
            className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors" title="Clear Filters"
          >
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button onClick={() => toggleConsultFilter("New")} className="relative bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:border-emerald-400">
            <Video className="w-4 h-4" />
            Consult Now/Upcoming
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {counts.consult?.New || 0}
            </span>
          </button>
          <button onClick={() => toggleConsultFilter("Complete")} className="relative bg-white hover:bg-teal-50 text-teal-700 border border-teal-300 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:border-teal-400">
            <CheckCircle className="w-4 h-4" />
            Consultation Done
            <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {counts.consult?.Complete || 0}
            </span>
          </button>
        </div>
      </div>

      {/* ─────────── DESKTOP TABLE ─────────── */}
      <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Booking Id</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Booked By</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Appoint Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    Loading bookings...
                  </td>
                </tr>
              ) : currentBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500 font-medium">No bookings found matching filters.</td>
                </tr>
              ) : (
                currentBookings.map((item, idx) => {
                  const isNearBottom = currentBookings.length > 3 && idx >= currentBookings.length - 3;
                  
                  // Safely fallbacks if data is missing
                  const account = item.patientDetails || {};
                  const patient = item.bookingPatientDetails || {};
                  const bookedBy = item.bookedBy?.original || {};

                  return (
                    <tr key={item.recordId || idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{item.bookingId}</td>
                      
                      {/* ✅ Updated Booked By Column Logic */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {bookedBy.type === "admin" ? (
                             <>
                               <p className="font-semibold text-slate-800">{bookedBy.name || "--"}</p>
                               <p className="text-slate-500 text-xs mt-0.5">📞 {bookedBy.mobileNo || "--"}</p>
                               <span className="inline-block mt-1 bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Admin</span>
                             </>
                          ) : (
                             <>
                               <p className="font-semibold text-slate-800">{account.name || "--"}</p>
                               <p className="text-slate-500 text-xs mt-0.5">📞 {account.loginNumber || "--"}</p>
                               {account.email && account.email !== '--' && <p className="text-slate-400 text-xs italic">{account.email}</p>}
                               {account.city && account.city !== '--' && <p className="text-slate-400 text-xs">{account.city}</p>}
                             </>
                          )}
                        </div>
                      </td>

                      {/* Patient Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-slate-800">
                            {patient.name || "--"} 
                            {patient.age && patient.age !== "--" && <span className="text-slate-500 font-normal text-xs ml-1">Age {patient.age}</span>}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">📞 {patient.contact || "--"}</p>
                          <p className="text-slate-500 text-xs mt-0.5 capitalize">{patient.gender || "--"}</p>
                          {patient.concernedAbout?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 max-w-[160px]">
                              {patient.concernedAbout.map((c, i) => (
                                <span key={i} className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{c}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="relative group cursor-help inline-block">
                          <span className="text-sm text-slate-600 font-medium">
                            {item.agentName}
                          </span>
                          {item.originalAgent && item.originalAgent !== item.agentName && (
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-[70] animate-in fade-in slide-in-from-bottom-1">
                              <div className="bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap">
                                <p className="text-slate-400 font-semibold uppercase tracking-tighter text-[8px]">Original Agent</p>
                                <p className="font-bold">{item.originalAgent}</p>
                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.doctor || '--'}</td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="flex flex-col gap-1">
                            <span className={`w-fit px-2 py-1 rounded-md text-[10px] font-bold border ${getConsultStyle(item.consultationStatus)}`}>
                              {item.consultationStatus}
                            </span>
                            
                            {item.bookedBy?.rescheduledBy && (
                              <div className="p-1.5 bg-purple-50/80 rounded border border-purple-100 text-[9px] text-purple-700 leading-tight w-max">
                                <span className="font-bold block mb-0.5">Rescheduled By:</span>
                                {item.bookedBy.rescheduledBy.name}
                                {item.bookedBy.rescheduledBy.mobileNo && <span className="block mt-0.5">📞 {item.bookedBy.rescheduledBy.mobileNo}</span>}
                              </div>
                            )}
                          </div>

                          <span className={`w-fit px-2 py-1 rounded-md text-[10px] font-bold border ${getSellStyle(item.sellResponse)}`}>
                            {item.sellResponse}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                        {formatDate(item.appointDetails?.date)}<br/>{item.appointDetails?.timeSlot}
                      </td>
                      <td className="px-6 py-4">
                        <ActionCell 
                          item={item} 
                          onCancel={(id) => setCancelModal({ isOpen: true, recordId: id })} 
                          dropUp={isNearBottom} 
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && bookings.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 mt-auto">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, bookings.length)}</span> of <span className="font-bold text-slate-700">{bookings.length}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'border border-slate-200 text-slate-600 hover:bg-white hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────── MOBILE CARDS ─────────── */}
      <div className="lg:hidden space-y-4">
        {loading ? (
            <div className="py-12 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              Loading bookings...
            </div>
        ) : currentBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-medium bg-white rounded-xl shadow-sm border border-slate-200">
              No bookings found matching filters.
            </div>
        ) : (
          currentBookings.map((item, idx) => {
            const isNearBottom = currentBookings.length > 3 && idx >= currentBookings.length - 2;
            const account = item.patientDetails || {};
            const patient = item.bookingPatientDetails || {};
            const bookedBy = item.bookedBy?.original || {};

            return (
              <div key={item.recordId || idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-slate-600 mt-0.5">{item.bookingId}</span>
                      
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`w-fit px-2 py-0.5 rounded-md text-[10px] font-bold border ${getConsultStyle(item.consultationStatus)}`}>
                          {item.consultationStatus}
                        </span>
                        
                        {item.bookedBy?.rescheduledBy && (
                          <div className="p-1.5 bg-purple-50/80 rounded border border-purple-100 text-[9px] text-purple-700 leading-tight w-max">
                            <span className="font-bold block mb-0.5">Rescheduled By:</span>
                            {item.bookedBy.rescheduledBy.name}
                          </div>
                        )}
                      </div>

                      <span className={`w-fit px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSellStyle(item.sellResponse)}`}>
                        {item.sellResponse}
                      </span>
                    </div>

                  </div>
                  <ActionCell 
                    item={item} 
                    onCancel={(id) => setCancelModal({ isOpen: true, recordId: id })} 
                    dropUp={isNearBottom} 
                  />
                </div>

                <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
                   {/* Patient Info */}
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Details</p>
                     <p className="font-semibold text-slate-800 text-sm">{patient.name || "--"} <span className="font-normal text-slate-500 text-xs ml-1">Age {patient.age || "--"} • {patient.gender}</span></p>
                     <p className="text-xs text-slate-600 mt-0.5">📞 {patient.contact}</p>
                     {patient.concernedAbout?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {patient.concernedAbout.map((c, i) => (
                            <span key={i} className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{c}</span>
                          ))}
                        </div>
                      )}
                   </div>

                   {/* ✅ Updated Booked By Info for Mobile */}
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Booked By (Account)</p>
                     {bookedBy.type === "admin" ? (
                       <>
                         <p className="text-sm font-medium text-slate-700">{bookedBy.name || "--"}</p>
                         <p className="text-xs text-slate-600">📞 {bookedBy.mobileNo || "--"}</p>
                         <span className="inline-block mt-1 bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Admin</span>
                       </>
                     ) : (
                       <>
                         <p className="text-sm font-medium text-slate-700">{account.name || "--"}</p>
                         <p className="text-xs text-slate-600">📞 {account.loginNumber || "--"}</p>
                         {account.city && account.city !== "--" && <p className="text-xs text-slate-500">{account.city}</p>}
                       </>
                     )}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Agent</span>
                    <div className="relative group cursor-help">
                      <p className="text-sm text-slate-700 font-medium">{item.agentName}</p>
                      {item.originalAgent && item.originalAgent !== item.agentName && (
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-[70] animate-in fade-in slide-in-from-bottom-1">
                          <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded-lg shadow-xl whitespace-nowrap">
                            <p className="text-[8px] opacity-70">Original Agent</p>
                            <p className="font-bold">{item.originalAgent}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Doctor</span>
                    <p className="text-sm text-slate-700 font-medium">{item.doctor || '--'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Appointment</span>
                  <p className="text-sm text-slate-700 font-bold">{formatDate(item.appointDetails?.date)}, {item.appointDetails?.timeSlot}</p>
                </div>
              </div>
            );
          })
        )}

        {!loading && bookings.length > 0 && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, bookings.length)} of {bookings.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white disabled:opacity-40">
                Prev
              </button>
              <span className="text-sm font-bold text-slate-700 px-2">{currentPage} / {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const StatusPill = ({ count, label, color, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold hover:shadow-md transition-all active:scale-95 ${color} ${active ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
  >
    <span className="text-sm leading-none">{count}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const getConsultStyle = (status) => {
  switch (status) {
    case "Complete":         return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "New":              return "bg-blue-50 text-blue-600 border-blue-100";
    case "Pending/Upcoming": return "bg-orange-50 text-orange-600 border-orange-100";
    case "Cancelled":        return "bg-red-50 text-red-600 border-red-100";
    case "Reschedule":       return "bg-purple-50 text-purple-600 border-purple-100";
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