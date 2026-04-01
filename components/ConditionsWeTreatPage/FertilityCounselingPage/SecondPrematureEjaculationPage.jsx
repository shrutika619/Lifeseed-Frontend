import React from "react";
import { Heart, Brain, Activity } from "lucide-react";

const SecondFertilityCounselingPage = () => {
  return (
    <section className="w-full">
      {/* =================== WHAT CAUSES SECTION =================== */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16 bg-[#F9FAFB]">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            Why Do Couples Seek Fertility Counseling?
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base md:text-lg">
            Fertility challenges affect every aspect of life — emotional,
            relational, and physical. Understanding these dimensions helps our
            counselors provide truly holistic support.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="p-5 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Emotional Challenges
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
              <li>Grief after pregnancy loss</li>
              <li>Anxiety around treatment cycles</li>
              <li>Fear of the unknown</li>
              <li>Feelings of guilt or inadequacy</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-5 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Psychological Impact
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
              <li>Depression & low self-worth</li>
              <li>Chronic stress & burnout</li>
              <li>Decision-making overwhelm</li>
              <li>Identity & relationship strain</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-5 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 hover:border transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Relational Factors
              </h3>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
              <li>Communication breakdown</li>
              <li>Intimacy & sexual concerns</li>
              <li>Differing treatment expectations</li>
              <li>Family & social pressure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* =================== WHY OUR SOLUTION SECTION =================== */}
      <section className="w-full bg-white py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Why Our Counseling Approach{" "}
            <span className="text-blue-600">Works</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            Our fertility counseling is built on evidence-based therapeutic
            techniques including Cognitive Behavioral Therapy (CBT), mindfulness
            practices, and couples communication frameworks. We work alongside
            your medical team to ensure your emotional health is treated with the
            same priority as your physical health throughout every stage of
            treatment.
          </p>
          <p className="mt-6 text-gray-800 text-sm sm:text-base md:text-lg font-medium">
            Our integrated support model achieves a{" "}
            <span className="text-blue-600 font-semibold">92% patient satisfaction rate</span>.
          </p>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            We complement individual sessions with couples counseling, group
            support circles, and guided stress-relief programs to ensure a
            truly comprehensive emotional wellness journey.
          </p>
        </div>
      </section>
    </section>
  );
};

export default SecondFertilityCounselingPage;