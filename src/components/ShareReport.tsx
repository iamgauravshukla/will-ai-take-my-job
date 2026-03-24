'use client';

import { useState } from 'react';

interface ShareReportProps {
  title: string;
  token: string;
  automationRisk: number;
}

export default function ShareReport({ title, token, automationRisk }: ShareReportProps) {
  const [copied, setCopied] = useState(false);
  const [instagramHint, setInstagramHint] = useState(false);
  const reportPath = `/results/${token}`;
  const displayUrl = reportPath;

  const shareText = `I just analyzed "${title}" on AI Take Job. This role came back with a ${automationRisk}% automation risk score.`;

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? `${window.location.origin}${reportPath}` : reportPath;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setInstagramHint(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openPopup = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=640,height=560');
  };

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`;
    openPopup(url);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    openPopup(url);
  };

  const shareOnInstagram = async () => {
    await handleCopyLink();
    setInstagramHint(true);
  };

  return (
    <div className="mb-16 scroll-animate">
      {/* Main Shareable Report Section */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/40 p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-10 -z-0" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-10 -z-0" />
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-10 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-100">
                <i className="fa-solid fa-share-nodes text-indigo-600 text-2xl"></i>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Shareable Report</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  Share Your Analysis
                </h2>
              </div>
            </div>
            <p className="text-base text-slate-700 leading-relaxed font-medium max-w-2xl">
              Copy your personalized report link or share it directly on social media. Perfect for career discussions, performance reviews, and professional development planning.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Copy Link Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all flex-shrink-0">
                    <i className="fa-solid fa-link text-xl"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Report Link</p>
                    <p className="text-sm font-medium text-slate-200 truncate">{displayUrl}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full rounded-xl bg-white text-slate-900 font-bold py-3 transition-all hover:bg-slate-100 hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-105 transform duration-200"
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-base`}></i>
                <span>{copied ? 'Copied to clipboard!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Social Sharing Card */}
            <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">Share Instantly</p>
                <p className="text-sm font-medium text-slate-700">Post your result on social platforms</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {/* X/Twitter */}
                <button
                  type="button"
                  onClick={shareOnX}
                  title="Share on X"
                  className="flex-1 min-w-[60px] rounded-xl border border-slate-300 bg-white py-3 text-slate-700 transition hover:border-slate-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md group/btn flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.941 6.694H2.421l7.725-8.835L1.904 2.25h6.52l4.881 6.235L17.896 2.25zM16.772 20.655h1.823L5.383 3.832H3.446l13.326 16.823z" />
                  </svg>
                  <span className="text-xs font-bold hidden sm:inline">Post</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={shareOnFacebook}
                  title="Share on Facebook"
                  className="flex-1 min-w-[60px] rounded-xl border border-sky-300 bg-sky-50 py-3 text-sky-700 transition hover:border-sky-400 hover:bg-sky-100 hover:shadow-md group/btn flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-facebook-f text-lg"></i>
                  <span className="text-xs font-bold hidden sm:inline">Share</span>
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={shareOnInstagram}
                  title="Copy for Instagram"
                  className="flex-1 min-w-[60px] rounded-xl border border-rose-300 bg-rose-50 py-3 text-rose-700 transition hover:border-rose-400 hover:bg-rose-100 hover:shadow-md group/btn flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-instagram text-lg"></i>
                  <span className="text-xs font-bold hidden sm:inline">Copy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instagram Hint */}
          {instagramHint && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3 animate-slideInUp">
              <i className="fa-solid fa-lightbulb text-amber-600 text-lg flex-shrink-0 mt-0.5"></i>
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">Tip for Instagram:</p>
                <p className="text-sm text-amber-800">
                  The link has been copied! Paste it into your Instagram bio, DM, or story caption to share your analysis.
                </p>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 pt-8 border-t border-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <i className="fa-solid fa-globe text-emerald-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Public Link</p>
                  <p className="text-sm text-slate-700 font-medium">Anyone can view</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <i className="fa-solid fa-chart-line text-blue-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Report</p>
                  <p className="text-sm text-slate-700 font-medium">All insights included</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <i className="fa-solid fa-lock-open text-purple-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">No Login</p>
                  <p className="text-sm text-slate-700 font-medium">Instant access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
