"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Star, Clock, User, Calendar, Droplet, X, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Services
import { getMeClinicProfile } from "@/app/services/clinic/hospitalProfile.service";
import { clinicBookingService } from "@/app/services/clinic/hospitalBooking.service"; 

const HospitalDashboard = () => {
  const router = useRouter();

  // API States
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [metrics, setMetrics] = useState({ counts: {}, followUpCounts: {}, total: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ Used to reload data after actions

  // UI States
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Prevents double clicks
  
  // Modal States
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRejectCard, setShowRejectCard] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  
  const [followUpStatus, setFollowUpStatus] = useState('');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [notes, setNotes] = useState('');

  // Clinic Header State
  const [clinicHeader, setClinicHeader] = useState({
    name: "Loading...",
    location: "Loading...",
    initial: "C"
  });

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // 1. FETCH CLINIC HEADER DATA
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
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        let queryStr = '?date=today';
        if (activeTab === 'booked') queryStr += '&status=Accept';
        else if (activeTab === 'cancelled') queryStr += '&status=Cancelled';
        else if (activeTab === 'completed') queryStr += '&status=Complete';
        else if (activeTab === 'absent') queryStr += '&status=Patient Absent';
        else if (activeTab === 'new') queryStr += '&status=New';
        else if (activeTab === 'follow-up') queryStr = '?followUpStatus=Interested'; // Override date if needed
        else if (activeTab === 'sold') queryStr = '?followUpStatus=Sell';

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

            return {
              id: b.appointmentId || "--",
              internalBookingId: b.bookingId, // ✅ Needed for PATCH requests
              time: `${bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${bDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
              type: isPrepaid ? 'Prepaid' : 'Collect CASH',
              amount: b.fees || 0,
              patient: {
                name: b.requestBy?.name || "Unknown",
                age: b.requestBy?.age || "--",
                gender: "Not Specified", 
                initials: (b.requestBy?.name || "U").substring(0, 2).toUpperCase(),
                image: null,
                phone: b.requestBy?.phone
              },
              slot: b.timeSlot || "Not Scheduled",
              doctor: {
                name: b.doctor?.name || "Unknown Doctor",
                qualification: [b.doctor?.underGradDegree, b.doctor?.postGradDegree].filter(x=>x && x !== "--").join(", ") || "Specialist",
                specialty: b.doctor?.primarySpecialty || "--",
                experience: `${b.doctor?.experience || 0} years`,
                rating: 4, 
                available: true,
                image: b.doctor?.profileImage || null
              },
              status: b.status?.toLowerCase() || 'pending',
              paymentStatus: b.paymentStatus
            };
          });

          setRequests(mappedRequests);
        } else {
          toast.error(res.message || "Failed to load bookings");
        }
      } catch (error) {
        toast.error("Error communicating with server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeTab, refreshTrigger]); // ✅ Added refreshTrigger


  // 3. DYNAMIC TABS BASED ON METRICS
  const tabs = [
    { id: 'all', label: 'All', count: metrics.total },
    { id: 'new', label: 'New', count: metrics.counts['New'] || 0 },
    { id: 'booked', label: 'Booked', count: metrics.counts['Accept'] || 0 },
    { id: 'completed', label: 'Completed', count: metrics.counts['Complete'] || 0 },
    { id: 'absent', label: 'Pt Absent', count: metrics.counts['Patient Absent'] || 0 },
    { id: 'cancelled', label: 'Cancelled', count: metrics.counts['Cancelled'] || 0 },
    { id: 'follow-up', label: 'Follow-up', count: metrics.followUpCounts['Interested'] || 0 },
    { id: 'sold', label: 'Sold', count: metrics.followUpCounts['Sell'] || 0 }
  ];


  // ── ACTION HANDLERS (WIRED TO API) ──

  const handleAccept = async (request) => {
    const toastId = toast.loading("Accepting booking...");
    setIsProcessing(true);
    try {
      const res = await clinicBookingService.updateBookingStatus(request.internalBookingId, { status: "Accept" });
      if (res.success) {
        toast.success("Booking Accepted!", { id: toastId });
        triggerRefresh();
      } else {
        toast.error(res.message || "Failed to accept booking", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Server Error", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async (request) => {
    const reason = window.prompt("Reason for cancellation (optional):", "Patient requested");
    if (reason === null) return; // User pressed Cancel on prompt

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

      const res = await clinicBookingService.updateBookingStatus(selectedRequest.internalBookingId, payload);
      if (res.success) {
        toast.success("Appointment completed successfully!", { id: toastId });
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


  // ── MODAL UI TRIGGERS ──
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
    setPaymentReceived(request.paymentStatus === 'COMPLETED');
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


  return (
    <div className="h-full overflow-y-auto bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Go back">
                <ArrowLeft size={22} className="text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                {clinicHeader.initial}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{clinicHeader.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500">{clinicHeader.location}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TABS */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
           <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-500 font-medium">Loading OPD List...</p>
           </div>
        ) : requests.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-500 font-medium">No bookings found for this filter.</p>
           </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.internalBookingId} className="relative">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                  <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="font-medium text-blue-600">{request.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={14} />{request.time}</span>
                      <span>•</span>
                      <span className={`font-bold ${request.type === 'Prepaid' ? 'text-green-600' : 'text-orange-500'}`}>
                        {request.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Patient Info */}
                      <div>
                        <div className="flex items-start gap-3">
                          {request.patient.image ? (
                            <img src={request.patient.image} alt={request.patient.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">{request.patient.initials}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900">{request.patient.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                              <span>{request.patient.phone}</span>
                              <span>•</span>
                              <span>{request.patient.age} yrs</span>
                            </div>
                            <div className="items-center gap-2 mt-3 text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex">
                              <Calendar size={14} className="text-blue-600" />
                              <span className="font-bold text-blue-700">{request.slot}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                        <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">Consulting Doctor</p>
                        <div className="flex items-start gap-3">
                          {request.doctor.image ? (
                            <img src={request.doctor.image} alt={request.doctor.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User size={20} className="text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900">{request.doctor.name}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{request.doctor.specialty}</p>
                            <p className="text-xs text-gray-500 mt-1">{request.doctor.qualification}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons based on Status */}
                    {request.status === 'new' && (
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                        <button disabled={isProcessing} onClick={() => handleAccept(request)} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50">Accept Booking</button>
                        <button disabled={isProcessing} onClick={() => handleRejectClick(request)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">Reject</button>
                      </div>
                    )}
                    {request.status === 'accept' && (
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button disabled={isProcessing} onClick={() => handleCompleteClick(request)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">Mark Complete</button>
                        <button disabled={isProcessing} onClick={() => handleAbsentClick(request)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">Patient Absent</button>
                        <button disabled={isProcessing} onClick={() => handleCancel(request)} className="text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">Cancel</button>
                      </div>
                    )}
                    {request.status === 'complete' && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg font-medium flex items-center gap-2">
                          <Check size={18} /> Appointment Finalized
                        </div>
                      </div>
                    )}
                    {request.status === 'patient absent' && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg font-medium flex items-center gap-2">
                          <X size={18} /> Marked as Absent
                        </div>
                      </div>
                    )}
                    {request.status === 'cancelled' && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg font-medium">Appointment Cancelled</div>
                      </div>
                    )}
                    {request.status === 'rejected' && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg font-medium">Appointment Rejected</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      
      {/* 1. Complete Modal */}
      {showCompleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-900">Complete Consultation</h2>
              <button onClick={() => setShowCompleteModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-blue-600 font-bold mb-2">{selectedRequest.id} • {selectedRequest.type}</p>
                <h3 className="font-bold text-gray-900 text-lg">{selectedRequest.patient.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Slot: <span className="font-bold text-gray-800">{selectedRequest.slot}</span></p>
              </div>

              {/* Follow Up */}
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">Follow Up Required?</h4>
                <select
                  value={followUpStatus}
                  onChange={(e) => setFollowUpStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-gray-700 font-medium"
                >
                  <option value="">No Follow Up</option>
                  <option value="not-interested">Not Interested</option>
                  <option value="sell">Sell Package</option>
                  <option value="interested">Interested in Procedure</option>
                </select>
              </div>

              {/* Payment Box */}
              {selectedRequest.type === 'Prepaid' ? (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <Check size={18} className="bg-blue-600 text-white rounded-full p-0.5" />
                    <p className="font-bold">Prepaid Online</p>
                  </div>
                  <p className="text-2xl font-black text-blue-700">₹{selectedRequest.amount}</p>
                </div>
              ) : !paymentReceived ? (
                <div className="bg-emerald-50 rounded-xl p-5 border-2 border-dashed border-emerald-300 flex justify-between items-center">
                  <div>
                     <p className="text-xs text-emerald-600 font-bold uppercase mb-1">To Collect</p>
                     <p className="text-3xl font-black text-emerald-700">₹{selectedRequest.amount}</p>
                  </div>
                  <button onClick={handleMarkCompletePaid} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm">
                    Mark Paid
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <Check size={18} className="bg-emerald-600 text-white rounded-full p-0.5" />
                    <p className="font-bold">Cash Collected</p>
                  </div>
                  <p className="text-2xl font-black text-emerald-700">₹{selectedRequest.amount}</p>
                </div>
              )}

              <button
                onClick={handleFinalizeAppointment}
                disabled={selectedRequest.type === 'Collect CASH' && !paymentReceived || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                Finalize Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Reject Card Modal (Intermediate step) */}
      {showRejectCard && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95">
            <div className="space-y-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">• Order ID {selectedRequest.id} • {selectedRequest.time} • {selectedRequest.type}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div>
                  <div className="flex items-start gap-3">
                    {selectedRequest.patient.image ? (
                      <img src={selectedRequest.patient.image} alt={selectedRequest.patient.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900">{selectedRequest.patient.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>{selectedRequest.patient.gender}</span>
                        <span>•</span>
                        <span>{selectedRequest.patient.age} years</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex">
                        <Calendar size={14} />
                        <span className="font-medium">Slot: {selectedRequest.slot}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Doctor Info */}
                <div className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                  <p className="text-sm text-gray-600 mb-2">Booking for</p>
                  <div className="flex items-start gap-3">
                    {selectedRequest.doctor.image ? (
                      <img src={selectedRequest.doctor.image} alt={selectedRequest.doctor.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900">{selectedRequest.doctor.name}</h4>
                      <p className="text-sm text-gray-600">{selectedRequest.doctor.qualification}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button onClick={() => { setShowRejectCard(false); handleAccept(selectedRequest); }} className="text-emerald-500 hover:text-emerald-600 font-semibold text-base transition-colors">Accept Instead</button>
                <button onClick={handleRejectFromCard} className="text-red-500 hover:text-red-600 font-semibold text-base transition-colors">Confirm Reject</button>
                <button onClick={() => setShowRejectCard(false)} className="text-gray-500 hover:text-gray-700 font-semibold text-base transition-colors ml-auto">Go Back</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Reject Modal (Final Step) */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Reject Booking</h2>
                <button onClick={() => setShowRejectModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Doctor unavailable, slot clash..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCloseRejectAppointment}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <X size={20} />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Absent Modal */}
      {showAbsentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Patient Absent</h2>
                <button onClick={() => setShowAbsentModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">Mark <span className="font-bold text-gray-900">{selectedRequest.patient.name}</span> as a no-show for this appointment?</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Tried calling, phone switched off..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCloseAbsentAppointment}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
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