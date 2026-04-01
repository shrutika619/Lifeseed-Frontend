"use client";
import React, { useState } from "react";

const FourthLifestyleAdvicePage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How quickly can lifestyle changes improve fertility?",
      answer:
        "Many patients notice improvements in hormone levels, energy, and cycle regularity within 4–8 weeks of consistent lifestyle changes. Egg and sperm quality can improve over a 3-month period, as that is the full maturation cycle for both.",
    },
    {
      question: "Does diet really affect egg and sperm quality?",
      answer:
        "Yes. A nutrient-rich diet high in antioxidants, folate, zinc, and omega-3 fatty acids has been clinically shown to improve egg quality, sperm motility, and overall reproductive function in both men and women.",
    },
    {
      question: "Can stress alone cause infertility?",
      answer:
        "Chronic stress elevates cortisol levels, which can disrupt the hormonal signals needed for ovulation and sperm production. While stress alone may not cause permanent infertility, it significantly impacts fertility outcomes and treatment success rates.",
    },
    {
      question: "Is exercise beneficial or harmful for fertility?",
      answer:
        "Moderate exercise — such as walking, yoga, or swimming for 30 minutes a day — is highly beneficial for fertility. However, excessive high-intensity workouts can disrupt hormone levels and menstrual cycles, so balance is key.",
    },
  ];

  return (
    <section className="w-full">
      {/* =================== SUCCESS STORIES SECTION =================== */}
      <div className="bg-[#F9FAFB] py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Real Results from Lifestyle Changes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Our lifestyle guidance program has helped thousands of individuals
            and couples improve their fertility naturally — with no medications
            and no invasive procedures.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">
              Success Story
            </h4>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Hormonal Balance Restored in 60 Days
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              "A patient with irregular cycles and high stress levels followed
              our personalized nutrition and mindfulness plan. Within 60 days,
              her hormone levels normalized and she resumed regular ovulation
              naturally."
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">
              Our Success Metrics
            </h4>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              78% Show Improved Fertility Markers
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Among patients who followed our structured lifestyle advice
              program for 90 days, 78% showed measurable improvement in
              hormonal balance, BMI, and reproductive health markers with no
              reported side effects.
            </p>
          </div>
        </div>
      </div>

      {/* =================== FAQ SECTION =================== */}
      <div className="w-full bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordions */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#F9FAFB] border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-gray-100"
              >
                {faq.question}
                <span className="ml-2 text-blue-600">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm sm:text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourthLifestyleAdvicePage;