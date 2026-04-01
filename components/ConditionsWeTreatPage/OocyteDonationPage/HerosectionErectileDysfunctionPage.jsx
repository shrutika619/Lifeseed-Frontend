import React from "react";
import Link from "next/link";

const HeroSectionOocyteDonationPage = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto text-center px-6">
        {/* Badge */}
        <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-4 py-1 rounded-full mb-5 uppercase tracking-wide">
          Oocyte Donation Programme
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Oocyte Donation —{" "}
          <span className="text-blue-600">A Path to Parenthood</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          When your own eggs are not an option, donor oocytes offer a
          scientifically proven and compassionate pathway to pregnancy.
          LifeSeed connects you with thoroughly screened donors and
          expert clinical care every step of the way.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/free-consultation"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Book Consultation
          </Link>
          <Link
            href="/#assessment"
            className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 transition"
          >
            Take Self-Assessment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">85%+</h3>
            <p className="text-gray-600">Pregnancy Success Rate</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-600">Screened Donors Available</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">100%</h3>
            <p className="text-gray-600">Confidential & Ethical</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionOocyteDonationPage;