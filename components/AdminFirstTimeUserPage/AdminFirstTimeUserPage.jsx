"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  ChevronDown, 
  Plus,
  User,
  Loader2,
  X,
  CheckCircle2,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { getFirstTimeLeads } from "@/app/services/admin/leads.service"; 

// --- Action Menu Component ---
const ActionMenu = ({ patientId }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all border border-transparent hover:border-gray-200"
      >
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              router.push(`${pathname}/customerprofile?patientId=${patientId}`);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-medium">CRM Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- Assessment Modal Component ---
const AssessmentModal = ({ assessment, onClose }) => {
  if (!assessment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">Assessment Details</h2>
              <p className="text-xs text-gray-500">
                Completed: {new Date(assessment.completedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Gender</p>
              <p className="text-sm font-bold text-slate-800">{assessment.gender || "Not specified"}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
              <p className="text-xs text-blue-500 mb-1 uppercase tracking-wider font-semibold">Total Score</p>
              <p className="text-sm font-bold text-blue-800">
                <span className="text-lg">{assessment.totalScore}</span> / {assessment.maxScore}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1 uppercase tracking-wider font-semibold">Concerns</p>
              <div className="flex flex-wrap gap-1">
                {assessment.selectedConcerns?.map((c, i) => (
                  <span key={i} className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Q&A Sections */}
          <div className="space-y-6">
            {assessment.concerns && Object.entries(assessment.concerns).map(([concernName, data], idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    {concernName}
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                    Score: {data.score}
                  </span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {data.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Q: {q.question}</p>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-gray-400 mt-0.5">A:</span>
                        <p className="text-sm font-bold text-gray-900">{q.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


// --- Main Page Component ---
const AdminFirstTimeUserPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); 

  const [leads, setLeads] = useState([]);
  const [totalNew, setTotalNew] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // ✅ Fetch Data Logic Extracted into a reusable function
  const fetchLeads = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    
    const params = {};
    if (selectedDate) params.date = selectedDate;
    if (searchTerm) params.search = searchTerm;

    try {
      const response = await getFirstTimeLeads(params);
      
      if (response.success && response.data) {
        setLeads(response.data.leads || []);
        setTotalNew(response.data.totalNew || 0);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  // ✅ Auto-refresh logic (Every 15 Seconds)
  useEffect(() => {
    // Initial fetch when dependencies change
    fetchLeads(true);

    // Set up the interval
    const intervalId = setInterval(() => {
      fetchLeads(false); // false = Don't show loading spinner on background refresh
    }, 15000);

    // Clean up interval on unmount or dependency change
    return () => clearInterval(intervalId);
  }, [searchTerm, selectedDate]);

  const formatDate = (isoString) => {
    if (!isoString || isoString === "--") return { date: "--", time: "--" };
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: d.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen relative">
      
      {/* Top Header / Filters */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* ── BACK BUTTON ── */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="relative">
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-white border border-gray-200 px-3 py-2 pr-9 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md border border-blue-100 flex items-center gap-2">
          <span className="text-sm font-bold">{totalNew < 10 ? `0${totalNew}` : totalNew}</span>
          <span className="uppercase tracking-wider text-[10px] font-black">New</span>
        </div>
      </div>

      {/* Search and Action Bar */}
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
            placeholder="Search leads by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">No leads found for this period.</p>
        </div>
      ) : (
        <>
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
                  {leads.map((lead) => {
                    const updateDateTime = formatDate(lead.leadUpdate?.date);
                    
                    let assessmentDateTime = { date: "--", time: "--" };
                    let hasAssessment = false;
                    
                    if (lead.assessment && typeof lead.assessment === 'object' && lead.assessment.completedAt) {
                      assessmentDateTime = formatDate(lead.assessment.completedAt);
                      hasAssessment = true;
                    }

                    return (
                      <tr key={lead.leadId} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{lead.customerId}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-bold text-gray-900 mb-0.5">
                              {lead.customerInfo?.name} 
                              {lead.customerInfo?.age && lead.customerInfo.age !== "--" && (
                                <span className="text-gray-400 font-normal ml-1">Age {lead.customerInfo.age}</span>
                              )}
                            </p>
                            <p className="text-gray-500 text-xs">{lead.customerInfo?.phone}</p>
                            {lead.customerInfo?.email && lead.customerInfo.email !== "--" && (
                              <p className="text-gray-500 text-xs">{lead.customerInfo.email}</p>
                            )}
                            {lead.customerInfo?.city && lead.customerInfo.city !== "--" && (
                              <p className="text-gray-400 text-xs italic mt-1">{lead.customerInfo.city}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            onClick={() => hasAssessment && setSelectedAssessment(lead.assessment)}
                            className={`flex flex-col gap-1.5 p-2 -m-2 rounded-lg transition-all w-max ${
                              hasAssessment ? 'cursor-pointer hover:bg-blue-100/50' : 'cursor-default'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className={`w-5 h-5 ${hasAssessment ? 'text-blue-500' : 'text-gray-300'}`} />
                              {hasAssessment && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">View</span>}
                            </div>
                            <div className="text-[11px] text-gray-500 leading-tight">
                              <p className="font-medium">{assessmentDateTime.date}</p>
                              <p>{assessmentDateTime.time}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-600 text-[11px] mb-1 font-medium">
                              {updateDateTime.date} | {updateDateTime.time}
                            </p>
                            <span className={`inline-block text-[10px] font-black uppercase px-2 py-1 rounded ${
                              lead.leadUpdate?.action === "Login Fail" 
                              ? "bg-red-50 text-red-500 border border-red-100" 
                              : "bg-green-50 text-green-600 border border-green-100"
                            }`}>
                              {lead.leadUpdate?.action || "New"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                            {lead.assignTo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{lead.leadSource}</td>
                        <td className="px-6 py-4 text-center">
                          <ActionMenu patientId={lead.patientId} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Mobile/Tablet Card View --- */}
          <div className="lg:hidden space-y-4">
            {leads.map((lead) => {
              const updateDateTime = formatDate(lead.leadUpdate?.date);
              
              let assessmentDateTime = { date: "--", time: "--" };
              let hasAssessment = false;
              if (lead.assessment && typeof lead.assessment === 'object' && lead.assessment.completedAt) {
                assessmentDateTime = formatDate(lead.assessment.completedAt);
                hasAssessment = true;
              }

              return (
                <div key={lead.leadId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">{lead.customerId}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          lead.leadUpdate?.action === "Login Fail" 
                          ? "bg-red-50 text-red-500 border border-red-100" 
                          : "bg-green-50 text-green-600 border border-green-100"
                        }`}>
                          {lead.leadUpdate?.action || "New"}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {lead.customerInfo?.name} 
                        {lead.customerInfo?.age && lead.customerInfo.age !== "--" && (
                          <span className="text-gray-400 font-normal text-sm ml-1">Age {lead.customerInfo.age}</span>
                        )}
                      </h3>
                    </div>
                    <ActionMenu patientId={lead.patientId} />
                  </div>

                  <div className="space-y-1 mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">{lead.customerInfo?.phone}</p>
                    {lead.customerInfo?.email && lead.customerInfo.email !== "--" && (
                      <p className="text-sm text-gray-600">{lead.customerInfo.email}</p>
                    )}
                    {lead.customerInfo?.city && lead.customerInfo.city !== "--" && (
                      <p className="text-sm text-gray-400 italic">{lead.customerInfo.city}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div 
                      onClick={() => hasAssessment && setSelectedAssessment(lead.assessment)}
                      className={`p-2 -m-2 rounded-lg transition-all ${
                        hasAssessment ? 'cursor-pointer hover:bg-blue-50' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText className={`w-4 h-4 ${hasAssessment ? 'text-blue-500' : 'text-gray-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${hasAssessment ? 'text-blue-600' : 'text-gray-400'}`}>
                          Assessment
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{assessmentDateTime.date}</p>
                      <p className="text-xs text-gray-500">{assessmentDateTime.time}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Lead Update</span>
                      <p className="text-xs text-gray-600 font-medium">{updateDateTime.date}</p>
                      <p className="text-xs text-gray-500">{updateDateTime.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Assigned To</span>
                        <span className="text-xs text-gray-700 font-semibold bg-gray-100 px-2 py-1 rounded-full">{lead.assignTo}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Source</span>
                      <span className="text-xs text-gray-600 font-medium">{lead.leadSource}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <AssessmentModal 
        assessment={selectedAssessment} 
        onClose={() => setSelectedAssessment(null)} 
      />

    </div>
  );
};

export default AdminFirstTimeUserPage;