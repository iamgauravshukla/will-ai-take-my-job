import { getDetailedAnalysis, type DetailedAnalysisOutput } from '@/lib/detailedAnalysis';

interface RiskAnalysisInput {
  jobTitle: string;
  sector: string;
  tasks?: string[];
  resumeText?: string;
  jobDescription?: string;
  baselineHighRiskTasks?: string[];
  baselineLowRiskTasks?: string[];
  baselineFutureSkills?: string[];
  baselineSummary?: string;
}

interface RiskAnalysisOutput {
  automationRiskScore: number;
  riskLevel: string;
  highRiskTasks: string[];
  lowRiskTasks: string[];
  futureSkills: string[];
  timelineAssessment: string;
  confidenceLevel: string;
  summary: string;
  detailedAnalysis: DetailedAnalysisOutput;
}

const HIGH_RISK_KEYWORDS = [
  'data entry',
  'reporting',
  'scheduling',
  'documentation',
  'testing',
  'transcription',
  'reconciliation',
  'classification',
  'quality check',
  'support ticket',
  'drafting',
  'summarization',
];

const LOW_RISK_KEYWORDS = [
  'strategy',
  'leadership',
  'mentoring',
  'negotiation',
  'stakeholder',
  'architecture',
  'innovation',
  'creative',
  'decision',
  'planning',
  'roadmap',
  'cross-functional',
];

const SECTOR_BASELINE: Record<string, number> = {
  Technology: 56,
  'Finance & Banking': 62,
  Healthcare: 48,
  'Retail & E-commerce': 64,
  Manufacturing: 68,
  Education: 44,
  'Marketing & Advertising': 57,
  'Human Resources': 52,
  'Data Science': 54,
  Legal: 49,
  'Real Estate': 51,
  'Logistics & Supply Chain': 63,
  Telecommunications: 58,
};

function normalizeTask(task: string): string {
  return task.trim().toLowerCase();
}

function classifyRiskLevel(score: number): string {
  if (score < 30) return 'Low';
  if (score < 50) return 'Low-Medium';
  if (score < 65) return 'Medium';
  if (score < 80) return 'Medium-High';
  if (score < 90) return 'High';
  return 'Very High';
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function inferFutureSkills(jobTitle: string, sector: string): string[] {
  const baseSkills = ['AI Collaboration', 'Critical Thinking', 'Data Literacy'];
  const role = jobTitle.toLowerCase();
  const sec = sector.toLowerCase();

  if (role.includes('engineer') || role.includes('developer')) {
    return [...baseSkills, 'System Design', 'AI Tooling', 'Leadership'];
  }
  if (role.includes('analyst') || sec.includes('data')) {
    return [...baseSkills, 'Business Storytelling', 'Experimental Design', 'Domain Strategy'];
  }
  if (role.includes('manager')) {
    return [...baseSkills, 'People Leadership', 'Strategic Planning', 'Change Management'];
  }
  if (sec.includes('marketing')) {
    return [...baseSkills, 'Creative Direction', 'Campaign Strategy', 'Brand Positioning'];
  }

  return [...baseSkills, 'Communication', 'Problem Solving', 'Adaptability'];
}

export function generateFallbackRiskAnalysis(input: RiskAnalysisInput): RiskAnalysisOutput {
  const tasks = (input.tasks || []).map(normalizeTask);
  const baseline = SECTOR_BASELINE[input.sector] ?? 55;

  let highHits = 0;
  let lowHits = 0;

  for (const task of tasks) {
    if (HIGH_RISK_KEYWORDS.some((keyword) => task.includes(keyword))) {
      highHits += 1;
    }
    if (LOW_RISK_KEYWORDS.some((keyword) => task.includes(keyword))) {
      lowHits += 1;
    }
  }

  const taskInfluence = highHits * 4 - lowHits * 3;
  const score = clampScore(baseline + taskInfluence);
  const riskLevel = classifyRiskLevel(score);

  const derivedHighRiskTasks = tasks
    .filter((task) => HIGH_RISK_KEYWORDS.some((keyword) => task.includes(keyword)))
    .slice(0, 5)
    .map((task) => task.charAt(0).toUpperCase() + task.slice(1));

  const derivedLowRiskTasks = tasks
    .filter((task) => LOW_RISK_KEYWORDS.some((keyword) => task.includes(keyword)))
    .slice(0, 5)
    .map((task) => task.charAt(0).toUpperCase() + task.slice(1));

  const highRiskTasks =
    derivedHighRiskTasks.length > 0
      ? derivedHighRiskTasks
      : ['Routine documentation', 'Standard reporting', 'Data processing'];

  const lowRiskTasks =
    derivedLowRiskTasks.length > 0
      ? derivedLowRiskTasks
      : ['Stakeholder communication', 'Strategic planning', 'Complex decision making'];

  const horizon = score >= 75 ? '1-2 years' : score >= 60 ? '2-3 years' : score >= 45 ? '3-5 years' : '5+ years';
  const futureSkills = inferFutureSkills(input.jobTitle, input.sector);
  const timelineAssessment = `Estimated meaningful automation pressure in ${horizon}.`;
  const summary = `${input.jobTitle} in ${input.sector} shows ${riskLevel.toLowerCase()} automation exposure with emphasis on augmenting repetitive tasks and increasing strategic responsibilities.`;

  return {
    automationRiskScore: score,
    riskLevel,
    highRiskTasks,
    lowRiskTasks,
    futureSkills,
    timelineAssessment,
    confidenceLevel: tasks.length >= 3 ? 'Medium' : 'Low',
    summary,
    detailedAnalysis: getDetailedAnalysis({
      jobTitle: input.jobTitle,
      sector: input.sector,
      automationRiskScore: score,
      riskLevel,
      highRiskTasks,
      lowRiskTasks,
      futureSkills,
      timelineAssessment,
      summary,
    }),
  };
}
