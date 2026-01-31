"use client";

import React, { useState } from "react";

const FifthErectileDysfunctionPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Can ED be treated for the long term?",
      answer:
        "Yes. Our approach focuses on treating the root cause rather than just managing symptoms. By addressing underlying health issues, lifestyle factors, and psychological elements, we aim for sustainable, long-term improvement.",
    },
    {
      question: "Is ED a normal part of getting older?",
      answer:
        "No, ED is not a normal part of aging. While it may become more common with age, it usually indicates an underlying issue that can be treated.",
    },
    {
      question: "How private is the treatment process?",
      answer:
        "Your privacy is our top priority. All consultations and treatments are conducted with complete confidentiality.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Journey to Recovery Section */}
      <section className="w-full bg-[#F9FAFB] py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Your Journey to Recovery
          </h2>
          <p className="text-gray-600 mb-12">
            We guide you through a clear, supportive, and effective treatment
            process from start to finish.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Evaluation",
                desc: "Start with a confidential assessment and a detailed consultation with our doctors.",
              },
              {
                number: "2",
                title: "Personalized Plan",
                desc: "Receive a custom treatment plan targeting the root cause of your ED.",
              },
              {
                number: "3",
                title: "Treatment & Monitoring",
                desc: "Begin your treatment with regular follow-ups and continuous care manager support.",
              },
              {
                number: "4",
                title: "Long-Term Wellness",
                desc: "Achieve lasting results with ongoing support and lifestyle guidance.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center transition transform hover:scale-105"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg mx-auto mb-4 transition hover:bg-blue-500 hover:text-white">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-white py-16 px-6 md:px-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#F9FAFB] rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-900 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="ml-2 text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-600 text-sm md:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FifthErectileDysfunctionPage;
