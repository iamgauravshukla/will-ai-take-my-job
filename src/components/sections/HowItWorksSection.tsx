'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Select Your Role',
      description: 'Choose your industry and job title from our database of 800+ occupations. Or start fresh by describing your unique role.',
      icon: '🎯',
    },
    {
      number: 2,
      title: 'Share Your Details',
      description: 'Upload your resume (PDF/DOCX) or manually describe your daily responsibilities for a deeper, more personalized analysis.',
      icon: '📄',
    },
    {
      number: 3,
      title: 'AI Analysis Runs',
      description: 'Our advanced AI model analyzes task automation probability, role vulnerability, and timeline for your specific role.',
      icon: '🤖',
    },
    {
      number: 4,
      title: 'Get Your Strategy',
      description: 'Receive a detailed automation risk report with actionable skills to develop and a roadmap to future-proof your career.',
      icon: '📊',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-6 uppercase tracking-widest">
            🔧 Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Four Simple Steps to Future-Proof Your Career</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI engine analyzes your specific tasks against current machine learning capabilities to give you an accurate, personalized outlook.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-indigo-300 to-indigo-100 group-hover:from-indigo-600 group-hover:to-indigo-400 transition-colors"></div>
              )}

              <div className="flex flex-col h-full">
                {/* Step Number */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow relative z-10">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Visual */}
        <div className="mt-24 pt-16 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-12 text-center">Expected Timeline</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { time: '< 1 min', label: 'Job Selection' },
              { time: '1-2 min', label: 'Upload Resume' },
              { time: '2-5 min', label: 'AI Analysis' },
              { time: 'Instant', label: 'Results Ready' },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 hover:border-indigo-300 transition-colors"
              >
                <div className="text-3xl font-bold text-indigo-600 mb-2">{item.time}</div>
                <p className="text-slate-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
