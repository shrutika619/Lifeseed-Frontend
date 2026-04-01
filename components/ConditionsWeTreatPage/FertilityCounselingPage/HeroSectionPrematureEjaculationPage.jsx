import React from "react";
import Link from "next/link";

const HeroSectionFertilityCounselingPage = () => {
  return (
    <section>
      {/* ================= HERO SECTION ================= */}
      <div
        className="px-6 md:px-20 py-16"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Fertility Counseling &{" "}
            <span className="text-blue-600">Emotional Support</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">
            Navigate your fertility journey with clarity and confidence. Our
            expert counselors provide compassionate, personalized support with a{" "}
            <span className="font-semibold">92% patient satisfaction rate</span>
            , helping you make informed decisions every step of the way.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/free-consultation"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition w-full sm:w-auto shadow-sm text-center"
            >
              Free Consultation
            </Link>
            <Link
              href="/#assessment"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition w-full sm:w-auto text-center"
            >
              Take Self-Assessment
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-col md:flex-row justify-center gap-12 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">1 in 6</p>
            <p className="text-gray-600 text-base mt-1">
              couples face fertility challenges
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">1–3 Sessions</p>
            <p className="text-gray-600 text-base mt-1">
              to build your personalized plan
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">8000+</p>
            <p className="text-gray-600 text-base mt-1">Patients Supported</p>
          </div>
        </div>
      </div>

      {/* ================= SECOND SECTION ================= */}
      <div className="px-6 md:px-20 py-16 bg-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            You Don&apos;t Have to Face This Alone
          </h2>
          <p className="mt-3 text-gray-600 text-base md:text-lg">
            The emotional toll of fertility struggles is real, yet many couples
            suffer in silence. Fertility counseling bridges the gap between
            medical treatment and emotional well-being.
          </p>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <p className="text-blue-600 font-bold text-xl md:text-2xl">
              60% of Couples
            </p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              undergoing fertility treatment report significant emotional
              distress and anxiety throughout the process.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <p className="text-blue-600 font-bold text-xl md:text-2xl">
              Only 20%
            </p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              of those struggling with fertility seek professional counseling,
              despite it significantly improving treatment outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionFertilityCounselingPage;