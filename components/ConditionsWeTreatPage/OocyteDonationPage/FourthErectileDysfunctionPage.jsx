"use client";
import React from "react";
import { Search, ClipboardCheck } from "lucide-react";

const FourthOocyteDonationPage = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-16 bg-white">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Our Approach to Oocyte Donation
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
          Matching the right donor, supporting every step of the journey, and
          helping you build the family you've always dreamed of. Our process is
          confidential, compassionate, and clinically proven.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-6 sm:p-8 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Search size={22} className="sm:w-6 sm:h-6" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl">
              Thorough Screening & Matching
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
              We begin with a detailed assessment of both the recipient and
              potential donors — evaluating medical history, genetic background,
              and compatibility. Our specialists conduct a confidential
              one-on-one consultation to understand your unique needs and ensure
              the most suitable donor match for your fertility journey.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-6 sm:p-8 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ClipboardCheck size={22} className="sm:w-6 sm:h-6" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl">
              Personalized & Guided Treatment Plan
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
              Based on your screening results, we design a tailored oocyte
              donation protocol combining advanced reproductive techniques with
              personalized hormonal preparation, nutritional support, and
              emotional counseling. We believe in holistic care that nurtures
              your physical and psychological well-being throughout the entire
              process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthOocyteDonationPage;