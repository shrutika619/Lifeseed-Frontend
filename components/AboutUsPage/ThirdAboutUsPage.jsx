import React from "react";

const founders = [
  {
    initials: "Dr. A",
    name: "Dr. ABC",
    qualification: "MD - Reproductive Medicine & IVF Specialist",
    quote:
      "\"With over 15 years of experience in IVF and assisted reproduction, I am committed to giving every couple the best possible chance at parenthood through personalised, evidence-based fertility care.\"",
  },
  {
    initials: "Dr. B",
    name: "Dr. XYZ",
    qualification: "MS - Obstetrics & Gynaecology, Fertility Consultant",
    quote:
      "\"I believe that fertility care goes beyond medical treatment — it is about understanding each patient's emotional journey and walking alongside them with compassion and expertise.\"",
  },
];

const ThirdAboutUsPage = () => {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto text-center px-4 sm:px-6">
        {/* Heading */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-12">
          Meet Our Fertility Experts
        </h2>

        {/* Founder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
                {founder.initials}
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">
                {founder.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{founder.qualification}</p>
              <p className="text-sm text-gray-600 max-w-xs">{founder.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdAboutUsPage;