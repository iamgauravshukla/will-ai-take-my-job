'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: '🎯',
      title: 'Personalized Risk Score',
      description: 'Get a unique automation risk score (0-100%) tailored to your specific job and responsibilities.',
    },
    {
      icon: '📋',
      title: 'Task Breakdown',
      description: 'See which of your daily tasks are likely to be automated and which will remain human-dependent.',
    },
    {
      icon: '🚀',
      title: 'Skill Recommendations',
      description: 'Discover specific, actionable skills you should develop to remain competitive and valuable.',
    },
    {
      icon: '📈',
      title: 'Timeline Forecast',
      description: 'Understand when automation might impact your role and how much time you have to prepare.',
    },
    {
      icon: '🔒',
      title: 'Privacy Guaranteed',
      description: 'Your resume and data are encrypted end-to-end. We never store or sell your personal information.',
    },
    {
      icon: '📊',
      title: 'Shareable Reports',
      description: 'Export or share your results with mentors, colleagues, or as proof of career planning to employers.',
    },
    {
      icon: '🏆',
      title: 'Industry Benchmarks',
      description: 'Compare your risk level against industry averages and see how your role stacks up.',
    },
    {
      icon: '💡',
      title: 'Actionable Roadmap',
      description: 'Get a concrete plan with learning resources, certifications, and next steps for career resilience.',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-6 uppercase tracking-widest">
            ✨ Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Everything You Need to Future-Proof Your Career</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our comprehensive platform provides deep insights into your career resilience and actionable strategies for adaptation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform">{feature.icon}</div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
