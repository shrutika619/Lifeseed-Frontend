"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, ArrowLeft, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

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
        availability[day][slot] = false;
      }
    }
  }
  return availability;
};

const DoctorsPage = () => {
  const router = useRouter();

  // View state
  const [showForm, setShowForm] = useState(false);

  // Doctors list state
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Ram Sharma",
      qualification: "MBBS, M.D Medicine",
      specialty: "General Physician",
      experience: "3 years",
      time: "10:00 AM – 06:30 PM",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      available: true,
    },
    {
      id: 2,
      name: "Dr. Shankar Dayal",
      qualification: "MBBS, M.D Medicine",
      specialty: "General Physician",
      experience: "3 years",
      time: "10:00 AM – 06:30 PM",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      available: true,
    },
    {
      id: 3,
      name: "Dr. Anita Roy",
      qualification: "MBBS, MS",
      specialty: "Cardiologist",
      experience: "5 years",
      time: "11:00 AM – 04:00 PM",
      days: ["Mon", "Wed", "Fri"],
      available: false,
    },
  ]);

  // Form state
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
    Gujarati: false,
  });
  const [consultationFee, setConsultationFee] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [availability, setAvailability] = useState(getInitialAvailability());

  const specialties = ["All", ...new Set(doctors.map((doc) => doc.specialty))];

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handleToggle = (id) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, available: !doc.available } : doc
      )
    );
  };

  const handleAddDoctor = () => {
    setShowForm(true);
  };

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
    setShowForm(false);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // If form is shown, render form view
  if (showForm) {
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

          {/* === Save & Cancel Buttons === */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium text-sm rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
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
  }

  // Otherwise render doctors list view
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Hospital
            </h1>
          </div>

          <button
            onClick={handleAddDoctor}
            className="bg-blue-600 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 whitespace-nowrap"
          >
            Add Doctor
          </button>
        </div>

        {/* Search + Filter */}
        <div className="relative mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex-grow focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor..."
                className="ml-2 w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-700"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-lg shadow-sm border transition-colors relative ${
                isFilterOpen || selectedSpecialty !== "All"
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-100 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Filter className="w-5 h-5" />
              {selectedSpecialty !== "All" && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 p-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center px-2 py-1 mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Filter by Specialty
                </span>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      setSelectedSpecialty(spec);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between group transition-colors ${
                      selectedSpecialty === spec
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {spec}
                    {selectedSpecialty === spec && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                  <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] flex-shrink-0">
                    <img
                      src="https://placehold.co/70x70/e2e8f0/1e293b?text=Dr"
                      alt={doc.name}
                      className="w-full h-full rounded-full object-cover border border-gray-100"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start md:block">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                          {doc.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium mt-0.5">
                          {doc.qualification}
                        </p>
                      </div>
                      <button className="md:hidden text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {doc.specialty} •{" "}
                      <span className="text-gray-700">Exp {doc.experience}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full bg-${doc.available ? 'blue' : 'gray'}-500 inline-block`}></span>
                      {doc.time}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <span
                            key={day}
                            className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                              doc.days.includes(day)
                                ? "bg-teal-50 text-teal-700 border border-teal-100"
                                : "bg-gray-50 text-gray-400 border border-gray-100"
                            }`}
                          >
                            {day}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-4 md:gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <button className="hidden md:block text-gray-400 hover:text-gray-600 p-1 -mr-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 bg-gray-50 md:bg-transparent p-2 md:p-0 rounded-lg w-full md:w-auto justify-between md:justify-end">
                    <span className="text-xs font-medium text-gray-500">
                      {doc.available ? "Available" : "Unavailable"}
                    </span>
                    <button
                      onClick={() => handleToggle(doc.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        doc.available ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          doc.available ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No doctors found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedSpecialty("All");
                }}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorsPage;