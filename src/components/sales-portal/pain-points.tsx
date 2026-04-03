'use client';

import React from 'react';
import { useLanguage } from './language-context';
import { AlertCircle } from 'lucide-react';

export function PainPoints() {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative" id="pain-points">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            <span className="text-[var(--text-primary)]">{t.painPoints.title}</span>
          </h2>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {t.painPoints.items.map((pain, index) => (
            <div
              key={index}
              className="glass-card glass-card-hover p-6 flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--error)]/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[var(--error)]" />
              </div>
              <p className="text-[var(--text-primary)] text-base sm:text-lg leading-relaxed">
                {pain}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
