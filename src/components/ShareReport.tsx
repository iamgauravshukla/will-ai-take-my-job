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
  const reportUrl = typeof window === 'undefined' ? reportPath : `${window.location.origin}${reportPath}`;

  const shareText = `I just analyzed "${title}" on AI Take Job. This role came back with a ${automationRisk}% automation risk score.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
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
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(reportUrl)}`;
    openPopup(url);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reportUrl)}`;
    openPopup(url);
  };

  const shareOnInstagram = async () => {
    await handleCopyLink();
    setInstagramHint(true);
  };

  return (
    <div className="mb-16 border-[2px] border-ink bg-parchment p-8 relative">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Shareable Report</p>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-ink">Spread The Intelligence</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed opacity-80 max-w-md uppercase tracking-wide">
            This URL opens the full public report, including the benchmark, task breakdown, and methodology.
          </p>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="flex flex-col gap-0 border-[2px] border-ink sm:flex-row">
            <div className="min-w-0 flex-1 border-b-[2px] border-ink sm:border-b-0 sm:border-r-[2px] bg-transparent px-4 py-3 text-sm font-medium text-ink overflow-auto no-scrollbar whitespace-nowrap">
              <span className="block">{reportUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-ink hover:text-parchment whitespace-nowrap"
            >
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY URL'}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={shareOnX}
              className="border-[2px] border-ink bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-parchment"
            >
              Share on X
            </button>
            <button
              type="button"
              onClick={shareOnFacebook}
              className="border-[2px] border-ink bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-parchment"
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={shareOnInstagram}
              className="border-[2px] border-ink bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-parchment"
            >
              Instagram
            </button>
          </div>

          {instagramHint && (
            <div className="mt-4 border-l-4 border-accent pl-3 text-xs font-bold uppercase tracking-widest opacity-80">
              <p>
                Instagram does not support direct web sharing. The link is copied so you can paste it into your bio, DM, or story.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
