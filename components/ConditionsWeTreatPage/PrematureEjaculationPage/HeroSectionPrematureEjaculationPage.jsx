import React from "react";

const HeroSectionPrematureEjaculationPage = () => {
  return (
    <section>
      {/* ================= HERO SECTION ================= */}
      <div
        className="px-6 md:px-20 py-16"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Premature Ejaculation{" "}
            <span className="text-blue-600">Treatment</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">
            Restore control and confidence—naturally and effectively. Our
            Ayurvedic-rooted approach offers long-term results with{" "}
            <span className="font-semibold">91% effectiveness</span>, all at an
            affordable price.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition w-full sm:w-auto shadow-sm">
              Free Consultation
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition w-full sm:w-auto">
              Take Self-Assessment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-col md:flex-row justify-center gap-12 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">30%</p>
            <p className="text-gray-600 text-base mt-1">
              of men experience PE
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">4–6 Weeks</p>
            <p className="text-gray-600 text-base mt-1">Recovery Begins</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">7000+</p>
            <p className="text-gray-600 text-base mt-1">Patients Helped</p>
          </div>
        </div>
      </div>

      {/* ================= SECOND SECTION ================= */}
      <div className="px-6 md:px-20 py-16 bg-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            It&apos;s More Common Than You Think
          </h2>
          <p className="mt-3 text-gray-600 text-base md:text-lg">
            PE is the most common sexual dysfunction in men, yet many hesitate
            to seek help due to stigma. You&apos;re not alone in this journey.
          </p>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <p className="text-blue-600 font-bold text-xl md:text-2xl">
              1 in 3 Men
            </p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              report experiencing premature ejaculation at some point in their
              lives.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <p className="text-blue-600 font-bold text-xl md:text-2xl">
              Only 9%
            </p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              of men with PE actually seek treatment, often due to embarrassment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionPrematureEjaculationPage;
