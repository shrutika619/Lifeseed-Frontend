import React from "react";
import { Check, X } from "lucide-react";

const FifthHomePage = () => {
  const comparisonData = [
    {
      feature: "Treatment Approach",
      men10: "Customized Ayurvedic + Modern Medicine",
      others: "Generic Allopathy",
    },
    {
      feature: "Medicine",
      men10: "In-house, Patented",
      others: "Third-party",
    },
    {
      feature: "Consultation Process",
      men10: "Free Doctor Consultation",
      others: "Paid Consultation",
    },
    {
      feature: "Follow-up Care",
      men10: "Regular Free Follow-up",
      others: "Minimal support",
    },
    {
      feature: "Satisfaction Guarantee",
      men10: "90-day money-back guarantee*",
      others: "No Guarantee",
    },
  ];

  return (
    <div className="w-full py-8 md:py-16 px-2 md:px-4 bg-white font-sans">
      <h2 className="text-xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-slate-900">
        What Makes <span className="text-slate-900">MEN10</span> Different?
      </h2>

      {/* Container with horizontal scroll support for very small screens */}
      <div className="max-w-5xl mx-auto overflow-x-auto rounded-xl shadow-lg border border-gray-100">
        <table className="w-full min-w-[340px] border-collapse bg-white">
          <thead>
            <tr>
              {/* Feature Header */}
              <th className="w-[25%] py-3 px-2 md:py-6 md:px-6 text-left bg-gray-50 text-xs md:text-lg font-bold text-slate-800 border-b border-gray-200">
                Feature
              </th>

              {/* MEN10 Header (Blue) */}
              <th className="w-[37.5%] py-3 px-2 md:py-6 md:px-6 text-center bg-[#4A90E2] text-white text-xs md:text-lg font-bold border-b border-[#4A90E2]">
                MEN10
              </th>

              {/* Others Header (Gray) */}
              <th className="w-[37.5%] py-3 px-2 md:py-6 md:px-6 text-center bg-gray-50 text-slate-600 text-xs md:text-lg font-bold border-b border-gray-200">
                Others
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-none">
                {/* Feature Name */}
                <td className="py-3 px-2 md:py-5 md:px-6 text-[10px] md:text-base font-bold text-slate-700 bg-white leading-tight">
                  {item.feature}
                </td>

                {/* MEN10 Column (Green Tint) */}
                <td className="py-3 px-1 md:py-5 md:px-6 bg-[#ECFDF5] text-center align-middle">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                    <Check className="w-3 h-3 md:w-5 md:h-5 text-green-600 flex-shrink-0" strokeWidth={4} />
                    <span className="text-[10px] md:text-base font-semibold text-slate-800 leading-tight">
                      {item.men10}
                    </span>
                  </div>
                </td>

                {/* Others Column (White) */}
                <td className="py-3 px-1 md:py-5 md:px-6 bg-white text-center align-middle">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                    <X className="w-3 h-3 md:w-5 md:h-5 text-red-400 flex-shrink-0" strokeWidth={4} />
                    <span className="text-[10px] md:text-base text-slate-500 leading-tight">
                      {item.others}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Footer Note */}
        <div className="bg-gray-50 py-2 text-center">
           <p className="text-[10px] md:text-xs text-gray-400">*Terms and conditions apply.</p>
        </div>
      </div>
    </div>
  );
};

export default FifthHomePage