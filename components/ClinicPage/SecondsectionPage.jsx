import React, { useState } from 'react';
import { ChevronDown, Shield, Target, Heart, Lock } from 'lucide-react';

export default function SecondsectionPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I book a consultation?",
      answer: "You can book a consultation directly by clicking the 'Book Now' button on any clinic card or by booking a free online consultation. You can also call the clinic directly to schedule your appointment."
    },
    {
      id: 2,
      question: "Is my consultation confidential?",
      answer: "Yes, absolutely. All consultations are completely confidential and private. We follow strict privacy protocols to protect your personal health information."
    },
    {
      id: 3,
      question: "What should I expect during my first visit?",
      answer: "During your first visit, our expert doctors will discuss your concerns in detail, perform any necessary examinations, and create a personalized treatment plan tailored to your needs."
    },
    {
      id: 4,
      question: "Do I need to book an appointment in advance?",
      answer: "While walk-ins are welcome, we highly recommend booking an appointment in advance to ensure minimal wait time and guaranteed availability with our specialists."
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Expert Ayurvedic Doctors",
      description: "Our doctors specialize in men's health and have years of experience in diagnosing and treating various conditions."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "83% Success Rate",
      description: "Our treatment plans are backed by proven results, ensuring long-lasting and effective results."
    },
    {
      icon: <Heart className="w-8 h-8 text-purple-600" />,
      title: "Holistic Approach",
      description: "We take a natural, comprehensive approach to men's health, combining ancient wisdom with modern science."
    },
    {
      icon: <Lock className="w-8 h-8 text-red-400" />,
      title: "100% Confidential",
      description: "Your privacy is our priority. All consultations and records are completely confidential."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleBookConsultation = () => {
    alert("Redirecting to online consultation booking...");
  };

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Online Consultation Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Can't visit a clinic?
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Get a Free Online Consultation
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Consult with our expert doctors from the comfort and privacy of your home. No commute, convenient, and completely confidential.
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
                  alt="Online consultation"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose MEN10 Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Why Choose MEN10?
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            A blend of ancient wisdom and modern science for holistic healing
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