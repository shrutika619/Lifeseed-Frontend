"use client";
import React, { useState } from "react";

const FourthLowSpermCountPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the normal sperm count range?",
      answer:
        "According to the WHO, a normal sperm count is 15 million or more sperm per milliliter of semen. For optimal fertility, higher counts—especially above 40 million/mL—are associated with better chances of conception.",
    },
    {
      question: "How does Ayurveda increase sperm count?",
      answer:
        "Ayurveda uses natural herbs like Ashwagandha, Safed Musli, and Shatavari along with dietary and lifestyle adjustments to boost sperm health, vitality, and overall reproductive wellness without side effects.",
    },
    {
      question: "Can sperm motility and morphology also be improved?",
      answer:
        "Yes. Along with sperm count, Ayurveda improves motility (movement) and morphology (shape) by rejuvenating Shukra Dhatu (reproductive tissue) and reducing oxidative stress.",
    },
    {
      question: "What if I have varicocele?",
      answer:
        "Mild varicocele cases can be supported with Ayurvedic therapies and lifestyle changes. Severe cases may require surgical or combined treatment approaches.",
    },
  ];

  return (
    <section className="w-full">
      {/* =================== CLINICAL SUCCESS SECTION =================== */}
      <div className="bg-[#F9FAFB] py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Clinical Success & Results
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Our results speak for themselves. We have a proven track record of
            helping men restore their fertility, even in cases with extremely
            low sperm counts.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">
              Case Study 1
            </h4>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              From 0.8 million/ml to 42 million/ml
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              "Patient A came to us with a severely low sperm count. After just
              45 days of our personalized Ayurvedic treatment and lifestyle
              plan, his count increased to a healthy, fertile level, with
              improved motility."
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">
              Our Success Metrics
            </h4>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              86% Success Rate
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              in patients without congenital conditions like varicocele. We have
              successfully treated over 1,000 men with high satisfaction and no
              major side effects reported.
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

export default FourthLowSpermCountPage;
