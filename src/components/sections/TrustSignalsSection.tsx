'use client';

export default function TrustSignalsSection() {
  const signals = [
    {
      icon: '🔐',
      title: 'Privacy First',
      description: 'End-to-end encrypted. Resumes never stored. GDPR & SOC 2 compliant.',
      metric: '100% Secure',
    },
    {
      icon: '🧠',
      title: 'AI-Backed Analysis',
      description: 'Powered by Claude 3.5 & GPT-4 benchmarks + labor market data.',
      metric: '98% Accuracy',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get results in 2-5 minutes. No waiting, no complexity.',
      metric: '2 Min Avg',
    },
    {
      icon: '📊',
      title: 'Data-Driven Insights',
      description: 'ML capability benchmarks + 800+ job profiles analyzed.',
      metric: '45M+ Tasks',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Professionals Analyzed', suffix: '' },
    { number: '800+', label: 'Job Profiles Covered', suffix: '' },
    { number: '50+', label: 'Industries', suffix: '' },
    { number: '98%', label: 'User Satisfaction', suffix: '' },
  ];

  const testimonials = [
    {
      quote: "This tool gave me clarity on which skills to develop before AI automates my role. Worth its weight in gold!",
      author: 'Sarah M.',
      role: 'Software Engineer, San Francisco',
      avatar: '👩‍💻',
    },
    {
      quote: "The 90-day action plan was exactly what I needed to have a productive conversation with my manager about development.",
      author: 'James K.',
      role: 'Data Analyst, New York',
      avatar: '👨‍💼',
    },
    {
      quote: "Finally a tool that doesn't just predict doom but shows a path forward. Highly recommend!",
      author: 'Priya S.',
      role: 'Marketing Manager, London',
      avatar: '👩‍💼',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Trust Signals */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mb-6 uppercase tracking-widest">
              ✓ Why Trust Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Built on Security & Accuracy</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signals.map((signal, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{signal.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-3">{signal.title}</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{signal.description}</p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-bold text-indigo-600">{signal.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-24 py-16 border-y border-slate-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What People Are Saying</h2>
            <p className="text-slate-600 text-lg">Don&apos;t just take our word for it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white border border-slate-200 p-8 hover:shadow-lg hover:border-slate-300 transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl">⭐</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-lg leading-relaxed mb-6 italic">&quot;{testimonial.quote}&quot;</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-600/10 to-blue-600/10 rounded-3xl border border-indigo-200 p-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Future-Proof Your Career?</h3>
            <p className="text-slate-600 text-lg mb-8">
              Get your personalized AI automation insights in 2 minutes. No credit card required.
            </p>
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200">
              Start Your Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
