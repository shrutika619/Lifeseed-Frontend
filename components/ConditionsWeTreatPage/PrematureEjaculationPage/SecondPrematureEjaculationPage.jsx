import React from "react";
import { Heart, Brain, Activity } from "lucide-react"; // Icons for cards

const SecondPrematureEjaculationPage = () => {
  return (
    <section className="w-full">
      {/* =================== WHAT CAUSES SECTION =================== */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16 bg-[#F9FAFB]">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            What Causes Premature Ejaculation?
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base md:text-lg">
            PE is a complex issue with interconnected physical, psychological,
            and lifestyle roots. Understanding the cause is the first step
            toward lasting control.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-5 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Physical/Physiological
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
              <li>Serotonin imbalance</li>
              <li>Penile hypersensitivity</li>
              <li>Hormonal factors (thyroid, testosterone)</li>
              <li>Inflammation or infection</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-5 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Psychological
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
              <li>Anxiety & stress</li>
              <li>Performance pressure</li>
              <li>Excessive masturbation</li>
              <li>Past negative experiences</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-5 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Lifestyle Factors
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
              <li>Excessive alcohol use</li>
              <li>Poor diet & nutrition</li>
              <li>Sedentary habits</li>
              <li>Smoking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* =================== WHY OUR SOLUTION SECTION =================== */}
      <section className="w-full bg-white py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Why Our Ayurvedic Solution <span className="text-blue-600">Works</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            MED10’s proprietary Ayurvedic medicines are designed to treat the
            root causes of PE naturally. By balancing key neurotransmitters,
            reducing hypersensitivity, and calming the nervous system, our
            herbal formulations help you regain control and restore sexual
            vitality without harmful side effects.
          </p>
          <p className="mt-6 text-gray-800 text-sm sm:text-base md:text-lg font-medium">
            Our integrated approach delivers a{" "}
            <span className="text-blue-600 font-semibold">97% success rate</span>.
          </p>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            We complement our powerful herbal remedies with guidance on yoga,
            pelvic floor exercises, and counseling to ensure a truly holistic
            recovery.
          </p>
        </div>
      </section>
    </section>
  );
};

export default SecondPrematureEjaculationPage;
