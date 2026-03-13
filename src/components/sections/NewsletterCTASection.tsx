'use client';

import { useState } from 'react';

export default function NewsletterCTASection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing_page' }),
      });

      if (response.ok) {
        setMessage('✓ Successfully subscribed! Check your email for a welcome message.');
        setEmail('');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Email already subscribed or invalid.');
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 md:p-20 text-center text-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-700 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-700 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-8 uppercase tracking-widest backdrop-blur">
              📬 Monthly Insights
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Stay Ahead of AI-Driven Career Changes
            </h2>

            <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
              Get monthly automation trends, emerging skill recommendations, and AI-proof career strategies delivered straight to your inbox. 
              <br />
              <strong>Free exclusive content from industry experts.</strong>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-black transition disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Join Now'}
              </button>
            </form>

            {message && (
              <p className={`mt-4 text-sm ${message.startsWith('✓') ? 'text-green-200' : 'text-red-200'}`}>
                {message}
              </p>
            )}

            <p className="text-indigo-200 text-xs mt-6">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-8 mt-16">
              {[
                { number: '15K+', label: 'Subscribers' },
                { number: '50+', label: 'Industries Covered' },
                { number: '98%', label: 'Report Accuracy' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <p className="text-indigo-100 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
