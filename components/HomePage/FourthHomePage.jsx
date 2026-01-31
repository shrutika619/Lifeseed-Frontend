import React from "react";
import { Phone, Notebook, Zap, Leaf, Pill, Activity, Stethoscope } from "lucide-react";

const FourthHomePage = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      {/* Journey Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-2">
          Your Journey with <span className="text-blue-700">MEN10</span>
        </h2>
        <p className="text-center text-gray-500 mb-12">
          A simple, discreet, and effective path to renewed sexual confidence.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">STEP 1 📞</h3>
                <p className="text-gray-500 text-xs">Takes 2–4 mins</p>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Free Call with Expert</h4>
            <p className="text-gray-600 text-sm">
              Discuss your concerns privately with our wellness expert. No judgment, just professional guidance.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Notebook size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">STEP 2 📝</h3>
                <p className="text-gray-500 text-xs">Takes 5 mins</p>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Get Your Custom Plan</h4>
            <p className="text-gray-600 text-sm">
              Based on your consultation, we design a personalized treatment plan with our unique Ayurvedic formulations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">STEP 3 💪</h3>
                <p className="text-gray-500 text-xs">15 days – 3 months</p>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Regain Your Confidence</h4>
            <p className="text-gray-600 text-sm">
              Follow your plan with our continuous support and experience a noticeable improvement in your sexual wellness and confidence.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Pillar Approach */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">
          Our 4-Pillar Approach
        </h2>
        <p className="text-center text-gray-500 mb-12">
          A complete plan for your well-being, made simple.
        </p>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 mb-4">
              <Leaf size={24} />
            </div>
            <h3 className="font-semibold mb-2">Natural Ayurveda</h3>
            <p className="text-gray-600 text-sm">
              Safe, patented herbal formulas made just for you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-pink-100 text-pink-600 mb-4">
              <Pill size={24} />
            </div>
            <h3 className="font-semibold mb-2">Modern Medicine</h3>
            <p className="text-gray-600 text-sm">
              Trusted, science-backed solutions for effective results.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <Activity size={24} />
            </div>
            <h3 className="font-semibold mb-2">Healthy Lifestyle</h3>
            <p className="text-gray-600 text-sm">
              Simple guidance on exercise & habits to boost your energy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-600 mb-4">
              <Stethoscope size={24} />
            </div>
            <h3 className="font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600 text-sm">
              Continuous and private guidance from our expert team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthHomePage;
