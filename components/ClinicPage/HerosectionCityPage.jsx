"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Navigation, Star, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllClinics, getAllCities } from "@/app/services/clinic.service";

export default function HerosectionCity({ cityName }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Helper to match slugs back to city names
  const normalizeString = (str) => str?.toLowerCase().replace(/\s+/g, '-').trim();

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Fetch all cities to find the one matching the cityName slug
        const cityResponse = await getAllCities();
        
        // Adjust based on your API structure: cityResponse.data.cities or cityResponse.data
        const citiesList = cityResponse?.data || []; 
        const targetCity = citiesList.find(
          (c) => normalizeString(c.name) === normalizeString(cityName)
        );

        if (!targetCity) {
          setError("City not found. Please select a different location.");
          setLoading(false);
          return;
        }

        // 2. Fetch clinics ONLY for that specific city ID
        const clinicResult = await getAllClinics(targetCity._id);

        if (clinicResult.success) {
          setClinics(clinicResult.clinics);
        } else {
          setError(clinicResult.message);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (cityName) initializeData();
  }, [cityName]);

  // Client-side search within the already filtered city results
  const filteredList = clinics.filter(
    (clinic) =>
      clinic.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.areaName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (phone) => (window.location.href = `tel:${phone}`);
  const handleDetails = (id) => router.push(`/clinicseedetails?id=${id}`);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
          Find Our Clinic in <span className="text-indigo-600">{cityName?.replace(/-/g, ' ')}</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Choose a clinic near you for a personal, in-clinic consultation.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl flex gap-3 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by area or name..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md space-y-8">
        {loading ? (
          <div className="flex flex-col items-center py-10">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
             <p className="text-gray-500">Finding best clinics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        ) : filteredList.length > 0 ? (
          filteredList.map((clinic) => (
            <div
              key={clinic._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-300 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="h-48 w-full bg-gray-200 overflow-hidden border-b border-gray-300">
                <img
                  src={clinic.photos?.clinicfrontPhoto || "https://via.placeholder.com/800x400?text=Clinic+Image"}
                  alt={clinic.clinicName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {clinic.clinicName}
                  </h3>
                  <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full uppercase">
                    Open
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                     <span className="flex items-center gap-1 font-semibold">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9
                     </span>
                     <span>{clinic.areaName}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleCall(clinic.mobileNo)} className="text-purple-600 hover:bg-purple-50 p-1 rounded-md transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button onClick={() => window.open(clinic.googleMapsLink, '_blank')} className="text-purple-600 hover:bg-purple-50 p-1 rounded-md transition-colors">
                        <Navigation className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-6 truncate">{clinic.fulladdress}</p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDetails(clinic._id)}
                    className="bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                  >
                    See Details
                  </button>
                  <button
                    onClick={() => handleDetails(clinic._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg shadow-md text-sm font-semibold transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
             <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500">No clinics available in this area yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}