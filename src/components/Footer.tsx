import Link from 'next/link';
import { footerGroups } from '@/lib/siteLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] mb-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="font-bold text-white">Will AI Take My Job?</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Personalized AI career analysis with sector benchmarks, shareable reports, and practical next steps for staying ahead of automation.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-bold text-white mb-4">{group.title}</h4>
              <ul className="space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className="text-slate-400 hover:text-indigo-400 transition"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-slate-400 hover:text-indigo-400 transition">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">
              © {currentYear} Will AI Take My Job?. Built for professionals adapting to AI-driven work.
            </p>

            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition">
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition">
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              ⚖️ <strong>Disclaimer:</strong> This tool provides AI-based estimations for informational purposes only. It is not professional career or financial advice. 
              Use it as a planning tool, not absolute truth. Consult with career professionals for personalized guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
