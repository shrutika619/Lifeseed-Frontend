"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Loader2 } from 'lucide-react';
import { getAllCities } from '@/app/services/patient/clinic.service';
import { bookTeleconsultation, getPatientTeleSlots } from '@/app/services/patient/appointment.service';
import Link from "next/link";
import { useRouter } from 'next/navigation'; 
import { toast } from 'sonner'; 
import api from "@/lib/axios"; 
import { Constants } from "@/app/utils/constants"; 

// ✅ Imported Redux Hooks & Actions
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
      fullDate: d.toISOString().split('T')[0], // YYYY-MM-DD for backend
      label: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon"
      date: d.getDate().toString() // "15"
    });
  }
  return dates;
};

// Sort periods chronologically starting at midnight
const sortPeriodsChronologically = (groups) => {
  const orderMap = {
    night: 1,      
    morning: 2,    
    afternoon: 3,  
    evening: 4     
  };

  return [...groups].sort((a, b) => {
    return (orderMap[a.period] || 99) - (orderMap[b.period] || 99);
  });
};

const FreeConsultationPage = () => {
  const router = useRouter(); 
  const dispatch = useDispatch();

  // ✅ Read Auth State from Redux
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Dynamic Date & Slot States
  const [availableDates, setAvailableDates] = useState(generateUpcomingDates());
  const [selectedDate, setSelectedDate] = useState(availableDates[0].fullDate);
  const [slotGroups, setSlotGroups] = useState([]);
  const [patientLimit, setPatientLimit] = useState(1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [activeGroupId, setActiveGroupId] = useState(null); 
  const [topLevelAvailabilityId, setTopLevelAvailabilityId] = useState(null); // ✅ Added state to hold the root ID

  // Auth & Profile States
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false); // Prevents overwriting user inputs

  // Form States
  const [gender, setGender] = useState('');
  const [concern, setConcern] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  
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

  // ✅ SYNC PROFILE FROM REDUX
  useEffect(() => {
    const loadProfile = async () => {
      // 1. If completely logged out
      if (!isAuthenticated) {
        setIsLoggedIn(false);
        setFetchingProfile(false);
        return;
      }

      setIsLoggedIn(true);

      // 2. If logged in but Redux hasn't fetched the profile data yet
      if (!user?.fullName && !profileLoaded) {
        setFetchingProfile(true);
        await dispatch(fetchProfileDetails());
        setFetchingProfile(false);
      } 
      
      // 3. If Redux has the data, auto-fill the form (only once)
      if (user && !profileLoaded) {
        if (user.fullName) setFullName(user.fullName);
        if (user.age) setAge(user.age.toString());
        if (user.gender) setGender(user.gender.toLowerCase());
        
        setProfileLoaded(true); // Mark loaded so we don't wipe out user edits later
        setFetchingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user, dispatch, profileLoaded]);

  // Fetch Cities 
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await getAllCities();
        const data = response?.data || response; 
        
        if (Array.isArray(data)) {
          const formattedLinks = data.reduce((acc, city) => {
            if (city?.name) {
                acc[city.name] = city.name.toLowerCase();
            }
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

// Fetch Slots when Date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      
      setLoadingSlots(true);
      setSelectedSlot(null); 
      setActiveGroupId(null);
      setTopLevelAvailabilityId(null); // Reset on date change

      // ✅ Use the new service function here
      const res = await getPatientTeleSlots(selectedDate);
      
      if (res.success && res.slotGroups) {
        setTopLevelAvailabilityId(res.availabilityId); 
        const sortedGroups = sortPeriodsChronologically(res.slotGroups);
        setSlotGroups(sortedGroups);
        setPatientLimit(res.patientLimit || 1);
      } else {
        setSlotGroups([]);
      }
      
      setLoadingSlots(false);
    };

    fetchSlots();
  }, [selectedDate]);

  // ✅ BOOKING HANDLER
  const handleBooking = async () => {
    // 1. Redirect if not logged in
    if (!isLoggedIn) {
      router.push('/login?from=/free-consultation'); 
      return;
    }

    // 2. Validate details
    if (!selectedSlot || !activeGroupId || !fullName || !age || !gender || !concern) {
      toast.error("Please fill all details and select a time slot."); 
      return;
    }

    setIsBooking(true);

    // ✅ Fixed Payload mapping
    const payload = {
      availabilityId: topLevelAvailabilityId, // Taken from the root of API response
      slotGroupId: activeGroupId,             // Set when clicking a slot
      slotId: selectedSlot._id                // The ID of the slot itself
    };

    const res = await bookTeleconsultation(payload);

    console.log(res)

    // Fallback if session expired mid-booking
    if (res.message?.toLowerCase().includes("unauthorized") || res.statusCode === 401) {
       router.push('/login?from=/free-consultation');
       return;
    }

    if (res.success || res.message === "Teleconsultation slot booked successfully") {
      const responseData = res.data;
      
      const displayDate = new Date(responseData.date).toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      });

      setBookingData({
        orderId: responseData.appointmentId, 
        date: displayDate,
        time: responseData.timeSlot,
        name: fullName,
        age: age,
        gender: gender,
        concern: concern
      });
      
      setIsBooked(true);
    } else {
      toast.error(res.message || "Something went wrong while booking. Please try again.");
    }
    
    setIsBooking(false);
  };

  const handleCancelAppointment = () => {
    setIsBooked(false);
    setBookingData(null);
    setConcern(''); // Keep name, age, and gender populated in case they re-book
    setSelectedDate(availableDates[0].fullDate);
    setSelectedSlot(null);
    setActiveGroupId(null);
  };

  const handleTabClick = (tab) => {
    if (tab === 'clinic') {
      setShowCityPopup(true);
    }
    setActiveTab(tab);
  };

  // SUCCESS SCREEN
  if (isBooked && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-b from-white to-gray-50 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Consultation Booked!</h1>
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
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Concern:</p>
                    <p className="text-sm font-semibold text-gray-800">{bookingData.concern}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-center text-sm text-gray-600 mb-3">Need to make a change?</p>
                <button 
                  onClick={handleCancelAppointment}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
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
        {/* Header Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => handleTabClick('online')}
            className={`pb-2 font-medium ${
              activeTab === 'online'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Online Consultation
          </button>
          <button 
            onClick={() => handleTabClick('clinic')}
            className={`pb-2 ${
              activeTab === 'clinic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Book In-Clinic Visit
          </button>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Book Your <span className="text-blue-600">FREE</span> Online Consultation
          </h1>
          <p className="text-gray-600 text-sm">
            Speak privately with our expert. Your first consultation is on us.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <span className="line-through text-gray-400">₹400</span>
            <span className="text-green-600 font-bold text-xl">₹0</span>
            <span className="text-gray-600 text-sm">Limited Time Offer!</span>
          </div>
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

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Details</h2>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Full Name</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Age</label>
                <input 
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-pink-50"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">What are you concerned about?</label>
              <div className="grid grid-cols-2 gap-2">
                {concerns.map((item) => (
                  <button
                    key={item}
                    onClick={() => setConcern(item)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      concern === item
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
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
                          const isBookable = slot.isAvailable && !isFull;
                          const isSelected = selectedSlot?._id === slot._id;

                          return (
                            <button
                              key={slot._id}
                              disabled={!isBookable}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setActiveGroupId(group._id); // ✅ Save Group ID
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
                              {isFull && (
                                <span className="text-[10px] text-red-500 font-bold mt-0.5 leading-none">Full</span>
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
              <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</>
            ) : selectedSlot ? (
              'Confirm & Book Free Consultation'
            ) : (
              'Select a Slot to Book'
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