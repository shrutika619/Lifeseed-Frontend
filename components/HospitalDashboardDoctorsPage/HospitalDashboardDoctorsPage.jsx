"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, ArrowLeft, Loader2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getDoctors, toggleDoctorStatus } from "@/app/services/hospitalDashboard.service"; // ✅ Import Service

// --- Helper Components ---
const ToggleSwitch = ({ id, checked, onChange, disabled }) => (
  <label htmlFor={id} className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} disabled={disabled} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
  </label>
);

const DoctorsPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDoctorsList = async () => {
      setIsLoading(true);
      
      // ✅ Call Service
      const result = await getDoctors(controller.signal);
      
      if (result.canceled) return; // Ignore if component unmounted
      
      if (result.success) {
        const docsData = Array.isArray(result.data) ? result.data : [];
        const formattedDoctors = docsData.map((doc) => {
          const degrees = [doc.underGraduationDegree?.name || doc.underGraduationDegree, doc.postGraduationDegree?.name || doc.postGraduationDegree].filter(Boolean);
          const qualificationString = degrees.length > 0 ? degrees.join(", ") : "MBBS";

          return {
            id: doc._id,
            name: doc.name,
            qualification: qualificationString, 
            specialty: doc.primarySpecialty?.name || doc.primarySpecialty || "General",
            experience: doc.experience || "N/A",
            time: doc.todayTiming || "09:00 AM - 05:00 PM",
            days: Array.isArray(doc.days) ? doc.days : [], 
            available: doc.isActive ?? true,
            profileImage: doc.profileImage
          };
        });
        setDoctors(formattedDoctors);
      } else {
        toast.error(result.message);
      }
      setIsLoading(false);
    };

    fetchDoctorsList();
    return () => controller.abort();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleToggle = async (id, currentStatus) => {
    setDoctors((prev) => prev.map((doc) => (doc.id === id ? { ...doc, available: !doc.available } : doc)));
    setUpdatingId(id);

    // ✅ Call Service
    const result = await toggleDoctorStatus(id, !currentStatus);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
      // Revert UI on failure
      setDoctors((prev) => prev.map((doc) => (doc.id === id ? { ...doc, available: currentStatus } : doc)));
    }
    setUpdatingId(null);
  };

  const handleAddDoctor = () => router.push("/hospitaldashboard/add-doctors");
  const handleEditDoctor = (id) => {
    setOpenMenuId(null);
    router.push(`/hospitaldashboard/add-doctors?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Hospital</h1>
          </div>
          <button onClick={handleAddDoctor} className="bg-blue-600 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 whitespace-nowrap">
            Add Doctor
          </button>
        </div>

        {/* Search + Filter */}
        <div className="relative mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex-grow focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctor..." className="ml-2 w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-700" />
            </div>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`p-2.5 rounded-lg shadow-sm border transition-colors relative ${isFilterOpen || selectedSpecialty !== "All" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-100 hover:bg-gray-50 text-gray-600"}`}>
              <Filter className="w-5 h-5" />
              {selectedSpecialty !== "All" && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </div>

        {/* Doctor Cards List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
               <p>Loading doctors...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                  <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] flex-shrink-0">
                    <img src={doc.profileImage || "https://placehold.co/70x70/e2e8f0/1e293b?text=Dr"} alt={doc.name} className="w-full h-full rounded-full object-cover border border-gray-100" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start md:block">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{doc.name}</h3>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium mt-0.5">{doc.qualification}</p>
                      </div>
                      
                      <div className="md:hidden relative dropdown-container">
                        <button onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)} className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openMenuId === doc.id && (
                          <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                            <button onClick={() => handleEditDoctor(doc.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{doc.specialty} • <span className="text-gray-700">Exp {doc.experience}</span></p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-gray-300'} inline-block`}></span>
                        {doc.time}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {doc.days.map((dayObj, index) => {
                        const dayName = dayObj?.day || ""; 
                        if (!dayName) return null; 
                        return (
                          <span key={index} className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-medium transition-colors border ${dayObj.active ? "bg-teal-50 text-teal-700 border-teal-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                            {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-4 md:gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <div className="hidden md:block relative dropdown-container">
                    <button onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)} className="text-gray-400 hover:text-gray-600 p-1 -mr-2">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === doc.id && (
                      <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                        <button onClick={() => handleEditDoctor(doc.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 md:bg-transparent p-2 md:p-0 rounded-lg w-full md:w-auto justify-between md:justify-end">
                    <span className="text-xs font-medium text-gray-500">{doc.available ? "Available" : "Unavailable"}</span>
                    <ToggleSwitch id={doc.id} checked={doc.available} disabled={updatingId === doc.id} onChange={() => handleToggle(doc.id, doc.available)} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No doctors found.</p>
              <button onClick={() => { setSearch(""); setSelectedSpecialty("All"); }} className="mt-2 text-blue-600 hover:underline text-sm">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;