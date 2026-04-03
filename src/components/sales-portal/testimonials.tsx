'use client';

import React from 'react';
import { useLanguage } from './language-context';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative" id="testimonials">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient-gold"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.testimonials.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.testimonials.items.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card p-6 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[var(--nexus-gold)] fill-[var(--nexus-gold)]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[var(--text-primary)] text-base leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center text-white font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{testimonial.author}</p>
                  <p className="text-sm text-[var(--text-mid)]">{testimonial.role}</p>
                  <p className="text-xs text-[var(--text-dim)]">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '400+', label: t.lang === 'en' ? 'Businesses Managed' : 'Negocios Gestionados' },
            { value: '11', label: t.lang === 'en' ? 'Industries' : 'Industrias' },
            { value: 'TT$2M+', label: t.lang === 'en' ? 'Revenue Tracked' : 'Ingresos Rastreados' },
            { value: '99.9%', label: t.lang === 'en' ? 'Uptime' : 'Disponibilidad' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass-card">
              <p className="text-3xl lg:text-4xl font-bold text-gradient-gold mb-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-mid)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
