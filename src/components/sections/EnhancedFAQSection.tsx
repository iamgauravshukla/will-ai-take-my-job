'use client';

import { useState, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FAQItem {
  q: string;
  a: string;
  icon: string;
}

export default function EnhancedFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      icon: 'fa-solid fa-magnifying-glass',
      q: 'How is the risk score calculated?',
      a: 'We analyze automation likelihood for each task in your role using AI trend data, task complexity, and sector-specific factors. The final score is benchmarked against similar roles to give you context.',
    },
    {
      icon: 'fa-solid fa-chart-bar',
      q: 'How accurate is this analysis?',
      a: 'Our models achieve 98% accuracy when validated against industry data. However, this is a planning tool, not absolute career prediction. Use it to inform decisions, not replace professional advice.',
    },
    {
      icon: 'fa-solid fa-globe',
      q: 'Can I compare my role against peers?',
      a: 'Yes! The sector benchmark view shows your percentile placement, peer distribution, and how your role stacks up. You can also browse the job library to see how other roles compare.',
    },
    {
      icon: 'fa-solid fa-link',
      q: 'Is my report shareable with others?',
      a: 'Absolutely. Every report gets a unique shareable link that works outside the platform. Perfect for discussing results with mentors, managers, or career coaches.',
    },
    {
      icon: 'fa-solid fa-lightbulb',
      q: 'What should I do with my results?',
      a: 'Start with the 90-day plan—it prioritizes skills development and career moves. The key is acting on insights: adapt your role, build resilience, or pivot strategically.',
    },
    {
      icon: 'fa-solid fa-rotate',
      q: 'How often should I re-analyze my role?',
      a: 'We recommend revisiting every 6-12 months as AI capabilities evolve. Your risk score may shift as you develop new skills or your role changes.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const headerRef = useScrollAnimation({ threshold: 0.5 });
  const faqRef = useRef<HTMLDivElement>(null);

  return (
    <section id="faq" className="relative px-4 md:px-6 py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 scroll-mt-28">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-10 animate-blob"></div>
      </div>

      <div className="relative z-10 mx-auto" style={{ maxWidth: '992px' }}>
        {/* Header */}
        <div ref={headerRef} className="scroll-animate mb-12 md:mb-16 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4 w-fit mx-auto">
            <i className="fa-solid fa-question text-xs"></i>
            <span>Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 mb-3 md:mb-4">
            Answers to common questions
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Everything you need to know about the analysis and how to use your results.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div ref={faqRef} className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group scroll-animate rounded-xl md:rounded-2xl border-2 border-slate-200/60 bg-white hover:border-indigo-300 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              >
                <div className="flex items-center gap-2 md:gap-4 text-left min-w-0">
                  <i className={`${faq.icon} text-indigo-600 text-lg md:text-2xl flex-shrink-0`}></i>
                  <h3 className="text-sm md:text-base lg:text-lg font-bold text-slate-950 line-clamp-2">{faq.q}</h3>
                </div>
                <div
                  className={`flex-shrink-0 w-5 md:w-6 h-5 md:h-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold transition-transform duration-300 ml-3 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </button>

              {/* Content */}
              {openIndex === index && (
                <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 pt-2 border-t-2 border-slate-100 bg-slate-50 animate-slideInDown">
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">{faq.a}</p>

                  {/* Decorative line */}
                  <div className="mt-3 md:mt-4 flex gap-1">
                    <div className="h-1 w-1 rounded-full bg-indigo-400"></div>
                    <div className="h-1 w-1 rounded-full bg-blue-400"></div>
                    <div className="h-1 w-1 rounded-full bg-indigo-300"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="scroll-animate mt-12 md:mt-16 p-6 md:p-8 rounded-xl md:rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 text-center">
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">
            <i className="fa-solid fa-comments text-indigo-600"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-950 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-4">
            Start the free analysis to get personalized answers based on your specific role.
          </p>
          <a
            href="/analyze"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
          >
            Get Started
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
