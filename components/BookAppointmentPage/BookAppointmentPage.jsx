"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux"; 
import { Calendar, Clock, MapPin, User, Phone, Mail, Loader2 } from 'lucide-react';
import { ClinicDoctorService } from "@/app/services/patient/clinicDoctor.service";
import { bookingService } from "@/app/services/patient/payment.service"; 
import { getPatientDetailsById } from '@/app/services/admin/leads.service'; 
import { toast } from 'sonner';

const generateNext7Days = () => {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return {
      fullDate: `${year}-${month}-${day}`, 
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      obj: d
    };
  });
};

const BookAppointmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clinicId = searchParams.get("clinicId"); 
  const urlPatientId = searchParams.get("patientId");

  const loggedInUser = useSelector((state) => state.auth?.user);

  // States
  const [doctors, setDoctors] = useState([]);
  const [clinicName, setClinicName] = useState("Our Clinic");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [availabilityData, setAvailabilityData] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false); 
  
  const [visibleDates] = useState(generateNext7Days());
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    email: '', 
    age: '',
    gender: ''
  });
  
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Auto-Fill Form Logic
  useEffect(() => {
    const autoFillData = async () => {
      if (urlPatientId) {
        try {
          const res = await getPatientDetailsById(urlPatientId);
          if (res.success && res.data) {
            setFormData({
              fullName: res.data.name || res.data.fullName || '',
              contact: res.data.mobileNo || res.data.phone || '',
              email: res.data.mailId || res.data.email || '',
              age: res.data.age || '',
              gender: res.data.gender ? res.data.gender.toLowerCase() : ''
            });
          }
        } catch (error) {
          console.error("Failed to auto-fill patient data", error);
        }
      } 
      else if (loggedInUser) {
        setFormData({
          fullName: loggedInUser.fullName || loggedInUser.name || '',
          contact: loggedInUser.mobileNo || loggedInUser.phone || '',
          email: loggedInUser.email || loggedInUser.mailId || '',
          age: loggedInUser.age || '',
          gender: loggedInUser.gender ? loggedInUser.gender.toLowerCase() : ''
        });
      }
    };

    autoFillData();
  }, [loggedInUser, urlPatientId]);

  // 1. Fetch Doctors 
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!clinicId) {
        setLoadingDoctors(false);
        return;
      }
      try {
        setLoadingDoctors(true);
        const res = await ClinicDoctorService.getDoctorsByClinicId(clinicId);
        if (res.success && res.data) {
          setClinicName(res.data.clinicName);
          const mappedDoctors = res.data.doctors.map(doc => {
            const ug = doc.underGraduationDegree?.name || "";
            const pg = doc.postGraduationDegree?.name || "";
            const superSpec = doc.superSpecialization?.name || "";
            const qualifications = [ug, pg, superSpec].filter(Boolean).join(", ");
            const fallbackSpec = doc.primarySpecialty?.name || "Specialist";

            return {
              id: doc._id,
              name: doc.name.toLowerCase().startsWith('dr') ? doc.name : `Dr. ${doc.name}`,
              specialization: qualifications || fallbackSpec,
              experience: doc.experience ? `${doc.experience}+ Years` : "Experience not listed",
              location: res.data.clinicName,
              fee: doc.consultationFee,
              image: doc.profileImage || `https://via.placeholder.com/100/6366f1/ffffff?text=${doc.name.charAt(0)}`
            };
          });
          setDoctors(mappedDoctors);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [clinicId]);

  // 2. Fetch Slots whenever a Doctor is selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDoctor) return;
      try {
        setLoadingSlots(true);
        setSelectedDate(visibleDates[0].fullDate); 
        setSelectedSlot(null); 

        const res = await ClinicDoctorService.getDoctorDetailsById(selectedDoctor);
        if (res.data?.availability) {
          setAvailabilityData(res.data.availability);
        } else {
          setAvailabilityData([]);
        }
      } catch (error) {
        console.error("Failed to fetch availability", error);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailability();
  }, [selectedDoctor, visibleDates]);

  // SAFELY EXTRACT AVAILABILITY BY SPLITTING ISO STRING
  const getAvailabilityForDate = (targetDateStr) => {
    return availabilityData.find(a => {
      if (!a.date) return false;
      const backendDateStr = a.date.split('T')[0]; 
      return backendDateStr === targetDateStr;
    });
  };

  const currentMonthYear = visibleDates[0].obj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const currentDayAvailability = getAvailabilityForDate(selectedDate);
  const patientLimit = currentDayAvailability?.patientLimit || 1;

  const isSlotInPast = (slotTimeRange) => {
    try {
      const startTimeStr = slotTimeRange.split(" - ")[0]; 
      const now = new Date();
      const [time, modifier] = startTimeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);

      return now > slotDate;
    } catch (err) {
      return false; 
    }
  };

  let activeGroups = [];

  if (currentDayAvailability?.slotGroups) {
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    activeGroups = currentDayAvailability.slotGroups
      .map(group => {
        const filteredSlots = isToday 
          ? group.slots.filter(slot => !isSlotInPast(slot.time))
          : group.slots;

        return { ...group, slots: filteredSlots };
      })
      .filter(g => g.slots && g.slots.length > 0);

    const orderMap = { night: 1, morning: 2, afternoon: 3, evening: 4 };
    activeGroups.sort((a, b) => (orderMap[a.period] || 99) - (orderMap[b.period] || 99));
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 3. Call Cash Booking API (EXACT PAYLOAD MATCH)
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedSlot || !formData.fullName || !formData.contact || !formData.gender || !formData.age || !acceptTerms) {
      toast.error('Please fill all required fields (Name, Phone, Gender, Age) and select a time slot.');
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    const fee = doctor ? doctor.fee : 0;

    const finalPatientId = urlPatientId || loggedInUser?._id || loggedInUser?.id || null;

    // ✅ Construct exact JSON payload format matching backend requirement
    const payload = {
      bookingData: {
        availabilityId: selectedSlot.availabilityId,
        slotGroupId: selectedSlot.slotGroupId,
        slotId: selectedSlot.slotId,
        doctorId: selectedDoctor,
        
        // Exact mapping from the form
        fullName: formData.fullName,
        patientPhone: String(formData.contact),
        gender: formData.gender.toLowerCase(),
        age: String(formData.age),
      },
      totalAmount: Number(fee)
    };

    // Attach patientId if it exists
    if (finalPatientId) {
      payload.bookingData.patientUserId = finalPatientId;
    }

    setIsBooking(true);
    try {
      const res = await bookingService.createCashBooking(payload);
      // console.log(res);
      if (res.success) {
        toast.success(res.message || "Booking confirmed!");
        router.push(`/confirmbooking?bookingId=${res.bookingId}`);
      } else {
        toast.error(res.message || "Failed to create booking.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "An error occurred while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Book In-Clinic Appointment
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2">
            Select a specialist and a time that works for you at our <span className="font-semibold">{clinicName}</span> clinic
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            
            {/* SELECT DOCTOR */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-base">
                  1
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Select Doctor</h2>
              </div>
              
              <div className="space-y-3">
                {loadingDoctors ? (
                  <div className="flex justify-center py-8">
                     <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
                        selectedDoctor === doctor.id 
                          ? 'border-indigo-600 bg-indigo-50/30 shadow-sm' 
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                          
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] rounded-full object-cover flex-shrink-0 bg-gray-100 border border-gray-100 shadow-sm" 
                          />
                          
                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <h3 className="font-bold text-[#0f172a] text-[17px] sm:text-[20px] leading-tight mb-1 truncate">
                              {doctor.name}
                            </h3>
                            <p className="text-[#475569] text-sm sm:text-[15px] font-medium truncate mb-0.5">
                              {doctor.specialization}
                            </p>
                            <p className="text-[#64748b] text-[13px] sm:text-[14px] font-medium">
                              {doctor.experience}
                            </p>
                          </div>

                        </div>
                        
                        <div className="text-right flex-shrink-0 flex flex-col justify-center self-start sm:self-center mt-1 sm:mt-0">
                          <p className="text-[22px] sm:text-[26px] font-extrabold text-[#0f172a] leading-none mb-1 tracking-tight">₹{doctor.fee}</p>
                          <p className="text-[13px] sm:text-[14px] text-[#64748b] font-medium">per session</p>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No doctors available at this clinic.
                  </div>
                )}
              </div>
            </div>

            {/* YOUR DETAILS */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Your Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-0 sm:ml-[40px]">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base placeholder-gray-400"
                />
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact No"
                  value={formData.contact}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base placeholder-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID (Optional)"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base placeholder-gray-400"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base placeholder-gray-400"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-sm sm:text-base appearance-none ${
                    formData.gender === '' ? 'text-gray-400' : 'text-gray-900'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 0.5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`
                  }}
                >
                  <option value="" disabled className="text-gray-400">Gender</option>
                  <option value="male" className="text-gray-900">Male</option>
                  <option value="female" className="text-gray-900">Female</option>
                  <option value="other" className="text-gray-900">Other</option>
                </select>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-base">
                  2
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  Select Date & Time
                </h2>
              </div>

              {!selectedDoctor ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed ml-0 sm:ml-[40px]">
                  Please select a doctor first to view their availability.
                </div>
              ) : loadingSlots ? (
                <div className="flex justify-center py-8 ml-0 sm:ml-[40px]">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="ml-0 sm:ml-[40px]">
                  {/* ALWAYS SHOW 7-DAY SLIDER */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <button 
                        disabled={true}
                        className="p-1 hover:bg-gray-100 rounded-full text-xl transition-all opacity-30 cursor-not-allowed text-gray-600"
                      >
                        ←
                      </button>
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">
                        {currentMonthYear}
                      </span>
                      <button 
                        disabled={true}
                        className="p-1 hover:bg-gray-100 rounded-full text-xl transition-all opacity-30 cursor-not-allowed text-gray-600"
                      >
                        →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {visibleDates.map((d) => (
                        <button
                          key={d.fullDate}
                          onClick={() => {
                            setSelectedDate(d.fullDate);
                            setSelectedSlot(null); 
                          }}
                          className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-xl transition-all border ${
                            selectedDate === d.fullDate
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-[#f8fafc] hover:bg-gray-200 text-gray-600 border-transparent'
                          }`}
                        >
                          <span className="text-xs font-medium mb-0.5">{d.day}</span>
                          <span className="text-lg sm:text-xl font-bold">{d.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DYNAMIC TIME SLOTS */}
                  <div className="space-y-4 sm:space-y-5">
                    {activeGroups.length === 0 ? (
                       <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl border border-dashed border-red-200">
                         <p className="font-semibold text-sm sm:text-base">Doctor is not available for this day.</p>
                         <p className="text-xs text-red-400 mt-1">Please select another date from the calendar above.</p>
                       </div>
                    ) : (
                      activeGroups.map((group) => (
                        <div key={group._id || group.period}>
                          <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base capitalize">
                            {group.period}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {group.slots.map((slot) => {
                              const isFull = slot.bookedCount >= patientLimit;
                              const isBookable = slot.isAvailable && !isFull;
                              
                              const isSelected = selectedSlot?.time === slot.time;

                              return (
                                <button
                                  key={slot._id || slot.id || slot.time}
                                  disabled={!isBookable}
                                  onClick={() => {
                                    const aId = currentDayAvailability?._id || currentDayAvailability?.id;
                                    const gId = group?._id || group?.id;
                                    const sId = slot?._id || slot?.id;

                                    if (!aId) {
                                       toast.error("Error: Could not read availability ID from data.");
                                       return;
                                    }

                                    setSelectedSlot({
                                      time: slot.time,
                                      availabilityId: aId,
                                      slotGroupId: gId,
                                      slotId: sId
                                    });
                                  }}
                                  className={`
                                    px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all font-medium flex flex-col items-center justify-center min-w-[90px]
                                    ${isSelected 
                                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                                      : isBookable 
                                        ? 'border-gray-300 hover:border-indigo-300 text-gray-700 hover:bg-gray-50' 
                                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    }
                                  `}
                                >
                                  <span>{slot.time}</span>
                                  {isFull && (
                                    <span className="text-[10px] text-red-500 font-bold mt-0.5 leading-none uppercase">Full</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Booking Summary</h2>

              {/* Doctor Summary */}
              {selectedDoctor && doctors.length > 0 ? (
                <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <img 
                      src={doctors.find(d => d.id === selectedDoctor)?.image} 
                      alt="Doctor" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {doctors.find(d => d.id === selectedDoctor)?.name}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {doctors.find(d => d.id === selectedDoctor)?.specialization}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b text-center text-gray-500 text-xs sm:text-sm">
                  No doctor selected
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-right">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold text-right">{selectedSlot?.time || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600">Clinic:</span>
                  <span className="font-semibold text-right truncate pl-4">{clinicName}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 sm:pt-4 mb-3 sm:mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹{selectedDoctor ? doctors.find(d => d.id === selectedDoctor)?.fee : 0}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xs text-indigo-600 mb-2 sm:mb-3">
                  Limited slots available. Book now to secure your consultation!
                </p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 sm:mt-1 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-gray-600 leading-snug">
                    I accept the <span className="text-indigo-600 font-medium hover:underline">Terms & Conditions</span> and <span className="text-indigo-600 font-medium hover:underline">Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* CONFIRM BUTTON */}
              <button
                onClick={handleBooking}
                className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm sm:text-base shadow-sm flex items-center justify-center gap-2"
                disabled={!selectedDoctor || !selectedSlot || !acceptTerms || isBooking}
              >
                {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookAppointmentPage;