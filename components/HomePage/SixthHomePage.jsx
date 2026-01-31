import React from "react";
import { Play } from "lucide-react";

const testimonials = [
  {
    name: "Ankit K.",
    location: "Delhi",
    quote:
      '“I was skeptical at first, but MEN10’s approach truly works. I feel like myself again. The process was so easy and respectful.”',
    author: "A. Kumar, Delhi",
  },
  {
    name: "Ankit K.",
    location: "Delhi",
    quote:
      '“I was skeptical at first, but MEN10’s approach truly works. I feel like myself again. The process was so easy and respectful.”',
    author: "A. Kumar, Delhi",
  },
  {
    name: "Ankit K.",
    location: "Delhi",
    quote:
      '“I was skeptical at first, but MEN10’s approach truly works. I feel like myself again. The process was so easy and respectful.”',
    author: "A. Kumar, Delhi",
  },
];

const SixthHomePage = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Hear From Our Satisfied Customers
        </h2>
        <p className="mt-2 text-gray-500 text-sm md:text-base">
          Discretion and results are our top priorities. See what our users have to say.
        </p>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
          >
            {/* Video / Placeholder */}
            <div className="relative bg-gray-800 flex items-center justify-center h-40">
              <span className="text-gray-300 text-2xl font-semibold">{t.name}</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play size={22} className="text-gray-800" />
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="p-6 text-center flex flex-col justify-between flex-grow">
              <p className="text-gray-600 text-sm italic">{t.quote}</p>
              <p className="mt-4 font-semibold text-gray-900 text-sm">- {t.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SixthHomePage;
