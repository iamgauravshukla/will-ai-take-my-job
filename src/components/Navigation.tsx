'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navigationLinks } from '@/lib/siteLinks';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            W
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:inline">
            Will AI Take My Job?
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
          {navigationLinks.map((link) =>
            link.href.startsWith('/#') ? (
              <a key={link.href} href={link.href} className="hover:text-indigo-600 transition">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="hover:text-indigo-600 transition">
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA Button */}
        <Link
          href="/analyze"
          className="hidden md:inline-flex bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Check My Risk
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900"
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
        <div className="md:hidden border-t border-slate-200/20 bg-white">
          <div className="px-6 py-4 space-y-4">
            {navigationLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-slate-600 hover:text-indigo-600"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-slate-600 hover:text-indigo-600"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-center"
            >
              Check My Risk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
