"use client";
import React, { useState } from "react";
import CountUp from "react-countup";
import Link from "next/link";
import { Heart, Brain, Users, Leaf, Dumbbell, Search, ClipboardCheck } from "lucide-react";

const CouplesCounselingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What issues does couples counseling address?",
      answer:
        "Couples counseling addresses a wide range of issues including communication breakdown, intimacy concerns, grief after pregnancy loss, differing expectations around fertility treatment, emotional distance, and relationship strain caused by infertility stress.",
    },
    {
      question: "Do both partners need to attend sessions?",
      answer:
        "While joint sessions are highly recommended for the best outcomes, we also offer individual sessions for partners who need personal space to process their emotions before engaging in couples work.",
    },
    {
      question: "How many sessions will we need?",
      answer:
        "The number of sessions varies depending on the couple's needs. Most couples begin to see meaningful progress within 4–6 sessions. Our counselors will work with you to design a plan that fits your pace and goals.",
    },
    {
      question: "Is everything we share kept confidential?",
      answer:
        "Absolutely. All sessions are conducted with complete confidentiality. Nothing shared in sessions is disclosed to anyone, including your medical team, without your explicit consent.",
    },
  ];

  return (
    <section className="w-full">

      {/* =================== SECTION 1 — HERO =================== */}
      <div className="text-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-[#F9FAFB]">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
          Couples Counseling for{" "}
          <span className="bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] bg-clip-text text-transparent">
            Fertility & <br /> Relationship Wellness
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Fertility struggles can strain even the strongest relationships. Our
          expert couples counselors provide a{" "}
          <span className="font-semibold text-gray-900">
            safe, compassionate space
          </span>{" "}
          to help you and your partner reconnect, communicate, and face the
          journey together.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/free-consultation"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition text-center"
          >
            Book a Consultation
          </Link>
          <Link
            href="/#assessment"
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition text-center"
          >
            Take Free Assessment
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              <CountUp end={90} duration={4} redraw={true} />%+
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Couples Report Improved Communication
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              <CountUp end={6000} duration={4} redraw={true} separator="," />+
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Couples Supported Successfully
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              100% Confidential
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Safe, Judgment-Free Sessions
            </p>
          </div>
        </div>
      </div>

      {/* =================== SECTION 2 — WHY COUPLES STRUGGLE =================== */}
      <div className="bg-white py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Why Fertility Strains{" "}
            <span className="text-blue-600">Relationships</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            The emotional weight of infertility affects both partners differently.
            Recognizing these pressure points is the first step toward healing
            together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-blue-600 w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-900">
                Emotional Distance
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Grief processed differently by each partner</li>
              <li>Withdrawal & emotional shutdown</li>
              <li>Feeling misunderstood or unsupported</li>
              <li>Loss of shared joy & intimacy</li>
            </ul>
          </div>

          <div className="p-6 bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-blue-600 w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-900">
                Communication Breakdown
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Avoiding difficult conversations</li>
              <li>Blame and resentment patterns</li>
              <li>Differing coping styles</li>
              <li>Unspoken fears and expectations</li>
            </ul>
          </div>

          <div className="p-6 bg-[#F9FAFB] rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-600 w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-900">
                External Pressures
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Family & social expectations</li>
              <li>Financial stress of treatment</li>
              <li>Workplace & lifestyle disruption</li>
              <li>Isolation from social circles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* =================== SECTION 3 — OUR APPROACH =================== */}
      <div className="bg-[#F9FAFB] py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our Approach to{" "}
            <span className="text-blue-600">Couples Counseling</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            We offer a structured, compassionate counseling experience designed
            specifically for couples navigating fertility challenges together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-6 sm:p-8 flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Search size={22} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl">
                Comprehensive Relationship Assessment
              </h3>
              <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
                We begin with a thorough understanding of each partner's
                emotional state, communication style, and relationship dynamics.
                This helps us tailor every session to address your specific
                challenges and goals as a couple.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-6 sm:p-8 flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ClipboardCheck size={22} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl">
                Personalised Counseling & Support Plan
              </h3>
              <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
                Based on your assessment, we create a bespoke counseling plan
                combining CBT, emotionally focused therapy, and mindfulness
                techniques — helping you rebuild connection, manage stress, and
                make aligned decisions throughout your fertility journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================== SECTION 4 — JOURNEY + PILLARS =================== */}
      <div className="bg-white py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Your Couples Counseling Journey
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            A clear, supportive path from your first session to lasting
            relationship wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center mb-16">
          {[
            { number: "1", title: "Initial Consultation", desc: "A confidential session to understand your relationship and fertility journey so far." },
            { number: "2", title: "Needs Assessment", desc: "Identifying emotional, communicative, and relational areas that need support." },
            { number: "3", title: "Tailored Sessions", desc: "Regular joint and individual sessions using proven therapeutic techniques." },
            { number: "4", title: "Lasting Wellness", desc: "Ongoing tools, resources, and follow-up support for long-term relationship strength." },
          ].map((step, index) => (
            <div key={index} className="text-center transition transform hover:scale-105">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg mx-auto mb-4 hover:bg-blue-500 hover:text-white transition">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: <Leaf className="text-blue-600 w-8 h-8" />, title: "Therapeutic Techniques", desc: "CBT, emotionally focused therapy, and mindfulness tailored to fertility-related stress." },
            { icon: <Dumbbell className="text-blue-600 w-8 h-8" />, title: "Wellness Practices", desc: "Guided breathing, relaxation, and lifestyle strategies to reduce anxiety together." },
            { icon: <Users className="text-blue-600 w-8 h-8" />, title: "Group & Peer Support", desc: "Connect with other couples through facilitated support groups and shared experiences." },
          ].map((card, i) => (
            <div key={i} className="p-6 bg-[#F9FAFB] rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
              <div className="flex justify-center mb-3">{card.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">{card.title}</h3>
              <p className="text-gray-600 text-sm text-center mt-2">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =================== SECTION 5 — FAQ =================== */}
      <div className="w-full bg-[#F9FAFB] py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-gray-50"
              >
                {faq.question}
                <span className="ml-2 text-blue-600 text-xl">
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

export default CouplesCounselingPage;