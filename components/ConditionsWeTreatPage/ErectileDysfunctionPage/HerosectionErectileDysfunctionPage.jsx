import React from "react";

const HerosectionErectileDysfunctionPage = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto text-center px-6">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Erectile Dysfunction{" "}
          <span className="text-blue-600">Treatment</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          We address the root cause of ED with personalized, science-backed
          treatments to restore your confidence and ensure long-term wellness.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <a
            href="/free-consultation"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Book Consultation
          </a>
          <a
            href="#self-assessment"
            className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 transition"
          >
            Take Self-Assessment
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">93%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">15,000+</h3>
            <p className="text-gray-600">Men Treated</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">2 Weeks</h3>
            <p className="text-gray-600">Recovery Begins In</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HerosectionErectileDysfunctionPage;
