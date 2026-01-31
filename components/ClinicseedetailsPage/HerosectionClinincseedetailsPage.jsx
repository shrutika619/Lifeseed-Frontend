"use client";
import React from 'react';
import { Star, Phone, CalendarCheck } from 'lucide-react';
import { useRouter } from "next/navigation";

// Reusable component for the rating stars
const StarRating = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
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
      <span className="text-sm font-semibold text-gray-700">{rating} stars</span>
      <span className="text-sm text-gray-500">|</span>
      <span className="text-sm text-gray-500">{count} ratings</span>
      <span className="ml-4 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
        Open Now
      </span>
    </div>
  );
};

// Main Hero Section Component
const HerosectionClinincseedetailsPage = () => {

  const router = useRouter();   // <-- Added

  const clinicName = "MEN 10 Clinic - Besa, Nagpur";
  const partnerName = "Meditrina Hospital, Nagpur";
  const partnerDescription = "Our partnership with one of Nagpur's leading hospitals ensures you receive comprehensive, integrated care for any condition requiring advanced facilities.";

  const hospitalImageUrl = "https://placehold.co/800x600/60a5fa/ffffff?text=Meditrina+Hospital+Nagpur";
  const doctorImageUrl = "https://placehold.co/800x600/94a3b8/ffffff?text=Clinic+Partner";

  return (
    <div className="bg-zinc-50 min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- SECTION 1 --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase text-indigo-600 tracking-wider">
              MEN's Sexual Health Clinic
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
                <p>morning 11am-1pm, afternoon 2pm-5pm, evening 6pm-8pm</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              
              {/* --------- BOOK BUTTON WITH ROUTE --------- */}
              <button
                onClick={() => router.push("/bookappointment")}
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/50"
              >
                <CalendarCheck className="w-5 h-5 mr-2" />
                Book Appointment
              </button>

              <button className="flex items-center justify-center px-8 py-3 border-2 border-indigo-600 text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 transition">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </button>
            </div>
          </div>

          {/* Right column image */}
          <div className="shadow-2xl rounded-3xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <img 
              src={hospitalImageUrl}
              alt="Meditrina Hospital Nagpur Building"
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
                alt="Professional man representing the clinic partner"
                className="w-full h-auto object-cover aspect-[4/3] rounded-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right text */}
          <div className="order-1 lg:order-2 space-y-6 lg:pl-10">
            <p className="text-sm font-medium uppercase text-gray-700 tracking-wider">
              Our Trusted Partner Hospital
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {partnerName}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              {partnerDescription}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HerosectionClinincseedetailsPage;
