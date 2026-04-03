'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './language-context';
import { ChevronRight } from 'lucide-react';

export function Industries() {
  const { t } = useLanguage();

  // First 4 industries for initial launch (with structure for all 11)
  const displayedIndustries = t.industries.items.slice(0, 4);
  const upcomingIndustries = t.industries.items.slice(4);

  // Map industry slugs to their portal routes
  const getIndustryRoute = (slug: string) => `/portal/${slug}`;

  return (
    <section className="section-padding relative" id="industries">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient-gold"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.industries.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg max-w-2xl mx-auto">
            {t.industries.subtitle}
          </p>
        </div>

        {/* Featured Industries (First 4) - Click to see details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayedIndustries.map((industry, index) => (
            <Link
              key={industry.slug}
              href={getIndustryRoute(industry.slug)}
              className="industry-card glass-card p-6 cursor-pointer group block hover:border-[var(--nexus-gold)]/30 transition-all"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {industry.icon}
              </div>

              {/* Name */}
              <h3
                className="text-xl font-bold mb-2 text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {industry.name}
              </h3>

              {/* Description */}
              <p className="text-[var(--text-mid)] text-sm mb-4 leading-relaxed">
                {industry.description}
              </p>

              {/* Status Badge & CTA */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
                  {t.industries.badge.active}
                </span>
                <span className="flex items-center gap-1 text-[var(--nexus-gold)] text-sm font-medium group-hover:gap-2 transition-all">
                  {t.lang === 'en' ? 'See more' : 'Ver más'}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming Industries */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {t.lang === 'en' ? 'More Industries Coming Soon' : 'Más Industrias Próximamente'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {upcomingIndustries.map((industry) => (
              <div
                key={industry.slug}
                className="flex flex-col items-center p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="text-3xl mb-2">{industry.icon}</span>
                <span className="text-xs text-[var(--text-mid)] text-center">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
