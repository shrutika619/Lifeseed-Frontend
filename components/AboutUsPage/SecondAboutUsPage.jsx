import React from "react";
import Image from "next/image";

const SecondAboutUsPage = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-12 space-y-20">
        {/* First Section - Who We Are */}
        <div className="grid md:grid-cols-2 items-center px-12 py-12 gap-12">
          {/* Text Content */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              MEN10 was started by two doctors, Dr. Aditya Aswar (MBBS) and
              Dr. Suresh Moon (Ayurvedacharya). Both come from families with a
              strong background in Ayurveda. Using their medical knowledge, they
              created a special Ayurvedic medicine that has shown a 97% success
              rate. Seeing such positive results, they decided to move beyond
              just treating patients in clinics and built MEN10 – a sexual
              wellness brand that makes these proven remedies available to more
              people.
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/Images/about1 (2).svg"
              alt="Who We Are"
              width={500}
              height={400}
              className="rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Second Section - Our Story (Full-width with grey background) */}
      <div className="bg-[#F3F6FF] py-20">
        <div className="container mx-auto px-12">
          <div className="grid md:grid-cols-2 items-center gap-12">
            {/* Image */}
            <div className="flex justify-center order-1 md:order-none">
              <Image
                src="/Images/about2.svg"
                alt="Our Story"
                width={500}
                height={400}
                className="rounded-xl shadow-md"
              />
            </div>

            {/* Text Content */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                People often say that food, clothing, and shelter are the three
                basic needs of life. But we believe there is a fourth – a healthy
                and fulfilling intimate relationship with your partner.
                <br />
                <br />
                When this part of life is disturbed, it can affect families,
                relationships, and overall happiness. Many people are willing to
                seek help, but most treatments available in the market today don’t
                offer long-term benefits and sometimes cause side effects.
                <br />
                <br />
                At MEN10, we set out to change this. Backed by Ayurveda and years
                of medical expertise, we developed a line of proven Ayurvedic
                medicines that deliver 97% success rates. Our treatments are not
                just effective but also affordable, long-term, and backed by a
                money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondAboutUsPage;
