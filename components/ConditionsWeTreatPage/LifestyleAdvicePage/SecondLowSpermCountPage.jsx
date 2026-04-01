"use client";
import React from "react";
import { FaHeartbeat, FaLeaf, FaBrain } from "react-icons/fa";

const SecondLifestyleAdvicePage = () => {
  return (
    <section className="w-full">
      {/* ================== ROOT CAUSES SECTION ================== */}
      <div className="bg-[#F9FAFB] py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Key Areas of{" "}
            <span className="text-blue-600">Lifestyle Impact</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Your everyday choices shape your reproductive health more than you
            realize. Our experts identify the specific lifestyle factors affecting
            your fertility and guide you toward meaningful change.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FaHeartbeat className="text-blue-600 text-2xl" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Physical Health Habits
              </h3>
            </div>
            <ul className="text-gray-600 text-sm sm:text-base space-y-2 list-disc list-inside">
              <li>Maintaining a healthy body weight</li>
              <li>Regular moderate exercise</li>
              <li>Avoiding smoking & alcohol</li>
              <li>Managing chronic conditions</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FaLeaf className="text-blue-600 text-2xl" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Diet & Nutrition
              </h3>
            </div>
            <ul className="text-gray-600 text-sm sm:text-base space-y-2 list-disc list-inside">
              <li>Antioxidant-rich foods</li>
              <li>Adequate folic acid & iron intake</li>
              <li>Limiting processed & junk food</li>
              <li>Staying well hydrated</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FaBrain className="text-blue-600 text-2xl" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Mental & Emotional Wellness
              </h3>
            </div>
            <ul className="text-gray-600 text-sm sm:text-base space-y-2 list-disc list-inside">
              <li>Stress management techniques</li>
              <li>Mindfulness & meditation</li>
              <li>Quality sleep routines</li>
              <li>Emotional counseling support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================== OUR APPROACH SECTION ================== */}
      <div className="bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Why Our Lifestyle Approach to Fertility{" "}
            <span className="text-blue-600">Works</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Our fertility lifestyle program combines evidence-based nutrition
            science, structured fitness guidance, and mental wellness support to
            create a holistic plan tailored to your body. We address{" "}
            <span className="font-medium text-gray-900">hormonal balance</span>,
            improve{" "}
            <span className="font-medium text-gray-900">
              egg and sperm quality
            </span>
            , and optimize your body's natural reproductive environment — all
            without invasive procedures or synthetic medications, ensuring a safe
            and sustainable path to parenthood.
          </p>
          <p className="mt-6 text-blue-700 font-semibold text-base sm:text-lg md:text-xl">
            Empowering your body naturally for the fertility journey ahead.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecondLifestyleAdvicePage;