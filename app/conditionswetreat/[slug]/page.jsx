"use client";
import React from "react";

// Import all components directly
import DelayedEjaculationPage from "@/components/ConditionsWeTreatPage/DelayedEjaculationPage/DelayedEjaculationPage";
import SexualDysfunctionPage from "@/components/ConditionsWeTreatPage/SexualDysfunctionPage/SexualDysfunctionPage";
import ErectileDysfunctionPage from "@/components/ConditionsWeTreatPage/ErectileDysfunctionPage/ErectileDysfunctionPage";
import LowSpermCountPage from "@/components/ConditionsWeTreatPage/LowSpermCountPage/LowSpermCountPage";
import PrematureEjaculationPage from "@/components/ConditionsWeTreatPage/PrematureEjaculationPage/PrematureEjaculationPage";
import CoupleSexProblemsPage from "@/components/ConditionsWeTreatPage/CoupleSexProblemsPage/CoupleSexProblemsPage";

// Map slugs to their respective components
const componentMap = {
  "sexual-dysfunction": SexualDysfunctionPage,
  "erectile-dysfunction": ErectileDysfunctionPage,
  "premature-ejaculation": PrematureEjaculationPage,
  "delayed-ejaculation": DelayedEjaculationPage,
  "couple-sex-problems": CoupleSexProblemsPage,
  "low-sperm-count": LowSpermCountPage,
};

const ConditionPage = ({ params }) => {
  const { slug } = React.use(params);
  const Component = componentMap[slug];

  // If component doesn't exist, show 404
  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-4">
            The condition page <span className="font-semibold">"{slug}"</span> could not be loaded.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Available pages: {Object.keys(componentMap).join(", ")}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Component />;
};

export default ConditionPage;
