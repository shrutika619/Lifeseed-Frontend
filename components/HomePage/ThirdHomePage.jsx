import React from "react";
import { Heart, CheckCircle, Clock, Users, Droplet, AlertCircle } from "lucide-react";

const treatments = [
  {
    title: "Sexual Dysfunction",
    description: "Provide compassionate support to improve intimacy and satisfaction.",
    icon: <Heart className="w-6 h-6 text-green-500" />,
  },
  {
    title: "Erectile Dysfunction",
    description: "Offer personalized treatment to enhance performance and confidence.",
    icon: <CheckCircle className="w-6 h-6 text-green-400" />,
  },
  {
    title: "Premature Ejaculation",
    description: "Help users manage early ejaculation and reduce stress in relationships.",
    icon: <AlertCircle className="w-6 h-6 text-yellow-400" />,
  },
  {
    title: "Delayed Ejaculation",
    description: "Explain possible causes and provide effective treatment options.",
    icon: <Clock className="w-6 h-6 text-blue-400" />,
  },
  {
    title: "Couple Sex Problems",
    description: "Provide counseling and solutions to help couples reconnect.",
    icon: <Users className="w-6 h-6 text-pink-500" />,
  },
  {
    title: "Low Sperm Count",
    description: "Offer therapies and lifestyle advice to improve reproductive health.",
    icon: <Droplet className="w-6 h-6 text-blue-500" />,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Section */}
      <section className="py-12 px-4 w-full">
        <div className="max-w-6xl mx-auto text-center p-6">
          <h2 className="text-2xl font-bold mb-2">What We Treat</h2>
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
            We provide expert care for a range of men's health concerns with confidentiality and
            compassion, ensuring you receive the best possible support.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left flex flex-col"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 flex-grow">{item.description}</p>
                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium mt-4 inline-flex items-center"
                >
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
