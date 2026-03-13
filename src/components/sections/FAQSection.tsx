'use client';

import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Will AI completely replace my job?',
      answer:
        "It's unlikely AI will 'replace' your entire job overnight. Instead, it will automate specific tasks within your role. Most jobs will transition into 'AI-collaborative' positions where humans manage and direct AI systems. The key is staying ahead of which tasks will automate.",
    },
    {
      question: 'How accurate are these predictions?',
      answer:
        'Our model uses current LLM capability benchmarks (like GPT-4 and Claude 3.5), historical labor data, and industry trends. These are probabilistic estimations based on current technology. However, technology evolves, and your personal adaptability matters. Use this as a planning tool, not absolute truth.',
    },
    {
      question: 'Is my resume data stored or sold?',
      answer:
        'No. We use end-to-end encryption for all analysis. Resumes are processed in real-time and permanently deleted after analysis unless you explicitly save your report. We never store, monetize, or share your personal data. Your privacy is guaranteed.',
    },
    {
      question: 'Can I share my results?',
      answer:
        'Yes! Each report comes with a unique shareable link. You can share your automation analysis with mentors, colleagues, managers, or even use it as proof of career planning proactively. We generate shareable cards optimized for LinkedIn, Twitter, and email.',
    },
    {
      question: 'How do I use this for career planning?',
      answer:
        'Your report includes a personalized 90-day action plan, specific skills to develop, learning resources, and a timeline. Take it to your manager, mentor, or career coach. Use it to justify training budgets, plan skill development, or pivot before disruption happens.',
    },
    {
      question: "What if my job title isn't in your database?",
      answer:
        "No problem! You can describe your role manually, list your key responsibilities, and our AI will perform the same analysis. In fact, custom role analysis often provides more personalized insights because it's based on YOUR specific tasks.",
    },
    {
      question: 'Can companies use this for HR/workforce planning?',
      answer:
        'Yes! We offer enterprise plans for organizations that want to assess workforce automation risk at scale. Contact our team for custom pricing and API access for integration with your HR systems.',
    },
    {
      question: 'How often should I re-run my analysis?',
      answer:
        'We recommend running your analysis every 6-12 months as AI capabilities evolve rapidly. Major job market changes or personal role shifts warrant an immediate re-analysis. Your historical reports are saved for comparison.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold mb-6 uppercase tracking-widest">
            ❓ Questions?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about AI automation risk analysis and career future-proofing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-colors"
              >
                <span className="font-bold text-lg text-slate-900 leading-tight flex-1">{faq.question}</span>
                <div
                  className={`flex-shrink-0 text-2xl text-indigo-600 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  ↓
                </div>
              </button>

              {openIndex === index && (
                <div className="border-t border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-300">
                  <div className="p-6 text-slate-700 leading-relaxed">
                    <p>{faq.answer}</p>

                    {index === 2 && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-green-100">
                        <p className="text-sm text-green-800 font-medium">
                          ✓ <strong>Privacy Certified:</strong> GDPR compliant, SOC 2 Type II certified, end-to-end encrypted.
                        </p>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">
                          💡 <strong>Pro Tip:</strong> Use your report when discussing career development with your manager to justify training investments.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl border border-indigo-200 text-center">
          <h3 className="font-bold text-slate-900 text-xl mb-3">Still have questions?</h3>
          <p className="text-slate-700 mb-6">
            Didn't find what you're looking for? Reach out to our team and we'll be happy to help.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
