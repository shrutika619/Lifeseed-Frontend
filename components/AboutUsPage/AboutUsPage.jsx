import React from 'react';
import Image from 'next/image';
import HeroAboutUsPage from './HeroAboutUsPage';
import SecondAboutUsPage from './SecondAboutUsPage';
import ThirdAboutUsPage from './ThirdAboutUsPage';

const AboutUsPage = () => {
  return (
    <div>
      <HeroAboutUsPage />
      <SecondAboutUsPage />
      <ThirdAboutUsPage />
    </div>
  );
};

export default AboutUsPage;
