"use client"
import React from "react";
import { Heart, Brain, Zap } from "lucide-react";

const ThirdErectileDysfunctionPage = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-12 bg-gray-50">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Understanding the Root Causes of ED
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          ED is a complex condition with physical, psychological, and lifestyle
          factors. Identifying the cause is key to effective treatment.
        </p>
      </div>

      {/* Causes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 h-full">
          <div className="flex items-center text-blue-600 mb-4">
            <Heart size={22} className="mr-2" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              Physical Causes
            </h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-600 space-y-2">
            <li>Heart disease</li>
            <li>High blood pressure</li>
            <li>Diabetes</li>
            <li>Hormonal imbalances</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 h-full">
          <div className="flex items-center text-blue-600 mb-4">
            <Brain size={22} className="mr-2" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              Psychological Causes
            </h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-600 space-y-2">
            <li>Stress & Anxiety</li>
            <li>Excessive Masturbation</li>
            <li>Performance pressure</li>
            <li>Relationship problems</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-lg p-6 h-full">
          <div className="flex items-center text-blue-600 mb-4">
            <Zap size={22} className="mr-2" />
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
              Lifestyle Factors
            </h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-600 space-y-2">
            <li>Smoking & Alcohol</li>
            <li>Poor diet</li>
            <li>Lack of exercise</li>
            <li>Obesity</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ThirdErectileDysfunctionPage;
