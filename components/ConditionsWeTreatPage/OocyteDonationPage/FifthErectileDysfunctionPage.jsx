"use client";

import React, { useState } from "react";

const FifthOocyteDonationPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Who is eligible to receive donor oocytes?",
      answer:
        "Women with premature ovarian failure, poor ovarian reserve, repeated IVF failures, or those carrying genetic conditions may be eligible for oocyte donation. Our specialists conduct a thorough evaluation to determine the best path forward for each individual.",
    },
    {
      question: "Is the donor identity kept confidential?",
      answer:
        "Yes. We follow strict anonymity protocols as per legal and ethical guidelines. Donor and recipient identities are kept completely confidential throughout the entire process.",
    },
    {
      question: "How successful is oocyte donation compared to regular IVF?",
      answer:
        "Oocyte donation generally has higher success rates than conventional IVF, especially for women with poor egg quality or low ovarian reserve, as the eggs come from thoroughly screened, healthy young donors.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Journey Section */}
      <section className="w-full bg-[#F9FAFB] py-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Your Oocyte Donation Journey
          </h2>
          <p className="text-gray-600 mb-12">
            We guide you through every step of the oocyte donation process with
            compassion, clarity, and expert clinical support.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Screening & Matching",
                desc: "Begin with a confidential medical assessment and get matched with a compatible, thoroughly screened donor.",
              },
              {
                number: "2",
                title: "Preparation Protocol",
                desc: "Receive a personalized hormonal preparation plan to ready your uterus for embryo transfer.",
              },
              {
                number: "3",
                title: "Retrieval & Fertilization",
                desc: "Donor eggs are retrieved and fertilized with your partner's or donor sperm under expert laboratory care.",
              },
              {
                number: "4",
                title: "Transfer & Support",
                desc: "Undergo embryo transfer with continuous monitoring and emotional support throughout your two-week wait.",
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

export default FifthOocyteDonationPage;