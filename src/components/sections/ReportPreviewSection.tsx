'use client';

export default function ReportPreviewSection() {
  return (
    <section id="report-preview" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold mb-6 uppercase tracking-widest">
            📋 Sample Report
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">See What Your Report Looks Like</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Below is an example of the comprehensive analysis you'll receive for your role.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 md:px-12 py-8 flex justify-between items-center">
            <h3 className="text-white font-bold text-xl tracking-wide">AI AUTOMATION REPORT</h3>
            <span className="text-slate-400 text-xs font-mono">ID: #AI-2026-001</span>
          </div>

          {/* Report Content */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Left Column - Main Analysis */}
              <div className="md:col-span-2">
                <div className="mb-10">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">Your Role</p>
                  <h4 className="text-3xl font-bold text-slate-900 mb-2">Software Engineer</h4>
                  <p className="text-slate-600">Full-stack development with Python & React</p>
                </div>

                <div className="mb-10">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">Automation Risk Score</p>
                  <div className="flex items-end gap-4">
                    <div className="text-6xl font-black text-slate-900">58%</div>
                    <div>
                      <span className="bg-yellow-100 text-yellow-700 text-sm font-bold px-4 py-2 rounded-lg">Medium Risk</span>
                      <p className="text-xs text-slate-500 mt-2">Moderate exposure to automation</p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-bold text-slate-900 mb-4">🔴 High-Risk Tasks</h5>
                    <ul className="space-y-3">
                      {[
                        'Code debugging and testing',
                        'Documentation writing',
                        'Routine code reviews',
                        'Data processing scripts',
                      ].map((task, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="text-red-500 font-bold">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-4">🟢 Future-Proof Tasks</h5>
                    <ul className="space-y-3">
                      {[
                        'System architecture design',
                        'Team leadership & mentoring',
                        'Client strategy & planning',
                        'Innovation & R&D',
                      ].map((task, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="text-green-500 font-bold">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column - Recommendations */}
              <div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100 sticky top-8">
                  <h5 className="font-bold text-indigo-900 mb-6 flex items-center gap-2 text-lg">
                    <span className="text-2xl">⚡</span> Critical Skills to Develop
                  </h5>

                  <div className="space-y-3 mb-8">
                    {[
                      { skill: 'System Design', level: 'Advanced' },
                      { skill: 'AI/ML Integration', level: 'Intermediate' },
                      { skill: 'Team Leadership', level: 'Intermediate' },
                      { skill: 'Product Strategy', level: 'Beginner' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-indigo-100">
                        <p className="text-sm font-bold text-slate-900">{item.skill}</p>
                        <p className="text-xs text-slate-500">{item.level}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-100 rounded-lg p-4 mb-6">
                    <p className="text-xs font-bold text-indigo-900 uppercase mb-2">Timeline</p>
                    <p className="text-sm text-indigo-900">
                      <strong>2-3 years</strong> before significant task automation in your role
                    </p>
                  </div>

                  <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition text-sm">
                    View Full Report
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Action Plan */}
            <div className="mt-12 pt-12 border-t border-slate-200">
              <h5 className="font-bold text-slate-900 mb-8 text-xl">📋 Your 90-Day Action Plan</h5>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    phase: 'Month 1',
                    title: 'Foundation',
                    tasks: ['Complete AI fundamentals course', 'Study system design patterns', 'Start leadership reading'],
                  },
                  {
                    phase: 'Month 2-3',
                    title: 'Build Skills',
                    tasks: ['Build AI-integrated project', 'Lead a small team initiative', 'Complete design certifications'],
                  },
                  {
                    phase: 'Ongoing',
                    title: 'Master & Apply',
                    tasks: ['Mentor junior developers', 'Architect complex systems', 'Think strategic'],
                  },
                ].map((phase, i) => (
                  <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">{phase.phase}</p>
                    <h6 className="font-bold text-slate-900 mb-4">{phase.title}</h6>
                    <ul className="space-y-2">
                      {phase.tasks.map((task, j) => (
                        <li key={j} className="text-sm text-slate-700 flex gap-2">
                          <span className="text-slate-400">→</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Below Report */}
        <div className="text-center mt-12">
          <p className="text-slate-600 text-lg mb-6">Ready to get your personalized analysis?</p>
          <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200">
            Get Your AI Risk Report Now
          </button>
        </div>
      </div>
    </section>
  );
}
