'use client';

import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function IndustriesSection() {
  const industries = [
    {
      name: 'Technology',
      icon: 'fa-solid fa-code',
      desc: 'Software, IT Services',
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Finance',
      icon: 'fa-solid fa-chart-line',
      desc: 'Banking, Accounting',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      name: 'Healthcare',
      icon: 'fa-solid fa-heart',
      desc: 'Medical, Nursing',
      color: 'from-red-400 to-red-600',
    },
    {
      name: 'Manufacturing',
      icon: 'fa-solid fa-industry',
      desc: 'Production, Engineering',
      color: 'from-orange-400 to-orange-600',
    },
    {
      name: 'Retail',
      icon: 'fa-solid fa-shop',
      desc: 'Sales, Customer Service',
      color: 'from-pink-400 to-pink-600',
    },
    {
      name: 'Education',
      icon: 'fa-solid fa-graduation-cap',
      desc: 'Teaching, Administration',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  const headerRef = useScrollAnimation({ threshold: 0.5 });
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative px-6 py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 scroll-mt-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-15 animate-blob-delayed"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="scroll-animate mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4 w-fit mx-auto">
            <i className="fa-solid fa-globe text-xs"></i>
            <span>Industry Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 mb-4">
            We cover all major <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">sectors</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2 md:px-0">
            Our analysis spans major industries. Whether you're in tech, finance, healthcare, or beyond, we have insights for your role.
          </p>
        </div>

        {/* Industries Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group relative scroll-animate rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-indigo-300 bg-white hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-5 group-hover:opacity-15 transition-opacity duration-500`}></div>
              
              {/* Decorative top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${industry.color} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`}></div>

              {/* Content */}
              <div className="relative p-5 md:p-8 z-10 h-full flex flex-col justify-between">
                <div>
                  <div className={`mb-3 md:mb-4 inline-flex items-center justify-center w-12 md:w-16 h-12 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br ${industry.color} text-white text-xl md:text-3xl group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl`}>
                    <i className={industry.icon}></i>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-slate-950 mb-1 md:mb-2 group-hover:text-indigo-600 transition-colors">{industry.name}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{industry.desc}</p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-4 md:mt-6 flex items-center gap-2 text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                  <span className="text-xs md:text-sm">Explore</span>
                  <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>
          ))}
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
      </div>
    </section>
  );
}
