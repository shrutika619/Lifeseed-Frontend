"use client";
import React from "react";

import MedicoLegalSupportPage from "@/components/ConditionsWeTreatPage/MedicoLegalSupportPage/MedicoLegalSupportPage";
import SemenBankingandSupplyPage from "@/components/ConditionsWeTreatPage/SemenBankingandSupplyPage/SemenBankingandSupplyPage";
import OocyteDonationPage from "@/components/ConditionsWeTreatPage/OocyteDonationPage/OocyteDonation";
import LifestyleAdvicePage from "@/components/ConditionsWeTreatPage/LifestyleAdvicePage/LifestyleAdvicePage";
import FertilityCounselingPage from "@/components/ConditionsWeTreatPage/FertilityCounselingPage/FertilityCounselingPage";
import CouplesCounselingPage from "@/components/ConditionsWeTreatPage/CouplesCounselingPage/CouplesCounselingPage";

const componentMap = {
  "medico-legal-support": MedicoLegalSupportPage,
  "semen-banking-and-supply": SemenBankingandSupplyPage,
  "oocyte-donation": OocyteDonationPage,
  "lifestyle-advice": LifestyleAdvicePage,
  "fertility-counseling": FertilityCounselingPage,
  "couples-counseling": CouplesCounselingPage,
};

const ConditionPage = ({ params }) => {
  const { slug } = React.use(params);
  const Component = componentMap[slug];

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg">
          <div className="text-5xl sm:text-6xl mb-4">❌</div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            The condition page{" "}
            <span className="font-semibold break-all">"{slug}"</span> could not
            be loaded.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6 break-words">
            Available pages: {Object.keys(componentMap).join(", ")}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Component />
    </div>
  );
};

export default ConditionPage;