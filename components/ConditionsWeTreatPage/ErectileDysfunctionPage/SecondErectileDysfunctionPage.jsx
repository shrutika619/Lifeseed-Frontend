"use client"
import React from "react";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

const SecondErectileDysfunctionPage = () => {
  return (
    <>
      {/* Main Content Section */}
      <section className="px-6 md:px-20 py-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            You Are Not Alone
          </h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Erectile dysfunction is a common health issue affecting men of all
            ages. Understanding its prevalence is the first step toward finding a
            solution.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="text-blue-600 flex justify-center mb-2">
              <Users size={36} />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">40%</h3>
            <p className="mt-2 text-sm text-gray-600">
              of men under 40 experience ED at some point.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="text-blue-600 flex justify-center mb-2">
              <TrendingUp size={36} />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">1 in 10</h3>
            <p className="mt-2 text-sm text-gray-600">
              men worldwide are estimated to have ED.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="text-blue-600 flex justify-center mb-2">
              <BarChart3 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">60%</h3>
            <p className="mt-2 text-sm text-gray-600">
              of men over 55 report dealing with ED.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-blue-600 text-white text-center py-12 px-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-3">
          Evaluate Your Symptoms Confidentially
        </h3>
        <p className="max-w-2xl mx-auto mb-6 text-sm md:text-base">
          Our 2-minute assessment helps you understand your symptoms and
          provides a confidential starting point for your recovery journey.
        </p>
        <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition">
          Take Free Self-Assessment
        </button>
      </div>
    </>
  );
};

export default SecondErectileDysfunctionPage;
