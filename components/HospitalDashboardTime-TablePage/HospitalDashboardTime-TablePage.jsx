"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

// ✅ IMPORT GLOBAL TIME SLOTS HOOK & API SERVICES
import { useTimeSlot } from '@/app/hooks/useTimeslot'; 
import { getMeClinicProfile, updateClinicTimings } from '@/app/services/clinic/hospitalProfile.service';

// ✅ HELPER: Convert "10:30 AM" into minutes (0 - 1440)
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

const HospitalDashboardTimeTablePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [clinicId, setClinicId] = useState(null);
  
  // ✅ NEW: State for Slot Duration (Defaults to 30)
  const [slotDuration, setSlotDuration] = useState(30);

  // Fetch master time slots
  const { allSlots, isLoadingSlots } = useTimeSlot();

  // Base default state
  const [timings, setTimings] = useState({
    monday: { morning: { enabled: true, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: true, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: false },
    tuesday: { morning: { enabled: true, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: true, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: false },
    wednesday: { morning: { enabled: true, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: true, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: false },
    thursday: { morning: { enabled: true, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: true, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: false },
    friday: { morning: { enabled: true, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: true, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: false },
    saturday: { morning: { enabled: true, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: true, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: false },
    sunday: { morning: { enabled: false, start: '10:00 AM', end: '12:00 PM' }, afternoon: { enabled: false, start: '02:00 PM', end: '05:00 PM' }, evening: { enabled: false, start: '06:00 PM', end: '09:00 PM' }, isClosed: true }
  });

  const [activeDay, setActiveDay] = useState('monday');
  const [openDropdown, setOpenDropdown] = useState(null);

  const days = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  const sessions = ['morning', 'afternoon', 'evening'];

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const response = await getMeClinicProfile();
        
        if (response.success && response.data?.clinic) {
          setClinicId(response.data.clinic._id);

          // ✅ Set existing slot duration from backend
          if (response.data.clinic.slotDuration) {
            setSlotDuration(response.data.clinic.slotDuration);
          }

          const existingTimings = response.data.clinic.timings;
          
          if (existingTimings && existingTimings.length > 0) {
            const newTimings = { ...timings }; 
            
            existingTimings.forEach(t => {
              if (newTimings[t.day]) {
                newTimings[t.day] = {
                  isClosed: t.isClosed || false,
                  morning: t.sections?.morning || newTimings[t.day].morning,
                  afternoon: t.sections?.afternoon || newTimings[t.day].afternoon,
                  evening: t.sections?.evening || newTimings[t.day].evening,
                };
              }
            });
            
            setTimings(newTimings);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch existing timings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (session) => {
    setTimings({
      ...timings,
      [activeDay]: {
        ...timings[activeDay],
        [session]: {
          ...timings[activeDay][session],
          enabled: !timings[activeDay][session].enabled
        }
      }
    });
  };

  const handleDayClosedToggle = () => {
    setTimings({
      ...timings,
      [activeDay]: {
        ...timings[activeDay],
        isClosed: !timings[activeDay].isClosed,
        ...( !timings[activeDay].isClosed ? {
          morning: { ...timings[activeDay].morning, enabled: false },
          afternoon: { ...timings[activeDay].afternoon, enabled: false },
          evening: { ...timings[activeDay].evening, enabled: false }
        } : {})
      }
    });
  };

  const handleTimeChange = (session, field, value) => {
    setTimings({
      ...timings,
      [activeDay]: {
        ...timings[activeDay],
        [session]: {
          ...timings[activeDay][session],
          [field]: value
        }
      }
    });
    setOpenDropdown(null);
  };

  const validateTimings = () => {
    for (const [dayKey, dayData] of Object.entries(timings)) {
      if (dayData.isClosed) continue;

      for (const session of sessions) {
        if (dayData[session].enabled) {
          const startMins = timeToMinutes(dayData[session].start);
          const endMins = timeToMinutes(dayData[session].end);

          if (startMins >= endMins) {
            const d = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
            const s = session.charAt(0).toUpperCase() + session.slice(1);
            
            toast.error(`Invalid Time on ${d} (${s}): Start time must be before End time.`);
            setActiveDay(dayKey);
            return false;
          }
        }
      }
    }
    return true;
  };

  // ✅ HELPER: Formats "9:30 AM" into "09:30 AM" to pass backend Regex
  const formatTimeForBackend = (timeStr) => {
    if (!timeStr) return "";
    const [time, period] = timeStr.split(" ");
    if (!time || !period) return timeStr;
    
    let [h, m] = time.split(":");
    if (h.length === 1) {
      h = "0" + h;
    }
    return `${h}:${m} ${period}`;
  };

  const handleSave = async () => {
    if (!validateTimings()) return; 
    
    if (!clinicId) {
      toast.error("Clinic ID is missing. Please refresh the page.");
      return;
    }

    setIsSaving(true);
    
    // FORMAT EXACTLY AS BACKEND EXPECTS
    const timingsArray = Object.keys(timings).map(day => {
      const dayData = timings[day];
      const isClosed = dayData.isClosed;

      const formatSection = (sectionData) => {
        if (isClosed || !sectionData.enabled) {
          return { enabled: false, start: "", end: "" };
        }
        return {
          enabled: true,
          start: formatTimeForBackend(sectionData.start),
          end: formatTimeForBackend(sectionData.end)
        };
      };

      return {
        day: day,
        isClosed: isClosed,
        sections: {
          morning: formatSection(dayData.morning),
          afternoon: formatSection(dayData.afternoon),
          evening: formatSection(dayData.evening)
        }
      };
    });

    try {
      // ✅ Now passing slotDuration to the API
      const response = await updateClinicTimings(clinicId, timingsArray, slotDuration);
      
      if (response.success) {
        toast.success(response.message || "Hospital timings saved successfully!");
        
        // ✅ SMART WARNINGS: Display backend warnings if they exist (e.g. telling them to update doctors)
        if (response.data?.warnings && response.data.warnings.length > 0) {
          response.data.warnings.forEach(warningMsg => {
            toast.warning(warningMsg, { duration: 8000 }); // Show warning for 8 seconds
          });
        }
      } else {
        toast.error(response.message || "Failed to save timings.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const TimeDropdown = ({ session, field, value }) => {
    const dropdownId = `${session}-${field}`;
    const isOpen = openDropdown === dropdownId;

    // STRICT TIME BOUNDARIES
    const sessionSlots = allSlots.filter((time) => {
      const mins = timeToMinutes(time);
      
      if (session === 'morning') return mins >= 360 && mins <= 720;
      if (session === 'afternoon') return mins >= 720 && mins <= 1020;
      if (session === 'evening') return mins >= 1020 && mins <= 1440;
      return true;
    });

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-medium bg-white flex items-center justify-between transition-colors ${
            isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <span>{value}</span>
          <ChevronDown size={20} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {sessionSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeChange(session, field, time)}
                  className={`w-full px-4 py-2.5 text-left transition-colors ${
                    value === time ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (isLoading || isLoadingSlots) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={22} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Time Table</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Hospital Timing</h2>
            
            <div className="flex flex-wrap items-center gap-6">
              {/* ✅ NEW: Slot Duration Dropdown */}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Slot Duration:</span>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none"
                >
                  <option value={10}>10 Mins</option>
                  <option value={15}>15 Mins</option>
                  <option value={30}>30 Mins</option>
                </select>
              </div>

              {/* Mark Day as Closed Toggle */}
              <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                <span className="text-sm font-medium text-gray-700">Closed on {activeDay}?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timings[activeDay].isClosed}
                    onChange={handleDayClosedToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Days Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {days.map(day => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  activeDay === day.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {!timings[activeDay].isClosed ? (
            <div className="space-y-6">
              {sessions.map((session) => (
                <div key={session} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900 capitalize">{session}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timings[activeDay][session].enabled}
                        onChange={() => handleToggle(session)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {timings[activeDay][session].enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <TimeDropdown session={session} field="start" value={timings[activeDay][session].start} />
                      <TimeDropdown session={session} field="end" value={timings[activeDay][session].end} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-red-50 rounded-xl border border-red-100 text-center">
              <h3 className="text-red-600 font-semibold text-lg">Hospital is marked as Closed on {activeDay}s</h3>
              <p className="text-red-500 text-sm mt-1">No appointments can be booked on this day.</p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            {isSaving ? "Saving..." : "Save Timings"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboardTimeTablePage;