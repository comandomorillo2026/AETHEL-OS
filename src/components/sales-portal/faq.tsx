'use client';

import React, { useState } from 'react';
import { useLanguage } from './language-context';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative" id="faq">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient-violet"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t.faq.title}
          </h2>
          <p className="text-[var(--text-mid)] text-lg">
            {t.faq.subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {t.faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="faq-item glass-card px-6 border-none"
            >
              <AccordionTrigger className="text-left text-[var(--text-primary)] hover:text-[var(--nexus-violet-lite)] py-6">
                <span className="font-medium pr-4">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-[var(--text-mid)] pb-6 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-[var(--text-mid)] mb-4">
            {t.lang === 'en' ? 'Still have questions?' : '¿Todavía tienes preguntas?'}
          </p>
          <a
            href="mailto:support@nexusos.tt"
            className="inline-flex items-center gap-2 text-[var(--nexus-violet-lite)] hover:text-[var(--nexus-gold)] transition-colors font-medium"
          >
            {t.lang === 'en' ? 'Contact our support team' : 'Contacta a nuestro equipo de soporte'} →
          </a>
        </div>
      </div>
    </section>
  );
}
