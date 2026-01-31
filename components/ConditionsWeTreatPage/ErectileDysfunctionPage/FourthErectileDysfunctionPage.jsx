"use client";
import React from "react";
import { Search, ClipboardCheck } from "lucide-react";

const FourthErectileDysfunctionPage = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-16 bg-white">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Our Approach to Erectile Dysfunction
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
          Understanding the causes, treating the root issue, and restoring your
          confidence for good. Our process is confidential, personalized, and
          science-backed.
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
              Comprehensive Evaluation
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
              We start by identifying the precise root cause—be it physical,
              psychological, or lifestyle-related. Your journey begins with a
              confidential self-assessment, followed by an in-depth,
              one-on-one consultation with our expert doctors to understand
              your unique situation.
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
              Personalized & Integrative Plan
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
              Based on your evaluation, we create a holistic treatment plan
              combining effective, Ayurveda-based medicine with personalized
              diet, exercise, and stress-management guidance. We believe in
              integrative care that supports your complete physical and mental
              well-being for lasting results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthErectileDysfunctionPage;
