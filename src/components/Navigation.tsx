'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { navigationLinks } from '@/lib/siteLinks';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 100) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-ink text-parchment will-change-transform"
      style={{ borderBottom: '2px solid rgba(245, 240, 232, 0.15)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div 
            className="w-10 h-10 flex items-center justify-center text-white font-display text-xl"
            style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--parchment)' }}
          >
            W
          </div>
          <span className="font-display text-2xl uppercase tracking-tight hidden sm:inline">
            Will AI Take My Job?
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-sm font-bold uppercase tracking-widest opacity-80">
          {navigationLinks.map((link) =>
            link.href.startsWith('/#') ? (
              <a 
                key={link.href} 
                href={link.href} 
                className="hover:opacity-100 hover:text-[color:var(--accent)] transition-all"
              >
                {link.label}
              </a>
            ) : (
              <Link 
                key={link.href} 
                href={link.href} 
                className="hover:opacity-100 hover:text-[color:var(--accent)] transition-all"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
          <Link
            href="/analyze"
            className="inline-flex h-10 items-center justify-center px-6 text-xs font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--parchment)' }}
          >
            Check My Risk
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-parchment hover:text-[color:var(--accent)] transition-colors"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink" style={{ borderTop: '2px solid rgba(245, 240, 232, 0.15)' }}>
          <div className="px-6 py-4 space-y-4">
            {navigationLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider opacity-80 hover:opacity-100 hover:text-[color:var(--accent)] transition-all"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider opacity-80 hover:opacity-100 hover:text-[color:var(--accent)] transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--parchment)' }}
            >
              Check My Risk
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
