'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const stats = [
    { number: '45M+', label: 'Tasks at Risk' },
    { number: '800+', label: 'Job Profiles' },
    { number: '98%', label: 'Accuracy' },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing_page' }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <header className="relative pt-32 pb-32 overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50"></div>
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Powered by Advanced AI Analysis
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Will AI Take <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Your Job?
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Get a personalized AI automation risk analysis in seconds. Upload your resume or describe your role to discover
              which parts of your job are likely to be automated and how to future-proof your career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 w-full sm:w-auto"
              >
                Check My AI Risk
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition w-full sm:w-auto"
              >
                See How It Works
              </Link>
            </div>

            <p className="text-sm text-slate-500 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free analysis. Your data is encrypted and never sold.</span>
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="glass-card rounded-2xl shadow-2xl p-8 md:p-10 transform -rotate-1 border border-white/40 backdrop-blur-xl hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 text-lg">Risk Analysis Report</h3>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Medium Risk</span>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="8"
                      strokeDasharray="212.05 424.1"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-slate-900">64%</div>
                      <div className="text-sm text-slate-500 mt-2">Automation Risk</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Top Skills to Develop</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Prompt Engineering</span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">AI Tools</span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Leadership</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-slate-600">3 high-risk tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-slate-600">5 future-proof tasks</span>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 glass-card rounded-2xl p-6 shadow-2xl border border-white/40 backdrop-blur-xl hidden lg:block hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">✓</div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Quick Insight</p>
                  <p className="text-sm font-bold text-slate-900">2-minute analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row - Below Hero */}
        <div className="grid grid-cols-3 gap-6 pt-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:border-indigo-300 transition-colors hover:shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
