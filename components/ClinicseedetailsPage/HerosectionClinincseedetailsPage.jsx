"use client";
import React from 'react';
import { Star, Phone, CalendarCheck } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // ✅ Added to check auth state

// Reusable component for the rating stars
const StarRating = ({ rating, count }) => {
  const fullStars = Math.floor(rating || 0);
  const starsArray = Array(5).fill(null).map((_, index) => (
    <Star
      key={index}
      className={`w-4 h-4 ${index < fullStars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
    />
  ));

  return (
    <div className="flex items-center space-x-2 p-2 rounded-xl transition duration-300 cursor-pointer hover:bg-indigo-50/50 hover:shadow-sm">
      <div className="flex -space-x-1.5">
        {starsArray}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating || 0} stars</span>
      <span className="text-sm text-gray-500">|</span>
      <span className="text-sm text-gray-500">{count || "100+"} ratings</span>
      <span className="ml-4 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
        Open Now
      </span>
    </div>
  );
};

// Main Hero Section Component
const HerosectionClinincseedetailsPage = ({ data }) => {

  const router = useRouter();
  
  // ✅ Access auth state to determine if user needs to login first
  const isAuthenticated = useSelector((state) => !!state.auth?.accessToken);
  
  // Safe Data Extraction
  const clinic = data?.clinic || {};
  
  // Fallbacks to keep design intact if data is missing
  const clinicName = `MEN 10 Clinic ${clinic.areaName || ""}`;
  const areaName = clinic.areaName ? `${clinic.areaName} Branch` : "MEN's Sexual Health Clinic";
  const partnerName = clinic.clinicName ;
  
  // Images from DB
  const hospitalImageUrl = clinic.photos?.clinicfrontPhoto || "https://placehold.co/800x600/60a5fa/ffffff?text=Clinic+Front";
  const doctorImageUrl = clinic.photos?.doctorCabinPhoto || "https://placehold.co/800x600/94a3b8/ffffff?text=Clinic+Interior";

  // Dynamic Timings Logic
  const getTodayTimings = () => {
    if (!clinic.timings) return "Loading...";
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = days[new Date().getDay()];
    const todaySchedule = clinic.timings.find(t => t.day?.toLowerCase() === todayName);

    if (!todaySchedule || todaySchedule.isClosed) return "Closed Today";

    const { morning, afternoon, evening } = todaySchedule.sections || {};
    let slots = [];
    
    if (morning?.enabled) slots.push(`morning ${morning.start}-${morning.end}`);
    if (afternoon?.enabled) slots.push(`afternoon ${afternoon.start}-${afternoon.end}`);
    if (evening?.enabled) slots.push(`evening ${evening.start}-${evening.end}`);
    
    return slots.length > 0 ? slots.join(", ") : "Open (See details below)";
  };

  // ✅ NEW HANDLER: Safely pass the full path including the clinic ID
  const handleBookClick = () => {
    const targetPath = clinic?._id 
      ? `/bookappointment?clinicId=${clinic._id}` 
      : "/bookappointment";

    if (isAuthenticated) {
      router.push(targetPath);
    } else {
      // Encode the target path so the login page receives the entire string safely
      router.push(`/login?from=${encodeURIComponent(targetPath)}`);
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- SECTION 1 --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase text-indigo-600 tracking-wider">
              {areaName}
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
              {clinicName}
            </h1>

            <p className="text-lg font-semibold text-indigo-600">
              In partnership with <span className="underline decoration-indigo-300 decoration-2">{partnerName}</span>
            </p>

            <StarRating rating={4.9} count="65k+" />

            {/* Timings */}
            <div className="text-gray-600 flex items-start space-x-2 pt-2">
              <CalendarCheck className="w-5 h-5 flex-shrink-0 mt-1 text-gray-500" />
              <div>
                <p className="font-semibold text-gray-700">Timings Today:</p>
                <p className="text-sm">{getTodayTimings()}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              
              {/* --------- UPDATED BOOK BUTTON --------- */}
              <button
                onClick={handleBookClick}
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/50"
              >
                <CalendarCheck className="w-5 h-5 mr-2" />
                Book Appointment
              </button>

              <button 
                onClick={() => window.location.href = `tel:${clinic.officeCallingNo}`} 
                className="flex items-center justify-center px-8 py-3 border-2 border-indigo-600 text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 transition"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </button>
            </div>
          </div>

          {/* Right column image */}
          <div className="shadow-2xl rounded-3xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <img 
              src={hospitalImageUrl}
              alt={clinicName}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
        </div>

        {/* --- SECTION 2 --- */}
        <div className="mt-20 pt-12 border-t border-gray-200 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left image */}
          <div className="order-2 lg:order-1 relative p-4 bg-gray-200 rounded-3xl shadow-xl">
            <div className="overflow-hidden rounded-2xl">
              <img 
                src={doctorImageUrl}
                alt="Clinic Interior"
                className="w-full h-auto object-cover aspect-[4/3] rounded-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right text */}
          <div className="order-1 lg:order-2 space-y-6 lg:pl-10">
            <p className="text-sm font-medium uppercase text-gray-700 tracking-wider">
              About the Clinic
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {clinicName}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              {clinic.clinicDescription || "Comprehensive care for all your needs."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HerosectionClinincseedetailsPage;