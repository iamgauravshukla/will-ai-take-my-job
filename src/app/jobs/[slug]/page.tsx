import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { dbConnect } from '@/database/mongodb/connect';
import { Job } from '@/database/mongodb/schemas/Job';
import { getDetailedAnalysis, getToneClasses } from '@/lib/detailedAnalysis';

type PageProps = {
  params: Promise<{ slug: string }>;
};

type JobDocument = {
  title: string;
  slug: string;
  sector: string;
  description: string;
  automationRisk: number;
  riskLevel: string;
  summary?: string;
  estimatedTimeline?: string;
  highRiskTasks?: string[];
  lowRiskTasks?: string[];
  futureSkills?: string[];
  contentSections?: {
    overview?: string;
    taskBreakdown?: string;
    skillsNeeded?: string;
    actionPlan?: string;
  };
  detailedAnalysis?: {
    executiveTakeaway?: string;
    workComposition?: Array<{
      label: string;
      value: number;
      tone: 'red' | 'amber' | 'emerald' | 'slate';
      description: string;
    }>;
    scoreDrivers?: Array<{
      title: string;
      strength: 'Primary' | 'Secondary';
      detail: string;
    }>;
    durableAdvantage?: string[];
    marketSignals?: string[];
    roleEvolution?: Array<{
      phase: string;
      title: string;
      detail: string;
    }>;
    ninetyDayPlan?: Array<{
      title: string;
      detail: string;
    }>;
    toolingFocus?: string[];
  };
};

type SectorPeerDocument = {
  title: string;
  slug: string;
  sector: string;
  automationRisk: number;
  riskLevel: string;
  futureSkills?: string[];
};

type DistributionTone = 'red' | 'amber' | 'emerald' | 'slate';

type SectorInsights = {
  peerCount: number;
  sectorAverage: number;
  exposurePercentile: number;
  highestRisk: SectorPeerDocument;
  lowestRisk: SectorPeerDocument;
  closestRoles: SectorPeerDocument[];
  distribution: Array<{
    label: string;
    count: number;
    tone: DistributionTone;
  }>;
  topSkills: Array<{
    skill: string;
    count: number;
  }>;
};

const FALLBACK_JOBS: Record<string, JobDocument> = {
  'software-engineer': {
    title: 'Software Engineer',
    slug: 'software-engineer',
    sector: 'Technology',
    description: 'Designs, builds, and maintains software applications',
    automationRisk: 58,
    riskLevel: 'High',
    summary:
      'Software engineering is becoming increasingly AI-assisted. Repetitive coding and testing tasks are being automated, while architecture decisions, product trade-offs, and stakeholder collaboration remain strongly human-led.',
    estimatedTimeline: '2-3 years',
    highRiskTasks: [
      'Boilerplate code generation',
      'Basic unit test creation',
      'Routine bug triage',
      'Simple API scaffolding',
      'Documentation drafts',
    ],
    lowRiskTasks: [
      'System architecture decisions',
      'Cross-team technical leadership',
      'Product and business trade-off analysis',
      'Incident response under ambiguity',
    ],
    futureSkills: ['AI Workflow Design', 'Distributed Systems', 'Product Thinking', 'Technical Communication', 'Mentorship'],
    contentSections: {
      overview:
        'AI is accelerating software delivery by automating repetitive implementation work. Engineers who shift toward architecture, integration strategy, and product-centric execution will see higher long-term resilience.',
      taskBreakdown:
        'High-Risk Tasks (automation-prone):\n• CRUD and boilerplate generation\n• Basic test case writing\n• Repetitive refactors\n• Documentation formatting\n• Routine code reviews\n\nFuture-Proof Tasks (human-centric):\n• Architectural planning and platform evolution\n• Complex debugging with unclear root causes\n• Stakeholder alignment and roadmap translation\n• Security and risk decisions\n• Mentoring and team enablement',
      skillsNeeded:
        '1. **AI Tool Fluency** — Use copilots effectively for development acceleration\n2. **System Design** — Own architecture beyond individual tickets\n3. **Problem Framing** — Convert ambiguous business needs into executable plans\n4. **Communication** — Explain technical trade-offs clearly across teams\n5. **Leadership** — Drive technical direction and raise team output',
      actionPlan:
        'Phase 1 (Next 3 Months):\n1. Map your weekly tasks by automation potential\n2. Integrate one AI coding workflow into daily work\n3. Track measurable delivery improvements\n\nPhase 2 (6-12 Months):\n1. Take ownership of architecture-level decisions\n2. Build strengths in reliability, performance, and security\n3. Lead cross-functional technical initiatives\n\nPhase 3 (1-3 Years):\n1. Move toward senior/lead responsibilities\n2. Develop domain specialization that is hard to automate\n3. Build a portfolio of high-impact, human-led outcomes',
    },
  },
};

const FALLBACK_SECTOR_PEERS: Record<string, SectorPeerDocument[]> = {
  Technology: [
    {
      title: 'Software Engineer',
      slug: 'software-engineer',
      sector: 'Technology',
      automationRisk: 58,
      riskLevel: 'High',
      futureSkills: ['AI Workflow Design', 'Distributed Systems', 'Product Thinking', 'Technical Communication', 'Mentorship'],
    },
    {
      title: 'Frontend Developer',
      slug: 'frontend-developer',
      sector: 'Technology',
      automationRisk: 50,
      riskLevel: 'Medium',
      futureSkills: ['Design Systems', 'Accessibility', 'AI-Assisted UI Development'],
    },
    {
      title: 'Backend Developer',
      slug: 'backend-developer',
      sector: 'Technology',
      automationRisk: 55,
      riskLevel: 'High',
      futureSkills: ['Distributed Systems', 'Platform Reliability', 'API Design'],
    },
    {
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      sector: 'Technology',
      automationRisk: 42,
      riskLevel: 'Medium',
      futureSkills: ['Platform Engineering', 'Cloud Architecture', 'Incident Leadership'],
    },
    {
      title: 'Data Engineer',
      slug: 'data-engineer',
      sector: 'Technology',
      automationRisk: 45,
      riskLevel: 'Medium',
      futureSkills: ['Data Modeling', 'AI Data Pipelines', 'Governance'],
    },
    {
      title: 'QA Engineer',
      slug: 'qa-engineer',
      sector: 'Technology',
      automationRisk: 63,
      riskLevel: 'High',
      futureSkills: ['Quality Strategy', 'Test Architecture', 'Observability'],
    },
    {
      title: 'Machine Learning Engineer',
      slug: 'machine-learning-engineer',
      sector: 'Technology',
      automationRisk: 35,
      riskLevel: 'Low',
      futureSkills: ['Model Operations', 'Evaluation Design', 'Applied Research'],
    },
    {
      title: 'Solutions Architect',
      slug: 'solutions-architect',
      sector: 'Technology',
      automationRisk: 36,
      riskLevel: 'Low',
      futureSkills: ['Systems Thinking', 'Executive Communication', 'Enterprise Design'],
    },
  ],
};

function getFallbackJob(slug: string): JobDocument | null {
  return FALLBACK_JOBS[slug] || null;
}

function getFallbackSectorPeers(sector: string): SectorPeerDocument[] {
  return FALLBACK_SECTOR_PEERS[sector] || [];
}

function getDistributionTone(score: number): DistributionTone {
  if (score >= 70) return 'red';
  if (score >= 55) return 'amber';
  if (score >= 40) return 'slate';
  return 'emerald';
}

function buildSectorInsights(job: JobDocument, peers: SectorPeerDocument[]): SectorInsights {
  const normalizedPeers = peers.length > 0 ? peers : getFallbackSectorPeers(job.sector);
  const dedupedPeers = normalizedPeers.filter(
    (peer, index, arr) => arr.findIndex((candidate) => candidate.slug === peer.slug) === index
  );
  const peersWithCurrent = dedupedPeers.some((peer) => peer.slug === job.slug)
    ? dedupedPeers
    : [
        ...dedupedPeers,
        {
          title: job.title,
          slug: job.slug,
          sector: job.sector,
          automationRisk: job.automationRisk,
          riskLevel: job.riskLevel,
          futureSkills: job.futureSkills,
        },
      ];

  const sortedByRisk = [...peersWithCurrent].sort((left, right) => left.automationRisk - right.automationRisk);
  const peerCount = peersWithCurrent.length;
  const totalRisk = peersWithCurrent.reduce((sum, peer) => sum + peer.automationRisk, 0);
  const sectorAverage = Math.round(totalRisk / Math.max(1, peerCount));
  const lowerRiskCount = peersWithCurrent.filter((peer) => peer.automationRisk < job.automationRisk).length;
  const exposurePercentile = Math.round((lowerRiskCount / Math.max(1, peerCount)) * 100);
  const closestRoles = peersWithCurrent
    .filter((peer) => peer.slug !== job.slug)
    .sort((left, right) => Math.abs(left.automationRisk - job.automationRisk) - Math.abs(right.automationRisk - job.automationRisk))
    .slice(0, 4);

  const skillsMap = new Map<string, number>();
  for (const peer of peersWithCurrent) {
    for (const skill of peer.futureSkills || []) {
      const normalizedSkill = skill.trim();
      if (!normalizedSkill) {
        continue;
      }

      skillsMap.set(normalizedSkill, (skillsMap.get(normalizedSkill) || 0) + 1);
    }
  }

  const topSkills = [...skillsMap.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }));

  const distribution = [
    { label: 'Low', count: peersWithCurrent.filter((peer) => peer.automationRisk < 40).length, tone: 'emerald' as const },
    { label: 'Medium', count: peersWithCurrent.filter((peer) => peer.automationRisk >= 40 && peer.automationRisk < 55).length, tone: 'slate' as const },
    { label: 'High', count: peersWithCurrent.filter((peer) => peer.automationRisk >= 55 && peer.automationRisk < 70).length, tone: 'amber' as const },
    { label: 'Very High', count: peersWithCurrent.filter((peer) => peer.automationRisk >= 70).length, tone: 'red' as const },
  ];

  return {
    peerCount,
    sectorAverage,
    exposurePercentile,
    highestRisk: sortedByRisk[sortedByRisk.length - 1],
    lowestRisk: sortedByRisk[0],
    closestRoles,
    distribution,
    topSkills,
  };
}

function BenchmarkBar({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: number;
  note: string;
  tone: DistributionTone;
}) {
  const toneClasses = getToneClasses(tone);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{note}</p>
        </div>
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${toneClasses.bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RiskLandscape({
  items,
  currentScore,
  sector,
}: {
  items: SectorInsights['distribution'];
  currentScore: number;
  sector: string;
}) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  const bands: Array<{ key: string; from: number; to: number; tone: DistributionTone }> = [
    { key: 'Low', from: 0, to: 40, tone: 'emerald' },
    { key: 'Medium', from: 40, to: 55, tone: 'slate' },
    { key: 'High', from: 55, to: 70, tone: 'amber' },
    { key: 'Very High', from: 70, to: 100, tone: 'red' },
  ];
  const currentBand = bands.find((b) => currentScore >= b.from && currentScore < b.to) ?? bands[bands.length - 1];
  const bandToneText: Record<string, string> = {
    red: 'text-red-600', amber: 'text-amber-600', emerald: 'text-emerald-600', slate: 'text-slate-700',
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600 leading-relaxed">
        This bar spans the full 0–100 risk range across{' '}
        <span className="font-semibold text-slate-900">{total}</span> tracked {sector} roles.
        Colour bands represent risk tiers. The pin marks where this role sits at{' '}
        <span className={`font-semibold ${bandToneText[currentBand.tone]}`}>{currentScore}%</span>{' '}
        — <span className={`font-semibold ${bandToneText[currentBand.tone]}`}>{currentBand.key}</span> band.
      </p>

      <div className="relative pt-12 pb-6">
        {/* Marker pin */}
        <div
          className="absolute top-0 z-10 flex flex-col items-center"
          style={{ left: `${Math.min(98, Math.max(2, currentScore))}%`, transform: 'translateX(-50%)' }}
        >
          <span className="whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            {currentScore}% — you
          </span>
          <div className="mt-0.5 h-8 w-px bg-slate-900" />
          <div className="h-3 w-3 rounded-full border-2 border-white bg-slate-900 shadow-md" />
        </div>

        {/* Coloured scale bar */}
        <div className="flex h-8 w-full overflow-hidden rounded-2xl shadow-inner">
          {bands.map((band) => (
            <div
              key={band.key}
              className={getToneClasses(band.tone).bar}
              style={{ width: `${band.to - band.from}%` }}
            />
          ))}
        </div>

        {/* Boundary ticks */}
        <div className="relative mt-1.5">
          {[0, 40, 55, 70, 100].map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 text-xs text-slate-400"
              style={{ left: `${t}%` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Tier count tiles */}
      <div className="grid grid-cols-4 gap-3">
        {bands.map((band) => {
          const item = items.find((i) => i.label === band.key);
          const count = item?.count ?? 0;
          const pct = Math.round((count / total) * 100);
          const isCurrent = band.key === currentBand.key;
          const tc = getToneClasses(band.tone);
          return (
            <div
              key={band.key}
              className={`rounded-xl p-3 text-center ${
                isCurrent ? 'bg-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'bg-slate-50'
              }`}
            >
              <div className={`mx-auto mb-2 h-1 w-5 rounded-full ${isCurrent ? 'bg-white/50' : tc.bar}`} />
              <p className={`text-[11px] font-medium ${isCurrent ? 'text-slate-400' : 'text-slate-500'}`}>{band.key}</p>
              <p className={`text-xl font-black ${isCurrent ? 'text-white' : 'text-slate-900'}`}>{count}</p>
              <p className={`text-[11px] ${isCurrent ? 'text-slate-400' : 'text-slate-500'}`}>{pct}% of roles</p>
              {isCurrent && <p className="mt-0.5 text-[11px] font-bold text-indigo-300">← you</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getRiskColor(score: number): { bg: string; text: string; badge: string } {
  if (score < 30) return { bg: 'bg-emerald-50', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700' };
  if (score < 50) return { bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' };
  if (score < 70) return { bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-700' };
  return { bg: 'bg-red-50', text: 'text-red-900', badge: 'bg-red-100 text-red-700' };
}

function RiskProgressBar({ score }: { score: number }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let job: JobDocument | null = null;

  try {
    await dbConnect();
    const dbJob = await Job.findOne({ slug }).lean();
    job = dbJob as JobDocument | null;
  } catch {
    job = null;
  }

  const resolvedJob = job || getFallbackJob(slug);
  if (!resolvedJob) {
    return {
      title: 'Job Not Found | Will AI Take My Job?',
    };
  }

  return {
    title: `Will AI Replace ${resolvedJob.title}? | AI Risk Analysis`,
    description: `${resolvedJob.title} has an estimated ${resolvedJob.automationRisk}% automation risk. Learn high-risk tasks and future-proof skills.`,
    openGraph: {
      title: `Will AI Replace ${resolvedJob.title}?`,
      description: resolvedJob.summary || resolvedJob.description,
      url: `https://aitakejob.com/jobs/${resolvedJob.slug}`,
      type: 'article',
    },
  };
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  let job: JobDocument | null = null;
  let sectorPeers: SectorPeerDocument[] = [];

  try {
    await dbConnect();
    const dbJob = await Job.findOne({ slug }).lean();
    job = dbJob as JobDocument | null;

    if (job) {
      const dbPeers = await Job.find({ sector: job.sector })
        .select('title slug sector automationRisk riskLevel futureSkills')
        .sort({ automationRisk: 1 })
        .limit(48)
        .lean();
      sectorPeers = dbPeers as SectorPeerDocument[];
    }
  } catch {
    job = null;
    sectorPeers = [];
  }

  if (!job) {
    job = getFallbackJob(slug);
  }

  if (!job) {
    notFound();
  }

  const riskColors = getRiskColor(job.automationRisk);
  const sectorInsights = buildSectorInsights(job, sectorPeers);
  const detailedAnalysis = getDetailedAnalysis({
    jobTitle: job.title,
    sector: job.sector,
    automationRiskScore: job.automationRisk,
    riskLevel: job.riskLevel,
    highRiskTasks: job.highRiskTasks,
    lowRiskTasks: job.lowRiskTasks,
    futureSkills: job.futureSkills,
    timelineAssessment: job.estimatedTimeline,
    summary: job.summary,
    existingDetailedAnalysis: job.detailedAnalysis,
  });

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      <article className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{job.sector}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs uppercase tracking-widest text-slate-400">AI Automation Analysis</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          Will AI Replace{' '}
          <span className="text-indigo-600">{job.title}?</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed">{job.description}</p>

        {/* Primary Risk Metric Card */}
        <section className={`rounded-2xl border border-slate-200 ${riskColors.bg} p-8 mb-12`}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-3 uppercase tracking-wider">Automation Risk Score</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-6xl font-black text-slate-900">{job.automationRisk}%</span>
                <span className={`text-xl font-bold ${riskColors.text}`}>{job.riskLevel}</span>
              </div>
              <RiskProgressBar score={job.automationRisk} />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-2">Estimated Timeline</p>
              <p className="text-2xl font-bold text-slate-900">{job.estimatedTimeline}</p>
              <p className="text-xs text-slate-500 mt-2">Until significant automation</p>
            </div>
          </div>
        </section>

        {/* Sector Benchmark */}
        <section className="mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Sector Benchmark</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Live comparison against {sectorInsights.peerCount} tracked roles in {job.sector}.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Data-backed</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-7">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Sector Average</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{sectorInsights.sectorAverage}%</p>
                <p className="mt-1 text-xs text-slate-500">
                  This role is{' '}
                  <span className={job.automationRisk > sectorInsights.sectorAverage ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                    {Math.abs(job.automationRisk - sectorInsights.sectorAverage)}%{' '}
                    {job.automationRisk > sectorInsights.sectorAverage ? 'above' : 'below'}
                  </span>{' '}average
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Risk Percentile</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{sectorInsights.exposurePercentile}th</p>
                <p className="mt-1 text-xs text-slate-500">{sectorInsights.exposurePercentile}% of peer roles have lower exposure</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Peer Roles</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{sectorInsights.peerCount}</p>
                <p className="mt-1 text-xs text-slate-500">Comparable {job.sector} roles tracked</p>
              </div>
            </div>

            <div className="space-y-4">
              <BenchmarkBar label={job.title} value={job.automationRisk} note="This role" tone={getDistributionTone(job.automationRisk)} />
              <BenchmarkBar label={`${job.sector} sector average`} value={sectorInsights.sectorAverage} note="Average across all tracked peer roles" tone={getDistributionTone(sectorInsights.sectorAverage)} />
              <BenchmarkBar label={sectorInsights.highestRisk.title} value={sectorInsights.highestRisk.automationRisk} note="Highest exposure in peer set" tone={getDistributionTone(sectorInsights.highestRisk.automationRisk)} />
              <BenchmarkBar label={sectorInsights.lowestRisk.title} value={sectorInsights.lowestRisk.automationRisk} note="Lowest exposure in peer set" tone={getDistributionTone(sectorInsights.lowestRisk.automationRisk)} />
            </div>
          </div>
        </section>

        {/* Risk Landscape */}
        <section className="mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Risk Landscape: Where {job.title} Sits</h2>
            <RiskLandscape items={sectorInsights.distribution} currentScore={job.automationRisk} sector={job.sector} />
          </div>
        </section>

        {/* Overview Section */}
        {(job.summary || detailedAnalysis.executiveTakeaway) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <p className="text-slate-700 leading-relaxed text-lg">{detailedAnalysis.executiveTakeaway || job.summary}</p>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Why This Score Looks Like This</h2>
          <p className="text-sm text-slate-500 mb-6">The key factors driving the automation exposure estimate for this role.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {detailedAnalysis.scoreDrivers.map((driver, index) => (
              <div key={index} className={`relative overflow-hidden rounded-2xl border bg-white p-6 ${
                driver.strength === 'Primary' ? 'border-indigo-200' : 'border-slate-200'
              }`}>
                <div className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${
                  driver.strength === 'Primary' ? 'bg-indigo-500' : 'bg-slate-300'
                }`} />
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  driver.strength === 'Primary' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {driver.strength} driver
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{driver.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{driver.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Task Risk Breakdown */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Task-Level Risk Analysis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <h3 className="text-lg font-bold text-slate-900">High-Risk Tasks</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">These tasks are most likely to be automated in the near term:</p>
              <ul className="space-y-2">
                {job.highRiskTasks?.map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 rounded-lg bg-red-50 px-3 py-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <h3 className="text-lg font-bold text-slate-900">Future-Proof Tasks</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">These tasks remain resilient and will likely increase in importance:</p>
              <ul className="space-y-2">
                {job.lowRiskTasks?.map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 rounded-lg bg-emerald-50 px-3 py-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                      ✓
                    </span>
                    <span className="text-sm text-slate-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Work Composition Snapshot</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
            {detailedAnalysis.workComposition.map((item, index) => {
              const toneClasses = getToneClasses(item.tone);

              return (
                <div key={index}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses.chip}`}>
                        {item.label}
                      </span>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${toneClasses.bar}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skill Development Roadmap */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills to Develop for Future-Proofing</h2>
          <p className="text-slate-600 mb-6">Invest in these skills to remain competitive and irreplaceable:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.futureSkills?.map((skill: string, index: number) => (
              <div key={index} className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-slate-900">{skill}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Where Humans Keep The Edge</h2>
            <ul className="space-y-3">
              {detailedAnalysis.durableAdvantage.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-1 text-emerald-500">●</span>
                  <span className="text-slate-700 leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Market Signals To Watch</h2>
            <ul className="space-y-3">
              {detailedAnalysis.marketSignals.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-1 text-indigo-500">●</span>
                  <span className="text-slate-700 leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Nearby Roles In {job.sector}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Roles with risk profiles closest to {job.title}, useful for comparison and transition planning.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sectorInsights.closestRoles.map((peer) => {
              const delta = peer.automationRisk - job.automationRisk;

              return (
                <Link
                  key={peer.slug}
                  href={`/jobs/${peer.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-lg"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500">{peer.sector}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{peer.title}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">{peer.automationRisk}%</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRiskColor(peer.automationRisk).badge}`}>
                      {delta === 0 ? 'Same band' : delta > 0 ? `+${delta}% vs current` : `${delta}% vs current`}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${getToneClasses(getDistributionTone(peer.automationRisk)).bar}`} style={{ width: `${peer.automationRisk}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {sectorInsights.topSkills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills Appearing Across Peer Roles</h2>
            <p className="text-slate-600 mb-6">
              Dynamic skill signals pulled from related roles in the same sector.
            </p>
            <div className="flex flex-wrap gap-3">
              {sectorInsights.topSkills.map((item) => (
                <div key={item.skill} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                  <span className="text-sm font-semibold text-slate-900">{item.skill}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Content Sections */}
        {job.contentSections?.taskBreakdown && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Detailed Task Breakdown</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.contentSections.taskBreakdown}</p>
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Role Evolution Over The Next 24 Months</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-slate-200" />
            <div className="grid md:grid-cols-3 gap-5 relative">
              {detailedAnalysis.roleEvolution.map((step, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-indigo-600 bg-white text-xs font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">90-Day De-Risking Plan</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {detailedAnalysis.ninetyDayPlan.map((step, index) => (
              <div key={index} className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white mb-4 shadow-md shadow-indigo-200">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tools &amp; Workflow Focus</h2>
          <p className="text-sm text-slate-500 mb-4">Skills and tools worth prioritising to stay ahead of automation in this role.</p>
          <div className="flex flex-wrap gap-2">
            {detailedAnalysis.toolingFocus.map((item, index) => (
              <span key={index} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-800">
                {item}
              </span>
            ))}
          </div>
        </section>

        {job.contentSections?.skillsNeeded && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills Development Path</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.contentSections.skillsNeeded}</p>
            </div>
          </section>
        )}

        {job.contentSections?.actionPlan && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Actionable Recommendations</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.contentSections.actionPlan}</p>
            </div>
          </section>
        )}

        {/* Methodology Note */}
        <section className="rounded-2xl bg-indigo-50 border border-indigo-200 p-6 mb-12">
          <h3 className="font-bold text-slate-900 mb-2">Research Methodology</h3>
          <p className="text-sm text-slate-700">
            This analysis is based on AI-driven assessment of task automation potential, industry trends, and skills evolution. 
            Results reflect current technology capabilities and may evolve as AI advances. Personal factors including experience level, 
            specialization, and continuous learning significantly impact individual risk.
          </p>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-8 text-white text-center">
          <p className="text-indigo-300 text-sm uppercase tracking-widest mb-3">Your Turn</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How exposed is your specific role?</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            The analysis above reflects the {job.title} role in general. Get a personalized score based on your actual tasks, experience, and context.
          </p>
          <a
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-8 py-4 font-bold text-lg hover:bg-indigo-50 transition"
          >
            Check My Risk Free →
          </a>
        </div>
      </article>
      <Footer />
    </main>
  );
}
