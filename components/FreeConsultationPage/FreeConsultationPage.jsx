"use client";
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';

const FreeConsultationPage = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedTime, setSelectedTime] = useState('');
  const [gender, setGender] = useState('');
  const [concern, setConcern] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('online');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const days = [
    { label: 'Sat', date: '13' },
    { label: 'Sun', date: '14' },
    { label: 'Mon', date: '15' },
    { label: 'Tue', date: '16' },
    { label: 'Wed', date: '17' },
    { label: 'Thu', date: '18' },
    { label: 'Fri', date: '19' }
  ];

  const timeSlots = {
    morning: ['10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'],
    evening: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'],
    night: ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM']
  };

  const concerns = [
    'Sexual Dysfunction',
    'Erectile Dysfunction',
    'Low Sex Desire',
    'Premature Ejaculation',
    'Couple Sex Problem',
    'Other'
  ];

  const cities = [
    { name: 'NAGPUR', state: 'Maharashtra, India' },
    { name: 'MUMBAI', state: 'Maharashtra' },
    { name: 'PUNE', state: 'Maharashtra' },
    { name: 'AMRAVATI', state: 'Maharashtra' },
    { name: 'DELHI', state: 'Delhi' }
  ];

  const handleBooking = () => {
    const selectedDayData = days.find(d => d.label === selectedDay);
    const data = {
      orderId: 'TC10',
      date: `September ${selectedDayData.date}, 2025`,
      time: selectedTime,
      name: fullName,
      age: age,
      gender: gender,
      concern: concern
    };
    
    setBookingData(data);
    setIsBooked(true);
  };

  const handleCancelAppointment = () => {
    setIsBooked(false);
    setBookingData(null);
    setFullName('');
    setAge('');
    setGender('');
    setConcern('');
    setSelectedDay('Mon');
    setSelectedTime('');
  };

  const handleTabClick = (tab) => {
    if (tab === 'clinic') {
      setShowCityPopup(true);
    }
    setActiveTab(tab);
  };

  const handleCitySelect = (cityName) => {
    setShowCityPopup(false);
  };

  if (isBooked && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-b from-white to-gray-50 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Consultation Booked!</h1>
              <p className="text-sm text-gray-600">Your appointment details are confirmed below.</p>
            </div>

            {/* Booking Details */}
            <div className="p-6 space-y-6">
              {/* Payment & Booking Details */}
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
                    <p className="font-semibold text-gray-800">N/A</p>
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

              {/* Cancel Button */}
              <div className="pt-4">
                <p className="text-center text-sm text-gray-600 mb-3">Need to make a change?</p>
                <button 
                  onClick={handleCancelAppointment}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="bg-white rounded-lg shadow-sm p-6">
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
            
            {/* Full Name */}
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

            {/* Age and Gender */}
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

            {/* Concerns */}
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
            
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-3">Select a Date</label>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <button
                    key={`${day.label}-${index}`}
                    onClick={() => setSelectedDay(day.label)}
                    className={`py-3 px-2 rounded-lg text-center transition ${
                      selectedDay === day.label
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-xs">{day.label}</div>
                    <div className="text-sm">{day.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm text-gray-600 mb-3">Select a Time Slot</label>
              
              {/* Morning */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Morning</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.morning.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm transition ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Afternoon</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.afternoon.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm transition ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Evening</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.evening.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm transition ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Night */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Night</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.night.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm transition ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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

        {/* Book Button */}
        <div className="text-center mt-8">
          <button 
            onClick={handleBooking}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-12 py-3 rounded-lg transition"
          >
            Book Free Consultation
          </button>
        </div>
      </div>

      {/* City Selection Popup */}
      {showCityPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Clinic City</h3>
              <button 
                onClick={() => setShowCityPopup(false)}
                className="text-white hover:bg-blue-700 rounded-full p-1 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* City List */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {cities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city.name)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg transition border-b border-gray-100 text-left"
                >
                  <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-gray-800">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.state}</div>
                  </div>
                </button>
              ))}
              
              {/* Footer text */}
              <p className="text-center text-sm text-gray-400 mt-4 pb-2">
                Can't find your city? Contact Customer...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeConsultationPage;