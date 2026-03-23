'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { navigationLinks } from '@/lib/siteLinks';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-2.5 group">
            <div className="w-9 md:w-10 h-9 md:h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg group-hover:shadow-xl transition-shadow">
              W
            </div>
            <span className="font-bold text-sm md:text-base tracking-tight text-slate-900 hidden sm:inline group-hover:text-indigo-600 transition-colors">
              Will AI Take My Job?
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-5 xl:gap-6 items-center text-xs xl:text-sm font-medium text-slate-600">
            {navigationLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="relative py-1 hover:text-indigo-600 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="relative py-1 hover:text-indigo-600 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Button */}
          <Link
            href="/analyze"
            className="hidden md:inline-flex bg-indigo-600 text-white px-4 md:px-5 py-2 md:py-2 rounded-full text-xs md:text-sm font-bold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/70 hover:scale-105 relative group overflow-hidden"
          >
            <span className="relative z-10">Check My Risk</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <i className="fa-solid fa-xmark text-xl"></i>
            ) : (
              <i className="fa-solid fa-bars text-xl"></i>
            )}
          </button>
        </div>
      </nav>

      {/* Left-Side Flyout Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Flyout Menu */}
          <div className="absolute top-0 left-0 h-screen w-64 md:w-72 bg-white shadow-2xl z-40 flex flex-col overflow-y-auto">
            {/* Close Button */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark text-xl text-slate-600"></i>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-4 md:px-6 py-6 space-y-3">
              {navigationLinks.map((link) =>
                link.href.startsWith('/#') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA and Bottom Actions */}
            <div className="border-t border-slate-200 p-4 md:p-6 space-y-3">
              <Link
                href="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-lg font-bold text-center text-sm hover:shadow-lg transition-all duration-300"
              >
                Check My Risk
              </Link>
              <button
                onClick={() => {
                  scrollToTop();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-slate-600 hover:text-indigo-600 px-4 py-2 text-sm font-medium text-center transition-colors"
              >
                <i className="fa-solid fa-arrow-up mr-2"></i>Back to Top
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <BackToTopButton />
    </>
  );
}

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-30 p-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-slideInUp"
      aria-label="Back to top"
      title="Back to top"
    >
      <i className="fa-solid fa-arrow-up text-lg"></i>
    </button>
  ) : null;
}
