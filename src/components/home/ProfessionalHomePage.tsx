
import React from 'react';
import { HeroSection } from './HeroSection';
import { FeatureGrid } from './FeatureGrid';
import { TestimonialSection } from './TestimonialSection';
import { CTASection } from './CTASection';

export const ProfessionalHomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureGrid />
      <TestimonialSection />
      <CTASection />
    </div>
  );
};
