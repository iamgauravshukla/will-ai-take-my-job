'use client';

import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function RealImpactSection() {
  const stats = [
    {
      number: '800+',
      label: 'Job Profiles',
      description: 'Analyzed across industries',
      icon: 'fa-solid fa-briefcase',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      number: '45M+',
      label: 'Tasks Evaluated',
      description: 'For automation risk',
      icon: 'fa-solid fa-tasks',
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '98%',
      label: 'Accuracy Rate',
      description: 'In predictions',
      icon: 'fa-solid fa-circle-check',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      number: '2 min',
      label: 'Analysis Time',
      description: 'From start to report',
      icon: 'fa-solid fa-stopwatch',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const headerRef = useScrollAnimation({ threshold: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative px-6 py-24 bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-15 animate-blob-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="scroll-animate mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">
            Real data, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">real impact</span>
          </h2>
          <p className="text-lg text-slate-600">
            Our analysis is grounded in comprehensive, AI-powered research across the global job market.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="scroll-animate group rounded-2xl border-2 border-white bg-white p-8 md:p-10 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 text-center hover:translate-y-[-8px] cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon with gradient background */}
              <div className={`mb-6 inline-flex items-center justify-center w-18 h-18 rounded-xl bg-gradient-to-br ${stat.color} text-white text-4xl group-hover:scale-125 transition-transform duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-indigo-200/30`}>
                <i className={stat.icon}></i>
              </div>

              {/* Number */}
              <div className="mb-3">
                <p className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.color} text-transparent bg-clip-text leading-tight`}>
                  {stat.number}
                </p>
              </div>

              {/* Label */}
              <h3 className="text-lg md:text-xl font-bold text-slate-950 mb-2 group-hover:text-indigo-600 transition-colors">{stat.label}</h3>
              <p className="text-sm md:text-base text-slate-600 group-hover:text-slate-700">{stat.description}</p>

              {/* Hover indicator */}
              <div className="mt-6 h-1 w-8 mx-auto bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
