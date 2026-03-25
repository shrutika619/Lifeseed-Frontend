"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Star, Clock, User, Calendar, Droplet, X, Check, ArrowLeft, Loader2, ChevronDown, PhoneCall, Phone, FileText, Download, MoreVertical } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { getMeClinicProfile } from "@/app/services/clinic/hospitalProfile.service";
import { clinicBookingService } from "@/app/services/clinic/hospitalBooking.service";
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
      const res = await clinicBookingService.updateBookingStatus(item.internalBookingId, { status: "Cancelled", notes: notes || "Doctor emergency" });
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
      `Doctor: ${item.doctor.name}`,
      `Price: ${item.amount}`,
      `Payment: ${item.type}`,
      `Status: ${item.status}`,
      `Appointment: ${item.slot}`,
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
          className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover:scale-105 border border-blue-100 shadow-sm">
          <Phone className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => router.push(profileHref)} title="View Profile"
          className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all hover:scale-105 border border-indigo-100 shadow-sm">
          <User className="w-3.5 h-3.5" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown((p) => !p)} title="More Actions"
            className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
          {showDropdown && <ActionDropdown item={item} onClose={() => setShowDropdown(false)} onOpenCancel={() => setCancelModal(true)} />}
        </div>
      </div>
    </>
  );
};

const HospitalDashboard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [metrics, setMetrics] = useState({ counts: {}, followUpCounts: {}, total: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [activeTab, setActiveTab] = useState('all');
  const [primaryDate, setPrimaryDate] = useState(""); 
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRejectCard, setShowRejectCard] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAbsentModal, setShowAbsentModal] = useState(false);

  const [followUpStatus, setFollowUpStatus] = useState('');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [notes, setNotes] = useState('');

  const [clinicHeader, setClinicHeader] = useState({
    name: "Loading...",
    location: "Loading...",
    initial: "C"
  });

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // 1. FETCH CLINIC HEADER
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await getMeClinicProfile();
        if (response.success && response.data) {
          const clinic = response.data.clinic;
          const area = clinic.areaName || "";
          const city = response.data.cityName || "";
          const formattedLocation = [area, city].filter(Boolean).join(", ");
          setClinicHeader({
            name: clinic.clinicName || "MEN10 Clinic",
            location: formattedLocation || "Location Unavailable",
            initial: (clinic.clinicName || "M").charAt(0).toUpperCase()
          });
        } else {
          setClinicHeader({ name: "MEN10 Clinic", location: "Location Unavailable", initial: "M" });
        }
      } catch (error) {
        setClinicHeader({ name: "MEN10 Clinic", location: "Location Unavailable", initial: "M" });
      }
    };
    fetchHeaderData();
  }, []);

  // 2. FETCH BOOKINGS
  const fetchBookings = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      let queryStr = '?';
      
      if (primaryDate) {
        queryStr += `date=${primaryDate}&`;
      }

      if (activeTab === 'booked') queryStr += 'status=Accept';
      else if (activeTab === 'cancelled') queryStr += 'status=Cancelled';
      else if (activeTab === 'completed') queryStr += 'status=Complete';
      else if (activeTab === 'absent') queryStr += 'status=Patient Absent';
      else if (activeTab === 'new') queryStr += 'status=New';
      
      else if (activeTab === 'follow-up') queryStr += 'followUpStatus=Interested';
      else if (activeTab === 'sold') queryStr += 'followUpStatus=Sell';
      else if (activeTab === 'not-interested') queryStr += 'followUpStatus=Not Interested';

      if (queryStr.endsWith('&') || queryStr.endsWith('?')) {
        queryStr = queryStr.slice(0, -1);
      }

      const res = await clinicBookingService.getClinicBookings(queryStr);
      
      if (res.success && res.data) {
        setMetrics({
          counts: res.data.counts || {},
          followUpCounts: res.data.followUpCounts || {},
          total: res.data.total || 0
        });

        const mappedRequests = res.data.bookings.map(b => {
          const bDate = new Date(b.bookingDate);
          const isPrepaid = b.paymentMode?.toLowerCase() !== 'cash' || b.paymentStatus === 'COMPLETED';
          
          // ✅ Corrected Mapping based on backend response
          const patientData = b.bookingPatientDetails || {};
          const accountData = b.patientDetails || {};
          const doctorData = b.doctor || {};

          return {
            id: b.appointmentId || "--",
            internalBookingId: b.bookingId,
            patientId: accountData.patientId || accountData.userId,
            
            time: `${bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${bDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            type: isPrepaid ? 'Prepaid' : 'Collect CASH',
            amount: b.fees || 0,
            orderType: b.notes || null,
            agent: b.agent || "Self",
            hospital: b.clinic || "--",
            
            bookedBy: b.bookedBy || {},

            // Actual Patient
            patient: {
              name: patientData.name || accountData.name || "Unknown",
              age: patientData.age || accountData.age || "--",
              gender: patientData.gender || accountData.gender || "Not Specified",
              initials: (patientData.name || accountData.name || "U").substring(0, 2).toUpperCase(),
              image: null,
              phone: patientData.contact || accountData.loginNumber || "--",
              concernedAbout: patientData.concernedAbout || []
            },
            
            // Account Owner
            account: {
              name: accountData.name || "--",
              phone: accountData.loginNumber || "--",
              email: accountData.email || "--",
              city: accountData.city || "--"
            },
            
            slot: b.timeSlot || "Not Scheduled",
            displayDate: `${bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${bDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            
            doctor: {
              name: doctorData.name || "Unknown Doctor",
              qualification: [doctorData.underGradDegree, doctorData.postGradDegree].filter(x => x && x !== "--").join(", ") || "Specialist",
              specialty: doctorData.primarySpecialty || "--",
              experience: doctorData.experience ? `${doctorData.experience} yrs` : "--",
              rating: 4,
              available: true,
              image: doctorData.profileImage || null
            },
            
            status: b.status?.toLowerCase() || 'pending',
            paymentStatus: b.paymentStatus
          };
        });

        setRequests(mappedRequests);
      } else {
        if(isInitialLoad) toast.error(res.message || "Failed to load bookings");
      }
    } catch (error) {
      if(isInitialLoad) toast.error("Error communicating with server.");
    } finally {
      if(isInitialLoad) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(true);

    const intervalId = setInterval(() => {
      fetchBookings(false);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [activeTab, primaryDate, refreshTrigger]);

  // 3. TABS
  const tabs = [
    { id: 'all', label: 'All', count: metrics.total },
    { id: 'new', label: 'New', count: metrics.counts['New'] || 0 },
    { id: 'booked', label: 'Booked', count: metrics.counts['Accept'] || 0 },
    { id: 'completed', label: 'Completed', count: metrics.counts['Complete'] || 0 },
    { id: 'absent', label: 'Pt Absent', count: metrics.counts['Patient Absent'] || 0 },
    { id: 'cancelled', label: 'Cancelled', count: metrics.counts['Cancelled'] || 0 },
    { id: 'follow-up', label: 'Follow-up', count: metrics.followUpCounts['Interested'] || 0 },
    { id: 'sold', label: 'Sold', count: metrics.followUpCounts['Sell'] || 0 },
    { id: 'not-interested', label: 'Not Interested', count: metrics.followUpCounts['Not Interested'] || metrics.followUpCounts['Not-Interested'] || 0 }
  ];

  // 4. ACTION HANDLERS
  const handleAccept = async (request) => {
    const toastId = toast.loading("Accepting booking...");
    setIsProcessing(true);
    try {
      const res = await clinicBookingService.updateBookingStatus(request.internalBookingId, { status: "Accept" });
      if (res.success) {
        toast.success("Booking Accepted!", { id: toastId });
        triggerRefresh();
      } else {
        toast.error(res.message || "Failed to accept", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Server Error", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async (request) => {
    const reason = window.prompt("Reason for cancellation (optional):", "Patient requested");
    if (reason === null) return;
    const toastId = toast.loading("Cancelling booking...");
    setIsProcessing(true);
    try {
      const res = await clinicBookingService.updateBookingStatus(request.internalBookingId, { status: "Cancelled", notes: reason });
      if (res.success) {
        toast.success("Booking Cancelled", { id: toastId });
        triggerRefresh();
      } else {
        toast.error(res.message || "Failed to cancel", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Server Error", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizeAppointment = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Finalizing appointment...");
    try {
      const payload = { status: "Complete" };
      if (followUpStatus === 'interested') payload.followUpStatus = "Interested";
      if (followUpStatus === 'sell') payload.followUpStatus = "Sell";
      if (followUpStatus === 'not-interested') payload.followUpStatus = "Not Interested";
      
      const res = await clinicBookingService.updateBookingStatus(selectedRequest.internalBookingId, payload);
      if (res.success) {
        toast.success("Appointment completed!", { id: toastId });
        setShowCompleteModal(false);
        setSelectedRequest(null);
        triggerRefresh();
      } else {
        toast.error(res.message || "Failed to complete", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Server Error", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseRejectAppointment = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Rejecting appointment...");
    try {
      const res = await clinicBookingService.updateBookingStatus(selectedRequest.internalBookingId, { status: "Rejected", notes });
      if (res.success) {
        toast.success("Appointment rejected", { id: toastId });
        setShowRejectModal(false);
        setSelectedRequest(null);
        triggerRefresh();
      } else {
        toast.error(res.message || "Failed to reject", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Server Error", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseAbsentAppointment = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Marking patient as absent...");
    try {
      const res = await clinicBookingService.updateBookingStatus(selectedRequest.internalBookingId, { status: "Patient Absent", notes });
      if (res.success) {
        toast.success("Patient marked as absent", { id: toastId });
        setShowAbsentModal(false);
        setSelectedRequest(null);
        triggerRefresh();
      } else {
        toast.error(res.message || "Failed to update", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Server Error", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. MODAL TRIGGERS
  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowRejectCard(true);
    setNotes('');
  };

  const handleRejectFromCard = () => {
    setShowRejectCard(false);
    setShowRejectModal(true);
  };

  const handleCompleteClick = (request) => {
    setSelectedRequest(request);
    setShowCompleteModal(true);
    setFollowUpStatus('');
    setPaymentReceived(request.paymentStatus === 'COMPLETED' || request.type === 'Prepaid');
    setNotes('');
  };

  const handleAbsentClick = (request) => {
    setSelectedRequest(request);
    setShowAbsentModal(true);
    setNotes('');
  };

  const handleMarkCompletePaid = () => {
    setPaymentReceived(true);
  };

  const filteredRequests = activeTab === 'all'
    ? requests
    : requests.filter(req => {
        if (activeTab === 'booked') return req.status === 'accept';
        return req.status === activeTab;
      });

  return (
    <div className="h-full overflow-y-auto bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-base sm:text-lg flex-shrink-0">
              {clinicHeader.initial}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{clinicHeader.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{clinicHeader.location}</p>
            </div>
            
            {/* Date Filter Dropdown */}
            <div className="relative w-32 sm:w-40 flex-shrink-0">
              <select
                value={primaryDate}
                onChange={(e) => setPrimaryDate(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 pr-8 sm:pr-10 rounded-lg text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* TABS ROW */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}

            {/* PLUS BUTTON */}
            <button
              onClick={() => router.push('/hospitaldashboard/plus')}
              className="p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center flex-shrink-0"
              aria-label="Add new"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* REQUEST CARDS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading OPD List...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No bookings found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.internalBookingId} className="relative">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">

                  {/* CARD HEADER */}
                  <div className="px-4 sm:px-6 py-3 bg-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[13px] text-gray-500 font-medium">
                      <span className="text-blue-600 font-semibold">• {request.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={13} />{request.time}</span>
                      <span>•</span>
                      <span className={`font-bold ${request.type === 'Prepaid' ? 'text-emerald-600' : 'text-orange-500'}`}>
                        {request.type}
                      </span>
                    </div>
                    {/* Action Cell positioned perfectly in header right */}
                    <ActionCell item={request} onRefresh={triggerRefresh} />
                  </div>

                  {/* CARD BODY: SPLIT VIEW */}
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 md:gap-0">
                    
                    {/* LEFT SIDE: PATIENT & BOOKING INFO */}
                    <div className="flex-1 md:pr-6 md:border-r border-gray-100 flex flex-col gap-5">
                      
                      {/* PATIENT DETAILS */}
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Patient Details</p>
                        <div className="flex items-start gap-4">
                          {request.patient.image ? (
                            <img src={request.patient.image} alt={request.patient.name} className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-[50px] h-[50px] rounded-full bg-[#A855F7] flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-[15px] tracking-wide">{request.patient.initials}</span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-[16px] text-gray-900 leading-tight mb-1">{request.patient.name}</h3>
                            <p className="text-[13px] text-gray-500 mb-2 font-medium">
                              {request.patient.phone} <span className="mx-1.5">•</span> {request.patient.age} yrs <span className="mx-1.5">•</span> <span className="capitalize">{request.patient.gender}</span>
                            </p>
                            {request.patient.concernedAbout?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {request.patient.concernedAbout.map((c, idx) => (
                                  <span key={idx} className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{c}</span>
                                ))}
                              </div>
                            )}
                            <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md font-semibold border border-blue-100/50 mt-1">
                              <Calendar size={13} className="text-blue-500" />
                              {request.slot}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BOOKING DETAILS */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Booking Details</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Booked By</p>
                             {request.bookedBy?.original?.type === "admin" ? (
                                <>
                                  <p className="text-sm font-semibold text-gray-800">{request.bookedBy.original.name || "--"}</p>
                                  <p className="text-xs text-gray-500">📞 {request.bookedBy.original.mobileNo || "--"}</p>
                                  <span className="inline-block mt-1 bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Admin</span>
                                </>
                             ) : (
                                <>
                                  <p className="text-sm font-semibold text-gray-800">{request.account.name}</p>
                                  <p className="text-xs text-gray-500">📞 {request.account.phone}</p>
                                </>
                             )}
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Fees & Payment</p>
                             <p className="text-sm font-semibold text-gray-800">₹{request.amount}</p>
                             <p className={`text-[10px] font-bold uppercase mt-0.5 ${request.type === 'Prepaid' ? 'text-emerald-600' : 'text-orange-500'}`}>{request.type}</p>
                          </div>
                          {/* <div>
                             <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Agent</p>
                             <p className="text-sm font-semibold text-gray-800">{request.agent}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Hospital</p>
                             <p className="text-sm font-semibold text-gray-800">{request.hospital}</p>
                          </div> */}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT SIDE: DOCTOR INFO */}
                    <div className="flex-1 md:pl-8 flex flex-col justify-center mt-4 md:mt-0">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Consulting Doctor</p>
                      
                      <div className="flex items-start gap-3">
                        {request.doctor.image ? (
                          <img src={request.doctor.image} alt={request.doctor.name} className="w-[42px] h-[42px] rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-[42px] h-[42px] rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                            <User size={20} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                           <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-[15px] text-gray-900 truncate">{request.doctor.name}</h4>
                              {request.doctor.available && (
                                <span className="bg-[#00B47D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 tracking-wide">
                                  Available
                                </span>
                              )}
                           </div>
                           <p className="text-[13px] text-gray-500 mt-0.5 truncate">{request.doctor.specialty}</p>
                           <p className="text-[13px] text-gray-400 mt-0.5 truncate">{request.doctor.qualification}</p>
                           <p className="text-[13px] text-gray-500 mt-0.5 truncate">
                             {request.doctor.specialty} • Exp ~ {request.doctor.experience}
                           </p>
                           <div className="flex items-center gap-0.5 mt-1.5">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} size={14} className={i < request.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} />
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ACTION BUTTONS (BOTTOM BAR) */}
                  {request.status === 'new' && (
                    <div className="flex items-center gap-4 border-t border-gray-100 p-4 sm:px-6 bg-white rounded-b-xl">
                      <button disabled={isProcessing} onClick={() => handleAccept(request)} className="bg-[#00B47D] text-white px-5 py-2.5 rounded-md font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 text-sm shadow-sm">Accept Booking</button>
                      <button disabled={isProcessing} onClick={() => handleRejectClick(request)} className="text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm">Reject</button>
                    </div>
                  )}
                  {request.status === 'accept' && (
                    <div className="flex items-center gap-4 border-t border-gray-100 p-4 sm:px-6 bg-white rounded-b-xl">
                      <button disabled={isProcessing} onClick={() => handleCompleteClick(request)} className="bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm shadow-sm">Mark Complete</button>
                      <button disabled={isProcessing} onClick={() => handleAbsentClick(request)} className="text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm">Patient Absent</button>
                      <button disabled={isProcessing} onClick={() => handleCancel(request)} className="text-yellow-600 hover:bg-yellow-50 px-4 py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50 text-sm">Cancel</button>
                    </div>
                  )}
                  {request.status === 'complete' && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-emerald-50/30 rounded-b-xl">
                      <div className="text-emerald-700 font-medium flex items-center gap-2 text-sm">
                        <Check size={16} /> Appointment Finalized
                      </div>
                    </div>
                  )}
                  {request.status === 'patient absent' && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-red-50/30 rounded-b-xl">
                      <div className="text-red-700 font-medium flex items-center gap-2 text-sm">
                        <X size={16} /> Marked as Absent
                      </div>
                    </div>
                  )}
                  {request.status === 'cancelled' && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-yellow-50/30 rounded-b-xl">
                      <div className="text-yellow-700 font-medium text-sm">Appointment Cancelled</div>
                    </div>
                  )}
                  {request.status === 'rejected' && (
                    <div className="border-t border-gray-100 p-4 sm:p-6 bg-red-50/30 rounded-b-xl">
                      <div className="text-red-700 font-medium text-sm">✗ Appointment Rejected</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── COMPLETE MODAL ── */}
      {showCompleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Complete Consultation</h2>
              <button onClick={() => setShowCompleteModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={22} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs sm:text-sm text-blue-600 font-bold mb-1">{selectedRequest.id} • {selectedRequest.type}</p>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{selectedRequest.patient.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Slot: <span className="font-bold text-gray-800">{selectedRequest.slot}</span></p>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">Follow Up Required?</h4>
                <select
                  value={followUpStatus}
                  onChange={(e) => setFollowUpStatus(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-700 text-sm font-medium"
                >
                  <option value="">No Follow Up</option>
                  <option value="not-interested">Not Interested</option>
                  <option value="sell">Sell Package</option>
                  <option value="interested">Interested in Procedure</option>
                </select>
              </div>

              {selectedRequest.type === 'Prepaid' ? (
                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <Check size={16} className="bg-blue-600 text-white rounded-full p-0.5" />
                    <p className="font-bold text-sm">Prepaid Online</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-blue-700">₹{selectedRequest.amount}</p>
                </div>
              ) : !paymentReceived ? (
                <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 border-2 border-dashed border-emerald-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs sm:text-sm text-emerald-700 font-medium mb-1">Please Collect Cash</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700">₹{selectedRequest.amount}</p>
                  </div>
                  <button 
                    onClick={handleMarkCompletePaid} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Mark Paid
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-4 sm:p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <Check size={16} className="bg-emerald-600 text-white rounded-full p-0.5" />
                    <p className="font-bold text-sm">Cash Collected</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700">₹{selectedRequest.amount}</p>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none text-sm"
                  rows={3}
                />
              </div>

              <button
                onClick={handleFinalizeAppointment}
                disabled={(selectedRequest.type === 'Collect CASH' && !paymentReceived) || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Finalize Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT CARD MODAL ── */}
      {showRejectCard && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">
            <div className="space-y-4 sm:space-y-5">
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                • {selectedRequest.id} • {selectedRequest.time} • {selectedRequest.type}
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{selectedRequest.patient.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{selectedRequest.patient.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm text-gray-600">
                    <span>{selectedRequest.patient.gender}</span>
                    <span>•</span>
                    <span>{selectedRequest.patient.age}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs sm:text-sm text-gray-700 bg-blue-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg inline-flex">
                    <Calendar size={12} />
                    <span className="font-medium">{selectedRequest.slot}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                <button disabled={isProcessing} onClick={() => { setShowRejectCard(false); handleAccept(selectedRequest); }} className="text-emerald-500 hover:text-emerald-600 font-semibold text-sm sm:text-base transition-colors disabled:opacity-50">Accept Instead</button>
                <button disabled={isProcessing} onClick={handleRejectFromCard} className="text-red-500 hover:text-red-600 font-semibold text-sm sm:text-base transition-colors disabled:opacity-50">Confirm Reject</button>
                <button onClick={() => setShowRejectCard(false)} className="text-gray-500 hover:text-gray-700 font-semibold text-sm sm:text-base transition-colors ml-auto">Go Back</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Reject Booking</h2>
              <button onClick={() => setShowRejectModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={22} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Doctor unavailable, slot clash..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCloseRejectAppointment}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 sm:py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <X size={18} />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ABSENT MODAL ── */}
      {showAbsentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Patient Absent</h2>
              <button onClick={() => setShowAbsentModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={22} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-xs sm:text-sm text-gray-600">Mark <span className="font-bold text-gray-900">{selectedRequest?.patient.name}</span> as a no-show for this appointment?</p>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Tried calling, phone switched off..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCloseAbsentAppointment}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 sm:py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={18} />}
                Confirm Absence
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalDashboard;