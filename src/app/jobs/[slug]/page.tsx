import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import SimpleFooter from '@/components/SimpleFooter';
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
    <div className="group">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">{label}</p>
          <p className="text-xs text-slate-500">{note}</p>
        </div>
        <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">{value}%</span>
      </div>
      <div className="h-5 overflow-hidden rounded-full bg-gradient-to-r from-slate-100 to-slate-50 shadow-sm border border-slate-200/50">
        <div 
          className={`h-full ${toneClasses.bar} transition-all duration-700 ease-out rounded-full shadow-sm group-hover:shadow-md`} 
          style={{ width: `${value}%` }}
        />
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
    <main className="w-full min-h-screen bg-white">
      <Navigation />
      <article className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-slideInUp">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
            <i className="fa-solid fa-briefcase text-indigo-600"></i>
            {job.sector}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-1.5 font-medium">
            <i className="fa-solid fa-robot text-slate-400"></i>
            AI Risk Analysis
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight animate-slideInUp" style={{ animationDelay: '0.05s' }}>
          Will AI Replace{' '}
          <span className="relative pb-2">
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text animate-rotateGradient">{job.title}?</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300/50 via-blue-300/50 to-transparent rounded-full"></span>
          </span>
        </h1>
        <p className="text-lg text-slate-600 mb-14 max-w-2xl leading-relaxed animate-slideInUp" style={{ animationDelay: '0.1s' }}>{job.description}</p>

        {/* Primary Risk Metric Card */}
        <section className={`rounded-3xl border border-indigo-200/60 ${riskColors.bg} p-12 mb-24 animate-slideInUp hover:shadow-2xl transition-all duration-300 relative overflow-hidden`} style={{ animationDelay: '0.15s' }}>
          {/* Subtle gradient background */}
          <div className="absolute inset-0 opacity-5 background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.1))"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-5">
                <i className="fa-solid fa-chart-pie text-indigo-600 text-lg"></i>
                <p className="text-sm text-slate-700 uppercase tracking-wider font-bold">Automation Risk Score</p>
              </div>
              
              {/* Large Risk Percentage with Emphasis */}
              <div className="mb-8 space-y-4">
                <div className="flex items-baseline gap-5">
                  <span className="text-9xl md:text-10xl font-black text-slate-900 leading-none drop-shadow-lg">{job.automationRisk}%</span>
                  <div>
                    <span className={`inline-block text-base font-bold px-5 py-2.5 rounded-full shadow-md ${riskColors.badge}`}>
                      {job.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Progress Bar with Glow */}
              <div className="space-y-3">
                <div className="relative">
                  <RiskProgressBar score={job.automationRisk} />
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-indigo-400/20 to-transparent blur-lg"></div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Risk exposure across all tracked professionals</p>
              </div>
            </div>
            
            {/* Timeline Section */}
            <div className="md:border-l-2 md:border-slate-200 md:pl-10">
              <div className="flex items-center gap-2 mb-4 justify-start md:justify-start">
                <i className="fa-solid fa-hourglass-end text-amber-600 text-lg"></i>
                <p className="text-sm text-slate-600 font-bold">Predicted Timeline</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-slate-900">{job.estimatedTimeline}</p>
                <p className="text-xs text-slate-500">Before significant change</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sector Benchmark */}
        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-2xl transition-all duration-300 shadow-lg">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-chart-bar text-indigo-600 text-xl"></i>
                  <h2 className="text-2xl font-bold text-slate-900">Sector Benchmark</h2>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Live comparison against {sectorInsights.peerCount} tracked roles in {job.sector}.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 flex items-center gap-1">
                <i className="fa-solid fa-database text-indigo-600"></i>
                Data-backed
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-10">
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-7 hover:from-slate-100 hover:to-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 hover:border-indigo-300 group cursor-default">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fa-solid fa-flag text-slate-600 group-hover:text-indigo-600 transition-colors text-lg"></i>
                  <p className="text-xs uppercase tracking-wide text-slate-600 font-bold">Sector Average</p>
                </div>
                <p className="mb-3 text-5xl font-black text-slate-900">{sectorInsights.sectorAverage}%</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This role is{' '}
                  <span className={job.automationRisk > sectorInsights.sectorAverage ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {Math.abs(job.automationRisk - sectorInsights.sectorAverage)}%{' '}
                    {job.automationRisk > sectorInsights.sectorAverage ? 'above' : 'below'}
                  </span>{' '}
                  average
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-7 hover:from-slate-100 hover:to-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-indigo-200/40 hover:border-indigo-300 group cursor-default shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fa-solid fa-chart-line text-indigo-600 group-hover:text-indigo-700 transition-colors text-lg"></i>
                  <p className="text-xs uppercase tracking-wide text-slate-700 font-bold">Risk Percentile</p>
                </div>
                <p className="mb-3 text-5xl font-black text-slate-900">{sectorInsights.exposurePercentile}th</p>
                <p className="text-xs text-slate-600 leading-relaxed">{sectorInsights.exposurePercentile}% of peer roles have lower risk</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-7 hover:from-slate-100 hover:to-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-indigo-200/40 hover:border-indigo-300 group cursor-default shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fa-solid fa-people-group text-indigo-600 group-hover:text-indigo-700 transition-colors text-lg"></i>
                  <p className="text-xs uppercase tracking-wide text-slate-700 font-bold">Peer Roles</p>
                </div>
                <p className="mb-3 text-5xl font-black text-slate-900">{sectorInsights.peerCount}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{job.sector} roles in our database</p>
              </div>
            </div>

            <div className="space-y-6">
              <BenchmarkBar label={job.title} value={job.automationRisk} note="This role" tone={getDistributionTone(job.automationRisk)} />
              <BenchmarkBar label={`${job.sector} sector average`} value={sectorInsights.sectorAverage} note="Average across all tracked peer roles" tone={getDistributionTone(sectorInsights.sectorAverage)} />
              <BenchmarkBar label={sectorInsights.highestRisk.title} value={sectorInsights.highestRisk.automationRisk} note="Highest exposure in peer set" tone={getDistributionTone(sectorInsights.highestRisk.automationRisk)} />
              <BenchmarkBar label={sectorInsights.lowestRisk.title} value={sectorInsights.lowestRisk.automationRisk} note="Lowest exposure in peer set" tone={getDistributionTone(sectorInsights.lowestRisk.automationRisk)} />
            </div>
          </div>
        </section>

        {/* Risk Landscape */}
        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.25s' }}>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-2xl transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-mountain-sun text-indigo-600 text-xl"></i>
              <h2 className="text-2xl font-bold text-slate-900">Risk Landscape: Where {job.title} Sits</h2>
            </div>
            <RiskLandscape items={sectorInsights.distribution} currentScore={job.automationRisk} sector={job.sector} />
          </div>
        </section>

        {/* Overview Section */}
        {(job.summary || detailedAnalysis.executiveTakeaway) && (
          <section className="mb-16 animate-slideInUp" style={{ animationDelay: '0.28s' }}>
            <div className="flex items-center gap-2 mb-5">
              <i className="fa-solid fa-binoculars text-indigo-600 text-xl"></i>
              <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
            </div>
            <p className="text-slate-700 leading-8 text-lg bg-gradient-to-r from-indigo-50/70 to-blue-50/70 rounded-xl p-7 border-l-4 border-indigo-600 border-slate-200">{detailedAnalysis.executiveTakeaway || job.summary}</p>
          </section>
        )}

        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.31s' }}>
          <div className="flex items-center gap-2 mb-8">
            <i className="fa-solid fa-sliders text-indigo-600 text-xl"></i>
            <h2 className="text-3xl font-bold text-slate-900">Why This Score Looks Like This</h2>
          </div>
          <p className="text-sm text-slate-600 mb-8 font-medium">The key factors driving the automation exposure estimate for this role.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {detailedAnalysis.scoreDrivers.map((driver, index) => (
              <div key={index} className={`relative overflow-hidden rounded-2xl border bg-white p-7 hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300 cursor-default shadow-md ${
                driver.strength === 'Primary' ? 'border-indigo-200 shadow-lg shadow-indigo-100/50' : 'border-indigo-200/40'
              }`}>
                <div className={`absolute inset-y-0 left-0 w-1.5 rounded-l-2xl ${
                  driver.strength === 'Primary' ? 'bg-indigo-500' : 'bg-slate-300'
                }`} />
                <div className="flex items-center gap-2 mb-3">
                  <i className={`text-lg ${driver.strength === 'Primary' ? 'fa-solid fa-arrow-trend-up text-indigo-600' : 'fa-solid fa-arrow-trend-down text-slate-400'}`}></i>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    driver.strength === 'Primary' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {driver.strength} driver
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{driver.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{driver.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Task Risk Breakdown */}
        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.34s' }}>
          <div className="flex items-center gap-2 mb-8">
            <i className="fa-solid fa-tasks text-indigo-600 text-xl"></i>
            <h2 className="text-3xl font-bold text-slate-900">Task-Level Risk Analysis</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-red-200/60 bg-gradient-to-br from-white to-red-50/30 p-8 hover:shadow-2xl hover:border-red-300 hover:-translate-y-2 transition-all duration-300 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                <h3 className="text-lg font-bold text-slate-900">High-Risk Tasks</h3>
              </div>
              <p className="text-sm text-slate-600 mb-5">These tasks are most likely to be automated in the near term:</p>
              <ul className="space-y-3">
                {job.highRiskTasks?.map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 rounded-lg bg-red-50/80 hover:bg-red-100/60 px-4 py-3 border border-red-200/40 hover:border-red-300/60 transition-all duration-200 group">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/30 p-8 hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <i className="fa-solid fa-shield-check text-emerald-600 text-xl"></i>
                <h3 className="text-lg font-bold text-slate-900">Future-Proof Tasks</h3>
              </div>
              <p className="text-sm text-slate-600 mb-5">These tasks remain resilient and will likely increase in importance:</p>
              <ul className="space-y-3">
                {job.lowRiskTasks?.map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 rounded-lg bg-emerald-50/80 hover:bg-emerald-100/60 px-4 py-3 border border-emerald-200/40 hover:border-emerald-300/60 transition-all duration-200 group">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600 flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <i className="fa-solid fa-check text-xs"></i>
                    </span>
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.37s' }}>
          <div className="flex items-center gap-3 mb-12">
            <i className="fa-solid fa-pie-chart text-indigo-600 text-2xl"></i>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Work Composition Snapshot</h2>
              <p className="text-sm text-slate-600 font-medium mt-1">How automation impact breaks down across your key responsibilities</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
            {/* Left side - Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-72 h-72">
                {/* Donut Chart SVG */}
                <svg className="w-full h-full" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
                  {(() => {
                    const total = detailedAnalysis.workComposition.reduce((sum, x) => sum + x.value, 0);
                    const radius = 80;
                    const innerRadius = 50;
                    let currentAngle = 0;
                    
                    const colorMap = { red: '#ef4444', amber: '#f59e0b', slate: '#64748b', emerald: '#10b981' };

                    return detailedAnalysis.workComposition.map((item, index) => {
                      const percentage = item.value / total;
                      const sliceAngle = percentage * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + sliceAngle;
                      currentAngle = endAngle;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const cx = 120, cy = 120;

                      const x1 = cx + radius * Math.cos(startRad);
                      const y1 = cy + radius * Math.sin(startRad);
                      const x2 = cx + radius * Math.cos(endRad);
                      const y2 = cy + radius * Math.sin(endRad);

                      const ix1 = cx + innerRadius * Math.cos(startRad);
                      const iy1 = cy + innerRadius * Math.sin(startRad);
                      const ix2 = cx + innerRadius * Math.cos(endRad);
                      const iy2 = cy + innerRadius * Math.sin(endRad);

                      const largeArc = sliceAngle > 180 ? 1 : 0;

                      const pathData = [
                        `M ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                        `L ${ix2} ${iy2}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
                        'Z'
                      ].join(' ');

                      return (
                        <path
                          key={index}
                          d={pathData}
                          fill={colorMap[item.tone]}
                          opacity="0.9"
                          className="hover:opacity-100 transition-opacity duration-300"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                        />
                      );
                    });
                  })()}
                </svg>
                
                {/* Center text - always on top */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-slate-900">100%</span>
                  <span className="text-sm text-slate-600 font-semibold mt-2 uppercase tracking-wider">Your Work</span>
                </div>
              </div>
            </div>

            {/* Right side - Composition Score Cards */}
            <div className="flex flex-col justify-center space-y-4">
              {detailedAnalysis.workComposition.map((item, index) => {
                const toneClasses = getToneClasses(item.tone);
                const icons = ['fa-solid fa-robot', 'fa-solid fa-person', 'fa-solid fa-chart-line', 'fa-solid fa-timer'];
                const icon = icons[index] || icons[0];
                const colorBg = item.tone === 'red' ? 'from-red-50/80 to-red-50/40' : item.tone === 'amber' ? 'from-amber-50/80 to-amber-50/40' : item.tone === 'slate' ? 'from-slate-50/80 to-slate-50/40' : 'from-emerald-50/80 to-emerald-50/40';
                const colorBorder = item.tone === 'red' ? 'border-red-200' : item.tone === 'amber' ? 'border-amber-200' : item.tone === 'slate' ? 'border-slate-200' : 'border-emerald-200';
                const labelColor = item.tone === 'red' ? 'text-red-700' : item.tone === 'amber' ? 'text-amber-700' : item.tone === 'slate' ? 'text-slate-700' : 'text-emerald-700';

                return (
                  <div key={index} className={`relative overflow-hidden rounded-2xl border ${colorBorder} bg-gradient-to-r ${colorBg} p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default shadow-md`}>
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${toneClasses.chip} group-hover:scale-110 transition-transform`}>
                        <i className={icon}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${labelColor}`}>{item.label}</p>
                        <p className="text-sm text-slate-700 font-medium truncate">{item.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">{item.value}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed breakdown bars */}
          <div className="space-y-5 p-8 rounded-2xl border border-indigo-200/40 bg-gradient-to-br from-indigo-50/50 to-blue-50/40">
            <p className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6">Detailed breakdown</p>
            {detailedAnalysis.workComposition.map((item, index) => {
              const toneClasses = getToneClasses(item.tone);
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{item.label}</label>
                    <span className="text-xs font-bold text-slate-600 bg-white/60 px-2.5 py-1 rounded-full group-hover:bg-white transition-all">{item.value}%</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/60 border border-slate-200/50 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                    <div 
                      className={`h-full ${toneClasses.bar} transition-all duration-700 ease-out rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skill Development Roadmap */}
        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 mb-8">
            <i className="fa-solid fa-graduation-cap text-indigo-600 text-xl"></i>
            <h2 className="text-3xl font-bold text-slate-900">Skills to Develop for Future-Proofing</h2>
          </div>
          <p className="text-slate-600 mb-7 font-medium">Invest in these skills to remain competitive and irreplaceable:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {job.futureSkills?.map((skill: string, index: number) => (
              <div key={index} className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/60 p-5 hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300 group cursor-default shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-indigo-700 group-hover:scale-110 transition-all">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{skill}</p>
                  <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-indigo-400 transition-colors ml-auto text-xs group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20 animate-slideInUp" style={{ animationDelay: '0.43s' }}>
          <div className="rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-white to-emerald-50/30 p-8 hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-crown text-emerald-600 text-xl"></i>
              <h2 className="text-3xl font-bold text-slate-900">Where Humans Keep The Edge</h2>
            </div>
            <ul className="space-y-4">
              {detailedAnalysis.durableAdvantage.map((item, index) => (
                <li key={index} className="flex gap-3 group">
                  <i className="fa-solid fa-star text-emerald-500 text-lg flex-shrink-0 mt-0.5 group-hover:text-emerald-600 transition-colors"></i>
                  <span className="text-slate-700 leading-7 group-hover:text-slate-900 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 p-8 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-radar text-blue-600 text-xl"></i>
              <h2 className="text-3xl font-bold text-slate-900">Market Signals To Watch</h2>
            </div>
            <ul className="space-y-4">
              {detailedAnalysis.marketSignals.map((item, index) => (
                <li key={index} className="flex gap-3 group">
                  <i className="fa-solid fa-lightbulb text-indigo-500 text-lg flex-shrink-0 mt-0.5 group-hover:text-indigo-600 transition-colors"></i>
                  <span className="text-slate-700 leading-7 group-hover:text-slate-900 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.46s' }}>
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <i className="fa-solid fa-compass text-indigo-600 text-2xl"></i>
                <h2 className="text-3xl font-bold text-slate-900">Nearby Roles In {job.sector}</h2>
              </div>
              <p className="text-base text-slate-600 font-medium leading-relaxed">
                Explore similar positions with comparable automation risk. Perfect for career transitions and skill planning.
              </p>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-2">
            {sectorInsights.closestRoles.slice(0, 4).map((peer) => {
              const delta = peer.automationRisk - job.automationRisk;
              const riskColor = getRiskColor(peer.automationRisk);
              const toneClasses = getToneClasses(getDistributionTone(peer.automationRisk));
              const isHigher = delta > 0;
              const isSame = delta === 0;

              return (
                <Link
                  key={peer.slug}
                  href={`/jobs/${peer.slug}`}
                  className={`relative overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-3xl hover:-translate-y-3 group cursor-pointer p-8 shadow-lg ${
                    peer.automationRisk >= 70 ? 'border-red-200 bg-gradient-to-br from-white to-red-50/30' :
                    peer.automationRisk >= 55 ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/30' :
                    peer.automationRisk >= 40 ? 'border-slate-200 bg-gradient-to-br from-white to-slate-50/30' :
                    'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30'
                  }`}
                >
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-5 group-hover:opacity-15 transition-opacity ${toneClasses.bar}`} />
                  
                  {/* Corner Badge - Risk Level */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-md ${
                      peer.automationRisk >= 70 ? 'bg-red-100 text-red-700' :
                      peer.automationRisk >= 55 ? 'bg-amber-100 text-amber-700' :
                      peer.automationRisk >= 40 ? 'bg-slate-100 text-slate-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      <i className={`text-xs ${
                        peer.automationRisk >= 70 ? 'fa-solid fa-triangle-exclamation' :
                        peer.automationRisk >= 55 ? 'fa-solid fa-circle-exclamation' :
                        peer.automationRisk >= 40 ? 'fa-solid fa-minus' :
                        'fa-solid fa-shield-check'
                      }`}></i>
                      {peer.riskLevel}
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Title Section */}
                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                        {peer.sector} Role
                      </p>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight mb-2">
                        {peer.title}
                      </h3>
                      <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        Automation potential analysis
                      </p>
                    </div>
                    
                    {/* Risk Score Emphasized */}
                    <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/60 border border-slate-200/60 hover:border-indigo-300/60 transition-all">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Automation Risk Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors leading-none">{peer.automationRisk}</span>
                        <span className="text-2xl font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">%</span>
                      </div>
                    </div>
                    
                    {/* Delta Comparison */}
                    <div className="mb-6">
                      {!isSame && (
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-sm transition-all ${
                          isHigher ? 'bg-red-100/70 text-red-700' : 'bg-emerald-100/70 text-emerald-700'
                        }`}>
                          <i className={`text-lg ${
                            isHigher ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'
                          }`}></i>
                          <span>{isHigher ? '+' : ''}{delta}% {isHigher ? 'higher' : 'lower'} risk</span>
                        </div>
                      )}
                      {isSame && (
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-sm bg-slate-100/70 text-slate-700">
                          <i className="fa-solid fa-equals text-lg"></i>
                          <span>Similar risk profile</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">Risk Exposure</span>
                        <span className="text-xs font-bold text-slate-900">{peer.automationRisk}%</span>
                      </div>
                      <div className="relative h-3.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                        <div 
                          className={`h-full ${toneClasses.bar} transition-all duration-700 ease-out rounded-full shadow-sm relative`}
                          style={{ width: `${peer.automationRisk}%` }}
                        >
                          {/* Moving shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Future Skills or CTA */}
                    <div className="mt-auto pt-4 border-t border-slate-200/60 group-hover:border-indigo-300/60 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">Explore Role</span>
                        <i className="fa-solid fa-arrow-right w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-all opacity-50 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-1 transform"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {sectorInsights.topSkills.length > 0 && (
          <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.49s' }}>
            <div className="flex items-center gap-2 mb-8">
              <i className="fa-solid fa-network-wired text-indigo-600 text-xl"></i>
              <h2 className="text-3xl font-bold text-slate-900">Skills Appearing Across Peer Roles</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Dynamic skill signals pulled from related roles in the same sector.
            </p>
            <div className="flex flex-wrap gap-3">
              {sectorInsights.topSkills.map((item) => (
                <div key={item.skill} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 group cursor-default">
                  <i className="fa-solid fa-tag text-slate-400 group-hover:text-indigo-600 transition-colors text-xs"></i>
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.skill}</span>
                  <span className="rounded-full bg-slate-100 group-hover:bg-indigo-200 px-2 py-0.5 text-xs font-bold text-slate-600 group-hover:text-indigo-700 transition-all">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Content Sections */}
        {job.contentSections?.taskBreakdown && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Detailed Task Breakdown</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.contentSections.taskBreakdown}</p>
            </div>
          </section>
        )}

        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.52s' }}>
          <div className="flex items-center gap-2 mb-8">
            <i className="fa-solid fa-timeline text-indigo-600 text-xl"></i>
            <h2 className="text-3xl font-bold text-slate-900">Role Evolution Over The Next 24 Months</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
            <div className="grid md:grid-cols-3 gap-5 relative">
              {detailedAnalysis.roleEvolution.map((step, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 group shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-50 text-xs font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      {index + 1}
                    </div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-all duration-300">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 group-hover:text-slate-700 transition-colors">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16 animate-slideInUp" style={{ animationDelay: '0.55s' }}>
          <div className="flex items-center gap-2 mb-6">
            <i className="fa-solid fa-rocket text-indigo-600 text-xl"></i>
            <h2 className="text-2xl font-bold text-slate-900">90-Day De-Risking Plan</h2>
          </div>
          <div className="relative">
            {/* Timeline connecting line - desktop only */}
            <div className="hidden md:block absolute top-12 left-[calc(50%-0.5px)] right-0 h-1 bg-gradient-to-r from-indigo-200 via-indigo-300 to-transparent" style={{ width: 'calc(100% - 60px)' }} />
            
            <div className="grid md:grid-cols-3 gap-6 relative">
              {detailedAnalysis.ninetyDayPlan.map((step, index) => (
                <div key={index} className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
                  {/* Step number badge */}
                  <div className="mb-4 inline-flex items-center justify-center">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-lg group-hover:bg-indigo-400/30 transition-all"></div>
                      
                      {/* Number circle */}
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-lg font-bold text-white shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-all group-hover:scale-110">
                        <span className="text-xl">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 group-hover:text-slate-700 transition-colors">{step.detail}</p>
                  
                  {/* Timeline dot indicator for bottom - desktop only */}
                  {index < 2 && (
                    <div className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 -translate-x-1/2">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-300 bg-white shadow-md"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20 animate-slideInUp" style={{ animationDelay: '0.58s' }}>
          <div className="flex items-center gap-2 mb-8">
            <i className="fa-solid fa-wrench text-indigo-600 text-xl"></i>
            <h2 className="text-3xl font-bold text-slate-900">Tools &amp; Workflow Focus</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6">Skills and tools worth prioritising to stay ahead of automation in this role.</p>
          <div className="flex flex-wrap gap-2">
            {detailedAnalysis.toolingFocus.map((item, index) => (
              <span key={index} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md transition-all duration-300 group cursor-default flex items-center gap-2 shadow-sm">
                <i className="fa-solid fa-star text-indigo-600 text-xs"></i>
                {item}
              </span>
            ))}
          </div>
        </section>

        {job.contentSections?.skillsNeeded && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Skills Development Path</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.contentSections.skillsNeeded}</p>
            </div>
          </section>
        )}

        {job.contentSections?.actionPlan && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Actionable Recommendations</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.contentSections.actionPlan}</p>
            </div>
          </section>
        )}

        {/* Methodology Note */}
        <section className="rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-indigo-200/40 p-8 mb-16 animate-slideInUp shadow-md" style={{ animationDelay: '0.61s' }}>
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-microscope text-slate-500 text-lg flex-shrink-0 mt-0.5"></i>
            <div>
              <h3 className="font-bold text-slate-700 mb-1 text-sm">Research Methodology</h3>
              <p className="text-xs text-slate-600 leading-6">
                This analysis is based on AI-driven assessment of task automation potential, industry trends, and skills evolution. 
                Results reflect current technology capabilities and may evolve as AI advances. Personal factors including experience level, 
                specialization, and continuous learning significantly impact individual risk.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 md:p-20 text-white text-center animate-slideInUp relative overflow-hidden shadow-2xl" style={{ animationDelay: '0.64s' }}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl animate-blob-delayed"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-indigo-200 text-sm uppercase tracking-widest mb-5 font-bold">Ready for your personalized assessment?</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">How exposed is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">your specific role?</span></h2>
            <p className="text-slate-200 mb-12 text-lg leading-relaxed">
              Get a personalized automation risk score based on your actual tasks, experience level, and context.
            </p>
            
            {/* Trust line */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400"></i>
                Free
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400"></i>
                No login required
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400"></i>
                2 minutes
              </span>
            </div>
            
            {/* CTA Button */}
            <a
              href="/analyze"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-slate-900 px-12 md:px-16 py-6 font-bold text-lg md:text-xl hover:bg-indigo-50 hover:shadow-3xl hover:shadow-indigo-600/50 transition-all duration-300 transform hover:scale-110 group shadow-xl"
            >
              <i className="fa-solid fa-zap text-amber-500 text-xl"></i>
              <span>Check My Risk Free</span>
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </article>
      <SimpleFooter />
    </main>
  );
}
