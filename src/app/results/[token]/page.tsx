import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ShareReport from '@/components/ShareReport';
import { dbConnect } from '@/database/mongodb/connect';
import { Report } from '@/database/mongodb/schemas/Report';
import { Job } from '@/database/mongodb/schemas/Job';
import { getDetailedAnalysis, getToneClasses, type DetailedAnalysisOutput } from '@/lib/detailedAnalysis';

type PageProps = {
  params: Promise<{ token: string }>;
};

type AnalysisJson = {
  automationRiskScore: number;
  riskLevel: string;
  highRiskTasks: string[];
  lowRiskTasks: string[];
  futureSkills: string[];
  timelineAssessment: string;
  confidenceLevel: string;
  summary: string;
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
  distribution: Array<{ label: string; count: number; tone: DistributionTone }>;
  topSkills: Array<{ skill: string; count: number }>;
};

function resolveExistingDetailedAnalysis(
  reportDetailedAnalysis?: AnalysisJson['detailedAnalysis'],
  roleDetailedAnalysis?: Partial<DetailedAnalysisOutput> | null
): Partial<DetailedAnalysisOutput> | undefined {
  if (!reportDetailedAnalysis && !roleDetailedAnalysis) {
    return undefined;
  }

  return {
    executiveTakeaway: reportDetailedAnalysis?.executiveTakeaway || roleDetailedAnalysis?.executiveTakeaway,
    workComposition:
      reportDetailedAnalysis?.workComposition && reportDetailedAnalysis.workComposition.length > 0
        ? reportDetailedAnalysis.workComposition
        : roleDetailedAnalysis?.workComposition,
    scoreDrivers:
      reportDetailedAnalysis?.scoreDrivers && reportDetailedAnalysis.scoreDrivers.length > 0
        ? reportDetailedAnalysis.scoreDrivers
        : roleDetailedAnalysis?.scoreDrivers,
    durableAdvantage:
      roleDetailedAnalysis?.durableAdvantage && roleDetailedAnalysis.durableAdvantage.length > 0
        ? roleDetailedAnalysis.durableAdvantage
        : reportDetailedAnalysis?.durableAdvantage,
    marketSignals:
      roleDetailedAnalysis?.marketSignals && roleDetailedAnalysis.marketSignals.length > 0
        ? roleDetailedAnalysis.marketSignals
        : reportDetailedAnalysis?.marketSignals,
    roleEvolution:
      roleDetailedAnalysis?.roleEvolution && roleDetailedAnalysis.roleEvolution.length > 0
        ? roleDetailedAnalysis.roleEvolution
        : reportDetailedAnalysis?.roleEvolution,
    ninetyDayPlan:
      roleDetailedAnalysis?.ninetyDayPlan && roleDetailedAnalysis.ninetyDayPlan.length > 0
        ? roleDetailedAnalysis.ninetyDayPlan
        : reportDetailedAnalysis?.ninetyDayPlan,
    toolingFocus:
      reportDetailedAnalysis?.toolingFocus && reportDetailedAnalysis.toolingFocus.length > 0
        ? reportDetailedAnalysis.toolingFocus
        : roleDetailedAnalysis?.toolingFocus,
  };
}

const FALLBACK_SECTOR_PEERS: Record<string, SectorPeerDocument[]> = {
  Technology: [
    { title: 'Frontend Developer', slug: 'frontend-developer', sector: 'Technology', automationRisk: 50, riskLevel: 'Medium', futureSkills: ['Design Systems', 'Accessibility', 'AI-Assisted UI Development'] },
    { title: 'Backend Developer', slug: 'backend-developer', sector: 'Technology', automationRisk: 55, riskLevel: 'High', futureSkills: ['Distributed Systems', 'Platform Reliability', 'API Design'] },
    { title: 'DevOps Engineer', slug: 'devops-engineer', sector: 'Technology', automationRisk: 42, riskLevel: 'Medium', futureSkills: ['Platform Engineering', 'Cloud Architecture', 'Incident Leadership'] },
    { title: 'Data Engineer', slug: 'data-engineer', sector: 'Technology', automationRisk: 45, riskLevel: 'Medium', futureSkills: ['Data Modeling', 'AI Data Pipelines', 'Governance'] },
    { title: 'QA Engineer', slug: 'qa-engineer', sector: 'Technology', automationRisk: 63, riskLevel: 'High', futureSkills: ['Quality Strategy', 'Test Architecture', 'Observability'] },
    { title: 'Machine Learning Engineer', slug: 'machine-learning-engineer', sector: 'Technology', automationRisk: 35, riskLevel: 'Low', futureSkills: ['Model Operations', 'Evaluation Design', 'Applied Research'] },
  ],
};

function getFallbackSectorPeers(sector: string): SectorPeerDocument[] {
  return FALLBACK_SECTOR_PEERS[sector] || [];
}

function getDistributionTone(score: number): DistributionTone {
  if (score >= 70) return 'red';
  if (score >= 55) return 'amber';
  if (score >= 40) return 'slate';
  return 'emerald';
}

function buildSectorInsights(current: SectorPeerDocument, peers: SectorPeerDocument[]): SectorInsights {
  const normalizedPeers = peers.length > 0 ? peers : getFallbackSectorPeers(current.sector);
  const dedupedPeers = normalizedPeers.filter(
    (peer, index, arr) => arr.findIndex((c) => c.slug === peer.slug) === index
  );
  const allPeers = dedupedPeers.some((p) => p.slug === current.slug)
    ? dedupedPeers
    : [...dedupedPeers, current];

  const sortedByRisk = [...allPeers].sort((a, b) => a.automationRisk - b.automationRisk);
  const peerCount = allPeers.length;
  const sectorAverage = Math.round(allPeers.reduce((s, p) => s + p.automationRisk, 0) / Math.max(1, peerCount));
  const lowerRiskCount = allPeers.filter((p) => p.automationRisk < current.automationRisk).length;
  const exposurePercentile = Math.round((lowerRiskCount / Math.max(1, peerCount)) * 100);
  const closestRoles = allPeers
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => Math.abs(a.automationRisk - current.automationRisk) - Math.abs(b.automationRisk - current.automationRisk))
    .slice(0, 4);

  const skillsMap = new Map<string, number>();
  for (const peer of allPeers) {
    for (const skill of peer.futureSkills || []) {
      const s = skill.trim();
      if (s) skillsMap.set(s, (skillsMap.get(s) || 0) + 1);
    }
  }
  const topSkills = [...skillsMap.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }));

  const distribution = [
    { label: 'Low', count: allPeers.filter((p) => p.automationRisk < 40).length, tone: 'emerald' as const },
    { label: 'Medium', count: allPeers.filter((p) => p.automationRisk >= 40 && p.automationRisk < 55).length, tone: 'slate' as const },
    { label: 'High', count: allPeers.filter((p) => p.automationRisk >= 55 && p.automationRisk < 70).length, tone: 'amber' as const },
    { label: 'Very High', count: allPeers.filter((p) => p.automationRisk >= 70).length, tone: 'red' as const },
  ];

  return { peerCount, sectorAverage, exposurePercentile, highestRisk: sortedByRisk[sortedByRisk.length - 1], lowestRisk: sortedByRisk[0], closestRoles, distribution, topSkills };
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
            <div key={band.key} className={`border-[2px] p-4 text-center ${isCurrent ? 'border-ink bg-ink text-parchment' : 'border-ink bg-transparent text-ink'
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

function getRiskBlockClass(score: number): string {
  if (score < 40) return 'bg-[#81B69D] text-ink'; // Emerald-ish flat tone
  if (score < 55) return 'bg-[#E5B25D] text-ink'; // Amber-ish flat tone
  if (score < 70) return 'bg-[#E07A5F] text-ink'; // Orange-ish flat tone
  return 'bg-[#E85D2A] text-white';               // Accent red flat tone
}


export default async function ResultPage({ params }: PageProps) {
  await dbConnect();
  const { token } = await params;

  const report = await Report.findOne({ shareToken: token }).lean();
  if (!report) {
    notFound();
  }

  const analysis = (report.analysisJson || {}) as AnalysisJson;

  type RelatedJobType = {
    slug: string;
    title: string;
    sector?: string;
    automationRisk?: number;
    riskLevel?: string;
    futureSkills?: string[];
    detailedAnalysis?: Partial<DetailedAnalysisOutput>;
  };
  let relatedJob: RelatedJobType | null = null;
  let sectorPeers: SectorPeerDocument[] = [];
  try {
    relatedJob = await Job.findOne({ title: report.jobTitle })
      .select('title slug sector automationRisk riskLevel futureSkills detailedAnalysis')
      .lean();
    if (relatedJob?.sector) {
      const dbPeers = await Job.find({ sector: relatedJob.sector })
        .select('title slug sector automationRisk riskLevel futureSkills')
        .sort({ automationRisk: 1 })
        .limit(48)
        .lean();
      sectorPeers = dbPeers as SectorPeerDocument[];
    }
  } catch {
    // Silent fail - sector benchmark is optional
  }

  const currentJobForBenchmark: SectorPeerDocument = {
    title: report.jobTitle,
    slug: relatedJob?.slug || report.jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    sector: relatedJob?.sector || 'General',
    automationRisk: analysis.automationRiskScore || 0,
    riskLevel: analysis.riskLevel || 'Unknown',
    futureSkills: analysis.futureSkills,
  };
  const sectorInsights = buildSectorInsights(currentJobForBenchmark, sectorPeers);

  const detailedAnalysis = getDetailedAnalysis({
    jobTitle: report.jobTitle,
    sector: relatedJob?.sector || 'General',
    automationRiskScore: analysis.automationRiskScore || 0,
    riskLevel: analysis.riskLevel || 'Unknown',
    highRiskTasks: analysis.highRiskTasks,
    lowRiskTasks: analysis.lowRiskTasks,
    futureSkills: analysis.futureSkills,
    timelineAssessment: analysis.timelineAssessment,
    summary: analysis.summary,
    existingDetailedAnalysis: resolveExistingDetailedAnalysis(analysis.detailedAnalysis, relatedJob?.detailedAnalysis),
  });

  return (
    <main className="w-full min-h-screen bg-parchment text-ink relative">
      <div className="grain-overlay" />
      <Navigation />

      <section className="pt-32 pb-24 max-w-5xl mx-auto px-6 relative z-10">

        {/* Premium hero card (Brutalist style) */}
        <div className="mb-12 border-[2px] border-ink bg-ink text-parchment p-8 md:p-12">

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="border-[2px] border-accent bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Personalized Analysis
            </span>
            <span className="text-sm opacity-60 font-bold uppercase tracking-widest">
              {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tight mb-8 leading-none">
            {report.jobTitle}
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 lg:items-end">
            <div className="flex-1 border-[2px] border-parchment p-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">Automation Risk Score</p>
              <div className="flex items-end gap-4 mb-4">
                <span className="font-display text-8xl md:text-[140px] leading-none text-accent">
                  {analysis.automationRiskScore || 0}%
                </span>
                <span className="font-display text-4xl md:text-5xl uppercase tracking-tight pb-2 md:pb-5">
                  {analysis.riskLevel || 'Unknown'}
                </span>
              </div>
              <div className="h-4 w-full border-[2px] border-parchment bg-ink flex">
                <div
                  className="h-full bg-accent border-r-[2px] border-parchment"
                  style={{ width: `${analysis.automationRiskScore || 0}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:w-1/3">
              <div className="border-[2px] border-parchment p-4">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1 block">Context Confidence</span>
                <span className="font-display text-3xl uppercase tracking-wider">{analysis.confidenceLevel || 'Medium'}</span>
              </div>
              {analysis.timelineAssessment && (
                <div className="border-[2px] border-parchment p-4 bg-parchment text-ink">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1 block">Estimated Timeline</span>
                  <span className="font-display text-2xl uppercase tracking-tight">{analysis.timelineAssessment}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-5xl uppercase tracking-tight">Executive Summary</h2>
            <div className="h-2 flex-1 bg-ink"></div>
          </div>
          <div className="border-[2px] border-ink bg-transparent p-6 md:p-8">
            <p className="text-xl font-medium leading-relaxed">
              {detailedAnalysis.executiveTakeaway || analysis.summary || 'No summary available.'}
            </p>
          </div>
        </section>

        {/* Sector Benchmark */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-4xl uppercase tracking-tight">Sector Benchmark</h2>
            <span className="border-[2px] border-ink bg-accent text-white px-3 py-1 font-bold uppercase tracking-widest text-xs">Live</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="border-[2px] border-ink p-6">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Sector Average</p>
              <p className="font-display text-6xl tracking-tight mb-2">{sectorInsights.sectorAverage}%</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 border-t-[2px] border-ink pt-2">
                You are{' '}
                <span className={(analysis.automationRiskScore || 0) > sectorInsights.sectorAverage ? 'text-accent' : ''}>
                  {Math.abs((analysis.automationRiskScore || 0) - sectorInsights.sectorAverage)}%{' '}
                  {(analysis.automationRiskScore || 0) > sectorInsights.sectorAverage ? 'ABOVE' : 'BELOW'}
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
                COMPARABLE {currentJobForBenchmark.sector.toUpperCase()} ROLES TRACKED
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <BenchmarkBar label={report.jobTitle} value={analysis.automationRiskScore || 0} note="Your role" tone={getDistributionTone(analysis.automationRiskScore || 0)} />
            <BenchmarkBar label={`${currentJobForBenchmark.sector} average`} value={sectorInsights.sectorAverage} note="Average across peers" tone={getDistributionTone(sectorInsights.sectorAverage)} />
            <BenchmarkBar label={sectorInsights.highestRisk.title} value={sectorInsights.highestRisk.automationRisk} note="Highest exposure" tone={getDistributionTone(sectorInsights.highestRisk.automationRisk)} />
            <BenchmarkBar label={sectorInsights.lowestRisk.title} value={sectorInsights.lowestRisk.automationRisk} note="Lowest exposure" tone={getDistributionTone(sectorInsights.lowestRisk.automationRisk)} />
          </div>
        </section>

        {/* Risk Landscape */}
        <section className="mb-16">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-6">Risk Landscape In Detail</h2>
          <RiskLandscape items={sectorInsights.distribution} currentScore={analysis.automationRiskScore || 0} sector={currentJobForBenchmark.sector} />
        </section>

        <section className="mb-16 border-t-[2px] border-ink pt-12">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-2">Why This Score Looks Like This</h2>
          <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-8 border-l-[2px] border-ink pl-4">The key factors driving the automation exposure estimate for this role.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {detailedAnalysis.scoreDrivers.map((driver, index) => (
              <div key={index} className={`border-[2px] p-6 ${driver.strength === 'Primary' ? 'border-accent bg-accent/5' : 'border-ink bg-transparent'
                }`}>
                <span className={`inline-block border-[2px] px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 ${driver.strength === 'Primary' ? 'border-accent bg-accent text-white' : 'border-ink text-ink bg-transparent'
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
                {(analysis.highRiskTasks || []).map((task: string, index: number) => (
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
                {(analysis.lowRiskTasks || []).map((task: string, index: number) => (
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

        {/* Skills Development */}
        <section className="mb-16 border-[2px] border-ink p-6 md:p-10 bg-accent text-white">
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-2">Skills to Prioritize</h2>
          <p className="font-bold uppercase tracking-widest text-xs opacity-80 mb-8 border-l-[2px] border-white pl-4">Focus your learning efforts on these high-impact domains:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(analysis.futureSkills || []).map((skill: string, index: number) => (
              <div key={index} className="border-[2px] border-white p-4 bg-transparent flex items-center gap-4 hover:bg-white hover:text-accent transition-colors">
                <div className="w-8 h-8 border-[2px] border-current flex items-center justify-center font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <p className="font-display text-xl uppercase tracking-wider">{skill}</p>
              </div>
            ))}
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

        {/* Timeline & Details */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border-[2px] border-ink p-8">
            <h3 className="font-display text-3xl uppercase tracking-tight mb-4 border-b-[2px] border-ink pb-2">Timeline Assessment</h3>
            <p className="text-sm font-medium leading-relaxed opacity-90 uppercase tracking-wide">{analysis.timelineAssessment || 'Timeline assessment not available.'}</p>
          </div>

          <div className="border-[2px] border-ink p-8 bg-ink text-parchment">
            <h3 className="font-display text-3xl uppercase tracking-tight mb-4 border-b-[2px] border-parchment pb-2">What This Means</h3>
            <p className="text-sm font-medium leading-relaxed opacity-90 uppercase tracking-wide">
              Your score indicates the likelihood that AI will automate parts of your role. Focus on developing human-centric skills
              like leadership, strategic thinking, and communication to remain irreplaceable.
            </p>
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

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-4xl uppercase tracking-tight">Role Evolution (Next 24 Months)</h2>
            <div className="h-[2px] flex-1 bg-ink"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-0 border-[2px] border-ink divide-y-[2px] md:divide-y-0 md:divide-x-[2px] divide-ink bg-transparent w-full">
            {detailedAnalysis.roleEvolution.map((step, index) => (
              <div key={index} className="p-6 md:p-8 hover:bg-ink/5 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border-[2px] border-ink bg-ink text-parchment font-display text-3xl">
                    {index + 1}
                  </div>
                  <span className="border-[2px] border-ink px-3 py-1 text-xs font-bold uppercase tracking-widest bg-transparent">
                    {step.phase}
                  </span>
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide mb-3">{step.title}</h3>
                <p className="text-sm font-medium leading-relaxed opacity-80">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-4xl uppercase tracking-tight mb-8">90-Day De-Risking Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {detailedAnalysis.ninetyDayPlan.map((step, index) => (
              <div key={index} className="border-[2px] border-ink p-6 bg-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 font-display text-8xl opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="flex h-10 w-10 items-center justify-center border-[2px] border-ink bg-accent text-white font-display text-2xl mb-6">
                  {index + 1}
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide mb-3">{step.title}</h3>
                <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 border-[2px] border-ink p-8 border-b-8">
          <h2 className="font-display text-3xl uppercase tracking-tight mb-4">Tools &amp; Workflow Focus</h2>
          <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-6">Skills and tools worth prioritising to stay competitive in this role.</p>
          <div className="flex flex-wrap gap-3">
            {detailedAnalysis.toolingFocus.map((item, index) => (
              <span key={index} className="border-[2px] border-ink bg-ink/5 px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-ink hover:text-parchment cursor-default transition-colors">
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Nearby Roles */}
        {sectorInsights.closestRoles.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 border-l-[4px] border-accent pl-4">
              <h2 className="font-display text-4xl uppercase tracking-tight leading-none">Nearby Roles In {currentJobForBenchmark.sector}</h2>
              <p className="mt-2 font-bold uppercase tracking-widest text-xs opacity-60">Roles with risk profiles closest to {report.jobTitle}.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {sectorInsights.closestRoles.map((peer) => {
                const delta = peer.automationRisk - (analysis.automationRiskScore || 0);
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

        {/* Skills Across Peers */}
        {sectorInsights.topSkills.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-3xl uppercase tracking-tight mb-4">Skills Across Peer Roles</h2>
            <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-6 border-l-[2px] border-ink pl-4">Frequently cited skills in similar {currentJobForBenchmark.sector} roles.</p>
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

        {/* Methodology */}
        <section className="border-[2px] border-ink bg-ink/5 p-8 mb-16">
          <h3 className="font-display text-2xl uppercase tracking-tight mb-4">About This Analysis</h3>
          <div className="space-y-4 text-xs font-bold uppercase tracking-widest opacity-80">
            <p className="flex flex-wrap gap-4">
              <span className="border-[2px] border-ink px-2 py-1 bg-parchment">
                PROVIDER: {report.llmProvider ? String(report.llmProvider).charAt(0).toUpperCase() + String(report.llmProvider).slice(1) : 'AI'}
              </span>
              <span className="border-[2px] border-ink px-2 py-1 bg-parchment">
                MODEL: {String(report.llmModel || 'Latest')}
              </span>
              <span className="border-[2px] border-ink px-2 py-1 bg-parchment">
                CONFIDENCE: {analysis.confidenceLevel || 'Medium'}
              </span>
            </p>
            <p className="opacity-60 leading-relaxed border-t-[2px] border-ink/20 pt-4">
              This analysis reflects current technology capabilities and may evolve. Your unique skills, experience level,
              and continuous learning significantly impact your actual automation risk.
            </p>
          </div>
        </section>

        {/* Related Job Link */}
        {relatedJob && (
          <div className="mb-12 border-[2px] border-ink bg-ink text-parchment text-center hover:bg-accent transition-colors">
            <Link href={`/jobs/${relatedJob.slug}`} className="block font-display text-2xl uppercase tracking-widest py-6">
              → See the full {report.jobTitle} global breakdown
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="border-[2px] border-ink bg-ink p-10 md:p-16 text-parchment text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[8px] bg-accent" />
          <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-4">SHARE OR RE-ANALYZE</p>
          <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tight mb-6 mt-4">KNOW SOMEONE IN THIS ROLE?</h2>
          <p className="font-medium opacity-80 mb-10 max-w-lg mx-auto text-lg">Share this personalised report, or run a fresh analysis for a different role or context.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="px-8 py-4 border-[2px] border-parchment bg-parchment text-ink font-bold uppercase tracking-widest text-sm hover:bg-accent hover:border-accent hover:text-white transition-colors"
            >
              RUN NEW ANALYSIS →
            </Link>
            <Link
              href="/jobs"
              className="px-8 py-4 border-[2px] border-parchment/40 text-parchment font-bold uppercase tracking-widest text-sm hover:border-parchment transition-colors"
            >
              BROWSE ALL ROLES
            </Link>
          </div>
        </div>

      </section>
      <Footer />
    </main>
  );
}
