'use client';

import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function EnhancedHowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: 'fa-solid fa-pen-to-square',
      title: 'Describe Your Role',
      description: 'Share your job title and the specific tasks you do daily. The more detailed your input, the more accurate our analysis.',
      highlight: 'Task-level precision',
      helper: 'Takes 30 sec',
    },
    {
      number: '02',
      icon: 'fa-solid fa-chart-bar',
      title: 'Get Your Risk Score',
      description: 'Receive your personalized automation risk percentage with detailed insight into what drives your score.',
      highlight: 'Peer benchmarked',
      helper: 'Instant results',
    },
    {
      number: '03',
      icon: 'fa-solid fa-bullseye',
      title: 'Build Your Action Plan',
      description: 'Get a 90-day plan, prioritized skills to develop, and a timeline for role evolution. Act with confidence.',
      highlight: '90-day roadmap',
      helper: 'No signup needed',
    },
  ];

  const headerRef = useScrollAnimation({ threshold: 0.5 });
  const stepsRef = useRef<HTMLDivElement>(null);

  return (
    <section id="how-it-works" className="relative px-6 py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 scroll-mt-28 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-15 animate-blob-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="scroll-animate mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4 w-fit">
            <i className="fa-solid fa-scroll text-xs"></i>
            <span>How it works</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-950 mb-4">
            Three steps to clarity
          </h2>
          <p className="text-xl text-slate-600">
            Get from question to actionable insights in minutes, not hours.
          </p>
        </div>

        {/* Steps Grid */}
        <div ref={stepsRef} className="grid md:grid-cols-3 gap-8 lg:gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative scroll-animate"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 transform group-hover:-translate-y-3">
                {/* Gradient accent background */}
                <div className="absolute -top-1 -right-1 w-32 h-32 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>

                {/* Step number background */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-full -z-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                {/* Step helper text */}
                <div className="absolute top-4 right-4 text-xs font-bold text-emerald-600 bg-emerald-100/70 px-3 py-1.5 rounded-full">
                  {step.helper}
                </div>

                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-3xl font-black mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  <i className={step.icon}></i>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-950 mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed mb-6">{step.description}</p>

                {/* Highlight badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 border border-indigo-300 text-xs font-semibold text-indigo-700 group-hover:bg-indigo-200 transition-colors duration-300">
                  <i className="fa-solid fa-bolt text-xs"></i>
                  {step.highlight}
                </div>

                {/* Connecting line (hidden on last) */}
                {index < steps.length - 1 && (
                  <div className="absolute hidden lg:block top-1/3 -right-6 w-12 h-0.5 bg-gradient-to-r from-indigo-400 via-indigo-300 to-transparent"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Flow indicator */}
        <div className="flex items-center justify-center gap-4 mb-16 hidden lg:flex">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* CTA Section */}
        <div className="pt-12 border-t-2 border-slate-200/50">
          <div className="text-center space-y-6 animate-slideInUp">
            <p className="text-lg text-slate-600 font-medium">Ready to discover your automation score?</p>
            <a
              href="/analyze"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-base hover:shadow-2xl hover:shadow-indigo-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              Start Your Free Analysis
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpStagger {
          from {
            opacity: 0;
            transform: translateY(30px);
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
