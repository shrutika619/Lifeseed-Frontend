import React from "react";
import { Leaf, Dumbbell, Users } from "lucide-react"; // icons for cards

const ThirdPrematureEjaculationPage = () => {
  return (
    <section className="w-full">
      {/* =================== OUR INTEGRATED TREATMENT APPROACH =================== */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16 bg-[#F9FAFB]">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            Our Integrated Treatment Approach
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-center mb-3">
              <Leaf className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Herbal Remedies
            </h3>
            <p className="text-gray-600 text-sm text-center mt-2">
              Tailored Ayurvedic formulations to address your specific root
              causes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-center mb-3">
              <Dumbbell className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Exercise & Lifestyle
            </h3>
            <p className="text-gray-600 text-sm text-center mt-2">
              Guidance on pelvic floor exercises (Kegels), yoga, and diet.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-center mb-3">
              <Users className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Counseling & Support
            </h3>
            <p className="text-gray-600 text-sm text-center mt-2">
              Managing stress, improving communication, and boosting confidence.
            </p>
          </div>
        </div>
      </div>

      {/* =================== YOUR TREATMENT JOURNEY =================== */}
      <div className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            Your Treatment Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-5xl mx-auto text-center">
          {/* Step 1 */}
          <div>
            <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-blue-50 text-blue-600 font-bold text-lg hover:border hover:border-blue-600 hover:shadow-md transition">
              1
            </div>
            <p className="mt-3 text-gray-700 text-sm sm:text-base font-medium">
              Confidential Consultation
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-blue-50 text-blue-600 font-bold text-lg hover:border hover:border-blue-600 hover:shadow-md transition">
              2
            </div>
            <p className="mt-3 text-gray-700 text-sm sm:text-base font-medium">
              Root-Cause Diagnosis
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-blue-50 text-blue-600 font-bold text-lg hover:border hover:border-blue-600 hover:shadow-md transition">
              3
            </div>
            <p className="mt-3 text-gray-700 text-sm sm:text-base font-medium">
              Personalised Ayurvedic Plan
            </p>
          </div>

          {/* Step 4 */}
          <div>
            <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-blue-50 text-blue-600 font-bold text-lg hover:border hover:border-blue-600 hover:shadow-md transition">
              4
            </div>
            <p className="mt-3 text-gray-700 text-sm sm:text-base font-medium">
              Monitoring & Regular Follow-Up
            </p>
          </div>

          {/* Step 5 */}
          <div>
            <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-blue-50 text-blue-600 font-bold text-lg hover:border hover:border-blue-600 hover:shadow-md transition">
              5
            </div>
            <p className="mt-3 text-gray-700 text-sm sm:text-base font-medium">
              Long-Term Wellness
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdPrematureEjaculationPage;
