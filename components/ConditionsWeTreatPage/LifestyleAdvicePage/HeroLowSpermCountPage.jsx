"use client";
import React from "react";
import CountUp from "react-countup";
import Link from "next/link";

const HeroLifestyleAdvicePage = () => {
  return (
    <section className="w-full">
      {/* =================== HERO SECTION =================== */}
      <div className="text-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-[#F9FAFB]">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
          Lifestyle Advice for{" "}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] bg-clip-text text-transparent">
            Fertility & <br /> Reproductive Health
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Small, consistent changes in your daily habits can make a significant
          difference in your fertility outcomes. Our experts provide{" "}
          <span className="font-semibold text-gray-900">
            personalized lifestyle guidance
          </span>{" "}
          to naturally boost your reproductive health and improve treatment
          success rates.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/free-consultation"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition text-center"
          >
            Book a Consultation
          </Link>
          <Link
            href="/#assessment"
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition text-center"
          >
            Take Free Fertility Assessment
          </Link>
        </div>

        {/* Stats with Counter */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              <CountUp end={70} duration={4} redraw={true} />%+
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Fertility Issues Linked to Lifestyle
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              <CountUp end={10000} duration={4} redraw={true} separator="," />+
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Patients Guided Successfully
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              100% Natural
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Drug-Free, Holistic Approach
            </p>
          </div>
        </div>
      </div>

      {/* =================== SECOND SECTION =================== */}
      <div className="w-full bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Why Lifestyle Matters for{" "}
            <span className="text-blue-600">Fertility Health</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Your daily habits have a{" "}
            <span className="font-medium text-gray-900">direct impact</span> on
            hormone levels, egg and sperm quality, and overall reproductive
            function — making lifestyle changes a{" "}
            <span className="text-gray-800 font-semibold">
              powerful first step
            </span>{" "}
            toward better fertility outcomes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Diet",
              text: "A balanced, nutrient-rich diet directly supports hormonal balance and egg quality.",
            },
            {
              title: "Exercise",
              text: "Moderate physical activity improves blood flow, reduces stress, and regulates cycles.",
            },
            {
              title: "Sleep",
              text: "Poor sleep disrupts reproductive hormones and reduces fertility in both men and women.",
            },
            {
              title: "Stress",
              text: "Chronic stress elevates cortisol levels, which can interfere with ovulation and conception.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-8 bg-[#E5E7EB] rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <h3 className="text-lg sm:text-xl font-bold text-blue-600">
                {card.title}
              </h3>
              <p className="mt-3 text-gray-700 text-sm sm:text-base">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroLifestyleAdvicePage;