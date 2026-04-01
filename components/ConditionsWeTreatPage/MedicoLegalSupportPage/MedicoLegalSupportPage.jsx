import React from "react";
import Link from "next/link";
import {
  FileText,
  Scale,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  PhoneCall,
} from "lucide-react";

const sections = [
  {
    icon: Scale,
    title: "Legal Consultation",
    description:
      "Get expert legal advice tailored to fertility and reproductive healthcare cases. Our team guides you through consent laws, donor agreements, and patient rights in assisted reproduction.",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Documentation Support",
    description:
      "We assist in preparing accurate and legally compliant medical documentation including IVF consent forms, donor contracts, surrogacy agreements, and treatment records.",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Patient Rights & Ethics",
    description:
      "Understand your rights as a fertility patient. We ensure that all treatments at LifeSeed adhere to ethical medical standards and regulatory guidelines set by Indian reproductive law.",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: ClipboardList,
    title: "Case Review & Analysis",
    description:
      "Our experts provide thorough review of complex medico-legal situations arising during or after fertility treatment — including failed cycles, complications, or disputes.",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: UserCheck,
    title: "Donor & Surrogacy Agreements",
    description:
      "Legal frameworks for egg donation, sperm donation, and surrogacy arrangements are carefully drafted and reviewed to protect all parties involved as per ART regulations in India.",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: PhoneCall,
    title: "24/7 Medico-Legal Helpline",
    description:
      "Have an urgent medico-legal concern? Our dedicated helpline connects you with experienced fertility law consultants who provide prompt, confidential, and professional support.",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

const MedicoLegalSupportPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F3F6FF] to-white py-16 px-6 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
          Medico Legal Support
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Protecting Your Rights at Every{" "}
          <span className="text-blue-700">Fertility Step</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          LifeSeed provides comprehensive medico-legal guidance to ensure your
          fertility journey is safe, ethical, and legally protected — from
          consultation to parenthood.
        </p>
      </section>

      {/* 6 Service Cards */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Our Medico-Legal Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${item.bg} rounded-2xl p-6 shadow-sm hover:shadow-md transition`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon size={24} className={item.iconColor} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-[#F3F6FF] py-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Why Medico-Legal Support Matters in Fertility Care
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
            Fertility treatments involve deeply personal decisions, complex
            medical procedures, and significant legal considerations. Without
            proper legal guidance, patients may face challenges around donor
            agreements, consent, surrogacy laws, or disputes with clinics.
          </p>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            At LifeSeed, we believe that every patient deserves clarity,
            transparency, and legal protection throughout their journey. Our
            medico-legal team works alongside our clinical experts to ensure
            your rights are upheld at every stage.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          {[
            {
              step: "01",
              title: "Book a Consultation",
              desc: "Schedule a free medico-legal consultation with our fertility law expert.",
            },
            {
              step: "02",
              title: "Case Assessment",
              desc: "Our team reviews your situation and identifies the legal support required.",
            },
            {
              step: "03",
              title: "Guided Resolution",
              desc: "Receive personalised legal documentation, advice, and ongoing support.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Banner */}
      <section className="bg-blue-700 py-12 px-6 md:px-20 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Fully Compliant with ART & ICMR Guidelines
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
          All medico-legal services at LifeSeed strictly follow the Assisted
          Reproductive Technology (ART) Regulation Act and ICMR guidelines to
          ensure safe, ethical, and lawful fertility care for every patient.
        </p>
        <Link
          href="/free-consultation"
          className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Get Legal Guidance Today
        </Link>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: "Is surrogacy legal in India?",
              a: "Yes, altruistic surrogacy is legal in India under the Surrogacy (Regulation) Act 2021. Commercial surrogacy is prohibited. LifeSeed ensures all surrogacy arrangements comply with current Indian law.",
            },
            {
              q: "What documents are needed for egg donation?",
              a: "Egg donation requires informed consent forms, donor-recipient agreements, medical screening reports, and legal contracts as per ART Regulation Act guidelines.",
            },
            {
              q: "Can I get legal help if my IVF cycle had complications?",
              a: "Yes. Our medico-legal team reviews complications, assesses liability, and provides guidance on the appropriate course of action including mediation or formal complaint procedures.",
            },
            {
              q: "Are my medical records and legal documents kept confidential?",
              a: "Absolutely. LifeSeed maintains 100% confidentiality of all patient records and legal documents in compliance with data protection regulations.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-2">
                {item.q}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default MedicoLegalSupportPage;