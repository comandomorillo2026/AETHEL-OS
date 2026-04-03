'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scissors, 
  CheckCircle, 
  Star,
  ChevronRight,
  Sparkles,
  Users,
  Calendar,
  CreditCard,
  ShoppingBag,
  PiggyBank,
  BarChart3
} from 'lucide-react';
import { IndustryPageLayout, useIndustryLanguage } from '@/components/industry';

// Industry content component (renders inside the layout)
function BeautyContent() {
  const { lang, t } = useIndustryLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const common = t.common;
  const industry = t.salon;
  const isEn = lang === 'en';

  const modules = [
    { icon: Scissors, name: industry.modules[0].name, desc: industry.modules[0].desc },
    { icon: Users, name: industry.modules[1].name, desc: industry.modules[1].desc },
    { icon: ShoppingBag, name: industry.modules[2].name, desc: industry.modules[2].desc },
    { icon: Sparkles, name: industry.modules[3].name, desc: industry.modules[3].desc },
    { icon: PiggyBank, name: industry.modules[4].name, desc: industry.modules[4].desc },
    { icon: CreditCard, name: industry.modules[5].name, desc: industry.modules[5].desc },
    { icon: Calendar, name: industry.modules[6].name, desc: industry.modules[6].desc },
    { icon: BarChart3, name: industry.modules[7].name, desc: industry.modules[7].desc },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{industry.badgeText}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#EDE9FE] mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {industry.heroTitle.split(' ').map((word, i) => 
                  i === 2 || i === 3 || i === 4 ? (
                    <span key={i} className="text-[#EC4899]">{word} </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h1>
              
              <p className="text-lg text-[#9D7BEA] mb-8">
                {industry.heroDesc}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#precios"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white font-semibold hover:opacity-90 transition-all"
                >
                  {common.seePlans}
                </a>
                <Link 
                  href="/portal"
                  className="px-8 py-4 rounded-xl border border-[rgba(167,139,250,0.3)] text-[#EDE9FE] hover:bg-[rgba(108,63,206,0.1)] transition-all"
                >
                  {common.otherIndustries}
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {industry.stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-xl bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)]">
                  <p className="text-3xl font-bold text-[#EC4899]">{stat.value}</p>
                  <p className="text-sm text-[#9D7BEA]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="relative z-10 py-16 px-4 bg-[rgba(108,63,206,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {common.modulesIncluded}
            </h2>
            <p className="text-[#9D7BEA] max-w-xl mx-auto">
              {common.completeSolution}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modules.map((mod, i) => (
              <div key={i} className="p-4 rounded-xl bg-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)] hover:border-[#EC4899]/30 transition-all">
                <mod.icon className="w-8 h-8 text-[#EC4899] mb-3" />
                <h4 className="font-medium text-[#EDE9FE] mb-1">{mod.name}</h4>
                <p className="text-xs text-[#9D7BEA]">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits List */}
            <div>
              <h2 className="text-3xl font-bold text-[#EDE9FE] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {common.benefits}
              </h2>
              <ul className="space-y-4">
                {industry.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#EC4899] mt-0.5 flex-shrink-0" />
                    <span className="text-[#EDE9FE]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Who it's for */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[rgba(236,72,153,0.1)] to-[rgba(108,63,206,0.05)] border border-[rgba(167,139,250,0.1)]">
              <h3 className="text-xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {common.whoItsFor}
              </h3>
              <p className="text-[#9D7BEA] mb-6">
                {industry.whoItsFor}
              </p>
              
              <h3 className="text-xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
                {common.whyChoose}
              </h3>
              <p className="text-[#9D7BEA]">
                {industry.whyChoose}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#EDE9FE] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {common.pricingPlans}
            </h2>
            <p className="text-[#9D7BEA] mb-6">
              {common.pricingOptimized}
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30' 
                    : 'text-[#9D7BEA] hover:text-[#EDE9FE]'
                }`}
              >
                {common.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billingCycle === 'annual' 
                    ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30' 
                    : 'text-[#9D7BEA] hover:text-[#EDE9FE]'
                }`}
              >
                {common.annual} <span className="text-xs ml-1">({common.savePercent})</span>
              </button>
            </div>
          </div>
          
          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {(['starter', 'growth', 'premium'] as const).map((key) => {
              const plan = industry.plans[key];
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
              
              return (
                <div 
                  key={key}
                  className={`p-6 rounded-2xl border transition-all ${
                    plan.popular 
                      ? 'bg-[rgba(236,72,153,0.05)] border-[#EC4899]/30 scale-105' 
                      : 'bg-[rgba(108,63,206,0.05)] border-[rgba(167,139,250,0.1)]'
                  }`}
                >
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#EC4899] text-white text-xs font-bold">
                        {common.popular}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-[#9D7BEA] mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#9D7BEA] mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-[#EDE9FE]">TT${price}</span>
                      <span className="text-[#9D7BEA]">{common.perMonth}</span>
                    </div>
                    <p className="text-xs text-[#9D7BEA] mt-2">{plan.users}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#EDE9FE]">
                        <CheckCircle className="w-4 h-4 text-[#EC4899] mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href="/portal#apply"
                    className={`block w-full py-3 rounded-lg text-center font-medium transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white hover:opacity-90' 
                        : 'border border-[rgba(167,139,250,0.3)] text-[#EDE9FE] hover:bg-[rgba(108,63,206,0.1)]'
                    }`}
                  >
                    {common.selectPlan}
                  </a>
                </div>
              );
            })}
          </div>
          
          {/* Activation Fee */}
          <div className="text-center mt-8">
            <p className="text-[#9D7BEA]">
              <span className="font-semibold text-[#F0B429]">{common.activation}:</span> TT${industry.activationFee} {common.oneTime}
              <span className="mx-2">•</span>
              <span className="font-semibold text-[#34D399]">{common.includes}:</span> {industry.includesText}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[rgba(236,72,153,0.1)] to-[rgba(139,92,246,0.1)] border border-[rgba(167,139,250,0.2)]">
            <h2 className="text-2xl font-bold text-[#EDE9FE] mb-4">
              {common.readyToTransform} {isEn ? 'salon?' : 'salón?'}
            </h2>
            <p className="text-[#9D7BEA] mb-6">
              {isEn ? 'Join over 40 salons in the Caribbean already using NexusOS' : 'Únete a más de 40 salones del Caribe que ya usan NexusOS'}
            </p>
            <a 
              href="/portal#apply"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white font-semibold hover:opacity-90"
            >
              {common.requestDemo}
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// Main page component
export default function BeautyPortalPage() {
  const screenshots = [
    { src: '/screenshots/beauty/dashboard.png', alt: 'Dashboard de Salón' },
    { src: '/screenshots/beauty/appointments.png', alt: 'Gestión de Citas' },
    { src: '/screenshots/beauty/pos.png', alt: 'Punto de Venta' },
  ];

  return (
    <IndustryPageLayout 
      industryKey="salon"
      industryIcon={<Scissors className="w-5 h-5 text-[#EC4899]" />}
      industryColor="#EC4899"
      screenshots={screenshots}
    >
      <BeautyContent />
    </IndustryPageLayout>
  );
}
