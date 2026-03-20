import Link from 'next/link';
import { footerGroups } from '@/lib/siteLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-parchment py-16" style={{ borderTop: '2px solid var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] mb-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-8 h-8 flex items-center justify-center text-white font-display text-xl"
                style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--parchment)' }}
              >
                W
              </div>
              <span className="font-display text-2xl uppercase tracking-tight">Will AI Take My Job?</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Personalised AI career analysis with sector benchmarks, shareable reports, and practical next steps for staying ahead of automation.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-xl uppercase tracking-tight text-white mb-4">{group.title}</h4>
              <ul className="space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className="opacity-60 hover:opacity-100 hover:text-[color:var(--accent)] transition-all"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.href} 
                        className="opacity-60 hover:opacity-100 hover:text-[color:var(--accent)] transition-all"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12" style={{ borderTop: '2px solid rgba(245, 240, 232, 0.15)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm opacity-50">
              © {currentYear} Will AI Take My Job?. Built for professionals adapting to AI-driven work.
            </p>

            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity">
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity">
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-transparent text-center" style={{ border: '2px solid rgba(245, 240, 232, 0.15)' }}>
            <p className="text-xs opacity-50">
              <strong className="text-parchment font-bold uppercase tracking-wider">Disclaimer:</strong> This tool provides AI-based estimations for informational purposes only. It is not professional career or financial advice. 
              Use it as a planning tool, not absolute truth. Consult with career professionals for personalised guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
