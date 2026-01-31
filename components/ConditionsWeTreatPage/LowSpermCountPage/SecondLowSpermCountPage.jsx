"use client";
import React from "react";
import { FaHeartbeat, FaLeaf, FaBrain } from "react-icons/fa";

const SecondLowSpermCountPage = () => {
  return (
    <section className="w-full">
      {/* ================== ROOT CAUSES SECTION ================== */}
      <div className="bg-[#F9FAFB] py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Understanding the <span className="text-blue-600">Root Causes</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Sperm health is a sensitive indicator of your overall well-being. Our
            diagnosis focuses on identifying the specific factors affecting your
            fertility.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FaHeartbeat className="text-blue-600 text-2xl" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Medical & Physiological
              </h3>
            </div>
            <ul className="text-gray-600 text-sm sm:text-base space-y-2 list-disc list-inside">
              <li>Hormonal imbalance</li>
              <li>Varicocele or obstructions</li>
              <li>Testicular damage or infections</li>
              <li>Chronic illness</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FaLeaf className="text-blue-600 text-2xl" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Lifestyle & Environmental
              </h3>
            </div>
            <ul className="text-gray-600 text-sm sm:text-base space-y-2 list-disc list-inside">
              <li>Smoking and alcohol</li>
              <li>Heat exposure & tight clothing</li>
              <li>Environmental toxins</li>
              <li>Sleep disorders & obesity</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <FaBrain className="text-blue-600 text-2xl" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Psychological & Emotional
              </h3>
            </div>
            <ul className="text-gray-600 text-sm sm:text-base space-y-2 list-disc list-inside">
              <li>Chronic stress and anxiety</li>
              <li>Mental and emotional fatigue</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================== AYURVEDIC APPROACH ================== */}
      <div className="bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Why MEN10’s Ayurvedic Approach{" "}
            <span className="text-blue-600">Works</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Our treatment is rooted in Vajikarana (sexual wellness) and Rasayana
            (rejuvenation) therapies. We use proven herbs like Ashwagandha,
            Shilajit, and Safed Musli to rejuvenate{" "}
            <span className="font-medium text-gray-900">Shukra Dhatu</span>{" "}
            (reproductive tissue), enhance{" "}
            <span className="font-medium text-gray-900">Ojas vitality</span>, and
            detoxify the reproductive system. This is done without hormones or
            synthetic drugs, ensuring no dependency or side effects.
          </p>
          <p className="mt-6 text-blue-700 font-semibold text-base sm:text-lg md:text-xl">
            A time-tested science for modern fertility challenges.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecondLowSpermCountPage;
