"use client";
import React, { useState, useEffect } from 'react';

// Helper component for form inputs to reduce repetition
const FormInput = ({ id, label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

// Helper component for the toggle switch
const ToggleSwitch = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
);

// Data for availability slots
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const timeSlotsData = {
  "OPD Morning": [
    "09:00 AM to 12:00 AM",
    "10:00 AM to 11:00 AM",
    "11:00 AM to 12:00 PM",
  ],
  "OPD Afternoon": [
    "12:00 PM to 01:00 PM",
    "02:00 PM to 03:00 PM",
    "04:00 PM to 05:00 PM",
  ],
  "OPD Evening": [
    "05:00 PM to 06:00 PM",
    "06:00 PM to 07:00 PM",
    "07:00 PM to 08:00 PM",
  ],
};

// Helper function to generate initial availability state
const getInitialAvailability = () => {
  let availability = {};
  for (const day of daysOfWeek) {
    availability[day] = {};
    for (const category in timeSlotsData) {
      for (const slot of timeSlotsData[category]) {
        availability[day][slot] = false; // Default to not available
      }
    }
  }
  return availability;
};

// Main component
const AddDoctorPage = () => {
  // --- STATE ---

  // Personal Information
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");

  // Professional Details
  const [ugDegree, setUgDegree] = useState("");
  const [degreeRegNum, setDegreeRegNum] = useState("");
  const [pgDegree, setPgDegree] = useState("");
  const [pgRegNum, setPgRegNum] = useState("");
  const [superSpecialization, setSuperSpecialization] = useState("");
  const [superSpecRegNum, setSuperSpecRegNum] = useState("");

  // Other Details
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
    Gujarati: false,
  });
  const [consultationFee, setConsultationFee] = useState("");

  // Availability
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [availability, setAvailability] = useState(getInitialAvailability());

  // --- EFFECTS ---

  // Create or revoke photo preview URL
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);

    // Cleanup function
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // --- HANDLERS ---

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleLanguageToggle = (lang) => {
    setLanguages((prev) => ({
      ...prev,
      [lang]: !prev[lang],
    }));
  };

  const handleAvailabilityToggle = (day, slot) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name,
      age,
      experience,
      ugDegree,
      degreeRegNum,
      pgDegree,
      pgRegNum,
      superSpecialization,
      superSpecRegNum,
      primarySpecialty,
      otherSpecialties,
      languages: Object.keys(languages).filter((lang) => languages[lang]),
      consultationFee,
      availability,
      photo: photo ? photo.name : null,
    };
    console.log("--- Doctor Form Data ---");
    console.log(JSON.stringify(formData, null, 2));
    alert("Form data has been logged to the console!");
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        {/* === Photo Upload Section === */}
        <div className="flex flex-col items-center p-6 border-b border-gray-200">
          <input
            type="file"
            id="photo-upload"
            accept="image/png, image/jpeg, image/gif"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Doctor preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <span className="mt-3 font-medium text-blue-600 hover:text-blue-500">
              Upload Photo
            </span>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>

        {/* === Personal Information Section === */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="name"
              label="Name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              id="age"
              label="Age"
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <FormInput
              id="experience"
              label="Experience"
              placeholder="e.g., 5 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
        </div>

        {/* === Professional Details Section === */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Professional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="ugDegree"
              label="Under Graduation Degree"
              placeholder="e.g., MBBS"
              value={ugDegree}
              onChange={(e) => setUgDegree(e.target.value)}
            />
            <FormInput
              id="degreeRegNum"
              label="Degree Registration Number"
              placeholder="Enter registration number"
              value={degreeRegNum}
              onChange={(e) => setDegreeRegNum(e.target.value)}
            />
            <FormInput
              id="pgDegree"
              label="Post Graduation Degree"
              placeholder="e.g., MD, MS"
              value={pgDegree}
              onChange={(e) => setPgDegree(e.target.value)}
            />
            <FormInput
              id="pgRegNum"
              label="PG Registration Number"
              placeholder="Enter registration number"
              value={pgRegNum}
              onChange={(e) => setPgRegNum(e.target.value)}
            />
            <FormInput
              id="superSpecialization"
              label="Super Specialization"
              placeholder="e.g., DM, MCh"
              value={superSpecialization}
              onChange={(e) => setSuperSpecialization(e.target.value)}
            />
            <FormInput
              id="superSpecRegNum"
              label="Super Specialization Registration Number"
              placeholder="Enter registration number"
              value={superSpecRegNum}
              onChange={(e) => setSuperSpecRegNum(e.target.value)}
            />
          </div>
        </div>

        {/* === Other Details Section === */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="primarySpecialty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Primary Specialty
              </label>
              <select
                id="primarySpecialty"
                value={primarySpecialty}
                onChange={(e) => setPrimarySpecialty(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a specialty</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                {/* Add more specialties as needed */}
              </select>
            </div>
            <FormInput
              id="otherSpecialties"
              label="Other Specialties (Tags)"
              placeholder="e.g., Men's Health, Infertility"
              value={otherSpecialties}
              onChange={(e) => setOtherSpecialties(e.target.value)}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(languages).map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      languages[lang]
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <FormInput
              id="consultationFee"
              label="Consultation Fee"
              type="number"
              placeholder="Enter amount"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
            />
          </div>
        </div>

        {/* === Weekly Availability Section === */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Weekly Availability
          </h2>
          <p className="text-sm text-gray-500 mb-4">Extra Time Slots</p>

          {/* Day Tabs */}
          <div className="mb-4">
            <div className="flex flex-wrap -mb-px border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap ${
                    selectedDay === day
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots for Selected Day */}
          <div>
            {Object.entries(timeSlotsData).map(([category, slots]) => (
              <div key={category} className="mb-4">
                <h3 className="text-md font-semibold text-gray-700 mb-3">
                  {category}
                </h3>
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">{slot}</span>
                      <ToggleSwitch
                        id={`${selectedDay}-${slot}`}
                        checked={availability[selectedDay][slot]}
                        onChange={() =>
                          handleAvailabilityToggle(selectedDay, slot)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Save Button === */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorPage;