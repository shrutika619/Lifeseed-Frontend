"use client";
import React, { use } from 'react';
import HerosectionCityPage from '@/components/ClinicPage/HerosectionCityPage'; 
import SecondsectionPage from '@/components/ClinicPage/SecondsectionPage'; 

const Page = ({ params }) => {
  // Unwrap the params promise using 'use'
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  // Handle case where slug might be undefined
  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading location data...</p>
      </div>
    );
  }

  return (
    <main>
      {/* Passing the raw slug; HerosectionCityPage handles the data fetching and formatting */}
      <HerosectionCityPage cityName={slug} />
      
      <div className="mt-12">
        <SecondsectionPage />
      </div>
    </main>
  );
};

export default Page;