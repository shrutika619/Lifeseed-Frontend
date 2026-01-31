"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  ChevronDown, 
  Plus 
} from "lucide-react";

const AdminLoginInUserPage = () => {
  // --- State for Search and Filter ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");

  // --- Sample Data Based on Image ---
  const userData = [
    {
      id: "#09883",
      name: "Sheetal Dayal",
      age: 50,
      phone: "9973827100",
      email: "sheetald@xyz.com",
      location: "Nagpur",
      assessmentDate: "10/12/2025",
      assessmentTime: "12:40 PM",
      lastUpdateDate: "10/12/2025",
      lastUpdateTime: "12:40 PM",
      lastUpdateStatus: "Login Fail",
      assignTo: "Pranjal",
      nextCallDate: "10/12/2025",
      nextCallTime: "12:40 PM",
      status: "Interested",
    },
    {
      id: "#09884",
      name: "Kunal Joshi",
      age: 36,
      phone: "9973827100",
      email: "Kunal@xyz.com",
      location: "Pune",
      assessmentDate: "10/12/2025",
      assessmentTime: "12:40 PM",
      lastUpdateDate: "12/12/2025",
      lastUpdateTime: "12:40 PM",
      lastUpdateStatus: "Login",
      assignTo: "Pranjal",
      nextCallDate: "10/12/2025",
      nextCallTime: "12:40 PM",
      status: "Interested",
    },
    {
      id: "#09885",
      name: "Rajesh Kumar",
      age: 45,
      phone: "9973827100",
      email: "rajesh@xyz.com",
      location: "Mumbai",
      assessmentDate: "10/12/2025",
      assessmentTime: "12:40 PM",
      lastUpdateDate: "10/12/2025",
      lastUpdateTime: "12:40 PM",
      lastUpdateStatus: "Scroll About",
      assignTo: "Pranjal",
      nextCallDate: "10/12/2025",
      nextCallTime: "12:40 PM",
      status: "Interested",
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-700 font-sans">
      
      {/* --- Status Badges / Top Row --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Dynamic Badge Counts */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Badge count="06" label="50-50" color="bg-slate-100 text-slate-600" />
          <Badge count="03" label="Interested" color="bg-cyan-50 text-cyan-600 border border-cyan-100" />
          <Badge count="00" label="Not-interested" color="bg-yellow-50 text-yellow-600 border border-yellow-100" />
          <Badge count="00" label="Future" color="bg-orange-50 text-orange-600 border border-orange-100" />
          <Badge count="00" label="Black list" color="bg-pink-50 text-pink-600 border border-pink-100" />
          <Badge count="00" label="Regular" color="bg-sky-50 text-sky-600 border border-sky-100" />
        </div>
      </div>

      {/* --- Search & Action Bar --- */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="flex items-center gap-2 w-full sm:flex-1">
          <button className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
          
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Add Booking/User
        </button>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Update</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assign To</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Next Call</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userData.map((user, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.id}</td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-slate-800">{user.name} Age {user.age}</p>
                      <p className="text-slate-500">{user.phone}</p>
                      <p className="text-slate-500">{user.email}</p>
                      <p className="text-slate-500">{user.location}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="text-[11px] text-slate-400 font-medium">
                        <p>{user.assessmentDate}</p>
                        <p>{user.assessmentTime}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-slate-500">{user.lastUpdateDate}</p>
                      <p className="text-slate-500">{user.lastUpdateTime}</p>
                      <p className="text-slate-500 font-medium">{user.lastUpdateStatus}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">{user.assignTo}</td>
                  
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <p>{user.nextCallDate}</p>
                    <p>{user.nextCallTime}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-xs font-semibold border border-emerald-100">
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors inline-flex items-center justify-center border border-slate-200 shadow-sm">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Mobile/Tablet Card View --- */}
      <div className="lg:hidden space-y-4">
        {userData.map((user, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500">{user.id}</span>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-emerald-100">
                    {user.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 text-base">
                  {user.name} <span className="text-slate-500 font-normal text-sm">Age {user.age}</span>
                </h3>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 mb-4 pb-4 border-b border-slate-100">
              <p className="text-sm text-slate-600">{user.phone}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
              <p className="text-sm text-slate-500">{user.location}</p>
            </div>

            {/* Grid Info - Assessment & Last Update */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
              {/* Assessment */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assessment</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{user.assessmentDate}</p>
                <p className="text-xs text-slate-500">{user.assessmentTime}</p>
              </div>

              {/* Last Update */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Update</span>
                <p className="text-xs text-slate-600 font-medium">{user.lastUpdateDate}</p>
                <p className="text-xs text-slate-500">{user.lastUpdateTime}</p>
                <p className="text-xs text-slate-600 font-medium mt-1">{user.lastUpdateStatus}</p>
              </div>
            </div>

            {/* Grid Info - Assign To & Next Call */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assign To */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assigned To</span>
                <span className="text-xs text-slate-700 font-medium">{user.assignTo}</span>
              </div>

              {/* Next Call */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Next Call</span>
                <p className="text-xs text-slate-600 font-medium">{user.nextCallDate}</p>
                <p className="text-xs text-slate-500">{user.nextCallTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable Badge Component
const Badge = ({ count, label, color }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] md:text-xs font-bold ${color}`}>
    <span className="text-sm leading-none">{count}</span>
    <span className="whitespace-nowrap">{label}</span>
  </div>
);

export default AdminLoginInUserPage;