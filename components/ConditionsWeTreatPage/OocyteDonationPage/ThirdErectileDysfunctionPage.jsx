"use client"
import React from "react";
import { Heart, Brain, Zap } from "lucide-react";

const OocyteDonationPage = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-12 bg-gray-50">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Understanding Oocyte Donation
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Oocyte donation is a compassionate fertility solution where eggs from a
          healthy donor help recipients achieve pregnancy. Knowing the process,
          eligibility, and benefits guides informed decisions.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 h-full">
          <div className="flex items-center text-blue-600 mb-4">
            <Heart size={22} className="mr-2" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              Who Can Benefit
            </h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-600 space-y-2">
            <li>Premature ovarian failure</li>
            <li>Poor ovarian reserve</li>
            <li>Repeated IVF failures</li>
            <li>Genetic disease carriers</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 h-full">
          <div className="flex items-center text-blue-600 mb-4">
            <Brain size={22} className="mr-2" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              The Donation Process
            </h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-600 space-y-2">
            <li>Donor screening & matching</li>
            <li>Ovarian stimulation</li>
            <li>Egg retrieval procedure</li>
            <li>Fertilization & embryo transfer</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-lg p-6 h-full">
          <div className="flex items-center text-blue-600 mb-4">
            <Zap size={22} className="mr-2" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              Key Considerations
            </h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-600 space-y-2">
            <li>Legal & ethical guidelines</li>
            <li>Psychological counseling</li>
            <li>Donor anonymity options</li>
            <li>Success rate factors</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OocyteDonationPage;