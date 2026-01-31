"use client";

import React, { useState } from "react";
import {
  Filter,
  Search,
  Bell,
  Menu,
  Phone,
  ArrowLeft,
  Building2,
  MoreVertical,
} from "lucide-react";

export default function AdminClinicsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("City");
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [activeTab, setActiveTab] = useState("Doctors");

  const clinics = [
    {
      id: "#DO987",
      name: "Care Hospital men 10 sexual health clinic - multi Specialist",
      contact: "9987909023",
      email: "care@abc.com",
      address: "Wardha Rd, Sita Burdi, Nagpur",
      fullAddress: "Plot no 18 near nagar kalva chowk kuthrudi",
      googleLink: "https://maps.app.goo.gl/...",
      doctors: "10 Doctors",
      transactions: "05",
      status: "Active",
      contactPerson: {
        name: "Parul Jadhav",
        phone: "9987865463",
        email: "carehospital@abc.com",
      },
      attendant: {
        name: "Ashok Mali",
        phone: "9987865463",
        email: "carehospital@abc.com",
      },
      hospitalPublic: {
        phone: "9987865463",
        email: "carehospital@abc.com",
      },
      owner: {
        name: "Ramesh More",
        phone: "9987865463",
        email: "carehospital@abc.com",
      },
      doctorsList: [
        {
          id: "#D01",
          name: "Sheetal Dayal",
          phone: "9973827100",
          email: "sheetald@xyz.com",
          type: "IPD",
          exp: "12 Years",
          qualification: "MBBS, MS OBGY",
          specialization: "Gynecologist",
          status: "Active",
          language: "Hindi, English, Marathi",
        },
        {
          id: "#D02",
          name: "Rohit Singh",
          phone: "9973827101",
          email: "rohit@xyz.com",
          type: "OPD",
          exp: "8 Years",
          qualification: "MBBS",
          specialization: "Physician",
          status: "Active",
          language: "Hindi, English",
        },
        {
          id: "#D03",
          name: "Priya Sharma",
          phone: "9973827102",
          email: "priya@xyz.com",
          type: "IPD",
          exp: "15 Years",
          qualification: "MBBS, MD",
          specialization: "Cardiologist",
          status: "Active",
          language: "Hindi, English, Marathi",
        },
      ],
    },
    {
      id: "#DR9088",
      name: "Sai Hospital",
      contact: "9987909023",
      email: "sai@abc.com",
      address: "Wardha Rd, Sita Burdi, Nagpur",
      fullAddress: "Plot no 18 near nagar kalva chowk kuthrudi",
      googleLink: "https://maps.app.goo.gl/...",
      doctors: "8 Doctors",
      transactions: "03",
      status: "Active",
      contactPerson: {
        name: "Parul Jadhav",
        phone: "9987865463",
        email: "saihospital@abc.com",
      },
      attendant: {
        name: "Ashok Mali",
        phone: "9987865463",
        email: "saihospital@abc.com",
      },
      hospitalPublic: {
        phone: "9987865463",
        email: "saihospital@abc.com",
      },
      owner: {
        name: "Ramesh More",
        phone: "9987865463",
        email: "saihospital@abc.com",
      },
      doctorsList: [],
    },
    {
      id: "#DR9089",
      name: "Global Care Hospital",
      contact: "9987909023",
      email: "global@abc.com",
      address: "Wardha Rd, Sita Burdi, Nagpur",
      fullAddress: "Plot no 18 near nagar kalva chowk kuthrudi",
      googleLink: "https://maps.app.goo.gl/...",
      doctors: "12 Doctors",
      transactions: "07",
      status: "Active",
      contactPerson: {
        name: "Parul Jadhav",
        phone: "9987865463",
        email: "globalcare@abc.com",
      },
      attendant: {
        name: "Ashok Mali",
        phone: "9987865463",
        email: "globalcare@abc.com",
      },
      hospitalPublic: {
        phone: "9987865463",
        email: "globalcare@abc.com",
      },
      owner: {
        name: "Ramesh More",
        phone: "9987865463",
        email: "globalcare@abc.com",
      },
      doctorsList: [],
    },
  ];

  const filteredClinics = clinics.filter((clinic) => {
    const matchesStatus =
      statusFilter === "All" || clinic.status === statusFilter;
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (selectedClinic) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedClinic(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">Details</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex gap-6">
              <div className="w-64 space-y-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3">
                      <Building2 size={32} className="text-white" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                      <Phone size={16} />
                      Call
                    </button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{selectedClinic.name}</h3>
                      <p className="text-gray-600 text-xs">{selectedClinic.fullAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Contact Person</p>
                      <p className="font-medium text-gray-900">{selectedClinic.contactPerson.name}</p>
                      <p className="text-gray-600 text-xs">{selectedClinic.contactPerson.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-gray-900 text-xs">{selectedClinic.contactPerson.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Attendant</p>
                      <p className="font-medium text-gray-900">{selectedClinic.attendant.name}</p>
                      <p className="text-gray-600 text-xs">{selectedClinic.attendant.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-gray-900 text-xs">{selectedClinic.attendant.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Hospital/Public</p>
                      <p className="text-gray-600 text-xs">{selectedClinic.hospitalPublic.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-gray-900 text-xs">{selectedClinic.hospitalPublic.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Owner</p>
                      <p className="font-medium text-gray-900">{selectedClinic.owner.name}</p>
                      <p className="text-gray-600 text-xs">{selectedClinic.owner.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-gray-900 text-xs">{selectedClinic.owner.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Address</p>
                      <p className="text-gray-900 text-xs">{selectedClinic.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Address Google link</p>
                      <a href={selectedClinic.googleLink} className="text-blue-600 text-xs hover:underline">
                        {selectedClinic.googleLink}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Status</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                        {selectedClinic.status}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-blue-600 text-sm font-medium mb-2">Banking Details</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bank Name</span>
                          <span className="text-gray-900">Branch Name</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="border-b border-gray-200">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab("Doctors")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Doctors"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Doctors <span className="font-bold">{selectedClinic.doctors.split(" ")[0]}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("Transactions")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Transactions"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Total Transactions <span className="font-bold">{selectedClinic.transactions}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("Images")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Images"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Images <span className="font-bold">10</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("Billing")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Billing"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Billing <span className="font-bold">10</span>
                      </button>
                    </div>
                  </div>
                  {activeTab === "Doctors" && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">ID</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Info</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Type</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Exp</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Qualification</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Specialization</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Status</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">Language</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedClinic.doctorsList.length > 0 ? (
                            selectedClinic.doctorsList.map((doctor, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm text-gray-900">{doctor.id}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                                      <p className="text-xs text-gray-500">{doctor.phone}</p>
                                      <p className="text-xs text-gray-500">{doctor.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">{doctor.type}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{doctor.exp}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{doctor.qualification}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{doctor.specialization}</td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                                    {doctor.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">{doctor.language}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="py-8 text-center text-gray-500">
                                No doctors available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === "Transactions" && (
                    <div className="p-8 text-center text-gray-500">
                      <p>No transactions available</p>
                    </div>
                  )}
                  {activeTab === "Images" && (
                    <div className="p-8 text-center text-gray-500">
                      <p>No images available</p>
                    </div>
                  )}
                  {activeTab === "Billing" && (
                    <div className="p-8 text-center text-gray-500">
                      <p>No billing information available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Setup</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            </div>
          </div>
        </div>
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              <span>{selectedCity}</span>
            </button>
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {[
                { label: "New", count: 6, bg: "bg-blue-50", text: "text-blue-600" },
                { label: "Active", count: 3, bg: "bg-green-50", text: "text-green-600" },
                { label: "Inactive", count: 0, bg: "bg-gray-50", text: "text-gray-600" },
                { label: "Block", count: 0, bg: "bg-gray-50", text: "text-gray-600" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => setStatusFilter(btn.label)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium ${btn.bg} ${btn.text} transition-all hover:shadow-sm`}
                >
                  <span className="font-bold">{String(btn.count).padStart(2, "0")}</span> {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctors</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClinics.map((clinic, idx) => (
                  <tr
                    key={`${clinic.id}-${idx}`}
                    onClick={() => setSelectedClinic(clinic)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">{clinic.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                          <Building2 size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{clinic.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{clinic.contact}</div>
                      <div className="text-xs text-gray-500">{clinic.email}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{clinic.address}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{clinic.doctors}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {clinic.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}