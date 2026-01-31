import React from "react";

const HeroAboutUsPage = () => {
  return (
    <section className="text-center py-20 bg-gradient-to-b from-[#F3F6FF] to-[#FFFFFF]">
      {/* Heading */}
      <h1 className="text-4xl font-semibold text-[48px] text-gray-900 mb-4 font-sans">
        To bring back your manhood
      </h1>

      {/* Paragraph with two lines */}
      <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-sans">
        Our mission is to provide accessible, compassionate, and evidence-based care to
        <br />
        individuals seeking support for their health concerns.
      </p>
    </section>
  );
};

export default HeroAboutUsPage;
