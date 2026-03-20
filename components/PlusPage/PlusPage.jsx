"use client";
import React, { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, ArrowLeft, Loader2, Search, UserCheck, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

// Import the APIs
import {
  getWalkInDoctors,
  getWalkInSlots,
  searchWalkInPatients,
  getWalkInPatientPrefill,
  bookWalkInAppointment
} from "@/app/services/clinic/hospitalWalkin.service"; 

const PlusPage = () => {
  const router = useRouter();

  // ─── API DATA STATE ───
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  
  const [availableSlotsData, setAvailableSlotsData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── SELECTION STATE ───
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSlotData, setSelectedSlotData] = useState(null); 

  // ─── PATIENT FORM STATE ───
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ─── SEARCH PATIENT STATE ───
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ─── CALENDAR STATE (7 DAYS FORWARD) ───
  const [next7Days, setNext7Days] = useState([]);
  const [selectedDateObj, setSelectedDateObj] = useState(new Date());

  // Generate 7 days starting from today
  useEffect(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
    setNext7Days(days);
    setSelectedDateObj(days[0]); // Default to today
  }, []);

  // 1. FETCH DOCTORS ON MOUNT
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      const res = await getWalkInDoctors();
      if (res.success && res.data?.doctors) {
        setDoctors(res.data.doctors);
        if (res.data.doctors.length > 0) {
          setSelectedDoctor(res.data.doctors[0].doctorId);
        }
      } else {
        toast.error("Failed to load doctors");
      }
      setLoadingDoctors(false);
    };
    fetchDoctors();
  }, []);

  // 2. FETCH SLOTS WHEN DOCTOR OR DATE CHANGES
  useEffect(() => {
    if (!selectedDoctor || !selectedDateObj) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlotData(null); 

      // Format date to YYYY-MM-DD
      const dateStr = `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}`;

      const res = await getWalkInSlots(selectedDoctor, dateStr);
      if (res.success && res.data?.availabilities?.length > 0) {
        setAvailableSlotsData(res.data.availabilities[0]);
      } else {
        setAvailableSlotsData(null);
      }
      setLoadingSlots(false);
    };

    fetchSlots();
  }, [selectedDoctor, selectedDateObj]);

  // 3. SEARCH PATIENTS ON PHONE INPUT (Debounced)
  useEffect(() => {
    const handler = setTimeout(async () => {
      const query = phone.trim();
      if (query.length >= 4) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const res = await searchWalkInPatients(query);
          if (res.success && res.data?.patients?.length > 0) {
            setSearchResults(res.data.patients);
          } else {
            setSearchResults([]); 
          }
        } catch (error) {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowDropdown(false);
      }
    }, 500); 

    return () => clearTimeout(handler);
  }, [phone]);

  // 4. FETCH PREFILL DETAILS WHEN PATIENT SELECTED
  const handleSelectPatient = async (patientUserId) => {
    setShowDropdown(false);
    const toastId = toast.loading("Fetching patient details...");
    try {
      const res = await getWalkInPatientPrefill(patientUserId);
      if (res.success && res.data) {
        setPhone(res.data.bookingContactNumber || res.data.mobileNo || phone);
        setFullName(res.data.fullName || "");
        setAge(res.data.age || "");
        setGender(res.data.gender || "");
        toast.success("Patient details loaded", { id: toastId });
      } else {
        toast.error("Failed to load details", { id: toastId });
      }
    } catch (err) {
      toast.error("Error fetching details", { id: toastId });
    }
  };

  // 5. CONFIRM BOOKING API CALL
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Processing booking...");

    const payload = {
      availabilityId: selectedSlotData.availabilityId,
      slotGroupId: selectedSlotData.slotGroupId,
      slotId: selectedSlotData.slotId,
      fullName: fullName.trim(),
      contactNo: phone.trim(),
      age: Number(age),
      gender: gender.toLowerCase()
    };

    try {
      const res = await bookWalkInAppointment(payload);
      if (res.success) {
        toast.success("Walk-in Booking Confirmed!", { id: toastId });
        router.back(); 
      } else {
        toast.error(res.message || "Failed to book appointment", { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || "Booking failed", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDoctorData = doctors.find((d) => d.doctorId === selectedDoctor);

  // Filter out slots that are in the past
  const renderSlotGroups = () => {
    if (!availableSlotsData || !availableSlotsData.isAvailable || availableSlotsData.slotGroups.length === 0) {
      return (
        <div className="text-center p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
          No slots available for this date.
        </div>
      );
    }

    const now = new Date();

    const renderedGroups = availableSlotsData.slotGroups.map((group) => {
      // Filter future slots only
      const validSlots = group.slots.filter(slot => {
        const startTimeStr = slot.time.split(" - ")[0]; // "9:00 AM"
        const match = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return true; // fallback

        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const modifier = match[3].toUpperCase();

        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const slotDateTime = new Date(selectedDateObj);
        slotDateTime.setHours(hours, minutes, 0, 0);

        return slotDateTime > now;
      });

      // If no valid future slots remain in this period, don't render the group
      if (validSlots.length === 0) return null;

      return (
        <div key={group.slotGroupId}>
          <p className="text-sm font-medium text-gray-700 mb-2 capitalize">{group.period}</p>
          <div className="grid grid-cols-3 gap-2">
            {validSlots.map((slot) => {
              const isSelected = selectedSlotData?.slotId === slot.slotId;
              return (
                <button
                  key={slot.slotId}
                  disabled={!slot.isAvailable}
                  onClick={() => setSelectedSlotData({
                    availabilityId: availableSlotsData.availabilityId,
                    slotGroupId: group.slotGroupId,
                    slotId: slot.slotId,
                    time: slot.time
                  })}
                  className={`py-2 px-1 rounded-lg text-[13px] font-medium transition-all border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : !slot.isAvailable
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                      : "bg-white text-gray-700 hover:border-blue-400 border-gray-200"
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      );
    }).filter(Boolean); // Filter out the null groups

    if (renderedGroups.length === 0) {
      return (
        <div className="text-center p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm font-medium">
          All slots for this day have already passed.
        </div>
      );
    }

    return <div className="space-y-5">{renderedGroups}</div>;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4 pb-12">
      {/* HEADER */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mb-3 -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Walk-in Booking</h1>
        <p className="text-sm text-gray-500">
          At our <span className="text-blue-600">Beela, Nagpur</span> clinic.
        </p>
      </div>

      {/* STEP 1: Select Doctor */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            1
          </div>
          <h2 className="font-semibold text-gray-900">Select Doctor</h2>
        </div>

        {loadingDoctors ? (
          <div className="flex justify-center p-4 border-2 border-gray-100 rounded-lg">
            <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
          </div>
        ) : (
          <div className="space-y-2">
            {doctors.map((doctor) => {
              const badge = doctor.name.replace("Dr.", "").trim().substring(0, 2).toUpperCase();
              const isSelected = selectedDoctor === doctor.doctorId;
              
              return (
                <label
                  key={doctor.doctorId}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="doctor"
                      value={doctor.doctorId}
                      checked={isSelected}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">{badge}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.degree} • {doctor.specialty !== "--" ? doctor.specialty : `${doctor.experience} Yrs`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{doctor.consultationFee}</p>
                    <p className="text-xs text-gray-500">per session</p>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 2: Your Details (Patient Identification) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
          <h2 className="font-semibold text-gray-900">Patient Details</h2>
        </div>
        
        <div className="space-y-4">
          <div className="relative z-30">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                placeholder="Phone Number (Search existing)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
              {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500 w-4 h-4" />}
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[250px] overflow-y-auto animate-in fade-in zoom-in-95">
                {searchResults && searchResults.length > 0 ? (
                  <div className="p-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 mb-1 bg-blue-50/50 rounded-lg">
                      <UserCheck className="text-blue-500 w-3 h-3" />
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Existing Patients</p>
                    </div>
                    {searchResults.map(patient => (
                      <button 
                        key={patient.userId}
                        type="button"
                        onClick={() => handleSelectPatient(patient.userId)}
                        className="w-full flex justify-between p-3 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0 text-left"
                      >
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{patient.fullName}</p>
                          <p className="text-xs text-gray-500 mt-1">📞 {patient.mobileNo}</p>
                        </div>
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-[10px] font-bold self-center">Select</span>
                      </button>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                       <button onClick={() => setShowDropdown(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600">Dismiss</button>
                    </div>
                  </div>
                ) : !isSearching ? (
                  <div className="p-4 text-center">
                    <p className="text-sm font-bold text-gray-700">No matches found.</p>
                    <button onClick={() => setShowDropdown(false)} className="mt-2 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">Register as New</button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white text-gray-600"
            >
              <option value="" disabled>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* STEP 3: Select Date & Time (7 DAYS FORWARD) */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            3
          </div>
          <h2 className="font-semibold text-gray-900">Select Date & Time</h2>
        </div>

        {/* Custom 7-Day Calendar Strip */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide pt-1">
          {next7Days.map((d, i) => {
            const isSelected = d.toDateString() === selectedDateObj.toDateString();
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum = d.getDate();
            return (
              <button
                key={i}
                onClick={() => setSelectedDateObj(d)}
                className={`flex-shrink-0 w-16 py-3 flex flex-col items-center justify-center rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                }`}
              >
                <span className={`text-[11px] font-bold uppercase mb-1 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>{dayName}</span>
                <span className="text-lg font-black">{dateNum}</span>
              </button>
            );
          })}
        </div>

        {/* Time Slots via API */}
        {loadingSlots ? (
          <div className="flex justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg mt-2">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="mt-2">
            {renderSlotGroups()}
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-blue-200/50">
             <div>
               <p className="font-bold text-gray-900">{selectedDoctorData?.name || "Select Doctor"}</p>
               <p className="text-xs text-gray-500 mt-0.5">{selectedDoctorData?.specialty !== "--" ? selectedDoctorData?.specialty : "General Consultation"}</p>
             </div>
             <div className="text-right">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total Fee</p>
               <p className="text-lg font-black text-blue-600">₹{selectedDoctorData?.consultationFee || 0}</p>
             </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-900 font-bold">
              {selectedDateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-600">Time:</span>
            <span className="text-gray-900 font-bold">{selectedSlotData ? selectedSlotData.time : "Not Selected"}</span>
          </div>
        </div>
      </div>

      {/* TERMS & SUBMIT */}
      <div className="mb-4">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
          />
          <span className="text-sm text-gray-600">
            I accept the <span className="text-blue-600 font-medium">Terms & Conditions</span>
          </span>
        </label>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={!acceptedTerms || !fullName || !age || !gender || !phone || !selectedSlotData || isSubmitting}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all flex justify-center items-center gap-2 ${
          acceptedTerms && fullName && age && gender && phone && selectedSlotData && !isSubmitting
            ? "bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
        {isSubmitting ? "Booking..." : "Confirm Walk-in Booking"}
      </button>

    </div>
  );
};

export default PlusPage;