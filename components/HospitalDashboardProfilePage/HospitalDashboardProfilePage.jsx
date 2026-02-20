"use client";
import React, { useState } from 'react';
import { Settings, MapPin, Phone, Mail, Clock, Activity, Save, X } from 'lucide-react';

const HospitalDashboardProfilePage = () => {
  // 1. Edit mode control karne ke liye state
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. Hospital info ko state mein rakha taaki change ho sake
  const [hospitalInfo, setHospitalInfo] = useState({
    name: "St. Mary's General Hospital",
    type: "Multi-Specialty Care",
    address: "123 Medical Drive, Health City, HC 54321",
    email: "admin@stmarys.org",
    phone: "+1 (555) 012-3456",
    status: "Active",
    capacity: "450 Beds",
    staff: "1,200+"
  });

  // Input change handle karne ke liye function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospitalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Yahan aap API call add kar sakte hain data database mein save karne ke liye
    console.log("Saved Data:", hospitalInfo);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hospital Profile</h1>
          <p className="text-gray-500">Manage your facility's public information and settings.</p>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              <X size={18} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Settings size={18} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Info Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-blue-600">
                {hospitalInfo.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            
            {isEditing ? (
              <input
                name="name"
                value={hospitalInfo.name}
                onChange={handleChange}
                className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none w-full text-center"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800">{hospitalInfo.name}</h2>
            )}
            
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mt-2">
              {hospitalInfo.status}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={18} />
              {isEditing ? (
                <textarea 
                  name="address"
                  value={hospitalInfo.address}
                  onChange={handleChange}
                  className="text-sm text-gray-600 border rounded p-1 w-full"
                />
              ) : (
                <p className="text-sm text-gray-600">{hospitalInfo.address}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={18} />
              {isEditing ? (
                <input 
                  name="phone"
                  value={hospitalInfo.phone}
                  onChange={handleChange}
                  className="text-sm text-gray-600 border rounded p-1 w-full"
                />
              ) : (
                <p className="text-sm text-gray-600">{hospitalInfo.phone}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={18} />
              {isEditing ? (
                <input 
                  name="email"
                  value={hospitalInfo.email}
                  onChange={handleChange}
                  className="text-sm text-gray-600 border rounded p-1 w-full"
                />
              ) : (
                <p className="text-sm text-gray-600">{hospitalInfo.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              Operational Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold">Total Capacity</p>
                {isEditing ? (
                  <input 
                    name="capacity"
                    value={hospitalInfo.capacity}
                    onChange={handleChange}
                    className="font-semibold text-gray-800 border rounded p-1 w-full mt-1"
                  />
                ) : (
                  <p className="text-xl font-semibold text-gray-800">{hospitalInfo.capacity}</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold">Staff Count</p>
                {isEditing ? (
                  <input 
                    name="staff"
                    value={hospitalInfo.staff}
                    onChange={handleChange}
                    className="font-semibold text-gray-800 border rounded p-1 w-full mt-1"
                  />
                ) : (
                  <p className="text-xl font-semibold text-gray-800">{hospitalInfo.staff}</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold">Emergency Units</p>
                <p className="text-xl font-semibold text-gray-800">24/7 Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Primary Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Cardiology', 'Pediatrics', 'Neurology', 'Oncology', 'Emergency', 'Radiology'].map((dept) => (
                <span key={dept} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm border border-blue-100">
                  {dept}
                </span>
              ))}
              {isEditing && (
                <button className="text-sm text-blue-600 border border-dashed border-blue-400 px-3 py-1 rounded-md hover:bg-blue-100">
                  + Add Dept
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboardProfilePage;
