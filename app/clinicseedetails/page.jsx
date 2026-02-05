"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClinicseedetailsPage from '../../components/ClinicseedetailsPage/ClinicseedetailsPage';


const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // ✅ Reads '?id=6974...'
    return <ClinicseedetailsPage id={id} />;

};

export default Page;