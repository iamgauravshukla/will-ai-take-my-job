'use client';

export default function ComparisonSection() {
  const comparisons = [
    {
      category: 'Job Security Planning',
      before: 'Guess which tasks might automate in 5-10 years',
      after: 'Know exactly which tasks are automatable now with ML benchmarks',
      icon: '🔮',
    },
    {
      category: 'Skill Development',
      before: 'Randomly upskill hoping it stays relevant',
      after: 'Target specific skills that future-proof your role',
      icon: '🎯',
    },
    {
      category: 'Career Conversations',
      before: 'Anxiety & uncertainty about your job longevity',
      after: 'Data-backed insights to discuss with your manager',
      icon: '💬',
    },
    {
      category: 'Resume Strategy',
      before: 'Hope your current skills remain valuable',
      after: 'Position yourself in the AI-powered job market',
      icon: '📄',
    },
    {
      category: 'Time Investment',
      before: 'Spend years guessing what to learn',
      after: '2-minute analysis + 90-day action plan',
      icon: '⏱️',
    },
    {
      category: 'Job Search Readiness',
      before: 'Uncertainty when entering new opportunities',
      after: 'Understand your value proposition in the AI era',
      icon: '🚀',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 uppercase tracking-widest backdrop-blur">
            ⚡ The Difference
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Before & After Using Our Tool</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            See how data-driven automation insights transform your career planning approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>

              <h3 className="font-bold text-lg text-white mb-6">{item.category}</h3>

              <div className="space-y-6">
                {/* Before */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <p className="text-xs font-bold text-red-400 uppercase">Before</p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.before}</p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-indigo-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-xs font-bold text-green-400 uppercase">After</p>
                  </div>
                  <p className="text-slate-100 text-sm leading-relaxed font-medium">{item.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Stop guessing. Start planning. Get your personalized AI automation insights today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/50">
              Get Your Report
            </button>
            <button className="bg-white/10 border border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition backdrop-blur">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
