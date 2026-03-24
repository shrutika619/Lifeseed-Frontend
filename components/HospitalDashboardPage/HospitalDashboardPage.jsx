"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Star, Clock, User, Calendar, Droplet, X, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getMeClinicProfile } from "@/app/services/clinic/hospitalProfile.service";
import { clinicBookingService } from "@/app/services/clinic/hospitalBooking.service";

const HospitalDashboard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [metrics, setMetrics] = useState({ counts: {}, followUpCounts: {}, total: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [activeTab, setActiveTab] = useState('all');
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
        
        else if (activeTab === 'follow-up') queryStr = '?followUpStatus=Interested';
        else if (activeTab === 'sold') queryStr = '?followUpStatus=Sell';
        else if (activeTab === 'not-interested') queryStr = '?followUpStatus=Not Interested';

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
            
            const patientData = b.bookingPatientDetails || {};
            const accountData = b.patientDetails || {};
            const doctorData = b.doctor || {};

            return {
              id: b.appointmentId || "--",
              internalBookingId: b.bookingId,
              time: `${bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${bDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
              type: isPrepaid ? 'Prepaid' : 'Collect CASH',
              amount: b.fees || 0,
              orderType: b.notes || null,
              
              patient: {
                name: patientData.name || accountData.name || "Unknown",
                age: patientData.age || accountData.age || "--",
                gender: patientData.gender || accountData.gender || "Not Specified",
                initials: (patientData.name || accountData.name || "U").substring(0, 2).toUpperCase(),
                image: null,
                phone: patientData.contact || accountData.loginNumber || "--"
              },
              
              slot: b.timeSlot || "Not Scheduled",
              
              doctor: {
                name: doctorData.name || "Unknown Doctor",
                qualification: [doctorData.underGradDegree, doctorData.postGradDegree].filter(x => x && x !== "--").join(", ") || "Specialist",
                specialty: doctorData.primarySpecialty || "--",
                experience: doctorData.experience ? `${doctorData.experience} years` : "--",
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
          toast.error(res.message || "Failed to load bookings");
        }
      } catch (error) {
        toast.error("Error communicating with server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeTab, refreshTrigger]);

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
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{clinicHeader.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{clinicHeader.location}</p>
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
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">

                  {/* CARD HEADER */}
                  <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="font-medium text-blue-600">• {request.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{request.time}</span>
                      <span>•</span>
                      <span className={`font-bold ${request.type === 'Prepaid' ? 'text-green-600' : 'text-orange-500'}`}>
                        {request.type}
                      </span>
                    </div>
                    {request.orderType && (
                      <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">{request.orderType}</p>
                    )}
                  </div>

                  <div className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                      {/* PATIENT INFO */}
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        {request.patient.image ? (
                          <img src={request.patient.image} alt={request.patient.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{request.patient.initials}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{request.patient.name}</h3>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-0.5 text-xs sm:text-sm text-gray-600">
                            <span>{request.patient.phone}</span>
                            <span>•</span>
                            <span>{request.patient.age} yrs</span>
                          </div>
                          <div className="items-center gap-1.5 mt-2 text-xs sm:text-sm text-gray-700 bg-blue-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg inline-flex">
                            <Calendar size={12} className="text-blue-600" />
                            <span className="font-bold text-blue-700">{request.slot}</span>
                          </div>
                        </div>
                      </div>

                      {/* DOCTOR INFO */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-3 lg:pt-0 lg:pl-6">
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium uppercase tracking-wider">Consulting Doctor</p>
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          {request.doctor.image ? (
                            <img src={request.doctor.image} alt={request.doctor.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User size={17} className="text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">{request.doctor.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{request.doctor.specialty}</p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{request.doctor.qualification}</p>
                              </div>
                              {request.doctor.available && (
                                <span className="bg-emerald-500 text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                  Available
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 truncate">
                              {request.doctor.specialty} • Exp ~ {request.doctor.experience}
                            </p>
                            <div className="flex items-center gap-0.5 mt-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < request.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  {request.status === 'new' && (
                    <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 p-3 sm:p-6">
                      <button disabled={isProcessing} onClick={() => handleAccept(request)} className="bg-emerald-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 text-sm sm:text-base">Accept Booking</button>
                      <button disabled={isProcessing} onClick={() => handleRejectClick(request)} className="text-red-500 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base">Reject</button>
                    </div>
                  )}
                  {request.status === 'accept' && (
                    <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 p-3 sm:p-6">
                      <button disabled={isProcessing} onClick={() => handleCompleteClick(request)} className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base">Mark Complete</button>
                      <button disabled={isProcessing} onClick={() => handleAbsentClick(request)} className="text-red-500 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base">Patient Absent</button>
                      <button disabled={isProcessing} onClick={() => handleCancel(request)} className="text-yellow-600 hover:bg-yellow-50 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base">Cancel</button>
                    </div>
                  )}
                  {request.status === 'complete' && (
                    <div className="border-t border-gray-200 p-3 sm:p-6">
                      <div className="bg-emerald-50 text-emerald-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Check size={16} /> Appointment Finalized
                      </div>
                    </div>
                  )}
                  {request.status === 'patient absent' && (
                    <div className="border-t border-gray-200 p-3 sm:p-6">
                      <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium flex items-center gap-2 text-sm sm:text-base">
                        <X size={16} /> Marked as Absent
                      </div>
                    </div>
                  )}
                  {request.status === 'cancelled' && (
                    <div className="border-t border-gray-200 p-3 sm:p-6">
                      <div className="bg-yellow-50 text-yellow-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base">Appointment Cancelled</div>
                    </div>
                  )}
                  {request.status === 'rejected' && (
                    <div className="border-t border-gray-200 p-3 sm:p-6">
                      <div className="bg-red-50 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base">✗ Appointment Rejected</div>
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
                  {/* ✅ Added missing options here in the select dropdown */}
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