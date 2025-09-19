// src/pages/HomePage.jsx
import React from 'react';
import PublicLayout from '@/components/public/PublicLayout.jsx';
import HeroSection from '@/components/public/HeroSection.jsx';
import FeaturesSection from '@/components/public/FeaturesSection.jsx';

const HomePage = () => {
  return (
    <PublicLayout>
      <div className="homepage">
        <HeroSection />
        <FeaturesSection />
      </div>
    </PublicLayout>
  );
};

export default HomePage;