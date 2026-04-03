'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useLanguage } from './language-context';
import { Button } from '@/components/ui/button';
import { Shield, CreditCard, Building2, Users } from 'lucide-react';

// Pre-generated deterministic star positions (avoiding hydration mismatch)
const STAR_POSITIONS = [
  { left: 12, top: 5, delay: 0.2, opacity: 0.6 },
  { left: 45, top: 12, delay: 1.1, opacity: 0.4 },
  { left: 78, top: 8, delay: 2.3, opacity: 0.7 },
  { left: 23, top: 25, delay: 0.8, opacity: 0.5 },
  { left: 67, top: 18, delay: 1.5, opacity: 0.6 },
  { left: 89, top: 35, delay: 0.4, opacity: 0.4 },
  { left: 34, top: 42, delay: 2.1, opacity: 0.7 },
  { left: 56, top: 28, delay: 1.8, opacity: 0.5 },
  { left: 15, top: 55, delay: 0.6, opacity: 0.6 },
  { left: 92, top: 48, delay: 1.2, opacity: 0.4 },
  { left: 8, top: 68, delay: 2.5, opacity: 0.5 },
  { left: 41, top: 62, delay: 0.9, opacity: 0.7 },
  { left: 73, top: 58, delay: 1.6, opacity: 0.4 },
  { left: 28, top: 75, delay: 2.2, opacity: 0.6 },
  { left: 85, top: 72, delay: 0.3, opacity: 0.5 },
  { left: 52, top: 82, delay: 1.4, opacity: 0.7 },
  { left: 19, top: 88, delay: 0.7, opacity: 0.4 },
  { left: 64, top: 92, delay: 2.0, opacity: 0.6 },
  { left: 96, top: 15, delay: 1.0, opacity: 0.5 },
  { left: 37, top: 38, delay: 1.9, opacity: 0.7 },
];

export function Hero() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trustBadges = [
    { icon: Shield, label: t.hero.trustBadges.secure },
    { icon: CreditCard, label: t.hero.trustBadges.wipay },
    { icon: CreditCard, label: t.hero.trustBadges.stripe },
    { icon: Building2, label: t.hero.trustBadges.industries },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Aurora Background */}
      <div className="aurora-bg" />
      
      {/* Star Field - Using deterministic positions */}
      <div className="star-field">
        {STAR_POSITIONS.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--nexus-violet)] bg-[var(--glass)] mb-8 animate-float">
          <span className="text-[var(--nexus-violet-lite)] text-sm font-medium tracking-wider uppercase">
            {t.hero.eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          <span className="text-[var(--text-primary)]">{t.hero.headline.split(' ').slice(0, 3).join(' ')}</span>
          <br />
          <span className="text-gradient-gold">{t.hero.headline.split(' ').slice(3).join(' ')}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-[var(--text-mid)] max-w-3xl mx-auto mb-8 leading-relaxed">
          {t.hero.subheadline}
        </p>

        {/* Price Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/30 mb-8">
          <span className="text-[var(--nexus-gold)] font-semibold">{t.hero.priceTag}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a href="#apply">
            <Button className="btn-gold text-lg px-8 py-6">
              {t.hero.ctaPrimary}
            </Button>
          </a>
          <a href="#how-it-works">
            <Button variant="ghost" className="btn-ghost text-lg px-8 py-6">
              {t.hero.ctaSecondary}
            </Button>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="trust-badge"
            >
              <badge.icon className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Trust Line */}
        <p className="text-[var(--text-dim)] text-sm">
          {t.hero.trustLine}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--nexus-violet)] flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-[var(--nexus-violet)] animate-pulse" />
        </div>
      </div>
    </section>
  );
}
