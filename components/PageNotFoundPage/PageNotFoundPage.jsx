"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float"></div>
      <div className="absolute top-60 right-20 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float-delayed"></div>
      <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-30 animate-float-slow"></div>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12 text-center">
          {/* Cute Robot Mascot */}
          <div className="mb-8 relative inline-block animate-float-robot">
            <div className="relative w-40 h-40 mx-auto">
              {/* Robot Body */}
              <div className="absolute w-28 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl top-8 left-1/2 transform -translate-x-1/2 shadow-lg">
                {/* Antenna */}
                <div className="absolute w-1 h-6 bg-purple-300 top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 rounded-full">
                  <div className="absolute w-3 h-3 bg-yellow-400 rounded-full -top-2 left-1/2 transform -translate-x-1/2 animate-pulse shadow-lg shadow-yellow-400/50"></div>
                </div>

                {/* Robot Screen/Face */}
                <div className="absolute w-20 h-16 bg-white rounded-2xl top-4 left-1/2 transform -translate-x-1/2 border-4 border-gray-200 overflow-hidden shadow-inner">
                  {/* Eyes */}
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <div className="relative w-4 h-4 bg-purple-400 rounded-full animate-blink">
                      <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-1"></div>
                    </div>
                    <div className="relative w-4 h-4 bg-purple-400 rounded-full animate-blink">
                      <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1 left-1"></div>
                    </div>
                  </div>
                  {/* Sad Mouth */}
                  <div className="relative mt-2">
                    <div className="w-8 h-1 bg-purple-400 rounded-full mx-auto"></div>
                    <div className="absolute w-3 h-2 border-2 border-purple-400 border-t-0 rounded-b-full bottom-0 left-1/4 rotate-12"></div>
                    <div className="absolute w-3 h-2 border-2 border-purple-400 border-t-0 rounded-b-full bottom-0 right-1/4 -rotate-12"></div>
                  </div>
                </div>

                {/* Arms */}
                <div className="absolute w-10 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full top-16 -left-7 transform -rotate-20">
                  <div className="absolute w-4 h-4 bg-purple-300 rounded-full -left-3 -top-1 shadow-md"></div>
                </div>
                <div className="absolute w-10 h-2 bg-gradient-to-l from-purple-500 to-indigo-600 rounded-full top-16 -right-7 transform rotate-20">
                  <div className="absolute w-4 h-4 bg-purple-300 rounded-full -right-3 -top-1 shadow-md"></div>
                </div>

                {/* Legs */}
                <div className="absolute w-6 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-b-2xl bottom-0 left-4 transform translate-y-8"></div>
                <div className="absolute w-6 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-b-2xl bottom-0 right-4 transform translate-y-8"></div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
            >
              <Home size={18} />
              Home Page
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">
              Need help finding something?
            </p>
            <button
              onClick={() => router.push("/search")}
              className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold transition-all duration-200 hover:gap-3"
            >
              <Search size={16} />
              Search our site
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-robot {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.6;
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-25px) scale(1.3);
            opacity: 0.5;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 0.4;
          }
        }

        @keyframes blink {
          0%, 48%, 52%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.1);
          }
        }

        .animate-float-robot {
          animation: float-robot 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite 2s;
        }

        .animate-blink {
          animation: blink 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;