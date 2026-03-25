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
import { getLoginUsersLeads } from "@/app/services/admin/leads.service"; 

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

  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-slate-100 rounded-full transition-colors inline-flex items-center justify-center border border-slate-200 shadow-sm"
      >
        <MoreVertical className="w-5 h-5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* 1st — CRM Profile */}
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

          {/* 2nd — Place Order */}
          <button
            onClick={() => {
              setOpen(false);
              router.push(`${basePath}/log-in-user/placeorder?patientId=${patientId}`);  
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-medium">Place Order</span>
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
const AdminLoginInUserPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  // States for API Params
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); 
  const [selectedStage, setSelectedStage] = useState("");

  // States for API Data
  const [leads, setLeads] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    New: 0,
    Interested: 0,
    "Follow-Up": 0,
    Future: 0,
    "N-Interested": 0,
    Cancel: 0,
    Regular: 0
  });
  const [loading, setLoading] = useState(true);
  
  // State for Assessment Modal
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // ✅ Fetch Data Logic Extracted into a reusable function
  const fetchLeads = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    
    const params = {};
    if (selectedDate) params.date = selectedDate;
    if (searchTerm) params.search = searchTerm;
    if (selectedStage) params.stage = selectedStage;

    try {
      const response = await getLoginUsersLeads(params);
      
      if (response.success && response.data) {
        setLeads(response.data.leads || []);
        setCounts(response.data.counts || {});
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
  }, [searchTerm, selectedDate, selectedStage]);

  const formatDate = (isoString) => {
    if (!isoString || isoString === "--") return { date: "--", time: "--" };
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: d.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const formatCount = (num) => (num < 10 ? `0${num || 0}` : num);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-700 font-sans relative">
      
      {/* --- Status Badges / Top Row --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-4 mb-6">

        {/* ── BACK BUTTON ── */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
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


        {/* Dynamic Clickable Badge Counts */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Badge 
            count={formatCount(counts.total)} label="All" 
            color={selectedStage === "" ? "bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-300" : "bg-white text-slate-600 border border-slate-200"} 
            onClick={() => setSelectedStage("")} 
          />
          <Badge 
            count={formatCount(counts.New)} label="New" 
            color={selectedStage === "New" ? "bg-slate-200 text-slate-800 ring-2 ring-slate-400" : "bg-slate-100 text-slate-600 border border-slate-200"} 
            onClick={() => setSelectedStage("New")}
          />
          <Badge 
            count={formatCount(counts.Interested)} label="Interested" 
            color={selectedStage === "Interested" ? "bg-cyan-100 text-cyan-800 ring-2 ring-cyan-400" : "bg-cyan-50 text-cyan-600 border border-cyan-100"} 
            onClick={() => setSelectedStage("Interested")}
          />
          <Badge 
            count={formatCount(counts["N-Interested"])} label="Not-interested" 
            color={selectedStage === "N-Interested" ? "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400" : "bg-yellow-50 text-yellow-600 border border-yellow-100"} 
            onClick={() => setSelectedStage("N-Interested")}
          />
          <Badge 
            count={formatCount(counts.Future)} label="Future" 
            color={selectedStage === "Future" ? "bg-orange-100 text-orange-800 ring-2 ring-orange-400" : "bg-orange-50 text-orange-600 border border-orange-100"} 
            onClick={() => setSelectedStage("Future")}
          />
          <Badge 
            count={formatCount(counts.Cancel)} label="Cancel" 
            color={selectedStage === "Cancel" ? "bg-pink-100 text-pink-800 ring-2 ring-pink-400" : "bg-pink-50 text-pink-600 border border-pink-100"} 
            onClick={() => setSelectedStage("Cancel")}
          />
          <Badge 
            count={formatCount(counts.Regular)} label="Regular" 
            color={selectedStage === "Regular" ? "bg-sky-100 text-sky-800 ring-2 ring-sky-400" : "bg-sky-50 text-sky-600 border border-sky-100"} 
            onClick={() => setSelectedStage("Regular")}
          />
          <Badge 
            count={formatCount(counts["Follow-Up"])} label="Follow-Up" 
            color={selectedStage === "Follow-Up" ? "bg-purple-100 text-purple-800 ring-2 ring-purple-400" : "bg-purple-50 text-purple-600 border border-purple-100"} 
            onClick={() => setSelectedStage("Follow-Up")}
          />
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
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => {
            const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
            router.push(`${basePath}/newuser`);
          }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Booking/User
        </button>
      </div>

      {/* --- Loading / Empty States --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 font-medium">No leads found for the selected filters.</p>
        </div>
      ) : (
        <>
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
                  {leads.map((user) => {
                    const updateDateTime = formatDate(user.lastUpdate?.date);
                    const nextCallDateTime = user.nextCall ? formatDate(user.nextCall.date) : { date: "--", time: "--" };
                    
                    let assessmentDateTime = { date: "--", time: "--" };
                    let hasAssessment = false;
                    if (user.assessment && typeof user.assessment === 'object' && user.assessment.completedAt) {
                      assessmentDateTime = formatDate(user.assessment.completedAt);
                      hasAssessment = true;
                    }

                    return (
                      <tr key={user.leadId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.customerId}</td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-semibold text-slate-800">
                              {user.customerInfo?.name} 
                              {user.customerInfo?.age && user.customerInfo.age !== "--" && (
                                <span className="font-normal text-slate-500 ml-1">Age {user.customerInfo.age}</span>
                              )}
                            </p>
                            <p className="text-slate-500">{user.customerInfo?.phone}</p>
                            {user.customerInfo?.email && user.customerInfo.email !== "--" && (
                              <p className="text-slate-500">{user.customerInfo.email}</p>
                            )}
                            {user.customerInfo?.city && user.customerInfo.city !== "--" && (
                              <p className="text-slate-500 italic">{user.customerInfo.city}</p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div 
                            onClick={() => hasAssessment && setSelectedAssessment(user.assessment)}
                            className={`flex flex-col gap-1 p-2 -m-2 rounded-lg transition-all w-max ${
                              hasAssessment ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className={`w-5 h-5 ${hasAssessment ? 'text-blue-500' : 'text-slate-300'}`} />
                              {hasAssessment && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">View</span>}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              <p>{assessmentDateTime.date}</p>
                              <p>{assessmentDateTime.time}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-slate-500">{updateDateTime.date}</p>
                            <p className="text-slate-500">{updateDateTime.time}</p>
                            <p className="text-slate-500 font-medium">{user.lastUpdate?.action || "--"}</p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">{user.assignTo}</td>
                        
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <p>{nextCallDateTime.date}</p>
                          <p>{nextCallDateTime.time}</p>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                            user.status === 'Interested' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                            user.status === 'New' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            user.status === 'Cancel' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                            'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                            {user.status || "Unknown"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <ActionMenu patientId={user.patientId || user.userId} />
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
            {leads.map((user) => {
              const updateDateTime = formatDate(user.lastUpdate?.date);
              const nextCallDateTime = user.nextCall ? formatDate(user.nextCall.date) : { date: "--", time: "--" };
              
              let assessmentDateTime = { date: "--", time: "--" };
              let hasAssessment = false;
              if (user.assessment && typeof user.assessment === 'object' && user.assessment.completedAt) {
                assessmentDateTime = formatDate(user.assessment.completedAt);
                hasAssessment = true;
              }

              return (
                <div key={user.leadId} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">{user.customerId}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          user.status === 'Interested' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                          user.status === 'New' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          user.status === 'Cancel' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {user.status || "Unknown"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-base">
                        {user.customerInfo?.name} 
                        {user.customerInfo?.age && user.customerInfo.age !== "--" && (
                          <span className="text-slate-500 font-normal text-sm ml-1">Age {user.customerInfo.age}</span>
                        )}
                      </h3>
                    </div>
                    <ActionMenu patientId={user.patientId || user.userId} />
                  </div>

                  <div className="space-y-1 mb-4 pb-4 border-b border-slate-100">
                    <p className="text-sm text-slate-600">{user.customerInfo?.phone}</p>
                    {user.customerInfo?.email && user.customerInfo.email !== "--" && (
                      <p className="text-sm text-slate-600">{user.customerInfo.email}</p>
                    )}
                    {user.customerInfo?.city && user.customerInfo.city !== "--" && (
                      <p className="text-sm text-slate-400 italic">{user.customerInfo.city}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div 
                      onClick={() => hasAssessment && setSelectedAssessment(user.assessment)}
                      className={`p-2 -m-2 rounded-lg transition-all ${
                        hasAssessment ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText className={`w-4 h-4 ${hasAssessment ? 'text-blue-500' : 'text-slate-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${hasAssessment ? 'text-blue-600' : 'text-slate-500'}`}>
                          Assessment
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{assessmentDateTime.date}</p>
                      <p className="text-xs text-slate-500">{assessmentDateTime.time}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Update</span>
                      <p className="text-xs text-slate-600 font-medium">{updateDateTime.date}</p>
                      <p className="text-xs text-slate-500">{updateDateTime.time}</p>
                      <p className="text-xs text-slate-600 font-medium mt-1">{user.lastUpdate?.action || "--"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assigned To</span>
                      <span className="text-xs text-slate-700 font-medium">{user.assignTo}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Next Call</span>
                      <p className="text-xs text-slate-600 font-medium">{nextCallDateTime.date}</p>
                      <p className="text-xs text-slate-500">{nextCallDateTime.time}</p>
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

const Badge = ({ count, label, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] md:text-xs font-bold cursor-pointer transition-all hover:opacity-80 ${color}`}
  >
    <span className="text-sm leading-none">{count}</span>
    <span className="whitespace-nowrap">{label}</span>
  </div>
);

export default AdminLoginInUserPage;