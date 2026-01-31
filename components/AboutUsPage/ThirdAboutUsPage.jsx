import React from "react";

const ThirdAboutUsPage = () => {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto text-center px-6">
        {/* Heading */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-12">
          Meet the Founders
        </h2>

        {/* Founder Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Dr. Aditya */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
              Dr. Aditya
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-900">
              Dr. Aditya Aswar
            </h3>
            <p className="text-sm text-gray-500 mb-3">MBBS</p>
            <p className="text-sm text-gray-600 max-w-xs">
              “Dr. Aswar combines clinical experience with personalized care,
              focusing on each patient’s unique health needs.”
            </p>
          </div>

          {/* Dr. Surabh */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
              Dr. Surabh
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-900">
              Dr. Surabh Moon
            </h3>
            <p className="text-sm text-gray-500 mb-3">Ayurvedacharya</p>
            <p className="text-sm text-gray-600 max-w-xs">
              “Dr. Moon specializes in preventive healthcare and wellness using
              Ayurvedic medicine. He guides patients toward natural lifestyle
              changes for better health and balance.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdAboutUsPage;
