"use client";
import React, { useState } from "react";
import { Search, Filter, MoreVertical, ArrowLeft, X, Check } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ REAL NEXT.JS ROUTER

const DoctorsPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Ram Sharma",
      qualification: "MBBS, M.D Medicine",
      specialty: "General Physician",
      experience: "3 years",
      time: "10:00 AM – 06:30 PM",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      available: true,
    },
    {
      id: 2,
      name: "Dr. Shankar Dayal",
      qualification: "MBBS, M.D Medicine",
      specialty: "General Physician",
      experience: "3 years",
      time: "10:00 AM – 06:30 PM",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      available: true,
    },
    {
      id: 3,
      name: "Dr. Anita Roy",
      qualification: "MBBS, MS",
      specialty: "Cardiologist",
      experience: "5 years",
      time: "11:00 AM – 04:00 PM",
      days: ["Mon", "Wed", "Fri"],
      available: false,
    },
  ]);

  const specialties = ["All", ...new Set(doctors.map((doc) => doc.specialty))];

  const handleToggle = (id) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, available: !doc.available } : doc
      )
    );
  };

  const handleAddDoctor = () => {
    router.push("/add-doctor"); // ✅ Redirect working
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Hospital
            </h1>
          </div>

          <button
            onClick={handleAddDoctor}
            className="bg-blue-600 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 whitespace-nowrap"
          >
            Add Doctor
          </button>
        </div>

        {/* Search + Filter */}
        <div className="relative mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100 flex-grow focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor..."
                className="ml-2 w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-700"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-lg shadow-sm border transition-colors relative ${
                isFilterOpen || selectedSpecialty !== "All"
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-100 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Filter className="w-5 h-5" />
              {selectedSpecialty !== "All" && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 p-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center px-2 py-1 mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Filter by Specialty
                </span>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      setSelectedSpecialty(spec);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between group transition-colors ${
                      selectedSpecialty === spec
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {spec}
                    {selectedSpecialty === spec && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                  <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] flex-shrink-0">
                    <img
                      src="https://placehold.co/70x70/e2e8f0/1e293b?text=Dr"
                      alt={doc.name}
                      className="w-full h-full rounded-full object-cover border border-gray-100"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start md:block">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                          {doc.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium mt-0.5">
                          {doc.qualification}
                        </p>
                      </div>
                      <button className="md:hidden text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {doc.specialty} •{" "}
                      <span className="text-gray-700">Exp {doc.experience}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                      {doc.time}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <span
                            key={day}
                            className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                              doc.days.includes(day)
                                ? "bg-teal-50 text-teal-700 border border-teal-100"
                                : "bg-gray-50 text-gray-400 border border-gray-100"
                            }`}
                          >
                            {day}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-4 md:gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <button className="hidden md:block text-gray-400 hover:text-gray-600 p-1 -mr-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 bg-gray-50 md:bg-transparent p-2 md:p-0 rounded-lg w-full md:w-auto justify-between md:justify-end">
                    <span className="text-xs font-medium text-gray-500">
                      {doc.available ? "Available" : "Unavailable"}
                    </span>
                    <button
                      onClick={() => handleToggle(doc.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        doc.available ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          doc.available ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No doctors found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedSpecialty("All");
                }}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorsPage;
