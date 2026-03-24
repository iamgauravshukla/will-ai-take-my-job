'use client';

import { useRef } from 'react';
import Navigation from '@/components/Navigation';
import SimpleFooter from '@/components/SimpleFooter';
import EnhancedHeroSection from '@/components/sections/EnhancedHeroSection';
import TextSliderSection from '@/components/sections/TextSliderSection';
import RealImpactSection from '@/components/sections/RealImpactSection';
import EnhancedHowItWorksSection from '@/components/sections/EnhancedHowItWorksSection';
import SuccessStoriesSection from '@/components/sections/SuccessStoriesSection';
import IndustriesSection from '@/components/sections/IndustriesSection';
import EnhancedFAQSection from '@/components/sections/EnhancedFAQSection';
import WillAITakeMyJobSection from '@/components/sections/WillAITakeMyJobSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Home() {
  const ctaRef = useScrollAnimation({ threshold: 0.2 });
  return (
    <main className="w-full bg-white text-slate-900">
      <Navigation />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Text Slider Section */}
      <TextSliderSection />

      {/* Real Impact Section - Stats */}
      <RealImpactSection />

      {/* Enhanced How It Works Section */}
      <EnhancedHowItWorksSection />

      {/* Will AI Take My Job Interactive Section */}
      <WillAITakeMyJobSection />

      {/* Success Stories Section */}
      <SuccessStoriesSection />

      {/* Industries Section */}
      <IndustriesSection />

      {/* Enhanced FAQ Section */}
      <EnhancedFAQSection />

      {/* Bottom CTA Section */}
      <section ref={ctaRef} className="scroll-animate relative px-4 md:px-6 py-24 md:py-32 bg-gradient-to-b from-white via-indigo-50 to-blue-50">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-15 animate-blob"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-fire text-xs"></i>
              <span>Limited time insight</span>
            </div>
          </div>

          <div className="text-center animate-slideInUp">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-slate-950 mb-4 md:mb-6">
              Ready to find out where you stand?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-2">
              Get personalized insights in <span className="font-bold text-indigo-600">less than 2 minutes</span>. Free, shareable, and actionable.
            </p>
            <p className="text-xs md:text-sm text-slate-500 mb-8 md:mb-10">
              <i className="fa-solid fa-check text-emerald-600 mr-2"></i>No login required • No email needed • Results are yours to keep
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12">
              <a
                href="/analyze"
                className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 rounded-full bg-indigo-600 text-white font-bold text-sm md:text-base hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-400/50 transition-all duration-300 transform hover:scale-105 group"
              >
                <i className="fa-solid fa-zap mr-2"></i>
                <span>Start Free Analysis</span>
                <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </a>
              <a
                href="/jobs"
                className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-10 rounded-full border-2 border-slate-300 bg-white text-slate-900 font-bold text-sm md:text-base hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
              >
                <i className="fa-solid fa-briefcase mr-2"></i>
                Browse Jobs
              </a>
            </div>

            {/* Trust badges grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
              <div className="p-3 md:p-4 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <i className="fa-solid fa-circle-check text-lg md:text-xl text-emerald-600"></i>
                  <p className="text-xs md:text-sm font-semibold text-slate-900">No login required</p>
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <i className="fa-solid fa-flash text-lg md:text-xl text-blue-600"></i>
                  <p className="text-xs md:text-sm font-semibold text-slate-900">Free report</p>
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <i className="fa-solid fa-lock text-lg md:text-xl text-indigo-600"></i>
                  <p className="text-xs md:text-sm font-semibold text-slate-900">100% private</p>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="text-center text-xs md:text-sm text-slate-500">
              <i className="fa-solid fa-star text-amber-400 mr-1"></i>
              <span className="font-semibold text-slate-900">Trusted by 50,000+ professionals</span> worldwide
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <SimpleFooter />
    </main>
  );
}
