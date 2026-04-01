import React from "react";
import Link from "next/link";
import {
  Snowflake,
  FlaskConical,
  ShieldCheck,
  UserCheck,
  ClipboardList,
  PhoneCall,
} from "lucide-react";

const sections = [
  {
    icon: Snowflake,
    title: "Sperm Freezing & Preservation",
    description:
      "Preserve your fertility with advanced sperm cryopreservation technology. Ideal for men undergoing chemotherapy, radiation, or surgery that may affect future fertility.",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: FlaskConical,
    title: "Semen Analysis & Quality Testing",
    description:
      "Comprehensive semen analysis to assess sperm count, motility, morphology, and overall quality — helping you understand your fertility health before banking.",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Long-Term Storage",
    description:
      "Your samples are stored in state-of-the-art cryogenic tanks under strict quality control, ensuring viability and safety for years to come with complete confidentiality.",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: UserCheck,
    title: "Donor Sperm Supply",
    description:
      "Access our carefully screened and ethically sourced donor sperm bank. All donors undergo rigorous medical, genetic, and psychological screening as per ART guidelines.",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: ClipboardList,
    title: "Pre-Treatment Banking",
    description:
      "Planning a vasectomy or facing a medical condition that may reduce sperm production? Bank your sperm before treatment to safeguard your future family planning options.",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: PhoneCall,
    title: "Expert Fertility Counselling",
    description:
      "Our fertility specialists guide you through every aspect of semen banking — from the initial consultation to storage plans, usage, and assisted reproduction options.",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

const SemenBankingandSupplyPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F3F6FF] to-white py-16 px-6 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
          Semen Banking & Supply
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Secure Your Future{" "}
          <span className="text-blue-700">Fertility Today</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          LifeSeed offers advanced semen banking and donor sperm supply services
          with the highest standards of safety, confidentiality, and clinical
          excellence — giving you control over your fertility journey.
        </p>
      </section>

      {/* 6 Service Cards */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Our Semen Banking Services
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

      {/* Why Bank Your Sperm */}
      <section className="bg-[#F3F6FF] py-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Why Consider Semen Banking?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
            Life is unpredictable. Medical treatments, age, occupational
            hazards, or health conditions can impact male fertility over time.
            Semen banking gives you the peace of mind that your fertility is
            preserved — on your terms, at the right time.
          </p>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Whether you are planning for the future, undergoing medical
            treatment, or exploring assisted reproduction, LifeSeed's semen
            banking programme provides a safe and reliable solution backed by
            cutting-edge cryopreservation technology.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          {[
            {
              step: "01",
              title: "Book a Consultation",
              desc: "Speak with our fertility specialist to understand your semen banking options and create a personalised plan.",
            },
            {
              step: "02",
              title: "Sample Collection & Analysis",
              desc: "Provide your sample at our clinic. It is analysed for quality and then cryopreserved using advanced freezing protocols.",
            },
            {
              step: "03",
              title: "Safe Storage & Future Use",
              desc: "Your sample is stored securely in our facility and can be used whenever you are ready for assisted reproduction.",
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

      {/* CTA Banner */}
      <section className="bg-blue-700 py-12 px-6 md:px-20 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Start Your Semen Banking Journey with LifeSeed
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
          Our team of fertility experts is ready to guide you through every
          step — from consultation to long-term storage and beyond. Take the
          first step towards securing your fertility today.
        </p>
        <Link
          href="/free-consultation"
          className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Book a Free Consultation
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
              q: "How long can sperm be stored?",
              a: "Sperm can be cryopreserved and stored for many years — in some cases up to 10 years or more — without significant loss of viability, subject to regulatory guidelines.",
            },
            {
              q: "Who should consider semen banking?",
              a: "Men facing cancer treatment, vasectomy, high-risk occupations, declining sperm quality, or those simply wanting to preserve fertility for future family planning should consider banking.",
            },
            {
              q: "Is donor sperm safe to use?",
              a: "Yes. All donor sperm at LifeSeed is sourced from thoroughly screened donors who undergo genetic, infectious disease, and psychological testing as per ART Regulation Act standards.",
            },
            {
              q: "Is the process confidential?",
              a: "Absolutely. All semen banking and donor supply services at LifeSeed are handled with complete privacy and strict data confidentiality.",
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

export default SemenBankingandSupplyPage;