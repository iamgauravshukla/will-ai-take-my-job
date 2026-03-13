import axios from 'axios';
import { generateFallbackRiskAnalysis } from '@/backend/services/riskEngine';
import { getDetailedAnalysis, type DetailedAnalysisOutput } from '@/lib/detailedAnalysis';

export type LLMProvider = 'gemini' | 'openai';

export interface RiskAnalysisInput {
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

export interface RiskAnalysisOutput {
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

const MAX_TASKS_FOR_PROMPT = 6;
const MAX_RESUME_CHARS_FOR_PROMPT = 2200;
const MAX_SUMMARY_CHARS = 320;

function compactText(text: string, maxChars: number): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

function normalizeStringArray(value: unknown, maxItems = 6): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, maxItems);
}

function buildCompactResumeContext(resumeText?: string): string {
  if (!resumeText) {
    return '';
  }

  const normalized = resumeText.replace(/\r\n/g, '\n');
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 22);

  return compactText(lines.join(' | '), MAX_RESUME_CHARS_FOR_PROMPT);
}

function safeParseAnalysis(text: string): Partial<RiskAnalysisOutput> {
  const raw = text.trim();
  const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const candidate = codeBlock || raw;

  try {
    return JSON.parse(candidate) as Partial<RiskAnalysisOutput>;
  } catch {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as Partial<RiskAnalysisOutput>;
      } catch {
        return {};
      }
    }
    return {};
  }
}

function getArrayFallback(primary: string[], secondary: string[], finalFallback: string[]): string[] {
  if (primary.length > 0) {
    return primary;
  }

  if (secondary.length > 0) {
    return secondary;
  }

  return finalFallback;
}

function normalizeOutput(input: Partial<RiskAnalysisOutput>, context: RiskAnalysisInput): RiskAnalysisOutput {
  const rawScore = typeof input.automationRiskScore === 'number' ? input.automationRiskScore : 50;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const riskLevel = input.riskLevel || 'Medium';
  const highRiskTasks = getArrayFallback(
    normalizeStringArray(input.highRiskTasks, 6),
    normalizeStringArray(context.baselineHighRiskTasks, 6),
    ['Routine documentation', 'Standard reporting', 'Repeatable operational workflows']
  );
  const lowRiskTasks = getArrayFallback(
    normalizeStringArray(input.lowRiskTasks, 6),
    normalizeStringArray(context.baselineLowRiskTasks, 6),
    ['Strategic planning', 'Stakeholder communication', 'Complex decision making']
  );
  const futureSkills = getArrayFallback(
    normalizeStringArray(input.futureSkills, 6),
    normalizeStringArray(context.baselineFutureSkills, 6),
    ['AI collaboration', 'Critical thinking', 'Communication']
  );
  const timelineAssessment = input.timelineAssessment || '2-3 years';
  const confidenceLevel = input.confidenceLevel || 'Medium';
  const summary = compactText(input.summary || context.baselineSummary || 'Analysis complete', MAX_SUMMARY_CHARS);

  return {
    automationRiskScore: score,
    riskLevel,
    highRiskTasks,
    lowRiskTasks,
    futureSkills,
    timelineAssessment,
    confidenceLevel,
    summary,
    detailedAnalysis: getDetailedAnalysis({
      jobTitle: context.jobTitle,
      sector: context.sector,
      automationRiskScore: score,
      riskLevel,
      highRiskTasks,
      lowRiskTasks,
      futureSkills,
      timelineAssessment,
      summary,
      existingDetailedAnalysis: input.detailedAnalysis,
    }),
  };
}

function buildPrompt(input: RiskAnalysisInput): string {
  const tasks = normalizeStringArray(input.tasks, MAX_TASKS_FOR_PROMPT).map((task) => compactText(task, 100));
  const compactResume = buildCompactResumeContext(input.resumeText);
  const baselineHighRisk = normalizeStringArray(input.baselineHighRiskTasks, 6);
  const baselineLowRisk = normalizeStringArray(input.baselineLowRiskTasks, 6);
  const baselineFutureSkills = normalizeStringArray(input.baselineFutureSkills, 6);

  return [
    'Return ONLY valid JSON.',
    'You are generating a rich AI automation-risk report for a dynamic job insights page and personalized career-risk report.',
    'Use the role baseline context as the starting point, then personalize the output based on the task and resume evidence when present.',
    'Required schema:',
    '{',
    '  "automationRiskScore": number,',
    '  "riskLevel": "Low"|"Low-Medium"|"Medium"|"Medium-High"|"High"|"Very High",',
    '  "highRiskTasks": string[],',
    '  "lowRiskTasks": string[],',
    '  "futureSkills": string[],',
    '  "timelineAssessment": string,',
    '  "confidenceLevel": "Low"|"Medium"|"High",',
    '  "summary": string,',
    '  "detailedAnalysis": {',
    '    "executiveTakeaway": string,',
    '    "workComposition": [',
    '      {"label":"Automate Now","value":number,"tone":"red","description":string},',
    '      {"label":"AI-Augmented","value":number,"tone":"amber","description":string},',
    '      {"label":"Human-Critical","value":number,"tone":"emerald","description":string}',
    '    ],',
    '    "scoreDrivers": [{"title":string,"strength":"Primary"|"Secondary","detail":string}],',
    '    "durableAdvantage": string[],',
    '    "marketSignals": string[],',
    '    "roleEvolution": [{"phase":string,"title":string,"detail":string}],',
    '    "ninetyDayPlan": [{"title":string,"detail":string}],',
    '    "toolingFocus": string[]',
    '  }',
    '}',
    'Constraints:',
    '- automationRiskScore must be an integer between 0 and 100.',
    '- Arrays should be concise, specific, and max 6 items unless otherwise implied by the fixed schema.',
    '- summary should be <= 320 characters.',
    '- workComposition values must sum to 100.',
    '- scoreDrivers should include exactly 3 items.',
    '- marketSignals should include exactly 3 items.',
    '- roleEvolution should include 3 items for Now, Next 6-12 Months, and 12-24 Months.',
    '- ninetyDayPlan should include exactly 3 items.',
    `Role: ${compactText(input.jobTitle, 80)}`,
    `Sector: ${compactText(input.sector, 80)}`,
    `Job Description: ${compactText(input.jobDescription || 'Not provided', 220)}`,
    baselineHighRisk.length > 0 ? `Baseline High-Risk Tasks: ${baselineHighRisk.join('; ')}` : 'Baseline High-Risk Tasks: None',
    baselineLowRisk.length > 0 ? `Baseline Low-Risk Tasks: ${baselineLowRisk.join('; ')}` : 'Baseline Low-Risk Tasks: None',
    baselineFutureSkills.length > 0 ? `Baseline Future Skills: ${baselineFutureSkills.join('; ')}` : 'Baseline Future Skills: None',
    input.baselineSummary ? `Baseline Summary: ${compactText(input.baselineSummary, 240)}` : 'Baseline Summary: None',
    tasks.length > 0 ? `Observed Tasks: ${tasks.join('; ')}` : 'Observed Tasks: None',
    compactResume ? `Resume Evidence: ${compactResume}` : 'Resume Evidence: None',
  ].join('\n');
}

async function analyzeWithGemini(input: RiskAnalysisInput): Promise<{ analysis: RiskAnalysisOutput; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: buildPrompt(input) }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1400,
        responseMimeType: 'application/json',
      },
    },
    { headers: { 'content-type': 'application/json' } }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const analysis = normalizeOutput(safeParseAnalysis(text), input);
  return { analysis, model };
}

async function analyzeWithOpenAI(input: RiskAnalysisInput): Promise<{ analysis: RiskAnalysisOutput; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      temperature: 0.2,
      max_completion_tokens: 1400,
      messages: [{ role: 'user', content: buildPrompt(input) }],
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
    }
  );

  const text = response.data?.choices?.[0]?.message?.content || '{}';
  const analysis = normalizeOutput(safeParseAnalysis(text), input);
  return { analysis, model };
}

export async function analyzeJobRiskWithProvider(
  input: RiskAnalysisInput,
  preferredProvider: LLMProvider = 'openai'
): Promise<{ analysis: RiskAnalysisOutput; providerUsed: LLMProvider | 'fallback'; modelUsed: string }> {
  try {
    if (preferredProvider === 'gemini') {
      const gemini = await analyzeWithGemini(input);
      return { analysis: gemini.analysis, providerUsed: 'gemini', modelUsed: gemini.model };
    }

    const openai = await analyzeWithOpenAI(input);
    return { analysis: openai.analysis, providerUsed: 'openai', modelUsed: openai.model };
  } catch {
    try {
      if (preferredProvider === 'openai') {
        const gemini = await analyzeWithGemini(input);
        return { analysis: gemini.analysis, providerUsed: 'gemini', modelUsed: gemini.model };
      }

      const openai = await analyzeWithOpenAI(input);
      return { analysis: openai.analysis, providerUsed: 'openai', modelUsed: openai.model };
    } catch {
      const fallback = generateFallbackRiskAnalysis(input);
      return { analysis: fallback, providerUsed: 'fallback', modelUsed: 'rules-v1' };
    }
  }
}
