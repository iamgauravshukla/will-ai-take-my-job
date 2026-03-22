'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/* ── animation helpers ────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ── ticker data ──────────────────────────────────── */
const tickerItems = [
  'Data Entry Clerk — 94%',
  'Radiologist — 62%',
  'Truck Driver — 79%',
  'UX Designer — 31%',
  'Accountant — 85%',
  'Nurse — 12%',
  'Copywriter — 73%',
  'Electrician — 8%',
  'Financial Analyst — 68%',
  'Software Engineer — 58%',
  'Pharmacist — 61%',
  'Graphic Designer — 52%',
];

export default function Home() {
  /* ── existing data (text unchanged) ─────────────── */
  const steps = [
    {
      n: '01',
      title: 'Describe your role',
      body: 'Share your job title and the tasks you actually do. The more specific you are, the sharper the analysis.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      n: '02',
      title: 'Get your risk score',
      body: 'See your automation risk percentage, the key drivers behind it, and how you compare against similar roles in your sector.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      n: '03',
      title: 'Act on the results',
      body: 'Use the 90-day plan, skill priorities, and role evolution timeline to decide what to change and when.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      q: 'How is this different from a generic AI career quiz?',
      a: 'Each score is driven by task-level analysis, sector peer comparisons, and a structured action plan — not a single vague percentage.',
    },
    {
      q: 'Can I compare my role against similar jobs?',
      a: 'Yes. The sector benchmark shows peer averages, percentile placement, and a risk landscape so the score has real context.',
    },
    {
      q: 'Is the report shareable?',
      a: 'Yes — every report has a unique link designed to be readable and useful outside the product.',
    },
    {
      q: 'What should I do after getting my score?',
      a: 'Start with the 90-day plan and skills section. The goal is to adapt how you work, not just know the number.',
    },
  ];

  const stats = [
    { value: '2.4M+', label: 'Jobs analysed' },
    { value: '73%', label: 'Avg risk score' },
    { value: '142', label: 'Sectors covered' },
    { value: '<2 min', label: 'Time to report' },
  ];

  return (
    <main className="w-full bg-parchment text-ink relative overflow-x-hidden">
      {/* grain overlay */}
      <div className="grain-overlay" />

      <Navigation />

      {/* ═══════════════  HERO  ═══════════════ */}
      <section className="px-6 pb-20 pt-32 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* left — copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: 'var(--accent)' }}
            >
              AI Career Risk Analysis
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight uppercase"
            >
              Will AI take<br />your job?
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-base leading-7 opacity-70"
            >
              Get a personalised automation risk score, sector benchmark context, and a shareable report with practical next steps.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/analyze"
                  className="inline-flex h-14 items-center justify-center px-8 text-sm font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--ink)' }}
                >
                  Check My Risk — it&apos;s free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/jobs"
                  className="inline-flex h-14 items-center justify-center px-8 text-sm font-bold uppercase tracking-wider border-2 border-ink bg-transparent hover:bg-ink hover:text-parchment transition-colors"
                >
                  Browse the job library
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium opacity-50">
              <span>Task-level analysis</span>
              <span>·</span>
              <span>Sector benchmarks</span>
              <span>·</span>
              <span>Shareable reports</span>
              <span>·</span>
              <span>90-day plan</span>
            </motion.div>
          </motion.div>

          {/* right — animated risk score card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            {/* card */}
            <div
              className="relative w-full max-w-sm p-8 bg-ink text-parchment"
              style={{ border: '2px solid var(--ink)' }}
            >
              <p className="text-xs uppercase tracking-[0.25em] opacity-50 mb-6">Sample Score</p>

              {/* circular gauge */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="var(--accent)"
                      strokeWidth="8"
                      strokeLinecap="butt"
                      strokeDasharray={2 * Math.PI * 52}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.58) }}
                      transition={{ duration: 1.4, delay: 0.6, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="font-display text-5xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      58%
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50">Risk</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm opacity-60 mb-6">Software Engineer</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Sector Rank', val: 'Top 35%' },
                  { label: 'Task Overlap', val: '6 / 10' },
                  { label: 'Trend', val: '↑ Rising' },
                  { label: 'Adaptability', val: 'High' },
                ].map((b, i) => (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + i * 0.15 }}
                    className="p-3 text-center"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <span className="block text-[10px] uppercase tracking-wider opacity-50">{b.label}</span>
                    <span className="block font-display text-lg mt-1">{b.val}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* floating badges */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="absolute -top-3 -right-3 md:-right-6 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white animate-float"
              style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--ink)' }}
            >
              Live Data
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="absolute -bottom-3 -left-3 md:-left-6 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-ink text-parchment animate-float"
              style={{ border: '2px solid var(--ink)', animationDelay: '3s' }}
            >
              142 Sectors
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════  LIVE TICKER BAND  ═══════════════ */}
      <section className="bg-ink text-parchment py-4 overflow-hidden" style={{ borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="whitespace-nowrap px-8 text-sm font-semibold uppercase tracking-wider opacity-80">
              {item}
              <span className="ml-8 opacity-30">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════  STAT BAND  ═══════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="px-6 py-16 md:py-20"
      >
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4" style={{ border: '2px solid var(--ink)' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="p-6 md:p-8 text-center"
              style={{
                borderRight: i < stats.length - 1 ? '2px solid var(--ink)' : undefined,
                borderBottom: i < 2 ? '2px solid var(--ink)' : undefined,
              }}
            >
              <span className="block font-display text-4xl md:text-5xl">{s.value}</span>
              <span className="block mt-2 text-xs uppercase tracking-[0.2em] opacity-60">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════  HOW IT WORKS  ═══════════════ */}
      <motion.section
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="scroll-mt-28 px-6 py-16 md:py-24 bg-parchment-dark"
        style={{ borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}
      >
        <div className="mx-auto max-w-5xl">
          <motion.p variants={fadeUp} className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl uppercase tracking-tight">
            Three steps, one clear plan.
          </motion.h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <motion.div
                key={step.n}
                variants={fadeUp}
                className="relative p-6 md:p-8 bg-parchment overflow-hidden"
                style={{ border: '2px solid var(--ink)' }}
              >
                {/* ghost number */}
                <span className="absolute -top-4 -left-1 font-display text-[8rem] leading-none opacity-[0.06] select-none pointer-events-none">
                  {step.n}
                </span>

                <div className="relative z-10">
                  <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ color: 'var(--accent)' }}>
                    {step.icon}
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 opacity-60">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════  SECTOR BENCHMARKS  ═══════════════ */}
      <motion.section
        id="role-benchmarks"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="scroll-mt-28 px-6 py-16 md:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <motion.p variants={fadeUp} className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Sector Benchmarks
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl uppercase tracking-tight">
            Context makes the score meaningful.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-7 opacity-60">
            A single percentage without comparison is noise. The benchmark view shows exactly where a role falls across its peer set.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 p-6 md:p-8 bg-parchment-dark"
            style={{ border: '2px solid var(--ink)' }}
          >
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">Example</p>
                <h3 className="mt-1 font-display text-2xl md:text-3xl uppercase">Software Engineer — 58% risk</h3>
              </div>
              <span
                className="self-start px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                High band
              </span>
            </div>

            <div className="relative pt-12 pb-8">
              <div className="absolute top-0 left-[58%] z-10 flex -translate-x-1/2 flex-col items-center">
                <span
                  className="whitespace-nowrap px-3 py-1.5 text-xs font-bold text-parchment"
                  style={{ backgroundColor: 'var(--ink)', border: '2px solid var(--ink)' }}
                >
                  58% — you
                </span>
                <div className="mt-0.5 h-7 w-px bg-ink" />
                <div className="h-3 w-3 bg-ink" style={{ border: '2px solid var(--accent)' }} />
              </div>
              <div className="flex h-7 overflow-hidden" style={{ border: '2px solid var(--ink)' }}>
                <div className="h-full w-[40%] bg-emerald-500" />
                <div className="h-full w-[15%] bg-yellow-500" />
                <div className="h-full w-[15%]" style={{ backgroundColor: 'var(--accent)' }} />
                <div className="h-full w-[30%] bg-red-500" />
              </div>
              <div className="relative mt-1.5 text-xs opacity-50">
                <span className="absolute left-0">0</span>
                <span className="absolute left-[40%] -translate-x-1/2">40</span>
                <span className="absolute left-[55%] -translate-x-1/2">55</span>
                <span className="absolute left-[70%] -translate-x-1/2">70</span>
                <span className="absolute right-0">100</span>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              {[
                { label: 'Low', range: '0–39', count: 12, tone: 'bg-emerald-500', current: false },
                { label: 'Medium', range: '40–54', count: 18, tone: 'bg-yellow-500', current: false },
                { label: 'High', range: '55–69', count: 21, tone: '', current: true },
                { label: 'Very High', range: '70–100', count: 9, tone: 'bg-red-500', current: false },
              ].map((band) => (
                <div
                  key={band.label}
                  className={`p-4 ${band.current ? 'bg-ink text-parchment' : 'bg-parchment'}`}
                  style={{ border: '2px solid var(--ink)' }}
                >
                  <div
                    className={`mb-3 h-1 w-6 ${band.current ? '' : band.tone}`}
                    style={band.current ? { backgroundColor: 'var(--accent)' } : undefined}
                  />
                  <p className={`text-xs font-medium ${band.current ? 'opacity-60' : 'opacity-50'}`}>{band.label}</p>
                  <p className={`mt-1 font-display text-3xl ${band.current ? 'text-parchment' : 'text-ink'}`}>{band.count}</p>
                  <p className="text-xs opacity-50">{band.range}%{band.current ? ' ← you' : ''}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════  FAQ  ═══════════════ */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="scroll-mt-28 px-6 py-16 md:py-24 bg-parchment-dark"
        style={{ borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}
      >
        <div className="mx-auto max-w-5xl">
          <motion.p variants={fadeUp} className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            FAQ
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl uppercase tracking-tight">
            Common questions.
          </motion.h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <motion.div
                key={item.q}
                variants={fadeUp}
                className="p-6 bg-parchment"
                style={{ border: '2px solid var(--ink)' }}
              >
                <h3 className="font-bold text-ink">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 opacity-60">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════  CTA — ASYMMETRIC  ═══════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="px-6 py-16 md:py-24"
      >
        <div className="mx-auto max-w-5xl grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          {/* left */}
          <motion.div variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight">
              Find out where you stand.
            </h2>
            <p className="mt-4 text-sm leading-7 opacity-60">
              The analysis takes about two minutes and the report is yours to keep.
            </p>

            <motion.div className="mt-8" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/analyze"
                className="inline-flex h-14 items-center justify-center px-10 text-sm font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--ink)' }}
              >
                Start free analysis →
              </Link>
            </motion.div>
          </motion.div>

          {/* right — dark card */}
          <motion.div
            variants={fadeUp}
            className="p-8 bg-ink text-parchment"
            style={{ border: '2px solid var(--ink)' }}
          >
            <h3 className="font-display text-2xl uppercase tracking-tight mb-6 opacity-80">Your report includes</h3>
            <ul className="space-y-4">
              {[
                'Personalised automation risk score',
                'Task-level vulnerability breakdown',
                'Sector benchmark & percentile',
                '90-day future-proofing plan',
                'Skill priority recommendations',
                'Shareable report link',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm opacity-70">
                  <span style={{ color: 'var(--accent)' }} className="mt-0.5 text-base">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
