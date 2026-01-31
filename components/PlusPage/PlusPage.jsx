"use client";
import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const PlusPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("AV");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedDate, setSelectedDate] = useState(13);
  const [selectedMonth, setSelectedMonth] = useState(10); // October
  const [selectedYear] = useState(2025);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("09:00 AM");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const doctors = [
    {
      id: "PS",
      name: "Dr. Priya Sharma",
      specialty: "MBBS, MD",
      fee: 600,
      badge: "PS",
    },
    {
      id: "AV",
      name: "Dr. Avinit Verma",
      specialty: "MBBS, MD",
      fee: 600,
      badge: "AV",
    },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const timeSlots = {
    morning: ["09:00 AM", "10:00 AM", "11:00 AM"],
    afternoon: ["02:00 PM", "03:00 PM", "04:00 PM"],
    evening: ["06:00 PM", "07:00 PM", "08:00 PM"],
  };

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);
  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Walk-in Booking</h1>
        <p className="text-sm text-gray-500">
          At our <span className="text-blue-600">Beela, Nagpur</span> clinic.
        </p>
      </div>

      {/* Select Doctor */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            1
          </div>
          <h2 className="font-semibold text-gray-900">Select Doctor</h2>
        </div>

        <div className="space-y-2">
          {doctors.map((doctor) => (
            <label
              key={doctor.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDoctor === doctor.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="doctor"
                  value={doctor.id}
                  checked={selectedDoctor === doctor.id}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {doctor.badge}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-gray-500">{doctor.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{doctor.fee}</p>
                <p className="text-xs text-gray-500">per session</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Your Details */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Your Details</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Select Date & Time */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            2
          </div>
          <h2 className="font-semibold text-gray-900">Select Date & Time</h2>
        </div>

        {/* Calendar */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">
              {months[selectedMonth]} {selectedYear}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
                  !day
                    ? "invisible"
                    : day === selectedDate
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-4">
          {Object.entries(timeSlots).map(([period, slots]) => (
            <div key={period}>
              <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {period}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      selectedTimeSlot === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-semibold text-sm">
                {selectedDoctorData?.badge}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {selectedDoctorData?.name}
              </p>
              <p className="text-xs text-gray-500">{selectedDoctorData?.specialty}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-900 font-medium">
                {selectedDate} {months[selectedMonth].slice(0, 3)} {selectedYear}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="text-gray-900 font-medium">
                {selectedTimeSlot}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                ₹{selectedDoctorData?.fee}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-4">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
          />
          <span className="text-sm text-gray-600">
            I accept the{" "}
            <span className="text-blue-600">Terms & Conditions</span> and{" "}
            <span className="text-blue-600">Privacy Policy</span>
          </span>
        </label>
      </div>

      {/* Confirm Booking Button */}
      <button
        disabled={!acceptedTerms || !fullName || !age || !gender}
        className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all ${
          acceptedTerms && fullName && age && gender
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default PlusPage;
