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
        <div className="flex h-8 w-full overflow-hidden rounded-2xl shadow-inner">
          {bands.map((band) => (
            <div key={band.key} className={getToneClasses(band.tone).bar} style={{ width: `${band.to - band.from}%` }} />
          ))}
        </div>
        <div className="relative mt-1.5">
          {[0, 40, 55, 70, 100].map((t) => (
            <span key={t} className="absolute -translate-x-1/2 text-xs text-slate-400" style={{ left: `${t}%` }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {bands.map((band) => {
          const item = items.find((i) => i.label === band.key);
          const count = item?.count ?? 0;
          const pct = Math.round((count / total) * 100);
          const isCurrent = band.key === currentBand.key;
          const tc = getToneClasses(band.tone);
          return (
            <div key={band.key} className={`rounded-xl p-3 text-center ${
              isCurrent ? 'bg-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'bg-slate-50'
            }`}>
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
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      <section className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        <ShareReport
          title={report.jobTitle}
          token={token}
          automationRisk={analysis.automationRiskScore || 0}
        />

        {/* Premium hero card */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 p-8 md:p-10 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">Personalized Analysis</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{report.jobTitle}</h1>

            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-1">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Automation Risk Score</p>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-6xl font-black">{analysis.automationRiskScore || 0}%</span>
                  <span className={`text-xl font-bold ${
                    (analysis.automationRiskScore || 0) >= 70 ? 'text-red-400' :
                    (analysis.automationRiskScore || 0) >= 55 ? 'text-amber-400' :
                    (analysis.automationRiskScore || 0) >= 40 ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>{analysis.riskLevel || 'Unknown'}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
                    style={{ width: `${analysis.automationRiskScore || 0}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Low risk</span>
                  <span>High risk</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <span className={`self-start md:self-auto rounded-full px-3 py-1 text-xs font-semibold ${
                  analysis.confidenceLevel?.toLowerCase() === 'high' ? 'bg-emerald-500/20 text-emerald-300' :
                  analysis.confidenceLevel?.toLowerCase() === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-slate-500/20 text-slate-300'
                }`}>
                  {analysis.confidenceLevel || 'Medium'} Confidence
                </span>
                {analysis.timelineAssessment && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Estimated timeline</p>
                    <p className="text-lg font-bold text-white">{analysis.timelineAssessment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Analysis Summary</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-slate-700 leading-relaxed text-lg">{detailedAnalysis.executiveTakeaway || analysis.summary || 'No summary available.'}</p>
          </div>
        </section>

        {/* Sector Benchmark */}
        <section className="mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Sector Benchmark</h2>
                <p className="mt-1 text-sm text-slate-500">
                  How your role compares against {sectorInsights.peerCount} tracked {currentJobForBenchmark.sector} roles.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Live data</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-7">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Sector Average</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{sectorInsights.sectorAverage}%</p>
                <p className="mt-1 text-xs text-slate-500">
                  You are{' '}
                  <span className={(analysis.automationRiskScore || 0) > sectorInsights.sectorAverage ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                    {Math.abs((analysis.automationRiskScore || 0) - sectorInsights.sectorAverage)}%{' '}
                    {(analysis.automationRiskScore || 0) > sectorInsights.sectorAverage ? 'above' : 'below'}
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
                <p className="mt-1 text-xs text-slate-500">Comparable {currentJobForBenchmark.sector} roles tracked</p>
              </div>
            </div>

            <div className="space-y-4">
              <BenchmarkBar label={report.jobTitle} value={analysis.automationRiskScore || 0} note="Your role" tone={getDistributionTone(analysis.automationRiskScore || 0)} />
              <BenchmarkBar label={`${currentJobForBenchmark.sector} sector average`} value={sectorInsights.sectorAverage} note="Average across all tracked peer roles" tone={getDistributionTone(sectorInsights.sectorAverage)} />
              <BenchmarkBar label={sectorInsights.highestRisk.title} value={sectorInsights.highestRisk.automationRisk} note="Highest exposure in peer set" tone={getDistributionTone(sectorInsights.highestRisk.automationRisk)} />
              <BenchmarkBar label={sectorInsights.lowestRisk.title} value={sectorInsights.lowestRisk.automationRisk} note="Lowest exposure in peer set" tone={getDistributionTone(sectorInsights.lowestRisk.automationRisk)} />
            </div>
          </div>
        </section>

        {/* Risk Landscape */}
        <section className="mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Risk Landscape: Where {report.jobTitle} Sits</h2>
            <RiskLandscape items={sectorInsights.distribution} currentScore={analysis.automationRiskScore || 0} sector={currentJobForBenchmark.sector} />
          </div>
        </section>

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

        {/* Task Breakdown */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Task-Level Risk Assessment</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <h3 className="text-lg font-bold text-slate-900">High-Risk Tasks</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">In your role, these tasks have the highest automation risk:</p>
              <ul className="space-y-2">
                {(analysis.highRiskTasks || []).map((task: string, index: number) => (
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
              <p className="text-sm text-slate-600 mb-4">These tasks will remain valuable and should be emphasised:</p>
              <ul className="space-y-2">
                {(analysis.lowRiskTasks || []).map((task: string, index: number) => (
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

        {/* Skills Development */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills to Develop & Prioritize</h2>
          <p className="text-slate-600 mb-6">Focus your learning efforts on these high-impact skills:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(analysis.futureSkills || []).map((skill: string, index: number) => (
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

        {/* Timeline & Details */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Timeline Assessment</h3>
            <p className="text-slate-700 leading-relaxed">{analysis.timelineAssessment || 'Timeline assessment not available.'}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">What This Means</h3>
            <p className="text-slate-700 leading-relaxed">
              Your score indicates the likelihood that AI will automate parts of your role. Focus on developing human-centric skills 
              like leadership, strategic thinking, and communication to remain irreplaceable.
            </p>
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
          <p className="text-sm text-slate-500 mb-4">Skills and tools worth prioritising to stay competitive in this role.</p>
          <div className="flex flex-wrap gap-2">
            {detailedAnalysis.toolingFocus.map((item, index) => (
              <span key={index} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-800">
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Nearby Roles */}
        {sectorInsights.closestRoles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Nearby Roles In {currentJobForBenchmark.sector}</h2>
                <p className="mt-2 text-sm text-slate-600">Roles with risk profiles closest to {report.jobTitle}, useful for comparison and transition planning.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {sectorInsights.closestRoles.map((peer) => {
                const delta = peer.automationRisk - (analysis.automationRiskScore || 0);
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
                        {delta === 0 ? 'Same band' : delta > 0 ? `+${delta}% vs yours` : `${delta}% vs yours`}
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
        )}

        {/* Skills Across Peers */}
        {sectorInsights.topSkills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills Appearing Across Peer Roles</h2>
            <p className="text-slate-600 mb-6">Frequently cited skills in similar {currentJobForBenchmark.sector} roles — worth prioritising in your development plan.</p>
            <div className="flex flex-wrap gap-3">
              {sectorInsights.topSkills.map(({ skill, count }) => (
                <span key={skill} className="rounded-full bg-indigo-50 border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800">
                  {skill}
                  {count > 1 && <span className="ml-2 text-indigo-500 text-xs">×{count}</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Methodology */}
        <section className="rounded-2xl bg-slate-50 border border-slate-200 p-6 mb-10">
          <h3 className="font-bold text-slate-900 mb-3">About This Analysis</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Provider:</span>{' '}
              {report.llmProvider ? String(report.llmProvider).charAt(0).toUpperCase() + String(report.llmProvider).slice(1) : 'AI'}
              {' · '}
              <span className="font-semibold text-slate-800">Model:</span> {String(report.llmModel || 'Latest')}
              {' · '}
              <span className="font-semibold text-slate-800">Confidence:</span> {analysis.confidenceLevel || 'Medium'}
            </p>
            <p className="text-slate-500">
              This analysis reflects current technology capabilities and may evolve. Your unique skills, experience level,
              and continuous learning significantly impact your actual automation risk.
            </p>
          </div>
        </section>

        {/* Related Job Link */}
        {relatedJob && (
          <div className="mb-8">
            <Link href={`/jobs/${relatedJob.slug}`} className="text-sm text-indigo-600 font-semibold hover:underline">
              → See the full {report.jobTitle} role breakdown
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-8 text-white text-center">
          <p className="text-indigo-300 text-sm uppercase tracking-widest mb-3">Share or Re-Analyse</p>
          <h2 className="text-2xl font-bold mb-2">Know someone in this role?</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">Share this personalised report, or run a fresh analysis for a different role or context.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-7 py-3.5 font-bold hover:bg-indigo-50 transition"
            >
              Run Another Analysis →
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 text-white px-7 py-3.5 font-semibold hover:bg-white/10 transition"
            >
              Browse All Roles
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
