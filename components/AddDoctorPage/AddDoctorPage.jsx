"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useDoctorOptions } from '@/app/hooks/useDoctorOptions';
import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";
import { getDoctorById, createDoctor, updateDoctor } from '@/app/services/hospitalDashboard.service';

// --- Helper Components ---
const FormInput = ({ id, label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
  </div>
);

const FormSelect = ({ id, label, value, onChange, options = [], placeholder, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={id} name={id} value={value || ""} onChange={onChange} disabled={disabled} className={`block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${!value ? "text-gray-400" : "text-gray-900"}`}>
      <option value="" disabled className="text-gray-400">{disabled ? "Loading..." : placeholder}</option>
      {options.map((opt) => {
        const val = typeof opt === 'object' ? opt._id : opt;
        const display = typeof opt === 'object' ? opt.name : opt;
        return <option key={val} value={val} className="text-gray-900">{display}</option>;
      })}
    </select>
  </div>
);

const ToggleSwitch = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
);

const daysMap = [
  { short: "Mon", full: "monday" },
  { short: "Tue", full: "tuesday" },
  { short: "Wed", full: "wednesday" },
  { short: "Thu", full: "thursday" },
  { short: "Fri", full: "friday" },
  { short: "Sat", full: "saturday" },
  { short: "Sun", full: "sunday" }
];

const sessionLabels = {
  morning: "OPD Morning",
  afternoon: "OPD Afternoon",
  evening: "OPD Evening",
};

// Main component
const AddDoctorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id");

  const { options, isLoading: dropdownsLoading } = useDoctorOptions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [ugDegree, setUgDegree] = useState("");
  const [degreeRegNum, setDegreeRegNum] = useState("");
  const [pgDegree, setPgDegree] = useState("");
  const [pgRegNum, setPgRegNum] = useState("");
  const [superSpecialization, setSuperSpecialization] = useState("");
  const [superSpecRegNum, setSuperSpecRegNum] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState("");
  const [otherSpecialties, setOtherSpecialties] = useState("");
  const [languages, setLanguages] = useState({
    English: false,
    Hindi: false,
    Marathi: false,
    Tamil: false,
    Telugu: false,
    Kannada: false,
    Bengali: false,
    Gujarati: false
  });
  const [consultationFee, setConsultationFee] = useState("");

  const [clinicSlots, setClinicSlots] = useState(null);
  const [selectedDayObj, setSelectedDayObj] = useState(daysMap[0]);
  const [selectedSlots, setSelectedSlots] = useState({});

  // ✅ Fetch Master Clinic Slots
  useEffect(() => {
    const fetchClinicSlots = async () => {
      try {
        const endpoint = Constants?.urlEndPoints?.GET_CLINIC_SLOTS || '/doctors/clinic-slots';
        const response = await api.get(endpoint);
        if (response.data.success) {
          setClinicSlots(response.data.data);
          const firstOpen = daysMap.find(d => !response.data.data[d.full]?.isClosed);
          if (firstOpen) setSelectedDayObj(firstOpen);
        }
      } catch (error) {
        console.error("Failed to load clinic slots", error);
        toast.error("Failed to load clinic operating hours.");
      }
    };
    fetchClinicSlots();
  }, []);

  // ✅ Fetch Doctor Details (Edit Mode)
  useEffect(() => {
    if (doctorId) {
      const fetchDetails = async () => {
        setIsFetchingInfo(true);
        const result = await getDoctorById(doctorId);

        if (result.success) {
          const data = result.data;
          setName(data.name || "");
          setAge(data.age || "");
          setExperience(data.experience || "");
          setUgDegree(data.underGraduationDegree?._id || data.underGraduationDegree || "");
          setDegreeRegNum(data.underGraduationRegNo || "");
          setPgDegree(data.postGraduationDegree?._id || data.postGraduationDegree || "");
          setPgRegNum(data.postGraduationRegNo || "");
          setSuperSpecialization(data.superSpecialization?._id || data.superSpecialization || "");
          setSuperSpecRegNum(data.superSpecializationRegNo || "");
          setPrimarySpecialty(data.primarySpecialty?._id || data.primarySpecialty || "");
          setConsultationFee(data.consultationFee || "");
          if (data.otherSpecialties) setOtherSpecialties(data.otherSpecialties.join(", "));

          if (data.languages && Array.isArray(data.languages)) {
            setLanguages(prev => {
              const newLangs = { ...prev };
              data.languages.forEach(l => { if (newLangs[l] !== undefined) newLangs[l] = true; });
              return newLangs;
            });
          }
          if (data.profileImage) setPhotoPreview(data.profileImage);

          // Pre-fill availability
          if (data.weeklyAvailability?.availability) {
            const bAvail = data.weeklyAvailability.availability;
            const prefilled = {};
            Object.keys(bAvail).forEach(fullDay => {
              ['morning', 'afternoon', 'evening', 'night'].forEach(session => {
                if (bAvail[fullDay][session]?.enabled && bAvail[fullDay][session]?.times) {
                  bAvail[fullDay][session].times.forEach(t => {
                    const key = `${fullDay}|${session}|${t.start}|${t.end}`;
                    prefilled[key] = true;
                  });
                }
              });
            });
            setSelectedSlots(prefilled);
          }
        } else {
          toast.error(result.message);
        }
        setIsFetchingInfo(false);
      };
      fetchDetails();
    }
  }, [doctorId]);

  useEffect(() => {
    if (!photo) return;
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handlePhotoChange = (e) => { if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]); };
  const handleLanguageToggle = (lang) => setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }));

  const handleSlotToggle = (slotKey) => {
    setSelectedSlots(prev => ({ ...prev, [slotKey]: !prev[slotKey] }));
  };

  // ✅ Includes night session as required by backend
  const formatAvailabilityForBackend = () => {
    const backendAvail = {};
    daysMap.forEach(d => {
      backendAvail[d.full] = {
        morning: { enabled: false, times: [] },
        afternoon: { enabled: false, times: [] },
        evening: { enabled: false, times: [] },
        night: { enabled: false, times: [] },
      };
    });
    Object.keys(selectedSlots).forEach(key => {
      if (selectedSlots[key]) {
        const [day, session, start, end] = key.split('|');
        if (backendAvail[day] && backendAvail[day][session]) {
          backendAvail[day][session].enabled = true;
          backendAvail[day][session].times.push({ start, end });
        }
      }
    });
    return backendAvail;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !ugDegree || !primarySpecialty || !consultationFee) {
      return toast.error("Name, UG Degree, Primary Specialty, and Fee are required.");
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (age) formData.append("age", age);
      if (experience) formData.append("experience", experience);
      formData.append("underGraduationDegree", ugDegree);
      if (degreeRegNum) formData.append("underGraduationRegNo", degreeRegNum);
      if (pgDegree) formData.append("postGraduationDegree", pgDegree);
      if (pgRegNum) formData.append("postGraduationRegNo", pgRegNum);
      if (superSpecialization) formData.append("superSpecialization", superSpecialization);
      if (superSpecRegNum) formData.append("superSpecializationRegNo", superSpecRegNum);
      formData.append("primarySpecialty", primarySpecialty);
      formData.append("consultationFee", consultationFee);

      // ✅ Send languages as array fields: languages[]
      const selectedLanguages = Object.keys(languages).filter(l => languages[l]);
      selectedLanguages.forEach(lang => formData.append("languages[]", lang));

      formData.append("otherSpecialties", JSON.stringify(otherSpecialties.split(",").map(s => s.trim()).filter(Boolean)));

      // ✅ Send availability with night session included
      formData.append("availability", JSON.stringify(formatAvailabilityForBackend()));

      if (photo) formData.append("profileImage", photo);

      const result = doctorId
        ? await updateDoctor(doctorId, formData)
        : await createDoctor(formData);

      if (result.success) {
        toast.success(`Doctor ${doctorId ? 'updated' : 'created'} successfully!`);
        router.push("/hospitaldashboard/doctors");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingInfo) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Loading details...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

        {/* === Photo Upload Section === */}
        <div className="flex flex-col items-center p-6 border-b border-gray-200">
          <input type="file" id="photo-upload" accept="image/png, image/jpeg, image/gif" onChange={handlePhotoChange} className="hidden" />
          <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <span className="mt-3 font-medium text-blue-600 hover:text-blue-500">
              {doctorId && !photo ? "Change Photo" : "Upload Photo"}
            </span>
          </label>
        </div>

        {/* === Personal Information Section === */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput id="age" label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <FormInput id="experience" label="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </div>
        </div>

        {/* === Professional Details Section === */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-5">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect id="ugDegree" label="Under Graduation Degree" options={options?.ugDegrees} value={ugDegree} onChange={(e) => setUgDegree(e.target.value)} disabled={dropdownsLoading} />
            <FormInput id="degreeRegNum" label="Degree Registration Number" value={degreeRegNum} onChange={(e) => setDegreeRegNum(e.target.value)} />
            <FormSelect id="pgDegree" label="Post Graduation Degree" options={options?.pgDegrees} value={pgDegree} onChange={(e) => setPgDegree(e.target.value)} disabled={dropdownsLoading} />
            <FormInput id="pgRegNum" label="PG Registration Number" value={pgRegNum} onChange={(e) => setPgRegNum(e.target.value)} />
            <FormSelect id="superSpecialization" label="Super Specialization" options={options?.superSpecs} value={superSpecialization} onChange={(e) => setSuperSpecialization(e.target.value)} disabled={dropdownsLoading} />
            <FormInput id="superSpecRegNum" label="Super Spec. Registration Number" value={superSpecRegNum} onChange={(e) => setSuperSpecRegNum(e.target.value)} />
          </div>
        </div>

        {/* === Other Details Section === */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect id="primarySpecialty" label="Primary Specialty" options={options?.specialties} value={primarySpecialty} onChange={(e) => setPrimarySpecialty(e.target.value)} disabled={dropdownsLoading} />
            <FormInput id="otherSpecialties" label="Other Specialties (Tags)" value={otherSpecialties} onChange={(e) => setOtherSpecialties(e.target.value)} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(languages).map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-4 py-1.5 rounded-full text-sm ${languages[lang] ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <FormInput id="consultationFee" label="Consultation Fee" type="number" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} />
          </div>
        </div>

        {/* === Weekly Availability Section === */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Availability</h2>

          {/* Day Tabs */}
          <div className="mb-4">
            <div className="flex flex-wrap -mb-px border-b border-gray-200">
              {daysMap.map((day) => {
                const isClosed = clinicSlots ? clinicSlots[day.full]?.isClosed : false;
                return (
                  <button
                    type="button"
                    key={day.full}
                    onClick={() => !isClosed && setSelectedDayObj(day)}
                    disabled={isClosed}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      isClosed
                        ? "border-transparent text-gray-300 line-through cursor-not-allowed"
                        : selectedDayObj.full === day.full
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {day.short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot Content */}
          <div>
            {!clinicSlots ? (
              <p className="text-sm text-gray-500 py-4">Loading clinic timings...</p>
            ) : clinicSlots[selectedDayObj.full]?.isClosed ? (
              <p className="text-sm text-red-500 py-4">Clinic is closed on this day.</p>
            ) : (
              ['morning', 'afternoon', 'evening'].map(session => {
                const sessionSlots = clinicSlots[selectedDayObj.full]?.[session] || [];
                if (sessionSlots.length === 0) return null;

                return (
                  <div key={session} className="mb-4">
                    <h3 className="text-md font-semibold mb-3">{sessionLabels[session]}</h3>
                    <div className="space-y-3">
                      {sessionSlots.map((slot) => {
                        const slotKey = `${selectedDayObj.full}|${session}|${slot.start}|${slot.end}`;
                        const isChecked = !!selectedSlots[slotKey];
                        return (
                          <div key={slot._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{slot.start} to {slot.end}</span>
                            <ToggleSwitch id={slotKey} checked={isChecked} onChange={() => handleSlotToggle(slotKey)} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* === Save Button === */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? (doctorId ? "Updating..." : "Saving...")
              : (doctorId ? "Update Doctor" : "Save Doctor")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorPage;