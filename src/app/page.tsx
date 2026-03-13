import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  const steps = [
    {
      n: '01',
      title: 'Describe your role',
      body: 'Share your job title and the tasks you actually do. The more specific you are, the sharper the analysis.',
    },
    {
      n: '02',
      title: 'Get your risk score',
      body: 'See your automation risk percentage, the key drivers behind it, and how you compare against similar roles in your sector.',
    },
    {
      n: '03',
      title: 'Act on the results',
      body: 'Use the 90-day plan, skill priorities, and role evolution timeline to decide what to change and when.',
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

  return (
    <main className="w-full bg-white text-slate-900">
      <Navigation />

      {/* Hero */}
      <section className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            AI Career Risk Analysis
          </p>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
            Will AI take<br />your job?
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-slate-500">
            Get a personalised automation risk score, sector benchmark context, and a shareable report with practical next steps.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/analyze"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-7 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Check My Risk — it&apos;s free
            </Link>
            <Link
              href="/jobs"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-7 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Browse the job library
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400">
            <span>Task-level analysis</span>
            <span className="text-slate-200">·</span>
            <span>Sector benchmarks</span>
            <span className="text-slate-200">·</span>
            <span>Shareable reports</span>
            <span className="text-slate-200">·</span>
            <span>90-day plan</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-28 border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">How It Works</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Three steps, one clear plan.</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <span className="block text-xs font-bold tracking-[0.26em] text-slate-300">{step.n}</span>
                <h3 className="mt-4 text-xl font-bold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector Benchmarks */}
      <section id="role-benchmarks" className="scroll-mt-28 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Sector Benchmarks</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Context makes the score meaningful.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            A single percentage without comparison is noise. The benchmark view shows exactly where a role falls across its peer set.
          </p>
          <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50 p-6 md:p-8">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Example</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">Software Engineer — 58% risk</h3>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">High band</span>
            </div>
            <div className="relative pt-12 pb-8">
              <div className="absolute top-0 left-[58%] z-10 flex -translate-x-1/2 flex-col items-center">
                <span className="whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-bold text-white shadow">
                  58% — you
                </span>
                <div className="mt-0.5 h-7 w-px bg-slate-950" />
                <div className="h-3 w-3 rounded-full border-2 border-white bg-slate-950 shadow" />
              </div>
              <div className="flex h-7 overflow-hidden rounded-xl">
                <div className="h-full w-[40%] bg-emerald-400" />
                <div className="h-full w-[15%] bg-slate-400" />
                <div className="h-full w-[15%] bg-amber-400" />
                <div className="h-full w-[30%] bg-red-400" />
              </div>
              <div className="relative mt-1.5 text-xs text-slate-400">
                <span className="absolute left-0">0</span>
                <span className="absolute left-[40%] -translate-x-1/2">40</span>
                <span className="absolute left-[55%] -translate-x-1/2">55</span>
                <span className="absolute left-[70%] -translate-x-1/2">70</span>
                <span className="absolute right-0">100</span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: 'Low', range: '0–39', count: 12, tone: 'bg-emerald-400', current: false },
                { label: 'Medium', range: '40–54', count: 18, tone: 'bg-slate-400', current: false },
                { label: 'High', range: '55–69', count: 21, tone: 'bg-amber-400', current: true },
                { label: 'Very High', range: '70–100', count: 9, tone: 'bg-red-400', current: false },
              ].map((band) => (
                <div
                  key={band.label}
                  className={`rounded-2xl p-4 ${band.current ? 'bg-slate-900 text-white' : 'border border-slate-100 bg-white'}`}
                >
                  <div className={`mb-3 h-1 w-6 rounded-full ${band.tone}`} />
                  <p className={`text-xs font-medium ${band.current ? 'text-slate-400' : 'text-slate-500'}`}>{band.label}</p>
                  <p className={`mt-1 text-2xl font-black ${band.current ? 'text-white' : 'text-slate-900'}`}>{band.count}</p>
                  <p className="text-xs text-slate-400">{band.range}%{band.current ? ' ← you' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">FAQ</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Common questions.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-slate-950">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Find out where you stand.
          </h2>
          <p className="mt-4 text-slate-500">The analysis takes about two minutes and the report is yours to keep.</p>
          <Link
            href="/analyze"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Start free analysis →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
