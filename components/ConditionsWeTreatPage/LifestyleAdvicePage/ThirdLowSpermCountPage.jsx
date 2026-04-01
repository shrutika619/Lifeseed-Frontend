"use client";
import React from "react";
import { Leaf, Apple, Users } from "lucide-react";

const ThirdLowSpermCountPage = () => {
  return (
    <section className="w-full">
      {/* ================== INTEGRATED TREATMENT FRAMEWORK ================== */}
      <div className="bg-[#F9FAFB] py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Our Integrated Treatment <span className="text-blue-600">Framework</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center">
            <Leaf className="mx-auto text-blue-600 text-3xl mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Customized Herbal Medicines
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Semen boosters, hormone balancers, and anti-inflammatory formulas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center">
            <Apple className="mx-auto text-blue-600 text-3xl mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Lifestyle & Nutrition Plans
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Cooling diets, anti-toxin foods, and sperm-safe lifestyle habits.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center">
            <Users className="mx-auto text-blue-600 text-3xl mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Mind-Body Therapies
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Yoga for pelvic health, guided meditation, and emotional counseling.
            </p>
          </div>
        </div>
      </div>

      {/* ================== TREATMENT JOURNEY ================== */}
      <div className="bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Your <span className="text-blue-600">Treatment Journey</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            "Initial Assessment & Semen Analysis",
            "Ayurvedic Diagnosis (Dosha, Shukra)",
            "Personalized Treatment Plan",
            "Ongoing Monitoring (15-day tests)",
            "Fertility Restoration (~1.5 months)",
            "Post-Treatment Support",
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-[#F9FAFB] rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm sm:text-base">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdLowSpermCountPage;
