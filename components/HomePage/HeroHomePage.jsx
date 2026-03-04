"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeroHomePage = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/free-consultation"); // 👈 redirects to your FreeConsultationPage
  };

  return (
    <section className="bg-gradient-to-r from-pink-50 to-white px-18 py-18">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between md:px-12">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-snug">
            Built for Clinics. <br />  Backed by Science ✨
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            With <span className="font-semibold">Lifeseed</span>,  AI-enabled IVF & Fertility SaaS solution designed to support clinics with secure patient management, treatment tracking, and digital workflows.


          </p>
          <button
            onClick={handleRedirect}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
             Get Free Consultation →
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/Images/clinic.webp"
            alt="Clinic Image"
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroHomePage;
