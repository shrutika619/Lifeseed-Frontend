"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

const ReviewFormPage = () => {
  const router = useRouter();

  const handleSimulateApproval = () => {
    router.push("/hospitaldashboard");
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600">MEN10</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Under Review
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for submitting your details. Our team is now manually reviewing your application.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-700 font-medium">
              This process usually takes about 1–5 working days.
            </p>
          </div>

          {/* Additional Info */}
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            You will receive an email and SMS notification on your registered contact details once the review is complete. Please check your inbox (and spam folder).
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBackHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </button>

            {/* ADDED: Simulate Approval (Test) Button */}
            <button
              onClick={handleSimulateApproval}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Simulate Approval (Test)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewFormPage;