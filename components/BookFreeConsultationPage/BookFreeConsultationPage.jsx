"use client";
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X, Phone, User, AlertCircle } from 'lucide-react';

export default function BookFreeConsultationPage() {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [gender, setGender] = useState('');
  const [concern, setConcern] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('online');

  const days = ['Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20', 'Sun 21', 'Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26', 'Sat 27', 'Sun 28'];
  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
    '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM'
  ];

  const concerns = [
    'Erectile Dysfunction', 'Premature Ejaculation', 'Low Sex Desire',
    'Nightfall', 'Small Penis Size', 'Couple Issues', 'Other'
  ];

  const handleSubmit = () => {
    if (!fullName || !age || !gender || !phone || !concern || !selectedDay || !selectedTime) {
      alert('Please fill all required fields');
      return;
    }
   
    alert(`Thank you ${fullName}!\nYour free consultation is confirmed for ${selectedDay} at ${selectedTime}\nWe will call you soon.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Book Your <span className="text-blue-600">FREE</span> Consultation
          </h1>
          <p className="text-gray-600 mt-2">100% Private • Doctor will call you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Left - Personal Info */}
          <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="text-blue-600" /> Your Details
            </h2>

            <input type="text" placeholder="Full Name *" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />

            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Age *" value={age} onChange={e => setAge(e.target.value)} className="px-4 py-3 border rounded-xl" />
              <select value={gender} onChange={e => setGender(e.target.value)} className="px-4 py-3 border rounded-xl">
                <option value="">Gender *</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <input type="tel" placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border rounded-xl flex items-center gap-2" />

            <div>
              <p className="mb-3 font-medium">Select Your Concern *</p>
              <div className="grid grid-cols-2 gap-3">
                {concerns.map(c => (
                  <button key={c} type="button" onClick={() => setConcern(c)}
                    className={`p-3 rounded-xl border ${concern === c ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Date & Time */}
          <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="text-blue-600" /> Choose Date & Time
            </h2>

            <div>
              <p className="mb-3 font-medium">Select Date</p>
              <div className="grid grid-cols-7 gap-2">
                {days.map(day => (
                  <button key={day} type="button" onClick={() => setSelectedDay(day)}
                    className={`p-3 rounded-xl text-sm ${selectedDay === day ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-medium">Preferred Time</p>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map(time => (
                  <button key={time} type="button" onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl text-sm ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* FINAL SUBMIT BUTTON */}
            <button onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-xl py-5 rounded-2xl shadow-xl transform transition hover:scale-105 mt-8">
              Confirm Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}