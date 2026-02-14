"use client";
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const HospitalDashboardTimeTablePage = () => {
  const [timings, setTimings] = useState({
    monday: { morning: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } },
    tuesday: { morning: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } },
    wednesday: { morning: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } },
    thursday: { morning: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } },
    friday: { morning: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } },
    saturday: { morning: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: true, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } },
    sunday: { morning: { enabled: false, start: '10:00 AM', end: '06:30 PM' }, afternoon: { enabled: false, start: '10:00 AM', end: '06:30 PM' }, evening: { enabled: false, start: '10:00 AM', end: '06:30 PM' } }
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

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${displayHour.toString().padStart(2, '0')}:${formattedMinute} ${period}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

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

  const handleSave = () => {
    console.log('Saved timings:', timings);
    alert('Hospital timings saved successfully!');
  };

  const TimeDropdown = ({ session, field, value }) => {
    const dropdownId = `${session}-${field}`;
    const isOpen = openDropdown === dropdownId;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-gray-900 font-medium bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
        >
          <span>{value}</span>
          <ChevronDown size={20} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setOpenDropdown(null)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeChange(session, field, time)}
                  className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                    value === time ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Hospital Timing</h2>

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

          {/* Time Slots */}
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
                    <TimeDropdown 
                      session={session} 
                      field="start" 
                      value={timings[activeDay][session].start} 
                    />
                    <TimeDropdown 
                      session={session} 
                      field="end" 
                      value={timings[activeDay][session].end} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboardTimeTablePage;