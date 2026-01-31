"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  ChevronDown, 
  Calendar 
} from "lucide-react";

const AdminFirstTimeUserPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");

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
      leadUpdateDate: "10/12/2025",
      leadUpdateTime: "12:40 PM",
      leadStatus: "Login Fail",
      assignTo: "Pranjal",
      source: "Website",
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
      leadUpdateDate: "10/12/2025",
      leadUpdateTime: "12:40 PM",
      leadStatus: "Login",
      assignTo: "Pranjal",
      source: "Website",
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* --- Top Header / Filters --- */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative">
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none bg-white border border-gray-200 px-3 py-2 pr-9 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md border border-blue-100 flex items-center gap-2">
          <span className="text-sm font-bold">06</span>
          <span className="uppercase tracking-wider text-[10px] font-black">New</span>
        </div>
      </div>

      {/* --- Search and Action Bar --- */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex justify-center">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assessment</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lead Update</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assign To</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userData.map((user, index) => (
                <tr key={index} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-bold text-gray-900 mb-0.5">{user.name} <span className="text-gray-400 font-normal ml-1">Age {user.age}</span></p>
                      <p className="text-gray-500 text-xs">{user.phone}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                      <p className="text-gray-400 text-xs italic mt-1">{user.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div className="text-[11px] text-gray-500 leading-tight">
                        <p className="font-medium">{user.assessmentDate}</p>
                        <p>{user.assessmentTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-600 text-[11px] mb-1 font-medium">{user.leadUpdateDate} | {user.leadUpdateTime}</p>
                      <span className={`inline-block text-[10px] font-black uppercase px-2 py-1 rounded ${
                        user.leadStatus === "Login Fail" 
                        ? "bg-red-50 text-red-500 border border-red-100" 
                        : "bg-green-50 text-green-600 border border-green-100"
                      }`}>
                        {user.leadStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-full">{user.assignTo}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.source}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all border border-transparent hover:border-gray-200">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
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
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400">{user.id}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    user.leadStatus === "Login Fail" 
                    ? "bg-red-50 text-red-500 border border-red-100" 
                    : "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    {user.leadStatus}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">
                  {user.name} <span className="text-gray-400 font-normal text-sm">Age {user.age}</span>
                </h3>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 mb-4 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">{user.phone}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-400 italic">{user.location}</p>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Assessment */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assessment</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">{user.assessmentDate}</p>
                <p className="text-xs text-gray-500">{user.assessmentTime}</p>
              </div>

              {/* Lead Update */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Lead Update</span>
                <p className="text-xs text-gray-600 font-medium">{user.leadUpdateDate}</p>
                <p className="text-xs text-gray-500">{user.leadUpdateTime}</p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Assigned To</span>
                  <span className="text-xs text-gray-700 font-semibold bg-gray-100 px-2 py-1 rounded-full">{user.assignTo}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Source</span>
                <span className="text-xs text-gray-600 font-medium">{user.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFirstTimeUserPage;