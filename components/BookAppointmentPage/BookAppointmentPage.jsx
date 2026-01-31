"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation"; // ⭐ Add this for routing
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react';

const BookAppointmentPage = () => {
  const router = useRouter(); // ⭐ Initialize router

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(16);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    age: '',
    gender: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialization: 'MBBS, MD (General Medicine)',
      location: 'Brass, Nagpur',
      fee: 600,
      image: 'https://via.placeholder.com/100/6366f1/ffffff?text=PS'
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialization: 'MBBS, MD (General Medicine)',
      location: 'Brass, Nagpur',
      fee: 600,
      image: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=PS'
    }
  ];

  const dates = [
    { day: 'Sun', date: 14 },
    { day: 'Mon', date: 15 },
    { day: 'Tue', date: 16 },
    { day: 'Wed', date: 17 },
    { day: 'Thu', date: 18 },
    { day: 'Fri', date: 19 },
    { day: 'Sat', date: 20 }
  ];

  const timeSlots = {
    morning: [
      '08:00 AM to 9:00 AM',
      '09:00 AM to 10:00 AM',
      '10:00 AM to 11:00 AM',
      '11:00 AM to 12:00 PM'
    ],
    afternoon: [
      '12:00 PM to 1:00 PM',
      '1:00 PM to 2:00 PM',
      '2:00 PM to 3:00 PM',
      '3:00 PM to 4:00 PM',
      '4:00 PM to 5:00 PM',
      '5:00 PM to 6:00 PM'
    ],
    evening: [
      '5:00 PM to 6:00 PM',
      '6:00 PM to 7:00 PM',
      '7:00 PM to 8:00 PM',
      '8:00 PM to 9:00 PM',
      '9:00 PM to 10:00 PM',
      '10:00 PM to 11:00 PM'
    ]
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ⭐ ROUTE TO CONFIRM BOOKING PAGE
  const handleBooking = () => {
    if (!selectedDoctor || !selectedTime || !formData.fullName || !formData.contact || !acceptTerms) {
      alert('Please fill all required fields and select a time slot');
      return;
    }

    // ⭐ Redirect to /confirmbooking
    router.push("/confirmbooking");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Book In-Clinic Appointment
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2">
            Select a specialist and a time that works for you at our <span className="font-semibold">Brass, Nagpur</span> clinic
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
              
              <div className="space-y-2 sm:space-y-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                      selectedDoctor === doctor.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {doctor.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {doctor.specialization}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {doctor.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{doctor.fee}</p>
                        <p className="text-xs text-gray-500">per session</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YOUR DETAILS */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Your Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                />
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact No"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-sm sm:text-base"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-base">
                  3
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  Select Date & Time
                </h2>
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg text-lg sm:text-xl">←</button>
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">
                    Sep 14 - Sep 20, 2025
                  </span>
                  <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg text-lg sm:text-xl">→</button>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-2 sm:p-3 rounded-lg text-center transition-all ${
                        selectedDate === d.date
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="text-xs">{d.day}</div>
                      <div className="text-sm sm:text-lg font-bold">{d.date}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* TIME SLOTS */}
              <div className="space-y-3 sm:space-y-4">

                {/* MORNING */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Morning</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {timeSlots.morning.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                          selectedTime === time
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AFTERNOON */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Afternoon</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {timeSlots.afternoon.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                          selectedTime === time
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EVENING */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Evening</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {timeSlots.evening.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-2 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg border transition-all ${
                          selectedTime === time
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Booking Summary</h2>

              {/* Doctor Summary */}
              {selectedDoctor ? (
                <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <img 
                      src={doctors.find(d => d.id === selectedDoctor).image} 
                      alt="Doctor" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {doctors.find(d => d.id === selectedDoctor).name}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {doctors.find(d => d.id === selectedDoctor).specialization}
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
                  <span className="font-semibold text-right">Tuesday, Sep {selectedDate}, 2025</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold text-right">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600">Clinic:</span>
                  <span className="font-semibold text-right">Brass, Nagpur</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 sm:pt-4 mb-3 sm:mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹{selectedDoctor ? doctors.find(d => d.id === selectedDoctor).fee : 0}
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
                    className="mt-0.5 sm:mt-1"
                  />
                  <span className="text-xs text-gray-600">
                    I accept the <span className="text-indigo-600">Terms & Conditions</span> and <span className="text-indigo-600">Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* CONFIRM BUTTON */}
              <button
                onClick={handleBooking}
                className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={!selectedDoctor || !selectedTime || !acceptTerms}
              >
                Confirm Booking
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookAppointmentPage;
