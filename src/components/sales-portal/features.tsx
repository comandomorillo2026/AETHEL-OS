'use client';

import React, { useState } from 'react';
import { useLanguage } from './language-context';
import { Check, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Features() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('growth');

  const plans = ['starter', 'growth', 'premium'] as const;

  return (
    <section className="section-padding relative" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient-violet"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.features.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 bg-[var(--glass)] border border-[var(--glass-border)]">
            {plans.map((plan) => (
              <TabsTrigger
                key={plan}
                value={plan}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--nexus-violet)] data-[state=active]:to-[var(--nexus-fuchsia)] data-[state=active]:text-white"
              >
                {plan === 'growth' && <Star className="w-4 h-4 mr-1 inline" />}
                {t.features.tabs[plan]}
              </TabsTrigger>
            ))}
          </TabsList>

          {plans.map((plan) => (
            <TabsContent key={plan} value={plan} className="mt-0">
              <div className="glass-card p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {t.features.byPlan[plan].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)]"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-[var(--success)]" />
                      </div>
                      <span className="text-[var(--text-primary)] text-sm sm:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
