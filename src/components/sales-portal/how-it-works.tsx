'use client';

import React from 'react';
import { useLanguage } from './language-context';
import { Building2, CreditCard, Zap, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const { t } = useLanguage();

  const icons = {
    Building2: Building2,
    CreditCard: CreditCard,
    Zap: Zap,
  };

  return (
    <section className="section-padding relative" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient-violet"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.howItWorks.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Lines (Desktop) */}
          <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[var(--nexus-violet)] via-[var(--nexus-fuchsia)] to-[var(--nexus-gold)]" />

          {t.howItWorks.steps.map((step, index) => {
            const IconComponent = icons[step.icon as keyof typeof icons] || Building2;
            return (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[var(--nexus-violet)]/30">
                    {index + 1}
                  </div>
                </div>

                {/* Card */}
                <div className="glass-card p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-[var(--nexus-violet)]/10 border border-[var(--nexus-violet)]/20 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-[var(--nexus-violet-lite)]" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3 text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-mid)] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Mobile) */}
                {index < 2 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-[var(--nexus-violet)] rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
