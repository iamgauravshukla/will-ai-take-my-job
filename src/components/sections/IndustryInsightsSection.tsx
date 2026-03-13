'use client';

export default function IndustryInsightsSection() {
  const insights = [
    {
      icon: '💻',
      title: 'Software Engineers',
      riskScore: 58,
      riskLevel: 'Medium',
      message: 'Code automation rising. Focus on system design & AI integration.',
      automatedTasks: ['Testing', 'Documentation', 'Code review'],
      futureSkills: ['System Design', 'AI/ML', 'Team Leadership'],
    },
    {
      icon: '📊',
      title: 'Data Analysts',
      riskScore: 72,
      riskLevel: 'High',
      message: 'Data processing is 70% automatable. Pivot to insights & strategy.',
      automatedTasks: ['Report generation', 'Data cleaning', 'SQL queries'],
      futureSkills: ['Data Strategy', 'Business Acumen', 'Storytelling'],
    },
    {
      icon: '🎨',
      title: 'Graphic Designers',
      riskScore: 65,
      riskLevel: 'Medium-High',
      message: 'AI design tools evolving. Differentiate with creative direction.',
      automatedTasks: ['Template design', 'Simple layouts', 'Editing'],
      futureSkills: ['Art Direction', 'Brand Strategy', 'UX/UI'],
    },
    {
      icon: '📝',
      title: 'Content Writers',
      riskScore: 48,
      riskLevel: 'Medium',
      message: 'AI assists writers. Your unique voice remains essential.',
      automatedTasks: ['Drafts', 'Summaries', 'Outlines'],
      futureSkills: ['Strategic Thinking', 'Research', 'Editing'],
    },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 55) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-6 uppercase tracking-widest">
            🏢 Industry Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Automation Risk Across Industries</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See how different roles face automation and what skills matter most for the future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
            >
              {/* Header with icon and score */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{insight.icon}</div>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full border ${getRiskColor(insight.riskScore)}`}>
                    {insight.riskScore}%
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{insight.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{insight.riskLevel} Risk</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-slate-600 mb-6 leading-relaxed italic">{insight.message}</p>

                {/* Automated Tasks */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">🔴 At-Risk Tasks</p>
                  <div className="space-y-2">
                    {insight.automatedTasks.map((task, i) => (
                      <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Future Skills */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">🟢 Future Skills</p>
                  <div className="space-y-2">
                    {insight.futureSkills.map((skill, i) => (
                      <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full text-center py-2 px-4 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm hover:bg-indigo-100 transition">
                  Analyze This Role
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all jobs CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition">
            Explore All 800+ Jobs
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
