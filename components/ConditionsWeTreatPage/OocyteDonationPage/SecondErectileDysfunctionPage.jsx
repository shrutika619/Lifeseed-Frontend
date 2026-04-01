"use client"
import React from "react";
import { Users, TrendingUp, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

const SecondOocyteDonationPage = () => {
  const router = useRouter();

  return (
    <>
      {/* Main Content Section */}
      <section className="px-6 md:px-20 py-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            You Are Not Alone in This Journey
          </h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Millions of women around the world face challenges with egg quality
            or ovarian reserve. Oocyte donation is a well-established,
            compassionate solution that has helped countless families achieve
            the dream of parenthood.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="text-blue-600 flex justify-center mb-2">
              <Users size={36} />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">1 in 6</h3>
            <p className="mt-2 text-sm text-gray-600">
              couples worldwide are affected by infertility at some point.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="text-blue-600 flex justify-center mb-2">
              <TrendingUp size={36} />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">85%+</h3>
            <p className="mt-2 text-sm text-gray-600">
              success rate achieved with donor oocyte IVF cycles at LifeSeed.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="text-blue-600 flex justify-center mb-2">
              <BarChart3 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">30%</h3>
            <p className="mt-2 text-sm text-gray-600">
              of IVF cycles globally now use donor eggs, reflecting growing
              acceptance and success.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <div className="w-full bg-blue-600 text-white text-center py-12 px-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-3">
          Find Out If Oocyte Donation Is Right for You
        </h3>
        <p className="max-w-2xl mx-auto mb-6 text-sm md:text-base">
          Our confidential 2-minute fertility assessment helps you understand
          your options and connects you with our expert team for personalised
          guidance.
        </p>
        <button
          onClick={() => router.push("/#assessment")}
          className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition"
        >
          Take Free Self-Assessment
        </button>
      </div>
    </>
  );
};

export default SecondOocyteDonationPage;