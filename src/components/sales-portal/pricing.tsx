'use client';

import React, { useState } from 'react';
import { useLanguage } from './language-context';
import { Button } from '@/components/ui/button';
import { Check, X, Star, Zap } from 'lucide-react';

export function Pricing() {
  const { t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = ['starter', 'growth', 'premium'] as const;

  const getPrice = (plan: typeof plans[number]) => {
    const planData = t.pricing.plans[plan];
    return isAnnual ? planData.priceAnnual : planData.priceMonthly;
  };

  const formatCurrency = (amount: number) => {
    return `TT$${amount.toLocaleString()}`;
  };

  return (
    <section className="section-padding relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/30 text-[var(--nexus-gold)] text-sm font-medium mb-4">
            {t.pricing.tag}
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.pricing.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isAnnual ? 'text-[var(--text-primary)]' : 'text-[var(--text-dim)]'}`}>
            {t.pricing.toggleMonthly}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? 'bg-[var(--nexus-violet)]' : 'bg-[var(--glass-border)]'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-[var(--nexus-gold)]' : 'text-[var(--text-dim)]'}`}>
            {t.pricing.toggleAnnual}
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((planKey) => {
            const plan = t.pricing.plans[planKey];
            const isPopular = planKey === 'growth';

            return (
              <div
                key={planKey}
                className={`pricing-card glass-card p-6 lg:p-8 ${isPopular ? 'popular scale-105' : ''}`}
              >
                {/* Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                  isPopular 
                    ? 'bg-[var(--nexus-gold)] text-[var(--obsidian)]' 
                    : 'bg-[var(--nexus-violet)]/20 text-[var(--nexus-violet-lite)]'
                }`}>
                  {isPopular && <Star className="w-3 h-3 mr-1" />}
                  {plan.badge}
                </div>

                {/* Plan Name */}
                <h3
                  className="text-2xl font-bold mb-2 text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-bold text-gradient-gold" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                      {formatCurrency(getPrice(planKey))}
                    </span>
                    <span className="text-[var(--text-dim)]">{plan.period}</span>
                  </div>
                  <p className="text-sm text-[var(--text-dim)] mt-1">{plan.priceUsd}</p>
                </div>

                {/* Tagline */}
                <p className="text-[var(--text-mid)] text-sm mb-6 leading-relaxed">
                  {plan.tagline}
                </p>

                {/* CTA */}
                <a href="#apply" className="block">
                  <Button className={`w-full ${isPopular ? 'btn-gold' : 'btn-nexus'}`}>
                    {plan.cta}
                  </Button>
                </a>

                {/* Ideal For */}
                <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider mb-2">
                    {t.lang === 'en' ? 'Ideal For' : 'Ideal Para'}
                  </p>
                  <p className="text-sm text-[var(--text-mid)]">
                    {plan.idealFor}
                  </p>
                </div>

                {/* Annual Savings */}
                {isAnnual && (
                  <div className="mt-4 p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
                    <p className="text-sm text-[var(--success)] text-center">
                      {t.lang === 'en' 
                        ? `Save TT$${((plan.priceMonthly - plan.priceAnnual) * 12).toLocaleString()}/year`
                        : `Ahorra TT$${((plan.priceMonthly - plan.priceAnnual) * 12).toLocaleString()}/año`
                      }
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Activation Fee Notice */}
        <div className="glass-card p-6 max-w-3xl mx-auto border-l-4 border-l-[var(--nexus-gold)]">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-[var(--nexus-gold)] flex-shrink-0" />
            <div>
              <p className="font-bold text-[var(--nexus-gold)] mb-1">
                {t.pricing.activationFee.amount}
              </p>
              <p className="text-sm text-[var(--text-mid)] mb-2">
                {t.pricing.activationFee.includes}
              </p>
              <p className="text-xs text-[var(--text-dim)]">
                {t.pricing.activationFee.urgency}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 glass-card overflow-hidden">
          <h3 className="text-xl font-bold p-6 border-b border-[var(--glass-border)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {t.pricing.comparison.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="text-left p-4 text-[var(--text-mid)] font-medium">{t.lang === 'en' ? 'Feature' : 'Función'}</th>
                  <th className="text-center p-4 text-[var(--text-mid)] font-medium">Starter</th>
                  <th className="text-center p-4 text-[var(--nexus-gold)] font-medium bg-[var(--nexus-gold)]/5">Growth</th>
                  <th className="text-center p-4 text-[var(--text-mid)] font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {t.pricing.comparison.rows.map((row, index) => (
                  <tr key={index} className="border-b border-[var(--glass-border)] last:border-0">
                    <td className="p-4 text-[var(--text-primary)]">{row.feature}</td>
                    <td className="text-center p-4">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check className="w-5 h-5 text-[var(--success)] mx-auto" /> : <X className="w-5 h-5 text-[var(--text-dim)] mx-auto" />
                      ) : (
                        <span className="text-[var(--text-mid)]">{row.starter}</span>
                      )}
                    </td>
                    <td className="text-center p-4 bg-[var(--nexus-gold)]/5">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? <Check className="w-5 h-5 text-[var(--success)] mx-auto" /> : <X className="w-5 h-5 text-[var(--text-dim)] mx-auto" />
                      ) : (
                        <span className="text-[var(--text-primary)]">{row.growth}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="w-5 h-5 text-[var(--success)] mx-auto" /> : <X className="w-5 h-5 text-[var(--text-dim)] mx-auto" />
                      ) : (
                        <span className="text-[var(--text-mid)]">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
