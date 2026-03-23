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
    <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-600">Shareable Report</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Copy the report link or post it directly.</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            This URL opens the full public report, including the benchmark, task breakdown, and next-step plan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {copied ? 'Copied link' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={shareOnX}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Share on X
          </button>
          <button
            type="button"
            onClick={shareOnFacebook}
            className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100"
          >
            Share on Facebook
          </button>
          <button
            type="button"
            onClick={shareOnInstagram}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:border-rose-300 hover:bg-rose-100"
          >
            Copy for Instagram
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span className="block truncate">{displayUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
        </div>

        {instagramHint && (
          <p className="text-xs leading-5 text-slate-500">
            Instagram does not support direct web sharing. The link is copied so you can paste it into your bio, DM, or story.
          </p>
        )}
      </div>
    </div>
  );
}
