"use client";

import React, { useState, useEffect } from "react";
import { ClinicStatusService } from "@/app/services/admin/clinicStatus.service"; 
// ✅ IMPORT BOTH SERVICES
import { getAllClinics, getClinicById } from "@/app/services/admin/adminClinic.service"; 
import { toast } from "sonner"; 
import {
  Filter,
  Search,
  Bell,
  Menu,
  Phone,
  ArrowLeft,
  Building2,
  MoreVertical,
  Loader2,
  X,
  AlertCircle,
  User 
} from "lucide-react";

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("City");
  
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isClinicLoading, setIsClinicLoading] = useState(false); // ✅ Added loading state for details

  const [activeTab, setActiveTab] = useState("Doctors");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // ✅ MODAL STATE
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", 
    clinicId: null,
  });
  const [actionReason, setActionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FETCH DATA USING SERVICE
  const fetchClinics = async (signal) => {
    setLoading(true);
    
    const result = await getAllClinics(signal);
    // console.log(result);
    
    if (result.canceled) return; 

    if (result.success) {
      const clinicsArray = result.data?.clinics || result.data || [];
      
      const mappedData = clinicsArray.map((c) => ({
        id: `#${c._id.slice(-5).toUpperCase()}`,
        dbId: c._id,
        name: c.clinicName,
        subtitle: "Sexual Health Clinic", 
        contact: c.mobileNo,
        email: c.clinicEmail,
        address: c.areaName || "Nagpur",
        fullAddress: c.fulladdress,
        googleLink: c.googleMapsLink,
        doctors: c.totalDoctors, 
        transactions: "00",   
        status: (c.status === "approved" || c.status === "APPROVED") ? "Active" : 
                (c.status === "pending" || c.status === "PENDING") ? "New" : 
                (c.status === "rejected" || c.status === "REJECTED") ? "Inactive" : "Block",
        
        contactPerson: {
          name: c.contactPersonName || "N/A",
          phone: c.mobileNo,
          email: c.contactPersonEmail || c.clinicEmail,
        },
        attendant: {
          name: c.attendantName || "N/A",
          phone: c.attendantNumber || "N/A",
          email: "N/A",
        },
        hospitalPublic: {
          phone: c.officeCallingNo || "N/A",
          email: c.clinicEmail,
        },
        owner: {
          name: c.ownerName || "N/A",
          phone: c.ownerContactNo || "N/A",
          email: c.clinicEmail,
        },
        doctorsList: [], // Will be populated when clicked
      }));

      setClinics(mappedData);
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchClinics(controller.signal);
    
    return () => controller.abort();
  }, []);

  const counts = {
    New: clinics.filter(c => c.status === "New").length,
    Active: clinics.filter(c => c.status === "Active").length,
    Inactive: clinics.filter(c => c.status === "Inactive").length,
    Block: clinics.filter(c => c.status === "Block").length,
    All: clinics.length
  };

  const filteredClinics = clinics.filter((clinic) => {
    const matchesStatus = statusFilter === "All" || clinic.status === statusFilter;
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || clinic.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ✅ HANDLE CLINIC CLICK (FETCH DOCTORS)
  const handleClinicClick = async (clinic) => {
    setSelectedClinic(clinic); // Set immediately for fast UI transition
    setIsClinicLoading(true);
    setActiveTab("Doctors");

    try {
      const result = await getClinicById(clinic.dbId);
      // console.log(result);
      if (result.success) {
        // Based on backend returning { clinic, doctors }
        const doctors = result.data?.doctors || [];
        
        // Update the selected clinic with the real doctors count and list
        setSelectedClinic(prev => ({
          ...prev,
          doctors: `${doctors.length} Doctors`,
          doctorsList: doctors
        }));

        // Also update the main array so the "Doctors" count updates on the table
        setClinics(prevClinics => prevClinics.map(c => 
          c.dbId === clinic.dbId ? { ...c, doctors: `${doctors.length} Doctors` } : c
        ));
      } else {
        toast.error(result.message || "Failed to load clinic details");
      }
    } catch (error) {
      toast.error("Error loading doctors for this clinic");
    } finally {
      setIsClinicLoading(false);
    }
  };

  // ✅ Open Modal
  const openActionModal = (type, dbId, e) => {
    e.stopPropagation();
    setOpenDropdownId(null); 
    setActionReason(""); 
    setModalConfig({ isOpen: true, type: type, clinicId: dbId });
  };

  const closeActionModal = () => {
    setModalConfig({ isOpen: false, type: "", clinicId: null });
    setActionReason("");
  };

  // ✅ Handle Actions
  const handleAction = async (action, dbId) => {
    setOpenDropdownId(null);
    if (action === 'Accept') {
      try {
        await ClinicStatusService.approveClinic(dbId);
        toast.success("Clinic approved successfully!");
        fetchClinics();
      } catch (error) {
        toast.error(error.message || `Failed to accept clinic`);
      }
    } 
  };

  // ✅ Submit Modal Action
  const handleSubmitAction = async () => {
    const { type, clinicId } = modalConfig;
    if (type === 'Reject' && !actionReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (type === 'Reject') {
        await ClinicStatusService.rejectClinic(clinicId, actionReason);
        toast.success("Clinic rejected successfully!");
      } 
      else if (type === 'Block') {
        await ClinicStatusService.blockClinic(clinicId);
        toast.success("Clinic blocked successfully!");
      }
      fetchClinics(); 
      closeActionModal();
      if(selectedClinic?.dbId === clinicId) setSelectedClinic(null); // Close details if open
    } catch (error) {
      toast.error(error.message || `Failed to ${type.toLowerCase()} clinic`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && clinics.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // --- DETAILS VIEW ---
  if (selectedClinic) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col min-h-screen"> 
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
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
            </div>
          </div>

          {/* Content Area - Scrollable Parent */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex gap-6 items-start">
              
              {/* SIDEBAR */}
              <div className="w-[340px] flex-shrink-0 bg-white rounded-lg p-5 border border-gray-200 shadow-sm h-fit">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-20 h-20 rounded-lg bg-[#5B4D8D] flex items-center justify-center">
                    <Building2 size={32} className="text-white" />
                  </div>
                  <button onClick={() => window.location.href=`tel:${selectedClinic.contact}`} className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                    Call
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedClinic.name}</h3>
                  <p className="text-gray-600 font-medium text-sm mt-1">{selectedClinic.subtitle}</p>
                  <p className="text-gray-900 font-bold text-sm mt-1">{selectedClinic.id}</p>
                  <p className="text-gray-900 font-bold text-sm">{selectedClinic.address}</p>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">{selectedClinic.fullAddress}</p>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Contact Person</p>
                      <p className="text-sm font-bold text-gray-900">{selectedClinic.contactPerson.name}</p>
                      <p className="text-sm text-gray-600">{selectedClinic.contactPerson.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-sm text-gray-800 break-words">{selectedClinic.contactPerson.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Attendant</p>
                      <p className="text-sm font-bold text-gray-900">{selectedClinic.attendant.name}</p>
                      <p className="text-sm text-gray-600">{selectedClinic.attendant.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Hospital/Public</p>
                      <p className="text-sm text-gray-600">{selectedClinic.hospitalPublic.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-sm text-gray-800 break-words">{selectedClinic.hospitalPublic.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Owner</p>
                      <p className="text-sm font-bold text-gray-900">{selectedClinic.owner.name}</p>
                      <p className="text-sm text-gray-600">{selectedClinic.owner.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Email</p>
                      <p className="text-sm text-gray-800 break-words">{selectedClinic.owner.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-900 mb-2">{selectedClinic.address}, {selectedClinic.fullAddress}</p>
                    <p className="text-gray-500 text-xs mb-1">Address Google link</p>
                    <a href={selectedClinic.googleLink} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline break-all block">
                      {selectedClinic.googleLink || "No link available"}
                    </a>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${selectedClinic.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {selectedClinic.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Area (Tabs) */}
              <div className="flex-1 flex flex-col h-full">
                <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col min-h-[500px]">
                  <div className="border-b border-gray-200">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab("Doctors")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Doctors" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Doctors <span className="font-bold">{selectedClinic.doctorsList?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("Transactions")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Transactions" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Total Transactions <span className="font-bold">{selectedClinic.transactions}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("Images")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Images" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Images <span className="font-bold">0</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("Billing")}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "Billing" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Billing <span className="font-bold">0</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="flex-1 overflow-auto bg-white relative">
                    
                    {/* ✅ Spinner Overlay for Details Fetch */}
                    {isClinicLoading && (
                      <div className="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center">
                         <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                         <p className="text-sm text-gray-500 font-medium">Loading details...</p>
                      </div>
                    )}

                    {activeTab === "Doctors" && (
                      <div className="min-w-full inline-block align-middle">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
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
                            {selectedClinic.doctorsList?.length > 0 ? (
                              selectedClinic.doctorsList.map((doctor, idx) => {
                                // Extract Qualifications securely
                                const ug = doctor.underGraduationDegree?.name || "";
                                const pg = doctor.postGraduationDegree?.name || "";
                                const qualification = [ug, pg].filter(Boolean).join(", ") || "MBBS";

                                return (
                                  <tr key={doctor._id || idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-900">
                                      #{doctor._id?.slice(-5).toUpperCase() || "N/A"}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                          {doctor.profileImage ? (
                                            <img src={doctor.profileImage} alt={doctor.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <User size={16} className="text-gray-400 m-auto mt-2" />
                                          )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{doctor.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{doctor.superSpecialization?.name || "Consultant"}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{doctor.experience ? `${doctor.experience} Yrs` : "N/A"}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600 max-w-[150px] truncate" title={qualification}>
                                      {qualification}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                      {doctor.primarySpecialty?.name || doctor.primarySpecialty || "General"}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${doctor.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                        {doctor.isActive ? "Active" : "Inactive"}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                      {Array.isArray(doctor.languages) ? doctor.languages.join(", ") : "English"}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              !isClinicLoading && (
                                <tr>
                                  <td colSpan="8" className="py-12 text-center text-gray-500">
                                    No doctors registered for this clinic
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeTab === "Transactions" && (
                      <div className="p-8 text-center text-gray-500"><p>No transactions available</p></div>
                    )}
                    {activeTab === "Images" && (
                      <div className="p-8 text-center text-gray-500"><p>No images available</p></div>
                    )}
                    {activeTab === "Billing" && (
                      <div className="p-8 text-center text-gray-500"><p>No billing information available</p></div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD LIST VIEW ---
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Clinics</h2>
            </div>
          </div>
        </div>
        
        {/* Filters */}
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
                { label: "New", count: counts.New, bg: "bg-blue-50", text: "text-blue-600" },
                { label: "Active", count: counts.Active, bg: "bg-green-50", text: "text-green-600" },
                { label: "Inactive", count: counts.Inactive, bg: "bg-gray-50", text: "text-gray-600" },
                { label: "Block", count: counts.Block, bg: "bg-gray-50", text: "text-gray-600" },
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

        {/* Table */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-visible pb-24"> 
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
                    onClick={() => handleClinicClick(clinic)}
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${clinic.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {clinic.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === clinic.id ? null : clinic.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors relative z-10"
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>

                        {openDropdownId === clinic.id && (
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }}
                          />
                        )}

                        {openDropdownId === clinic.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 py-1.5 z-50">
                            {/* ✅ Updated Logic: Block button only shows for Active clinics */}
                            {clinic.status === 'Active' && (
                              <button onClick={(e) => openActionModal('Block', clinic.dbId, e)} className="w-full text-left px-4 py-2 text-[15px] text-[#334155] hover:bg-gray-50 transition-colors">Block</button>
                            )}
                            {clinic.status === 'New' && (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); handleAction('Accept', clinic.dbId); }} className="w-full text-left px-4 py-2 text-[15px] text-[#334155] hover:bg-gray-50 transition-colors">Accept</button>
                                <button onClick={(e) => openActionModal('Reject', clinic.dbId, e)} className="w-full text-left px-4 py-2 text-[15px] text-[#334155] hover:bg-gray-50 transition-colors">Reject</button>
                              </>
                            )}
                            {(clinic.status === 'Inactive' || clinic.status === 'Block') && (
                              <button onClick={(e) => { e.stopPropagation(); handleAction('Accept', clinic.dbId); }} className="w-full text-left px-4 py-2 text-[15px] text-[#334155] hover:bg-gray-50 transition-colors">Accept</button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ BLUE & WHITE MODAL */}
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-blue-100 scale-100 animate-in zoom-in-95 duration-200">
              
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${modalConfig.type === 'Reject' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                     <AlertCircle size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {modalConfig.type} Clinic
                  </h3>
                </div>
                <button 
                  onClick={closeActionModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to <strong>{modalConfig.type.toLowerCase()}</strong> this clinic? 
                  {modalConfig.type === 'Reject' 
                    ? " Please provide a reason below." 
                    : " This action will restrict access immediately."}
                </p>
                
                {/* Only show input if type is Reject */}
                {modalConfig.type === 'Reject' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Reason for Rejection <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Please enter the reason..."
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm min-h-[100px] resize-none text-gray-700 placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={closeActionModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAction}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  Confirm {modalConfig.type}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}