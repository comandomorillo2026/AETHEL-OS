'use client';

import React from 'react';
import { useLanguage } from './language-context';
import { Button } from '@/components/ui/button';
import { Shield, CreditCard, Building2, Users } from 'lucide-react';

export function Hero() {
  const { t } = useLanguage();

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
      
      {/* Star Field */}
      <div className="star-field">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
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
