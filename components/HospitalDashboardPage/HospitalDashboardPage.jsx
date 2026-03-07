"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Star, Clock, User, Calendar, Droplet, X, Check } from 'lucide-react';
import { getMeClinicProfile } from "@/app/services/clinic/hospitalProfile.service"; // ✅ IMPORT SERVICE

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRejectCard, setShowRejectCard] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  const [followUpStatus, setFollowUpStatus] = useState('');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [notes, setNotes] = useState('');
  
  // ✅ STATE FOR CLINIC HEADER
  const [clinicHeader, setClinicHeader] = useState({
    name: "Loading...",
    location: "Loading...",
    initial: "C"
  });

  const [requests, setRequests] = useState([
    {
      id: 'ED#0298848',
      time: 'Today 10:30 AM',
      type: 'Collet CASH ED',
      amount: 599,
      patient: {
        name: 'Pavan Karchal',
        age: 38,
        gender: 'Male',
        bloodGroup: null,
        initials: 'PK',
        image: null
      },
      slot: 'Today 11 AM - 12 PM',
      doctor: {
        name: 'Dr. Ram Sharma',
        qualification: 'MBBS, M.D Medicine',
        specialty: 'General Physician',
        experience: '3 years',
        rating: 4,
        available: true,
        image: null
      },
      status: 'pending'
    },
    {
      id: 'ED#0298098',
      time: 'Today 10:30 AM',
      type: 'Collet CASH',
      amount: 599,
      orderType: 'Low Sperm',
      patient: {
        name: 'Pavan Karchal',
        age: 38,
        gender: 'Male',
        bloodGroup: 'O+',
        initials: 'PK',
        image: null
      },
      slot: 'Today 11 AM - 12 PM',
      doctor: {
        name: 'Dr. Shankar Dayal',
        qualification: 'MBBS, M.D Medicine',
        specialty: 'General Physician',
        experience: '3 years',
        rating: 4,
        available: true,
        image: null
      },
      status: 'pending'
    }
  ]);

  // ✅ FETCH CLINIC DATA ON MOUNT
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await getMeClinicProfile();
        if (response.success && response.data) {
          console.log(response.data)
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
        console.error("Failed to load header clinic data", error);
        setClinicHeader({ name: "MEN10 Clinic", location: "Location Unavailable", initial: "M" });
      }
    };

    fetchHeaderData();
  }, []);


  const tabs = [
    { id: 'all', label: 'All', count: requests.length },
    { id: 'booked', label: 'Booked', count: requests.filter(r => r.status === 'accepted').length },
    { id: 'cancelled', label: 'Cancelled', count: requests.filter(r => r.status === 'cancelled').length },
    { id: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
    { id: 'absent', label: 'Pt Absent', count: requests.filter(r => r.status === 'absent').length },
    { id: 'follow-up', label: 'Follow-up', count: requests.filter(r => r.status === 'follow-up').length },
    { id: 'sold', label: 'Sold', count: requests.filter(r => r.status === 'sold').length }
  ];

  const handleAccept = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'accepted' } : req
    ));
    setShowRejectCard(false);
  };

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
    setPaymentReceived(false);
    setNotes('');
  };

  const handleAbsentClick = (request) => {
    setSelectedRequest(request);
    setShowAbsentModal(true);
    setNotes('');
  };

  const handleCancel = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'cancelled' } : req
    ));
  };

  const handleMarkCompletePaid = () => {
    setPaymentReceived(true);
  };

  const handleFinalizeAppointment = () => {
    let finalStatus = 'completed';
    
    if (followUpStatus === 'interested') {
      finalStatus = 'follow-up';
    } else if (followUpStatus === 'sell') {
      finalStatus = 'sold';
    }
    
    setRequests(requests.map(req => 
      req.id === selectedRequest.id ? { ...req, status: finalStatus } : req
    ));
    setShowCompleteModal(false);
    setSelectedRequest(null);
  };

  const handleCloseRejectAppointment = () => {
    setRequests(requests.map(req => 
      req.id === selectedRequest.id ? { ...req, status: 'rejected' } : req
    ));
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  const handleCloseAbsentAppointment = () => {
    setRequests(requests.map(req => 
      req.id === selectedRequest.id ? { ...req, status: 'absent' } : req
    ));
    setShowAbsentModal(false);
    setSelectedRequest(null);
  };

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(req => {
        if (activeTab === 'booked') return req.status === 'accepted';
        return req.status === activeTab;
      });

  return (
    <div className="h-full overflow-y-auto bg-gray-50">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* ✅ DYNAMIC INITIAL */}
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                {clinicHeader.initial}
              </div>
              <div>
                {/* ✅ DYNAMIC NAME */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{clinicHeader.name}</h1>
                {/* ✅ DYNAMIC LOCATION */}
                <p className="text-xs sm:text-sm text-gray-500">{clinicHeader.location}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
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
                  activeTab === tab.id
                    ? 'bg-white text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={20} />
            <span>Add Request</span>
          </button>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="relative">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">• Order ID: {request.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {request.time}
                    </span>
                    <span>•</span>
                    <span>{request.type}</span>
                  </div>
                  {request.orderType && (
                    <p className="text-sm text-gray-700 mt-1 font-medium">{request.orderType}</p>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-start gap-3">
                        {request.patient.image ? (
                          <img src={request.patient.image} alt={request.patient.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <User size={24} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900">{request.patient.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                            <span>{request.patient.gender}</span>
                            <span>•</span>
                            <span>{request.patient.age} years</span>
                            {request.patient.bloodGroup && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Droplet size={14} className="text-red-500" />
                                  Blood Group {request.patient.bloodGroup}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="items-center gap-2 mt-2 text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex">
                            <Calendar size={14} />
                            <span className="font-medium">Slot: {request.slot}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                      <p className="text-sm text-gray-600 mb-2">Booking for</p>
                      <div className="flex items-start gap-3">
                        {request.doctor.image ? (
                          <img src={request.doctor.image} alt={request.doctor.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <User size={24} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{request.doctor.name}</h4>
                              <p className="text-sm text-gray-600">{request.doctor.qualification}</p>
                            </div>
                            {request.doctor.available && (
                              <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                Available
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {request.doctor.specialty} • Exp ~ {request.doctor.experience}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < request.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                      <button onClick={() => handleAccept(request.id)} className="text-emerald-500 hover:text-emerald-600 font-semibold text-base transition-colors">Accept</button>
                      <button onClick={() => handleRejectClick(request)} className="text-red-500 hover:text-red-600 font-semibold text-base transition-colors">Reject</button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                      <button onClick={() => handleCompleteClick(request)} className="text-emerald-500 hover:text-emerald-600 font-semibold text-base transition-colors">Complete</button>
                      <button onClick={() => handleAbsentClick(request)} className="text-red-500 hover:text-red-600 font-semibold text-base transition-colors">Absent</button>
                      <button onClick={() => handleCancel(request.id)} className="text-yellow-600 hover:text-yellow-700 font-semibold text-base transition-colors">Cancel</button>
                    </div>
                  )}

                  {request.status === 'completed' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg font-medium text-center">✓ Appointment Finalized</div>
                    </div>
                  )}
                  {request.status === 'absent' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg font-medium text-center">Marked as Absent</div>
                    </div>
                  )}
                  {request.status === 'cancelled' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg font-medium text-center">Appointment Cancelled</div>
                    </div>
                  )}
                  {request.status === 'rejected' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg font-medium text-center">✗ Appointment Closed</div>
                    </div>
                  )}
                  {request.status === 'follow-up' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg font-medium text-center">📋 Follow-up Required</div>
                    </div>
                  )}
                  {request.status === 'sold' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-lg font-medium text-center">💰 Sold</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Complete Modal */}
      {showCompleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Complete</h2>
              <button onClick={() => setShowCompleteModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-blue-600 font-medium mb-2">• Order ID {selectedRequest.id} • {selectedRequest.time} • {selectedRequest.type}</p>
                <div className="flex items-center gap-3 mt-4">
                  {selectedRequest.patient.image ? (
                    <img src={selectedRequest.patient.image} alt={selectedRequest.patient.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {selectedRequest.patient.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedRequest.patient.name}</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.patient.gender} • {selectedRequest.patient.age} years</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">Slot: {selectedRequest.slot}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Booking for</p>
                <div className="flex items-center gap-3">
                  {selectedRequest.doctor.image ? (
                    <img src={selectedRequest.doctor.image} alt={selectedRequest.doctor.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedRequest.doctor.name}</h4>
                    <p className="text-xs text-gray-600">{selectedRequest.doctor.qualification}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.doctor.specialty} • Exp ~ {selectedRequest.doctor.experience}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < selectedRequest.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {!paymentReceived && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Follow Up</h4>
                  <div className="space-y-2">
                    {['not-interested', 'sell', 'interested'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFollowUpStatus(status)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                          followUpStatus === status ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {status.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!paymentReceived ? (
                <div className="bg-emerald-50 rounded-lg p-4 border-2 border-dashed border-emerald-200">
                  <p className="text-sm text-emerald-700 font-medium mb-1">Please Collect Cash</p>
                  <p className="text-3xl font-bold text-emerald-700">₹{selectedRequest.amount}</p>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Check size={20} className="bg-blue-600 text-white rounded-full p-0.5" />
                    <p className="font-semibold">Online Payment Received</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">₹{selectedRequest.amount}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={!paymentReceived ? handleMarkCompletePaid : handleFinalizeAppointment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {!paymentReceived ? 'Mark as Completed & Paid' : 'Finalize Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Card Modal */}
      {showRejectCard && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="space-y-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">• Order ID {selectedRequest.id} • {selectedRequest.time} • {selectedRequest.type}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{selectedRequest.doctor.name}</h4>
                          <p className="text-sm text-gray-600">{selectedRequest.doctor.qualification}</p>
                        </div>
                        {selectedRequest.doctor.available && (
                          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                            Available
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {selectedRequest.doctor.specialty} • Exp ~ {selectedRequest.doctor.experience}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < selectedRequest.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button onClick={() => handleAccept(selectedRequest.id)} className="text-emerald-500 hover:text-emerald-600 font-semibold text-base transition-colors">Complete</button>
                <button onClick={handleRejectFromCard} className="text-red-500 hover:text-red-600 font-semibold text-base transition-colors">Absent</button>
                <button onClick={() => setShowRejectCard(false)} className="text-yellow-600 hover:text-yellow-700 font-semibold text-base transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Reject</h2>
                <button onClick={() => setShowRejectModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-blue-600 font-medium mb-2">• Order ID {selectedRequest.id} • {selectedRequest.time} • {selectedRequest.type}</p>
                <div className="flex items-center gap-3 mt-4">
                  {selectedRequest.patient.image ? (
                    <img src={selectedRequest.patient.image} alt={selectedRequest.patient.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {selectedRequest.patient.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedRequest.patient.name}</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.patient.gender} • {selectedRequest.patient.age} years</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">Slot: {selectedRequest.slot}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Booking for</p>
                <div className="flex items-center gap-3">
                  {selectedRequest.doctor.image ? (
                    <img src={selectedRequest.doctor.image} alt={selectedRequest.doctor.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedRequest.doctor.name}</h4>
                    <p className="text-xs text-gray-600">{selectedRequest.doctor.qualification}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.doctor.specialty} • Exp ~ {selectedRequest.doctor.experience}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < selectedRequest.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any notes about the consultation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCloseRejectAppointment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Check size={20} /> Close Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Absent Modal */}
      {showAbsentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Reject</h2>
                <button onClick={() => setShowAbsentModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-blue-600 font-medium mb-2">• Order ID {selectedRequest.id} • {selectedRequest.time} • {selectedRequest.type}</p>
                <div className="flex items-center gap-3 mt-4">
                  {selectedRequest.patient.image ? (
                    <img src={selectedRequest.patient.image} alt={selectedRequest.patient.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {selectedRequest.patient.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedRequest.patient.name}</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.patient.gender} • {selectedRequest.patient.age} years</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">Slot: {selectedRequest.slot}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Booking for</p>
                <div className="flex items-center gap-3">
                  {selectedRequest.doctor.image ? (
                    <img src={selectedRequest.doctor.image} alt={selectedRequest.doctor.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedRequest.doctor.name}</h4>
                    <p className="text-xs text-gray-600">{selectedRequest.doctor.qualification}</p>
                    <p className="text-xs text-gray-600">{selectedRequest.doctor.specialty} • Exp ~ {selectedRequest.doctor.experience}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < selectedRequest.doctor.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any notes about the consultation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCloseAbsentAppointment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Check size={20} /> Close Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;