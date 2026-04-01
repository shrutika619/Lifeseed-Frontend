import React from "react";
import Image from "next/image";

const SecondAboutUsPage = () => {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 space-y-12 sm:space-y-16 md:space-y-20">
        {/* First Section - Who We Are */}
        <div className="grid md:grid-cols-2 items-center px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12 gap-8 sm:gap-10 md:gap-12">
          {/* Text Content */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              LifeSeed is a cloud-based fertility care platform founded with a
              vision to make advanced IVF and reproductive healthcare accessible
              to every couple across India. Built by a team of experienced
              fertility specialists, embryologists, and healthcare professionals,
              LifeSeed digitally connects patients with trusted fertility clinics
              and doctors on a single, secure platform.
              <br />
              <br />
              We believe that every individual deserves compassionate,
              evidence-based fertility care — and LifeSeed was created to make
              that a reality.
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/Images/about1 (2).svg"
              alt="Who We Are"
              width={500}
              height={400}
              className="rounded-xl shadow-md w-full max-w-sm sm:max-w-md md:max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Second Section - Our Story (Full-width with grey background) */}
      <div className="bg-[#F3F6FF] py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 items-center gap-8 sm:gap-10 md:gap-12">
            {/* Image */}
            <div className="flex justify-center order-1 md:order-none">
              <Image
                src="/Images/about2.svg"
                alt="Our Story"
                width={500}
                height={400}
                className="rounded-xl shadow-md w-full max-w-sm sm:max-w-md md:max-w-full h-auto"
              />
            </div>

            {/* Text Content */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Infertility is one of the most emotionally challenging journeys
                a couple can face. Yet for millions of families across India,
                access to quality fertility care remains out of reach — due to
                cost, lack of awareness, or simply not knowing where to begin.
                <br />
                <br />
                LifeSeed was born from a simple but powerful belief: that the
                dream of parenthood should not be limited by geography,
                resources, or lack of guidance. We set out to build a platform
                that brings together the best fertility clinics, doctors, and
                treatment options under one roof — making the journey to
                parenthood simpler, safer, and more hopeful.
                <br />
                <br />
                Today, LifeSeed supports patients through every stage of their
                fertility journey — from initial assessment and consultation to
                IVF treatment, emotional counselling, and post-treatment care —
                all with complete privacy, transparency, and compassion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondAboutUsPage;