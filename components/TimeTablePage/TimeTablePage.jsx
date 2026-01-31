"use client";

import React, { useState } from "react";
import { Sun, Sunset, ArrowLeft, CheckCircle, Moon } from "lucide-react";

const TimeTablePage = () => {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.back();
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [activeDay, setActiveDay] = useState("Mon");
  const [isSaved, setIsSaved] = useState(false);

  const defaultTiming = {
    morning: { enabled: true, start: "10:00 AM", end: "06:30 PM" },
    afternoon: { enabled: true, start: "10:00 AM", end: "06:30 PM" },
    evening: { enabled: false, start: "10:00 AM", end: "06:30 PM" },
  };

  const [schedule, setSchedule] = useState({
    Mon: { ...defaultTiming },
    Tue: { ...defaultTiming },
    Wed: { ...defaultTiming },
    Thu: { ...defaultTiming },
    Fri: { ...defaultTiming },
    Sat: { ...defaultTiming },
    Sun: { ...defaultTiming },
  });

  const toggleSession = (day, session) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [session]: {
          ...prev[day][session],
          enabled: !prev[day][session].enabled,
        },
      },
    }));
  };

  const handleTimeChange = (day, session, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [session]: { ...prev[day][session], [field]: value },
      },
    }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    console.log("Schedule Saved:", schedule);
  };

  const timeOptions = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "06:30 PM",
    "07:00 PM", "08:00 PM", "09:00 PM",
  ];

  const sessionConfig = {
    morning: { 
      icon: <Sun className="w-5 h-5 text-yellow-500" />, 
      label: "Morning" 
    },
    afternoon: { 
      icon: <Sun className="w-5 h-5 text-orange-500" />, 
      label: "Afternoon" 
    },
    evening: { 
      icon: <Moon className="w-5 h-5 text-indigo-500" />, 
      label: "Evening" 
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 flex justify-center items-center p-4 md:p-8">
      
      {/* Success Notification */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 p-4 bg-green-500 text-white flex items-center justify-center transition-transform duration-300 shadow-lg ${
          isSaved ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        <span className="font-medium">Timing updated successfully!</span>
      </div>

      {/* Main Container */}
      <div className="bg-white w-full max-w-4xl min-h-screen md:min-h-0 md:rounded-2xl md:shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-200 flex items-center bg-white">
          <button
            onClick={handleGoBack}
            className="mr-3 md:mr-4 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">Profile</h1>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 py-6 md:py-8">
          <h2 className="text-base md:text-lg font-medium text-gray-700 mb-6">
            Hospital Timing
          </h2>

          {/* Day Tabs */}
          <div className="flex justify-between mb-8 border-b border-gray-200 overflow-x-auto">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`text-sm md:text-base px-3 md:px-4 pb-3 font-medium transition-all whitespace-nowrap ${
                  activeDay === day
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Session Blocks */}
          <div className="space-y-2 md:space-y-4">
            {Object.keys(schedule[activeDay]).map((session) => {
              const sessionData = schedule[activeDay][session];
              const config = sessionConfig[session];
              
              return (
                <div key={session} className="py-5 md:py-6 px-4 md:px-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                  
                  {/* Session Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      {config.icon}
                      <span className="font-semibold text-gray-900 text-base md:text-lg">
                        {config.label}
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleSession(activeDay, session)}
                      className={`relative inline-flex h-7 w-12 md:h-8 md:w-14 items-center rounded-full transition-colors ${
                        sessionData.enabled ? "bg-teal-500" : "bg-gray-300"
                      }`}
                      aria-label={`Toggle ${config.label}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform shadow-md ${
                          sessionData.enabled ? "translate-x-6 md:translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Time Selectors */}
                  {sessionData.enabled && (
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                      <div className="flex-1">
                        <label className="block text-xs md:text-sm text-gray-600 mb-1.5 font-medium">Start Time</label>
                        <select
                          value={sessionData.start}
                          onChange={(e) =>
                            handleTimeChange(activeDay, session, "start", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg text-sm md:text-base px-3 md:px-4 py-2.5 md:py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-xs md:text-sm text-gray-600 mb-1.5 font-medium">End Time</label>
                        <select
                          value={sessionData.end}
                          onChange={(e) =>
                            handleTimeChange(activeDay, session, "end", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg text-sm md:text-base px-3 md:px-4 py-2.5 md:py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full md:w-auto md:px-12 bg-blue-600 text-white font-semibold py-3.5 md:py-4 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition shadow-lg hover:shadow-xl mt-8 md:text-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTablePage;