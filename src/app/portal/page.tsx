'use client';

import React from 'react';
import {
  Navbar,
  Hero,
  PainPoints,
  HowItWorks,
  Industries,
  Features,
  Pricing,
  Testimonials,
  FAQ,
  ApplyForm,
  Footer,
  LanguageProvider,
} from '@/components/sales-portal';

export default function SalesPortalPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[var(--obsidian)]">
        <Navbar />
        <main>
          <Hero />
          <PainPoints />
          <HowItWorks />
          <Industries />
          <Features />
          <Pricing />
          <Testimonials />
          <FAQ />
          <ApplyForm />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
