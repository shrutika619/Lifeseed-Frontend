"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useDoctorOptions } from '@/app/hooks/useDoctorOptions';
// ✅ Import Services
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

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlotsData = {
  "OPD Morning": ["09:00 AM to 12:00 PM", "10:00 AM to 11:00 AM", "11:00 AM to 12:00 PM"],
  "OPD Afternoon": ["12:00 PM to 01:00 PM", "02:00 PM to 03:00 PM", "04:00 PM to 05:00 PM"],
  "OPD Evening": ["05:00 PM to 06:00 PM", "06:00 PM to 07:00 PM", "07:00 PM to 08:00 PM"],
};

const getInitialAvailability = () => {
  let availability = {};
  for (const day of daysOfWeek) {
    availability[day] = {};
    for (const category in timeSlotsData) {
      for (const slot of timeSlotsData[category]) availability[day][slot] = false; 
    }
  }
  return availability;
};

// Main component
const AddDoctorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id"); 
  
  const { options, isLoading: dropdownsLoading } = useDoctorOptions();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  // States
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
  const [languages, setLanguages] = useState({ English: false, Hindi: false, Marathi: false, Tamil: false, Telugu: false, Kannada: false, Bengali: false, Gujarati: false });
  const [consultationFee, setConsultationFee] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [availability, setAvailability] = useState(getInitialAvailability());

  // ✅ Call Service to Get Doctor Details
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

          if (data.weeklyAvailability?.availability) {
            const bAvail = data.weeklyAvailability.availability;
            const fAvail = getInitialAvailability();
            const dayMap = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };
            
            Object.keys(bAvail).forEach(bDay => {
              const uiDay = dayMap[bDay];
              if (!uiDay) return;
              Object.keys(bAvail[bDay]).forEach(bSession => {
                const sessionData = bAvail[bDay][bSession];
                if (sessionData?.enabled && sessionData.times) {
                  sessionData.times.forEach(t => {
                    const slotStr = `${t.start} to ${t.end}`;
                    if (fAvail[uiDay][slotStr] !== undefined) fAvail[uiDay][slotStr] = true;
                  });
                }
              });
            });
            setAvailability(fAvail);
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
  const handleAvailabilityToggle = (day, slot) => setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], [slot]: !prev[day][slot] } }));

  const formatAvailabilityForBackend = () => {
    const dayMap = { Mon: "monday", Tue: "tuesday", Wed: "wednesday", Thu: "thursday", Fri: "friday", Sat: "saturday", Sun: "sunday" };
    const sessionMap = { "OPD Morning": "morning", "OPD Afternoon": "afternoon", "OPD Evening": "evening" };
    const backendAvail = {};
    
    Object.keys(availability).forEach(shortDay => {
      const fullDay = dayMap[shortDay];
      backendAvail[fullDay] = { morning: { enabled: false, times: [] }, afternoon: { enabled: false, times: [] }, evening: { enabled: false, times: [] } };
      Object.entries(timeSlotsData).forEach(([category, slots]) => {
        const sessionKey = sessionMap[category];
        const activeSlots = slots.filter(slot => availability[shortDay][slot]);
        if (activeSlots.length > 0) {
          backendAvail[fullDay][sessionKey].enabled = true;
          backendAvail[fullDay][sessionKey].times = activeSlots.map(slot => {
            const [start, end] = slot.split(" to ");
            return { start: start.trim(), end: end.trim() };
          });
        }
      });
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
      formData.append("languages", JSON.stringify(Object.keys(languages).filter(l => languages[l])));
      formData.append("otherSpecialties", JSON.stringify(otherSpecialties.split(",").map(s => s.trim()).filter(Boolean)));
      formData.append("availability", JSON.stringify(formatAvailabilityForBackend()));
      if (photo) formData.append("profileImage", photo); 

      // ✅ Call Services
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

  if (isFetchingInfo) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading details...</p></div>;

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
            <span className="mt-3 font-medium text-blue-600 hover:text-blue-500">{doctorId && !photo ? "Change Photo" : "Upload Photo"}</span>
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
                  <button type="button" key={lang} onClick={() => handleLanguageToggle(lang)} className={`px-4 py-1.5 rounded-full text-sm ${languages[lang] ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
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
          <div className="mb-4">
            <div className="flex flex-wrap -mb-px border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <button type="button" key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${selectedDay === day ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>{day}</button>
              ))}
            </div>
          </div>
          <div>
            {Object.entries(timeSlotsData).map(([category, slots]) => (
              <div key={category} className="mb-4">
                <h3 className="text-md font-semibold mb-3">{category}</h3>
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div key={slot} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{slot}</span>
                      <ToggleSwitch id={`${selectedDay}-${slot}`} checked={availability[selectedDay][slot]} onChange={() => handleAvailabilityToggle(selectedDay, slot)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Save Button === */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (doctorId ? "Updating..." : "Saving...") : (doctorId ? "Update Doctor" : "Save Doctor")}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddDoctorPage;