"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search, Filter, ChevronDown, Plus, Bell,
  Phone, User, MoreVertical, Calendar, Download,
  FileText, MapPin, X, PhoneCall, ArrowLeft, Loader2
} from "lucide-react";
import { useRouter , usePathname} from "next/navigation";
import { toast } from "sonner";
import { adminInclinicService } from "@/app/services/admin/adminInclinic.service"; 

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
            <p className="text-sm text-slate-500">Age {patient.age || '--'}</p>
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

/* ── CANCEL MODAL ── */
const CancelModal = ({ item, onClose, onRefresh }) => {
  const [notes, setNotes] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = async () => {
    setIsCancelling(true);
    const toastId = toast.loading("Cancelling booking...");
    try {
      const res = await adminInclinicService.cancelInClinicBooking(item.internalBookingId, notes || "Doctor emergency");
      if (res.success) {
        toast.success("Booking cancelled successfully", { id: toastId });
        if (onRefresh) onRefresh();
        onClose();
      } else {
        toast.error(res.message || "Failed to cancel booking", { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || "Error cancelling booking", { id: toastId });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Cancel Booking</h3>
          <button onClick={onClose} disabled={isCancelling} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="mb-5">
          <p className="text-sm text-slate-600 mb-4">
            Are you sure you want to cancel the booking for <span className="font-bold text-slate-800">{item.patient.name}</span>?
          </p>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Reason for Cancellation</label>
          <textarea
            className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 resize-none h-24 transition-all bg-slate-50 focus:bg-white"
            placeholder="e.g. Doctor emergency, Patient requested..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isCancelling}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isCancelling} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50">
            Keep Booking
          </button>
          <button onClick={handleConfirm} disabled={isCancelling} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-red-200 disabled:opacity-50">
            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── THREE-DOT DROPDOWN ── */
const ActionDropdown = ({ item, onClose, onOpenCancel }) => {
  const router = useRouter();
  
  const handleDownload = () => {
    const content = [
      `Request ID: ${item.id}`,
      `Patient: ${item.patient.name}, Age ${item.patient.age}`,
      `Phone: ${item.patient.phone}`,
      `Email: ${item.account.email}`,
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

  const profileHref = item.patientId 
    ? `/super-admin/in-clinic-consultation/customerprofile?patientId=${item.patientId}` 
    : `/super-admin/in-clinic-consultation/customerprofile`;

  const actions = [
    { icon: X,         label: "Cancel",        color: "text-red-600",     bg: "hover:bg-red-50",     onClick: () => { onOpenCancel(); onClose(); } },
    { icon: PhoneCall, label: "Call Clinic",    color: "text-slate-600",   bg: "hover:bg-slate-50",   onClick: () => { window.location.href = "tel:+911800000000"; onClose(); } },
    { icon: FileText,  label: "Profile & CRM", color: "text-indigo-600",  bg: "hover:bg-indigo-50",  onClick: () => { router.push(profileHref); onClose(); } },
    { icon: Calendar,  label: "Reschedule",    color: "text-orange-600",  bg: "hover:bg-orange-50",  onClick: () => { alert(`Reschedule ${item.id}`); onClose(); } },
    { icon: Phone,     label: "Call Patient",  color: "text-blue-600",    bg: "hover:bg-blue-50",    onClick: () => { window.location.href = `tel:${item.patient.phone}`; onClose(); } },
    { icon: Download,  label: "Download",      color: "text-emerald-600", bg: "hover:bg-emerald-50", onClick: handleDownload },
    { icon: FileText,  label: "Ticket",        color: "text-cyan-600",    bg: "hover:bg-cyan-50",    onClick: () => { alert(`Ticket raised for ${item.id}`); onClose(); } },
  ];

  return (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-40 min-w-[185px] py-1">
      {actions.map(({ icon: Icon, label, color, bg, onClick }) => (
         <button key={label} onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${color} ${bg} transition-colors`}>
           <Icon className="w-4 h-4 shrink-0" />{label}
         </button>
      ))}
    </div>
  );
};

/* ── ACTION CELL ── */
const ActionCell = ({ item, onRefresh }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [callModal,    setCallModal]    = useState(false);
  const [cancelModal,  setCancelModal]  = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const profileHref = item.patientId 
    ? `/super-admin/in-clinic-consultation/customerprofile?patientId=${item.patientId}` 
    : `/super-admin/in-clinic-consultation/customerprofile`;

  return (
    <>
      {callModal && <CallModal patient={item.patient} onClose={() => setCallModal(false)} />}
      {cancelModal && <CancelModal item={item} onClose={() => setCancelModal(false)} onRefresh={onRefresh} />}
      
      <div className="flex items-center justify-center gap-1.5">
        <button onClick={() => setCallModal(true)} title="Call Patient"
          className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-blue-200 shadow-sm">
          <Phone className="w-4 h-4" />
        </button>
        <button onClick={() => router.push(profileHref)} title="View Profile"
          className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all hover:scale-110 border border-indigo-200 shadow-sm">
          <User className="w-4 h-4" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown((p) => !p)} title="More Actions"
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && <ActionDropdown item={item} onClose={() => setShowDropdown(false)} onOpenCancel={() => setCancelModal(true)} />}
        </div>
      </div>
    </>
  );
};

/* ── STATUS BADGE ── */
const StatusBadge = ({ count, label, color, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${active ? "ring-2 ring-blue-400 shadow-md scale-105" : "hover:scale-105"} ${color}`}>
    <span className="text-sm leading-none">{String(count).padStart(2, '0')}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

/* ── MAIN PAGE ── */
const AdminInClinicConsultationPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [primaryDate, setPrimaryDate] = useState("All Time");
  
  // API Data States
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [metrics, setMetrics] = useState({
    counts: { "New": 0, "Accept": 0, "Rejected": 0, "Complete": 0, "Patient Absent": 0, "Cancelled": 0 },
    followUpCounts: { "Not Interested": 0, "Sell": 0, "Interested": 0 }
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Server-Side Filtering API Fetch
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        const dateMap = {
          "Today": "today",
          "Yesterday": "yesterday",
          "Last 7 Days": "week",
          "This Month": "month"
        };
        if (dateMap[primaryDate]) {
          params.append("date", dateMap[primaryDate]);
        }

        if (activeFilter !== "All") {
          if (["Interested", "Sell", "Not Interested"].includes(activeFilter)) {
            params.append("followUpStatus", activeFilter);
          } else {
            params.append("status", activeFilter);
          }
        }

        const res = await adminInclinicService.getAllInClinicBookings(`?${params.toString()}`);
        console.log(res)
        
        if (res.success && res.data) {
          setMetrics({
            counts: res.data.counts || {},
            followUpCounts: res.data.followUpCounts || {}
          });

          // ✅ SPLIT MAPPING
          const mappedData = res.data.bookings.map(b => {
            const bDate = new Date(b.bookingDate);
            const patientData = b.bookingPatientDetails || {};
            const accountData = b.patientDetails || {};
            
            return {
              id: b.appointmentId || "--",
              internalBookingId: b.bookingId,
              patientId: accountData.patientId, // Passed for CRM routing
              
              bookingDate: `${bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${bDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
              appointment: b.timeSlot ? b.timeSlot : "--",
              
              paymentMode: b.paymentMode === "cash" ? "Cash" : b.paymentMode || "Unknown",
              price: `₹${b.fees}`,
              status: b.status || "New",
              agent: b.agent || "Self",
              
              // Map Actual Patient
              patient: { 
                name: patientData.name || "--", 
                age: patientData.age || "--", 
                gender: patientData.gender || "--", 
                phone: patientData.contact || accountData.loginNumber || "--",
                concernedAbout: patientData.concernedAbout || []
              },
              
              // Map Account Owner
              account: {
                name: accountData.name || "--",
                phone: accountData.loginNumber || "--",
                email: accountData.email || "--",
                city: accountData.city || "--"
              },

              hospital: b.clinic?.name || "--",
              doctor: b.doctor?.name || "--",
            };
          });

          setBookingData(mappedData);
        } else {
          toast.error("Failed to load in-clinic bookings");
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error(error.message || "Failed to communicate with server");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [debouncedSearch, activeFilter, primaryDate, refreshTrigger]); 

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Accept': return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
      case 'Complete': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border border-rose-300';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const handleFilterClick = (filterName) => {
    setActiveFilter(prev => prev === filterName ? "All" : filterName);
  };

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-slate-700 font-sans">

      {/* Row 1 */}
      <div className="flex flex-col xl:flex-row xl:flex-wrap items-start xl:items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="relative w-full xl:w-auto">
          <select value={primaryDate} onChange={(e) => setPrimaryDate(e.target.value)} className="w-full xl:w-auto appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>All Time</option>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge count={metrics.counts["New"] || 0} label="New" color="bg-amber-50 text-amber-700 border border-amber-200" active={activeFilter==="New"} onClick={() => handleFilterClick("New")} />
          <StatusBadge count={metrics.counts["Accept"] || 0} label="Accept" color="bg-cyan-50 text-cyan-700 border border-cyan-200" active={activeFilter==="Accept"} onClick={() => handleFilterClick("Accept")} />
          <StatusBadge count={metrics.counts["Patient Absent"] || 0} label="Patient Absent" color="bg-slate-100 text-slate-600 border border-slate-200" active={activeFilter==="Patient Absent"} onClick={() => handleFilterClick("Patient Absent")} />
          <StatusBadge count={metrics.counts["Cancelled"] || 0} label="Cancelled" color="bg-rose-100 text-rose-700 border border-rose-300" active={activeFilter==="Cancelled"} onClick={() => handleFilterClick("Cancelled")} />
          <StatusBadge count={metrics.counts["Complete"] || 0} label="Complete" color="bg-emerald-50 text-emerald-700 border border-emerald-200" active={activeFilter==="Complete"} onClick={() => handleFilterClick("Complete")} />
          
          <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block"></div>
          
          <StatusBadge count={metrics.followUpCounts["Interested"] || 0} label="Interested" color="bg-blue-50 text-blue-700 border border-blue-200" active={activeFilter==="Interested"} onClick={() => handleFilterClick("Interested")} />
          <StatusBadge count={metrics.followUpCounts["Sell"] || 0} label="Sell" color="bg-green-500 text-white border border-green-600" active={activeFilter==="Sell"} onClick={() => handleFilterClick("Sell")} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 w-full lg:flex-1">
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"><Filter className="w-5 h-5 text-slate-500" /></button>
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients, ID, phone..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button 
            onClick={() => {
              const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
              router.push(`${basePath}/newuser`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Add Booking
          </button>
          <button className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><Bell className="w-4 h-4" /> 03 Notification</button>
        </div>
      </div>

      {/* ── DATA RENDERING ── */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-slate-500">Loading Bookings...</p>
        </div>
      ) : bookingData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center">
          <p className="text-sm font-medium text-slate-500">No bookings match your filters.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60">
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Request Id</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booked By</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment</th>
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.map((item, i) => (
                    <tr key={item.internalBookingId || i} className="border-b border-slate-100 last:border-0 hover:bg-blue-50/20 transition-colors">
                      <td className="px-5 py-5">
                        <p className="text-sm font-bold text-slate-700 whitespace-nowrap">{item.id}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{item.bookingDate.split(',')[0]}</p>
                        <p className="text-[11px] text-slate-500">{item.bookingDate.split(',')[1]}</p>
                      </td>
                      
                      {/* ✅ BOOKED BY COLUMN */}
                      <td className="px-5 py-5">
                        <p className="text-sm text-slate-800 font-semibold">{item.account.name}</p>
                        <p className="text-sm text-slate-600 mt-0.5">📞 {item.account.phone}</p>
                        {item.account.email !== "--" && <p className="text-xs text-slate-500 truncate max-w-[150px]" title={item.account.email}>{item.account.email}</p>}
                        {item.account.city !== "--" && <p className="text-xs text-slate-500">{item.account.city}</p>}
                      </td>
                      
                      {/* ✅ PATIENT COLUMN */}
                      <td className="px-5 py-5">
                        <p className="text-sm text-slate-800 font-semibold">
                          {item.patient.name} 
                          {item.patient.age !== "--" && <span className="font-normal text-slate-500 text-xs ml-1">Age {item.patient.age}</span>}
                        </p>
                        <p className="text-sm text-slate-600 mt-0.5">📞 {item.patient.phone}</p>
                        <p className="text-xs text-slate-500 capitalize">{item.patient.gender}</p>
                        {item.patient.concernedAbout?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 max-w-[160px]">
                            {item.patient.concernedAbout.map((c, idx) => (
                              <span key={idx} className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{c}</span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-5 text-sm font-medium text-slate-700">{item.agent}</td>
                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-slate-700">{item.hospital}</p>
                        <p className="text-sm text-slate-600">{item.doctor}</p>
                        <p className="text-sm font-extrabold text-slate-800 mt-1">{item.price}</p>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5 capitalize">{item.paymentMode}</p>
                      </td>
                      <td className="px-5 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-sm font-semibold text-slate-700 whitespace-nowrap">{item.appointment}</td>
                      <td className="px-5 py-5">
                        <ActionCell item={item} onRefresh={triggerRefresh} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4">
            {bookingData.map((item, i) => (
              <div key={item.internalBookingId || i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-slate-700">{item.id}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>{item.status}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 capitalize">{item.paymentMode}</span>
                    </div>
                  </div>
                  <ActionCell item={item} onRefresh={triggerRefresh} />
                </div>

                <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
                   {/* ✅ Patient Info Box */}
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Details</p>
                     <p className="font-semibold text-slate-800 text-sm">
                       {item.patient.name} <span className="font-normal text-slate-500 text-xs ml-1">Age {item.patient.age} • {item.patient.gender}</span>
                     </p>
                     <p className="text-xs text-slate-600 mt-0.5">📞 {item.patient.phone}</p>
                     {item.patient.concernedAbout?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.patient.concernedAbout.map((c, i) => (
                            <span key={i} className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{c}</span>
                          ))}
                        </div>
                      )}
                   </div>

                   {/* ✅ Booked By Info Box */}
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Booked By (Account)</p>
                     <p className="text-sm font-medium text-slate-700">{item.account.name}</p>
                     <p className="text-xs text-slate-600">📞 {item.account.phone}</p>
                     {item.account.city !== "--" && <p className="text-xs text-slate-500">{item.account.city}</p>}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-slate-100">
                  <div><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Booking Date</p><p className="text-xs text-slate-700 font-medium">{item.bookingDate}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Agent</p><p className="text-sm text-slate-700 font-medium">{item.agent}</p></div>
                </div>
                <div className="mb-3 pb-3 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Hospital</p>
                  <p className="text-sm font-bold text-slate-700">{item.hospital}</p>
                  <p className="text-sm text-slate-600">{item.doctor}</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{item.price}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Appointment</p>
                  <p className="text-sm font-bold text-slate-700">{item.appointment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default AdminInClinicConsultationPage;