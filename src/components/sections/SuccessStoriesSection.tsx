'use client';

import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function SuccessStoriesSection() {
  const stories = [
    {
      name: 'Sarah Chen',
      role: 'Data Analyst',
      riskScore: 35,
      quote: 'This tool showed me I had time to pivot. The actionable plan helped me land a Senior Analytics role.',
      avatar: 'SC',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      name: 'Marcus Johnson',
      role: 'Marketing Manager',
      riskScore: 52,
      quote: 'Understanding my actual risk factors helped me focus on what matters. My strategy completely changed.',
      avatar: 'MJ',
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Product Manager',
      riskScore: 28,
      quote: 'Great to see my role is more resilient than I thought. Now I know exactly where to invest in my development.',
      avatar: 'ER',
      color: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const headerRef = useScrollAnimation({ threshold: 0.5 });
  const storiesRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative px-6 py-24 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10 animate-blob-delayed"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="scroll-animate mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4 w-fit mx-auto">
            <i className="fa-solid fa-users text-xs"></i>
            <span>Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">
            Professionals making smarter choices
          </h2>
          <p className="text-lg text-slate-600">
            See how others used their insights to adapt and thrive in an AI-driven world.
          </p>
        </div>

        {/* Stories Grid */}
        <div ref={storiesRef} className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group scroll-animate rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-8 hover:border-white hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Risk Score Badge */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${story.color} flex items-center justify-center font-bold text-sm`}>
                    {story.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950">{story.name}</h3>
                    <p className="text-xs text-slate-600">{story.role}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                  <i className="fa-solid fa-chart-pie text-xs"></i>
                  {story.riskScore}%
                </div>
              </div>

              {/* Quote */}
              <p className="text-slate-700 leading-relaxed mb-4 italic">"{story.quote}"</p>

              {/* Stars */}
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star text-xs"></i>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
