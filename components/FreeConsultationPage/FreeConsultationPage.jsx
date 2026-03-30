"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, X, Loader2, ArrowLeft } from 'lucide-react';
import { getAllCities } from '@/app/services/patient/clinic.service';
import { bookTeleconsultation, getPatientTeleSlots } from '@/app/services/patient/appointment.service';
import { adminTeleconsultationService } from '@/app/services/admin/adminTeleconsultation.service'; 
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation'; 
import { toast } from 'sonner'; 

import { useSelector, useDispatch } from "react-redux";
import { 
  selectUser, 
  selectIsAuthenticated, 
  fetchProfileDetails 
} from "@/redux/slices/authSlice";

// Helper to generate the next 3 days dynamically
const generateUpcomingDates = (numDays = 3) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      fullDate: d.toISOString().split('T')[0], 
      label: d.toLocaleDateString('en-US', { weekday: 'short' }), 
      date: d.getDate().toString() 
    });
  }
  return dates;
};

// Sort periods chronologically
const sortPeriodsChronologically = (groups) => {
  const orderMap = { night: 1, morning: 2, afternoon: 3, evening: 4 };
  return [...groups].sort((a, b) => {
    return (orderMap[a.period] || 99) - (orderMap[b.period] || 99);
  });
};

// ✅ HELPER: Check if a time slot string (e.g., "10:30 AM - 11:00 AM") is in the past (for today)
const isSlotInPast = (slotTimeStr, selectedDateStr) => {
  const today = new Date();
  const selectedDate = new Date(selectedDateStr);
  
  // If selected date is strictly in the future, slot is not in the past
  if (selectedDate.setHours(0,0,0,0) > today.setHours(0,0,0,0)) return false;

  // Extract start time (e.g. "10:30 AM")
  const startTimeStr = slotTimeStr.split(" - ")[0];
  if (!startTimeStr) return false;

  const match = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  let [_, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

  const currentTime = new Date();
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);

  return slotTime < currentTime;
};

const FreeConsultationPage = () => {
  const router = useRouter(); 
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Read Auth State from Redux
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Determine if the logged-in user is an Admin/SuperAdmin
  const userRole = user?.role?.toLowerCase() || '';
  const isAdminOrSuperAdmin = ['admin', 'super_admin', 'superadmin', 'clinic_admin'].includes(userRole);
  const adminDashboardPath = (userRole === 'super_admin' || userRole === 'superadmin') 
      ? '/super-admin/teleconsultation' 
      : '/admin/teleconsultation';

  // Dynamic Date & Slot States
  const [availableDates, setAvailableDates] = useState(generateUpcomingDates());
  const [selectedDate, setSelectedDate] = useState(availableDates[0].fullDate);
  const [slotGroups, setSlotGroups] = useState([]);
  const [patientLimit, setPatientLimit] = useState(1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [activeGroupId, setActiveGroupId] = useState(null); 
  const [topLevelAvailabilityId, setTopLevelAvailabilityId] = useState(null);

  // Auth & Profile States
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false); 
  const [prefillLoaded, setPrefillLoaded] = useState(false);

  // Form States
  const [patientContact, setPatientContact] = useState(searchParams.get('contact') || ''); 
  const [fullName, setFullName] = useState(searchParams.get('name') || '');
  const [age, setAge] = useState(searchParams.get('age') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  
  const initialConcern = searchParams.get('concern');
  const [concern, setConcern] = useState(initialConcern ? [initialConcern] : []);

  // ✅ NEW: Form validation errors state
  const [formErrors, setFormErrors] = useState({});
  
  const isAdminBooking = searchParams.get('admin_booking') === 'true'; 
  const rescheduleRecordId = searchParams.get('rescheduleRecordId'); 
  
  // UI States
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('online');
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false); 
  const [bookingData, setBookingData] = useState(null);
  const [clinicLinks, setClinicLinks] = useState({});

  const concerns = [
    'Sexual Dysfunction',
    'Erectile Dysfunction',
    'Low Sex Desire',
    'Premature Ejaculation',
    'Couple Sex Problem',
    'Other'
  ];

  // SYNC DATA
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setIsLoggedIn(false);
        setFetchingProfile(false);
        return;
      }

      setIsLoggedIn(true);
      
      // ADMIN FLOW: Prefill API
      if (isAdminOrSuperAdmin) {
        setProfileLoaded(true); 
        
        const pUserId = searchParams.get('userId');
        
        if (isAdminBooking && pUserId && !prefillLoaded) {
          setFetchingProfile(true);
          try {
            const res = await adminTeleconsultationService.getAppointmentPrefill(pUserId);
            if (res.success && res.data) {
              if (!patientContact && (res.data.bookingContactNumber || res.data.mobileNo)) {
                setPatientContact(res.data.bookingContactNumber || res.data.mobileNo); 
              }
              if (!fullName && res.data.fullName) setFullName(res.data.fullName);
              if (!age && res.data.age) setAge(res.data.age.toString());
              if (!gender && res.data.gender) setGender(res.data.gender.toLowerCase());
            }
          } catch (error) {
            console.error("Failed to load prefill data", error);
            toast.error("Could not fetch patient prefill data.");
          } finally {
            setPrefillLoaded(true);
            setFetchingProfile(false);
          }
        } else {
          setFetchingProfile(false);
        }
        return; 
      }

      // PATIENT FLOW: Redux profile
      if (!user?.fullName && !profileLoaded) {
        setFetchingProfile(true);
        await dispatch(fetchProfileDetails());
        setFetchingProfile(false);
      } 
      
      if (user && !profileLoaded && !isAdminOrSuperAdmin) {
        if (!patientContact && (user.mobileNo || user.contactNumber || user.phone)) {
           setPatientContact(user.mobileNo || user.contactNumber || user.phone);
        }
        if (!fullName && user.fullName) setFullName(user.fullName);
        if (!age && user.age) setAge(user.age.toString());
        if (!gender && user.gender) setGender(user.gender.toLowerCase());
        
        setProfileLoaded(true); 
        setFetchingProfile(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, dispatch, profileLoaded, prefillLoaded, fullName, age, gender, patientContact, isAdminBooking, searchParams, isAdminOrSuperAdmin]);

  // Fetch Cities 
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await getAllCities();
        const data = response?.data || response; 
        if (Array.isArray(data)) {
          const formattedLinks = data.reduce((acc, city) => {
            if (city?.name) acc[city.name] = city.name.toLowerCase();
            return acc;
          }, {});
          setClinicLinks(formattedLinks);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCityData();
  }, []);

  // Fetch Slots
  const fetchSlots = useCallback(async () => {
    if (!selectedDate) return;
    
    setLoadingSlots(true);
    setSelectedSlot(null); 
    setActiveGroupId(null);
    setTopLevelAvailabilityId(null); 

    try {
      const res = await getPatientTeleSlots(selectedDate);
      const responseData = res?.data?.slotGroups ? res.data : res;
      
      if (responseData && responseData.slotGroups) {
        setTopLevelAvailabilityId(responseData.availabilityId); 
        const sortedGroups = sortPeriodsChronologically(responseData.slotGroups);
        setSlotGroups(sortedGroups);
        setPatientLimit(responseData.patientLimit || 1);
      } else {
        setSlotGroups([]);
      }
    } catch (error) {
      console.error("Slot fetch error", error);
      setSlotGroups([]);
    }
    
    setLoadingSlots(false);
  }, [selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Toggle Multiple Concerns
  const toggleConcern = (item) => {
    if (concern.includes(item)) {
      setConcern(concern.filter(c => c !== item));
    } else {
      setConcern([...concern, item]);
      // ✅ Clear concern error when user selects one
      setFormErrors(prev => ({ ...prev, concern: '' }));
    }
  };

  // ✅ NEW: Validate form fields and return errors object
  const validateForm = () => {
    const errors = {};

    if (isAdminOrSuperAdmin && !rescheduleRecordId && !patientContact) {
      errors.patientContact = 'Patient Username / Contact is required.';
    }

    if (!rescheduleRecordId) {
      if (!fullName.trim()) errors.fullName = 'Full Name is required.';
      if (!age) {
        errors.age = 'Age is required.';
      } else if (isNaN(age) || Number(age) <= 0 || Number(age) > 120) {
        errors.age = 'Please enter a valid age.';
      }
      if (!gender) errors.gender = 'Gender is required.';
      if (!concern || concern.length === 0) errors.concern = 'Please select at least one concern.';
    }

    if (!selectedSlot || !activeGroupId || !topLevelAvailabilityId) {
      errors.slot = 'Please select a valid time slot.';
    }

    return errors;
  };

  // BOOKING / RESCHEDULING HANDLER
  const handleBooking = async () => {
    if (!isLoggedIn) {
      router.push('/login?from=/free-consultation'); 
      return;
    }

    // ✅ Run validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Show slot error via toast since it's on different section
      if (errors.slot) toast.error(errors.slot);
      return;
    }

    // Clear all errors if validation passes
    setFormErrors({});
    setIsBooking(true);

    try {
      let res;
      let orderIdToDisplay = "";

      if (rescheduleRecordId) {
        const reschedulePayload = {
          availabilityId: topLevelAvailabilityId,
          slotGroupId: activeGroupId,             
          slotId: selectedSlot._id || selectedSlot.id,
        };

        res = await adminTeleconsultationService.rescheduleBooking(rescheduleRecordId, reschedulePayload);
        
        if (res.success) {
           orderIdToDisplay = res.data.requestId || res.data.bookingId || "RESCHEDULED";
        }
      } 
      else {
        const bookingPayload = {
          availabilityId: topLevelAvailabilityId,
          slotGroupId: activeGroupId,             
          slotId: selectedSlot._id || selectedSlot.id,
          fullName: fullName,
          age: Number(age), 
          gender: gender,
          concernedAbout: concern,
          bookingContactNumber: patientContact || searchParams.get('contact') || ''
        };

        if (isAdminOrSuperAdmin && isAdminBooking && searchParams.get('userId')) {
           bookingPayload.patientUserId = searchParams.get('userId'); 
        }

        res = await bookTeleconsultation(bookingPayload);
        
        if (res.success) {
          orderIdToDisplay = res.data.appointmentId || res.data.requestId;
        }
      }

      if (res.message?.toLowerCase().includes("unauthorized") || res.statusCode === 401) {
         router.push('/login?from=/free-consultation');
         return;
      }

      if (res.success || res.message?.includes("successfully")) {
        const responseData = res.data;
        const displayDate = new Date(responseData.date).toLocaleDateString('en-US', { 
          month: 'long', day: 'numeric', year: 'numeric' 
        });

        setBookingData({
          orderId: orderIdToDisplay, 
          date: displayDate,
          time: responseData.timeSlot,
          name: fullName || "Existing Patient",
          contact: patientContact || "On File", 
          age: age || "--",
          gender: gender || "--",
          concern: concern.length > 0 ? concern.join(", ") : "Follow-Up" 
        });
        
        setIsBooked(true);

        if (rescheduleRecordId) {
            toast.success("Booking successfully rescheduled!");
        } else if (isAdminBooking) {
            toast.success(`Booking successfully created for ${fullName}`);
        }
      } else {
        const errorMsg = res.message || "";
        if (errorMsg.includes("VersionError") || errorMsg.includes("No matching document")) {
          toast.error("Slot already full. Please select another time slot.");
          fetchSlots(); 
        } else {
          toast.error(errorMsg || "Something went wrong. Please try again.");
        }
      }

    } catch (error) {
      console.error(error);
      const errorStr = String(error?.message || error?.error || error);
      if (errorStr.includes("VersionError") || errorStr.includes("No matching document")) {
        toast.error("Slot already full. Please select another time slot.");
        fetchSlots(); 
      } else {
        toast.error(error?.message || "Failed to communicate with server.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = () => {
    setIsBooked(false);
    setBookingData(null);
    setConcern([]); 
    setSelectedDate(availableDates[0].fullDate);
    setSelectedSlot(null);
    setActiveGroupId(null);
    setFormErrors({});
  };

  const handleTabClick = (tab) => {
    if (tab === 'clinic') setShowCityPopup(true);
    setActiveTab(tab);
  };

  // SUCCESS SCREEN
  if (isBooked && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button 
            onClick={handleCancelAppointment}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Booking</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-b from-white to-gray-50 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                 {rescheduleRecordId ? "Consultation Rescheduled!" : "Consultation Booked!"}
              </h1>
              <p className="text-sm text-gray-600">Your appointment details are confirmed below.</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="font-semibold text-gray-800">Payment & Booking Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-semibold text-gray-800">{bookingData.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <p className="font-semibold text-green-600">Free / ₹0</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">Appointment Details</h2>
                    <p className="text-xs text-gray-500">with a MEN10 Expert</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-semibold text-gray-800">{bookingData.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="font-semibold text-gray-800">{bookingData.time}</p>
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <h2 className="font-semibold text-gray-800">Patient Details</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {isAdminOrSuperAdmin && bookingData.contact && (
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">Contact / Username:</p>
                      <p className="text-sm font-semibold text-gray-800">{bookingData.contact}</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Full Name:</p>
                    <p className="text-sm font-semibold text-gray-800">{bookingData.name}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Age:</p>
                    <p className="text-sm font-semibold text-gray-800">{bookingData.age}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Gender:</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{bookingData.gender}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-600">Concern:</p>
                    <p className="text-sm font-semibold text-gray-800">{bookingData.concern}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {isAdminBooking ? (
                  <button 
                    onClick={() => router.push(adminDashboardPath)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Back to Admin Dashboard
                  </button>
                ) : (
                  <p className="text-center text-sm text-gray-600 mb-3">Need to make a change?</p>
                )}
                <button 
                  onClick={handleCancelAppointment}
                  className={`w-full font-semibold py-3 rounded-lg transition ${isAdminBooking ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  Book Another Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeGroups = slotGroups.filter(g => g.slots && g.slots.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Admin Warning Banner */}
        {isAdminBooking && (
            <div className={`border px-4 py-3 rounded-lg mb-6 font-semibold flex items-center justify-between ${rescheduleRecordId ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-orange-100 border-orange-300 text-orange-800'}`}>
                <span>⚠️ Admin Mode: {rescheduleRecordId ? "Rescheduling an existing appointment." : "Booking an appointment on behalf of a patient."}</span>
                <button onClick={() => router.push(adminDashboardPath)} className={`text-sm bg-white px-3 py-1 rounded shadow-sm hover:bg-gray-50 ${rescheduleRecordId ? 'text-indigo-700' : 'text-orange-700'}`}>Back to Dashboard</button>
            </div>
        )}

        {/* Header Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => handleTabClick('online')}
            className={`pb-2 font-medium ${activeTab === 'online' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Online Consultation
          </button>
          <button 
            onClick={() => handleTabClick('clinic')}
            className={`pb-2 ${activeTab === 'clinic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Book In-Clinic Visit
          </button>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {rescheduleRecordId 
               ? "Reschedule Appointment" 
               : <>Book {isAdminBooking ? 'Patient' : 'Your'} <span className="text-blue-600">FREE</span> Online Consultation</>
            }
          </h1>
          <p className="text-gray-600 text-sm">
            {rescheduleRecordId 
               ? "Please select a new date and time for the patient's consultation." 
               : "Speak privately with our expert. Your first consultation is on us."}
          </p>
          
          {!rescheduleRecordId && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="line-through text-gray-400">₹400</span>
              <span className="text-green-600 font-bold text-xl">₹0</span>
              <span className="text-gray-600 text-sm">Limited Time Offer!</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Section - Your Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 relative">
            
            {fetchingProfile && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                 <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
               </div>
            )}

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Consulting Expert</h2>
            
            {/* Doctor Card */}
            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg mb-6">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" 
                alt="Doctor" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-blue-600">Our Expert Doctor</h3>
                <p className="text-sm text-gray-600">Sexual Wellness & Men's Health</p>
                <p className="text-xs text-gray-500">17+ Years of Experience</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">{isAdminBooking ? "Patient Details" : "Your Details"}</h2>
            
            {/* ✅ Admin Contact Field with star */}
            {isAdminOrSuperAdmin && (
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Patient Username / Contact <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={patientContact}
                  disabled={rescheduleRecordId}
                  onChange={(e) => {
                    setPatientContact(e.target.value);
                    setFormErrors(prev => ({ ...prev, patientContact: '' }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    formErrors.patientContact
                      ? 'border-red-400 bg-red-50'
                      : rescheduleRecordId
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'border-blue-200 focus:border-blue-500 bg-blue-50/30'
                  }`}
                  placeholder="e.g. 8908999995"
                />
                {formErrors.patientContact && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.patientContact}</p>
                )}
              </div>
            )}

            {/* ✅ Full Name with star */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Full Name {!rescheduleRecordId && <span className="text-red-500">*</span>}
              </label>
              <input 
                type="text"
                value={fullName}
                disabled={rescheduleRecordId}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFormErrors(prev => ({ ...prev, fullName: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  formErrors.fullName
                    ? 'border-red-400 bg-red-50'
                    : rescheduleRecordId
                      ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                      : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Enter patient name"
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* ✅ Age with star */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Age {!rescheduleRecordId && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="number"
                  value={age}
                  disabled={rescheduleRecordId}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setFormErrors(prev => ({ ...prev, age: '' }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    formErrors.age
                      ? 'border-red-400 bg-red-50'
                      : rescheduleRecordId
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Age"
                />
                {formErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                )}
              </div>

              {/* ✅ Gender with star */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Gender {!rescheduleRecordId && <span className="text-red-500">*</span>}
                </label>
                <select 
                  value={gender}
                  disabled={rescheduleRecordId}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setFormErrors(prev => ({ ...prev, gender: '' }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    formErrors.gender
                      ? 'border-red-400 bg-red-50'
                      : rescheduleRecordId
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'border-gray-300 focus:border-blue-500 bg-pink-50'
                  }`}
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
                )}
              </div>
            </div>

            {/* ✅ Concern with star */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                What are you concerned about? {!rescheduleRecordId && <span className="text-red-500">*</span>}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {concerns.map((item) => {
                  const isSelected = concern.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={rescheduleRecordId}
                      onClick={() => toggleConcern(item)}
                      className={`px-3 py-2 rounded-lg text-sm border transition ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : rescheduleRecordId
                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                            : formErrors.concern
                              ? 'bg-white text-gray-700 border-red-300 hover:border-blue-300 hover:bg-blue-50'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {formErrors.concern && (
                <p className="text-red-500 text-xs mt-2">{formErrors.concern}</p>
              )}
            </div>
          </div>

          {/* Right Section - Date & Time Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h2>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-3">Select a Date</label>
              <div className="grid grid-cols-7 gap-2">
                {availableDates.map((day) => (
                  <button
                    key={day.fullDate}
                    onClick={() => setSelectedDate(day.fullDate)}
                    className={`py-3 px-2 rounded-lg text-center transition border ${
                      selectedDate === day.fullDate
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`font-semibold text-xs ${selectedDate === day.fullDate ? 'text-blue-100' : 'text-gray-500'}`}>
                      {day.label}
                    </div>
                    <div className="text-sm font-bold mt-1">{day.date}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[250px]">
              <label className="block text-sm text-gray-600 mb-3">Select a Time Slot</label>
              
              {loadingSlots ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-600" />
                  <p className="text-sm">Loading available slots...</p>
                </div>
              ) : activeGroups.length === 0 ? (
                <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">No slots available for this date.</p>
                  <p className="text-gray-400 text-xs mt-1">Please select a different date.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {activeGroups.map((group) => (
                    <div key={group._id || group.period}>
                      <p className="text-xs font-semibold text-gray-500 mb-2 capitalize tracking-wide">
                        {group.period}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {group.slots.map((slot) => {
                          const isFull = slot.bookedCount >= patientLimit;
                          // ✅ ADDED PAST SLOT CHECK
                          const isPast = isSlotInPast(slot.time, selectedDate); 
                          const isBookable = slot.isAvailable && !isFull && !isPast;
                          const isSelected = selectedSlot?._id === slot._id;

                          return (
                            <button
                              key={slot._id}
                              disabled={!isBookable}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setActiveGroupId(group._id); 
                                setFormErrors(prev => ({ ...prev, slot: '' }));
                              }}
                              className={`
                                py-2 px-1 rounded-lg text-sm transition border flex flex-col items-center justify-center
                                ${isSelected 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                  : isBookable 
                                    ? 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50' 
                                    : 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                                }
                              `}
                            >
                              <span className="font-medium whitespace-nowrap text-xs">{slot.time}</span>
                              
                              {/* Display Full OR Passed badge based on the condition */}
                              {isFull && !isPast && (
                                <span className="text-[10px] text-red-500 font-bold mt-0.5 leading-none">Full</span>
                              )}
                              {isPast && (
                                <span className="text-[10px] text-gray-400 font-bold mt-0.5 leading-none">Passed</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book Button */}
        <div className="text-center mt-8 flex justify-center">
          <button 
            onClick={handleBooking}
            disabled={isBooking}
            className={`flex items-center justify-center min-w-[320px] gap-2 text-white font-semibold px-12 py-4 rounded-xl shadow-lg transition-all transform active:scale-95 ${
              !selectedSlot ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isBooking ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {rescheduleRecordId ? 'Rescheduling...' : 'Booking...'}</>
            ) : selectedSlot ? (
              rescheduleRecordId ? 'Confirm Reschedule' : 'Confirm & Book Free Consultation'
            ) : (
              'Select a Slot'
            )}
          </button>
        </div>
      </div>

      {/* City Selection Popup */}
      {showCityPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Clinic City</h3>
              <button 
                onClick={() => setShowCityPopup(false)}
                className="text-white hover:bg-blue-700 rounded-full p-1 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {Object.entries(clinicLinks).map(([label, path]) => (
                <button
                  key={path}
                  className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition border-b border-gray-100 text-left"
                >
                  <Link href={`/clinic/${path}`} className="flex items-center gap-2 w-full">
                    <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                    <div className="font-semibold text-gray-800">{label}</div>
                  </Link>
                </button>
              ))}
              <p className="text-center text-sm text-gray-400 mt-4 pb-2">
                Can't find your city? Contact Customer Support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeConsultationPage;