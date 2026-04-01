import React from "react";
import { Phone, Notebook, Zap, Leaf, Pill, Activity, Stethoscope } from "lucide-react";

const FourthHomePage = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      {/* Journey Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-2">
          Your Journey with <span className="text-blue-700">LifeSeed</span>
        </h2>
        <p className="text-center text-gray-500 mb-12">
          A simple, private, and compassionate path to your fertility and wellness goals.
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
            <h4 className="font-semibold mb-2">Free Fertility Consultation</h4>
            <p className="text-gray-600 text-sm">
              Speak privately with our fertility expert. Share your concerns confidentially and get honest, professional guidance on your path forward.
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
            <h4 className="font-semibold mb-2">Your Personalised Treatment Plan</h4>
            <p className="text-gray-600 text-sm">
              Based on your assessment and consultation, our specialists design a customised IVF or fertility care plan tailored to your unique needs.
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
                <p className="text-gray-500 text-xs">Ongoing support</p>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Begin Your Fertility Journey</h4>
            <p className="text-gray-600 text-sm">
              Start your treatment with continuous expert support at every stage — from diagnosis to embryo transfer and beyond.
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
          Comprehensive fertility care built on science, compassion, and trust.
        </p>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 mb-4">
              <Leaf size={24} />
            </div>
            <h3 className="font-semibold mb-2">Advanced IVF Care</h3>
            <p className="text-gray-600 text-sm">
              State-of-the-art IVF, IUI, and ICSI treatments with the latest reproductive technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-pink-100 text-pink-600 mb-4">
              <Pill size={24} />
            </div>
            <h3 className="font-semibold mb-2">Evidence-Based Medicine</h3>
            <p className="text-gray-600 text-sm">
              Clinically proven protocols and treatments backed by the latest fertility research.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <Activity size={24} />
            </div>
            <h3 className="font-semibold mb-2">Lifestyle & Wellness</h3>
            <p className="text-gray-600 text-sm">
              Personalised nutrition, lifestyle, and wellness guidance to naturally improve your fertility outcomes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-600 mb-4">
              <Stethoscope size={24} />
            </div>
            <h3 className="font-semibold mb-2">End-to-End Support</h3>
            <p className="text-gray-600 text-sm">
              Dedicated counselling and emotional support from consultation through to pregnancy and beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthHomePage;