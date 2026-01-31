"use client";
import React from "react";
import CountUp from "react-countup";

const HeroLowSpermCountPage = () => {
  return (
    <section className="w-full">
      {/* =================== HERO SECTION =================== */}
      <div className="text-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-[#F9FAFB]">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
          Low Sperm Count{" "}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] bg-clip-text text-transparent">
            Treatment <br /> (Oligospermia)
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Revive fertility naturally—restore healthy sperm count without side
          effects. Our Ayurvedic therapies have helped thousands regain normal
          sperm count with an{" "}
          <span className="font-semibold text-gray-900">86% success rate</span>{" "}
          within 45 days.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition">
            Book a Consultation
          </button>
          <button className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">
            Take Free Fertility Assessment
          </button>
        </div>

        {/* Stats with Counter */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              <CountUp end={40} duration={4} redraw={true} />+ million/ml
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Is a Normal Sperm Count
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              <CountUp end={40} duration={4} redraw={true} />+ million
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Patient Recoveries We’ve Seen
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              100% Natural
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Non-Invasive, Lasting Results
            </p>
          </div>
        </div>
      </div>

      {/* =================== SECOND SECTION =================== */}
      <div className="w-full bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            A Major Factor in{" "}
            <span className="text-blue-600">Male Infertility</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Low sperm count is a{" "}
            <span className="font-medium text-gray-900">primary reason</span> for
            infertility in couples, and its prevalence is{" "}
            <span className="text-gray-800 font-semibold">rising</span> due to
            modern lifestyle and environmental pressures.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { title: "1 in 6", text: "couples experience infertility." },
            { title: "40–50%", text: "of cases involve male factors." },
            { title: "<15 mil/ml", text: "is low sperm count (WHO)." },
            {
              title: "Rising",
              text: "due to lifestyle & environmental risks.",
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

export default HeroLowSpermCountPage;
