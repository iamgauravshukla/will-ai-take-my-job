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

function BenchmarkBar({ label, value, note, tone }: { label: string; value: number; note: string; tone: DistributionTone }) {
  const toneClasses = getToneClasses(tone);
  return (
    <div className="border-[2px] border-ink bg-parchment p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="w-full sm:w-1/3 shrink-0">
        <p className="font-display uppercase tracking-wider text-xl">{label}</p>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">{note}</p>
      </div>
      <div className="w-full sm:flex-1 h-8 border-[2px] border-ink bg-transparent flex">
        <div className={`h-full border-r-[2px] border-ink ${toneClasses.bar}`} style={{ width: `${value}%` }} />
      </div>
      <span className="font-display text-3xl sm:-mt-1 w-12 text-right shrink-0">{value}%</span>
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

  return (
    <div className="space-y-6">
      <p className="text-sm font-medium leading-relaxed opacity-80 uppercase tracking-widest border-l-4 border-accent pl-4">
        SPANNING THE FULL 0–100 RISK RANGE ACROSS{' '}
        <span className="font-black text-ink">{total}</span> TRACKED {sector.toUpperCase()} ROLES.
        THE PIN MARKS YOUR EXACT POSITION AT{' '}
        <span className="font-black">{currentScore}%</span> IN THE {currentBand.key.toUpperCase()} BAND.
      </p>

      <div className="relative pt-12 pb-8 border-[2px] border-ink p-6 bg-transparent">
        <div
          className="absolute top-2 z-10 flex flex-col items-center transition-all"
          style={{ left: `${Math.min(98, Math.max(2, currentScore))}%`, transform: 'translateX(-50%)' }}
        >
          <span className="whitespace-nowrap bg-ink px-3 py-1 text-xs font-bold text-parchment uppercase tracking-widest">
            {currentScore}% — YOU
          </span>
          <div className="mt-0 h-6 w-[2px] bg-ink" />
          <div className="h-4 w-4 border-[2px] border-ink bg-accent" />
        </div>
        <div className="flex h-12 w-full border-[2px] border-ink">
          {bands.map((band) => (
            <div key={band.key} className={`border-r-[2px] border-ink last:border-r-0 ${getToneClasses(band.tone).bar}`} style={{ width: `${band.to - band.from}%` }} />
          ))}
        </div>
        <div className="relative mt-3 hidden md:block">
          {[0, 40, 55, 70, 100].map((t) => (
            <span key={t} className="absolute -translate-x-1/2 font-display text-xl" style={{ left: `${t}%` }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bands.map((band) => {
          const item = items.find((i) => i.label === band.key);
          const count = item?.count ?? 0;
          const pct = Math.round((count / total) * 100);
          const isCurrent = band.key === currentBand.key;
          const tc = getToneClasses(band.tone);
          return (
            <div key={band.key} className={`border-[2px] p-4 text-center ${
              isCurrent ? 'border-ink bg-ink text-parchment' : 'border-ink bg-transparent text-ink'
            }`}>
              <div className={`mx-auto mb-3 h-2 w-8 border-[2px] border-ink ${tc.bar}`} />
              <p className={`font-bold uppercase tracking-widest text-xs mb-1 ${isCurrent ? 'opacity-70' : 'opacity-60'}`}>{band.key}</p>
              <p className="font-display text-4xl leading-none mb-1">{count}</p>
              <p className={`text-xs font-medium uppercase tracking-widest ${isCurrent ? 'text-accent' : 'opacity-60'}`}>{pct}% OF ROLES</p>
              {isCurrent && <p className="mt-2 text-xs font-black uppercase tracking-widest bg-accent text-white py-1">← YOU</p>}
            </div>
          );
        })}
      </div>
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
    <main className="w-full min-h-screen bg-parchment text-ink relative">
      <div className="grain-overlay" />
      <Navigation />
      
      <article className="pt-32 pb-24 max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="border-[2px] border-ink bg-ink text-parchment px-3 py-1 text-xs font-bold uppercase tracking-widest">
            {job.sector}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">AI Automation Analysis</span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-6 leading-none text-ink">
          Will AI Replace{' '}
          <span className="text-accent">{job.title}?</span>
        </h1>
        <p className="text-lg font-medium opacity-80 uppercase tracking-wide leading-relaxed mb-12 max-w-2xl">{job.description}</p>

        {/* Primary Risk Metric Card */}
        <div className="mb-16 border-[2px] border-ink bg-ink text-parchment p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-end">
            <div className="flex-1 border-[2px] border-parchment p-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">Automation Risk Score</p>
              <div className="flex items-end gap-4 mb-4">
                <span className="font-display text-8xl md:text-[140px] leading-none text-accent">
                  {job.automationRisk || 0}%
                </span>
                <span className="font-display text-4xl md:text-5xl uppercase tracking-tight pb-2 md:pb-5">
                  {job.riskLevel || 'Unknown'}
                </span>
              </div>
              <div className="h-4 w-full border-[2px] border-parchment bg-ink flex">
                <div
                  className="h-full bg-accent border-r-[2px] border-parchment"
                  style={{ width: `${job.automationRisk || 0}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/3">
              {job.estimatedTimeline && (
                <div className="border-[2px] border-parchment p-4 bg-parchment text-ink">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1 block">Estimated Timeline</span>
                  <span className="font-display text-2xl uppercase tracking-tight">{job.estimatedTimeline}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1 block">Until significant automation</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sector Benchmark */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-4xl uppercase tracking-tight">Sector Benchmark</h2>
            <span className="border-[2px] border-ink bg-accent text-white px-3 py-1 font-bold uppercase tracking-widest text-xs">Live Database</span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="border-[2px] border-ink p-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Sector Average</p>
              <p className="font-display text-6xl tracking-tight mb-2">{sectorInsights.sectorAverage}%</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 border-t-[2px] border-ink pt-2">
                This role is{' '}
                <span className={job.automationRisk > sectorInsights.sectorAverage ? 'text-accent' : ''}>
                  {Math.abs(job.automationRisk - sectorInsights.sectorAverage)}%{' '}
                  {job.automationRisk > sectorInsights.sectorAverage ? 'ABOVE' : 'BELOW'}
                </span>
                {' '}AVERAGE
              </p>
            </div>
            <div className="border-[2px] border-ink p-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Risk Percentile</p>
              <p className="font-display text-6xl tracking-tight mb-2">{sectorInsights.exposurePercentile}th</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 border-t-[2px] border-ink pt-2">
                PERCENT OF PEER ROLES HAVE LOWER EXPOSURE
              </p>
            </div>
            <div className="border-[2px] border-ink p-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Peer Roles</p>
              <p className="font-display text-6xl tracking-tight mb-2">{sectorInsights.peerCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 border-t-[2px] border-ink pt-2">
                COMPARABLE {job.sector.toUpperCase()} ROLES TRACKED
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <BenchmarkBar label={job.title} value={job.automationRisk} note="This role" tone={getDistributionTone(job.automationRisk)} />
            <BenchmarkBar label={`${job.sector} average`} value={sectorInsights.sectorAverage} note="Average across peers" tone={getDistributionTone(sectorInsights.sectorAverage)} />
            <BenchmarkBar label={sectorInsights.highestRisk.title} value={sectorInsights.highestRisk.automationRisk} note="Highest exposure" tone={getDistributionTone(sectorInsights.highestRisk.automationRisk)} />
            <BenchmarkBar label={sectorInsights.lowestRisk.title} value={sectorInsights.lowestRisk.automationRisk} note="Lowest exposure" tone={getDistributionTone(sectorInsights.lowestRisk.automationRisk)} />
          </div>
        </section>

        {/* Risk Landscape */}
        <section className="mb-16">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-6">Risk Landscape: Where {job.title} Sits</h2>
          <RiskLandscape items={sectorInsights.distribution} currentScore={job.automationRisk} sector={job.sector} />
        </section>

        {/* Overview Section */}
        {(job.summary || detailedAnalysis.executiveTakeaway) && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display text-5xl uppercase tracking-tight">Overview</h2>
              <div className="h-2 flex-1 bg-ink"></div>
            </div>
            <div className="border-[2px] border-ink bg-transparent p-6 md:p-8">
              <p className="text-xl font-medium leading-relaxed uppercase tracking-wide">
                {detailedAnalysis.executiveTakeaway || job.summary}
              </p>
            </div>
          </section>
        )}

        <section className="mb-16 border-t-[2px] border-ink pt-12">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-2">Why This Score Looks Like This</h2>
          <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-8 border-l-[2px] border-ink pl-4">The key factors driving the automation exposure estimate for this role.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {detailedAnalysis.scoreDrivers.map((driver, index) => (
              <div key={index} className={`border-[2px] p-6 ${
                driver.strength === 'Primary' ? 'border-accent bg-accent/5' : 'border-ink bg-transparent'
              }`}>
                <span className={`inline-block border-[2px] px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 ${
                  driver.strength === 'Primary' ? 'border-accent bg-accent text-white' : 'border-ink text-ink bg-transparent'
                }`}>
                  {driver.strength} DRIVER
                </span>
                <h3 className="font-display text-2xl uppercase tracking-wide mb-3">{driver.title}</h3>
                <p className="text-sm font-medium leading-relaxed opacity-80">{driver.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Task Breakdown */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-4xl uppercase tracking-tight">Task-Level Assessment</h2>
            <div className="h-2 flex-1 bg-ink"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="border-[2px] border-ink p-6 md:p-8 bg-ink text-parchment">
              <div className="flex items-center gap-4 mb-6 border-b-[2px] border-parchment pb-4">
                <div className="w-8 h-8 flex items-center justify-center border-[2px] border-parchment bg-accent font-bold">!</div>
                <h3 className="font-display text-4xl uppercase tracking-tight">High-Risk Tasks</h3>
              </div>
              <ul className="space-y-4">
                {(job.highRiskTasks || []).map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border-[2px] border-parchment bg-transparent text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-relaxed opacity-90">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-[2px] border-ink p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6 border-b-[2px] border-ink pb-4">
                <div className="w-8 h-8 flex items-center justify-center border-[2px] border-ink bg-[#81B69D] font-bold text-ink">✓</div>
                <h3 className="font-display text-4xl uppercase tracking-tight">Future-Proof Tasks</h3>
              </div>
              <ul className="space-y-4">
                {(job.lowRiskTasks || []).map((task: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border-[2px] border-ink bg-transparent text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm font-medium leading-relaxed opacity-90">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-6">Work Composition Snapshot</h2>
          <div className="border-[2px] border-ink p-6 md:p-8 space-y-8">
            {detailedAnalysis.workComposition.map((item, index) => {
              const tc = getToneClasses(item.tone);
              return (
                <div key={index}>
                  <div className="flex items-center justify-between gap-4 mb-3 border-[2px] border-ink p-3 bg-ink/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className={`border-[2px] border-ink px-4 py-1 text-xs font-bold uppercase tracking-widest ${tc.bar}`}>
                        {item.label}
                      </span>
                      <p className="text-sm font-medium opacity-80">{item.description}</p>
                    </div>
                    <span className="font-display text-4xl">{item.value}%</span>
                  </div>
                  <div className="h-4 border-[2px] border-ink bg-transparent flex">
                    <div className={`h-full border-r-[2px] border-ink ${tc.bar}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills Development */}
        <section className="mb-16 border-[2px] border-ink p-6 md:p-10 bg-accent text-white">
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-2">Skills to Prioritize</h2>
          <p className="font-bold uppercase tracking-widest text-xs opacity-80 mb-8 border-l-[2px] border-white pl-4">Focus your learning efforts on these high-impact domains:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(job.futureSkills || []).map((skill: string, index: number) => (
              <div key={index} className="border-[2px] border-white p-4 bg-transparent flex items-center gap-4 hover:bg-white hover:text-accent transition-colors">
                <div className="w-8 h-8 border-[2px] border-current flex items-center justify-center font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <p className="font-display text-xl uppercase tracking-wider">{skill}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border-[2px] border-ink p-6 md:p-8">
            <h2 className="font-display text-3xl uppercase tracking-tight mb-6 flex items-center gap-3">
              <span className="w-4 h-4 bg-ink border-[2px] border-ink shrink-0" />
              Where Humans Keep The Edge
            </h2>
            <ul className="space-y-4 font-medium opacity-90">
              {detailedAnalysis.durableAdvantage.map((item, index) => (
                <li key={index} className="flex gap-4 border-[2px] border-ink/20 p-4">
                  <span className="font-display text-2xl opacity-40 leading-none">{index + 1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-[2px] border-ink p-6 md:p-8 bg-ink/5 relative overflow-hidden">
            <h2 className="font-display text-3xl uppercase tracking-tight mb-6 flex items-center gap-3 relative z-10">
              <span className="w-4 h-4 bg-accent border-[2px] border-ink shrink-0" />
              Market Signals To Watch
            </h2>
            <ul className="space-y-4 font-medium opacity-90 relative z-10">
              {detailedAnalysis.marketSignals.map((item, index) => (
                <li key={index} className="flex gap-4 border-[2px] border-ink border-b-4 p-4 bg-parchment">
                  <span className="font-display text-2xl text-accent leading-none">!</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {sectorInsights.closestRoles.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 border-l-[4px] border-accent pl-4">
              <h2 className="font-display text-4xl uppercase tracking-tight leading-none">Nearby Roles In {job.sector}</h2>
              <p className="mt-2 font-bold uppercase tracking-widest text-xs opacity-60">Roles with risk profiles closest to {job.title}.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {sectorInsights.closestRoles.map((peer) => {
                const delta = peer.automationRisk - job.automationRisk;
                return (
                  <Link
                    key={peer.slug}
                    href={`/jobs/${peer.slug}`}
                    className="border-[2px] border-ink bg-parchment p-6 transition-all hover:bg-ink hover:text-parchment group block"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{peer.sector}</p>
                    <h3 className="font-display text-2xl uppercase tracking-wide mt-2 mb-6 border-b-[2px] border-ink group-hover:border-parchment pb-4">{peer.title}</h3>
                    <div className="flex items-end justify-between mb-4">
                      <span className="font-display text-5xl leading-none">{peer.automationRisk}%</span>
                      <span className="border-[2px] border-ink bg-transparent group-hover:border-parchment px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        {delta === 0 ? 'SAME' : delta > 0 ? `+${delta}%` : `${delta}%`}
                      </span>
                    </div>
                    <div className="h-2 border-[2px] border-ink bg-transparent group-hover:border-parchment flex">
                      <div className={`h-full border-r-[2px] border-ink group-hover:border-parchment ${getToneClasses(getDistributionTone(peer.automationRisk)).bar}`} style={{ width: `${peer.automationRisk}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {sectorInsights.topSkills.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-3xl uppercase tracking-tight mb-4">Skills Across Peer Roles</h2>
            <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-6 border-l-[2px] border-ink pl-4">Frequently cited skills in similar {job.sector} roles.</p>
            <div className="flex flex-wrap gap-4">
              {sectorInsights.topSkills.map(({ skill, count }) => (
                <span key={skill} className="border-[2px] border-ink px-4 py-2 text-sm font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-ink hover:text-parchment transition-colors">
                  {skill}
                  {count > 1 && <span className="opacity-60 text-xs">×{count}</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="border-[2px] border-ink bg-ink p-10 md:p-16 text-parchment text-center relative overflow-hidden mt-12 mb-8">
          <div className="absolute inset-x-0 top-0 h-[8px] bg-accent" />
          <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-4">WANT IT IN YOUR INBOX?</p>
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-6 mt-4">RUN A PERSONALIZED ANALYSIS</h2>
          <p className="font-medium opacity-80 mb-10 max-w-lg mx-auto text-lg">Input your exact responsibilities, resume, and experience level to get a customized risk report.</p>
          <div className="flex justify-center">
            <Link
              href="/analyze"
              className="px-8 py-4 border-[2px] border-parchment bg-parchment text-ink font-bold uppercase tracking-widest text-sm hover:bg-accent hover:border-accent hover:text-white transition-colors"
            >
              RUN ANALYSIS →
            </Link>
          </div>
        </div>

      </article>
      <Footer />
    </main>
  );
}
