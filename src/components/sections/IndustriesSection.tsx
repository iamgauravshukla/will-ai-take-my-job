'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function IndustriesSection() {
  // Featured job roles
  const featuredJobs = [
    {
      title: 'Software Engineer',
      slug: 'software-engineer',
      icon: 'fa-solid fa-code',
      description: 'Full-stack development and system design',
      color: 'from-blue-400 to-blue-600',
      risk: 58,
    },
    {
      title: 'Data Analyst',
      slug: 'data-analyst',
      icon: 'fa-solid fa-chart-bar',
      description: 'Data insights and reporting',
      color: 'from-emerald-400 to-emerald-600',
      risk: 72,
    },
    {
      title: 'Graphic Designer',
      slug: 'graphic-designer',
      icon: 'fa-solid fa-palette',
      description: 'Visual design and branding',
      color: 'from-purple-400 to-purple-600',
      risk: 65,
    },
    {
      title: 'Product Manager',
      slug: 'product-manager',
      icon: 'fa-solid fa-briefcase',
      description: 'Product strategy and roadmapping',
      color: 'from-orange-400 to-orange-600',
      risk: 42,
    },
    {
      title: 'Marketing Manager',
      slug: 'marketing-manager',
      icon: 'fa-solid fa-bullhorn',
      description: 'Campaign management and analytics',
      color: 'from-pink-400 to-pink-600',
      risk: 55,
    },
    {
      title: 'Healthcare Professional',
      slug: 'healthcare-professional',
      icon: 'fa-solid fa-heart',
      description: 'Patient care and medical services',
      color: 'from-red-400 to-red-600',
      risk: 35,
    },
  ];

  const headerRef = useScrollAnimation({ threshold: 0.5 });
  const gridRef = useRef<HTMLDivElement>(null);

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600 bg-red-100';
    if (risk >= 55) return 'text-orange-600 bg-orange-100';
    return 'text-emerald-600 bg-emerald-100';
  };

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
            <i className="fa-solid fa-chart-pie text-xs"></i>
            <span>Popular Roles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 mb-4">
            Explore popular job <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">roles</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2 md:px-0">
            Analyze automation risk across diverse career paths. Click to explore detailed analysis for each role.
          </p>
        </div>

        {/* Featured Jobs Grid - 6 Cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {featuredJobs.map((job, index) => (
            <Link
              key={index}
              href={`/jobs/${job.slug}`}
              className="group relative scroll-animate rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-indigo-400 bg-white hover:shadow-xl hover:shadow-indigo-200/40 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Gradient Top Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${job.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}></div>

              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${job.color} opacity-3 group-hover:opacity-8 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-6 md:p-7 z-10 flex flex-col flex-1">
                {/* Icon and Risk Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${job.color} text-white text-2xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <i className={job.icon}></i>
                  </div>
                  <div className={`rounded-full px-2.5 py-1 text-xs font-bold ${getRiskColor(job.risk)}`}>
                    {job.risk}%
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-slate-950 mb-2 group-hover:text-indigo-700 transition-colors duration-300">{job.title}</h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed flex-1 group-hover:text-slate-700 transition-colors">{job.description}</p>

                {/* Risk Level */}
                <div className="mt-4 pt-4 border-t border-slate-200 group-hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide font-semibold text-slate-500">Automation Risk</span>
                    <span className={`text-sm font-bold ${getRiskColor(job.risk)}`}>{job.risk}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${job.color} transition-all duration-300`}
                      style={{ width: `${job.risk}%` }}
                    />
                  </div>
                </div>

                {/* CTA Indicator */}
                <div className="mt-4 flex items-center justify-between text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold">View Details</span>
                  <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center pt-12 border-t border-slate-200">
          <p className="text-slate-600 mb-4">Want to find analysis for a different role?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 hover:shadow-lg transition-all"
            >
              <i className="fa-solid fa-search mr-2"></i>
              Search All Roles
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-slate-300 text-slate-900 font-bold hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              <i className="fa-solid fa-list mr-2"></i>
              Browse Full Library
            </Link>
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
      </div>
    </section>
  );
}
