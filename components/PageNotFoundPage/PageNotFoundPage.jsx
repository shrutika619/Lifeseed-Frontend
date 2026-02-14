"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
          {/* 404 Illustration */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-4">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-2">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The page might have been removed, renamed, or doesn't exist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Home size={18} />
              Home Page
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">
              Need help finding something?
            </p>
            <button
              onClick={() => router.push("/search")}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Search size={16} />
              Search our site
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Error Code: 404 - Page Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;