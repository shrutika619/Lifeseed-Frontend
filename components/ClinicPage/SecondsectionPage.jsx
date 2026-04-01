import React, { useState } from 'react';
import { ChevronDown, Shield, Target, Heart, Lock } from 'lucide-react';

export default function SecondsectionLifeseedPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I register my fertility clinic on LifeSeed?",
      answer: "Your clinic can register directly through the LifeSeed platform. Once you submit your details, our super admin team will verify and approve your clinic, providing you with a dedicated workspace to manage your doctors, patients, and IVF treatment workflows."
    },
    {
      id: 2,
      question: "Is patient data secure on the LifeSeed platform?",
      answer: "Absolutely. LifeSeed follows strict data privacy and security protocols. Each hospital's data, patient records, and treatment information are fully isolated under our multi-tenant architecture, ensuring complete confidentiality and compliance."
    },
    {
      id: 3,
      question: "What should a patient expect when registering on LifeSeed?",
      answer: "Patients can register under their specific fertility clinic, build their fertility profile, upload medical reports, book appointments, and track their complete IVF treatment progress — all from one secure, easy-to-use dashboard."
    },
    {
      id: 4,
      question: "Can doctors manage their own schedules and treatment plans?",
      answer: "Yes. Doctors have a dedicated module to manage their availability, patient consultations, IVF cycle updates, and treatment plans. The platform is designed to streamline clinical workflows and reduce administrative burden."
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Multi-Tenant Architecture",
      description: "Multiple hospitals and fertility clinics can operate independently on a single secure platform with fully isolated data and workflows."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Complete IVF Workflow",
      description: "From hormonal stimulation and egg retrieval to embryo transfer and pregnancy testing — every stage of IVF is managed in one place."
    },
    {
      icon: <Heart className="w-8 h-8 text-purple-600" />,
      title: "Patient-Centered Care",
      description: "Patients can track their fertility journey, access reports, and stay connected with their care team through a seamless digital experience."
    },
    {
      icon: <Lock className="w-8 h-8 text-red-400" />,
      title: "100% Secure & Confidential",
      description: "Role-based access control ensures that sensitive medical data is only accessible to authorized users — doctors, admins, and patients."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleBookConsultation = () => {
    window.location.href = "/free-consultation";
  };

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Online Consultation Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Can't visit a clinic in person?
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Connect with a Fertility Specialist Online
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                LifeSeed connects you with verified IVF doctors and fertility
                specialists from the comfort of your home. Book a confidential
                online consultation, share your reports digitally, and get a
                personalized fertility care plan — all through one secure platform.
              </p>
              <button
                onClick={handleBookConsultation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors"
              >
                Book Your Online Consultation
              </button>
            </div>

            <div className="flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop"
                  alt="Online fertility consultation"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose LifeSeed Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Why Choose LifeSeed?
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            A unified cloud-based platform purpose-built for IVF clinics,
            fertility specialists, and patients — all in one secure ecosystem.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="mb-4 flex justify-center">
                  <div className="bg-gray-50 p-4 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFaq === faq.id && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}