type Tone = 'red' | 'amber' | 'emerald' | 'slate';

export type DetailedAnalysisInput = {
  jobTitle: string;
  sector: string;
  automationRiskScore: number;
  riskLevel: string;
  highRiskTasks?: string[];
  lowRiskTasks?: string[];
  futureSkills?: string[];
  timelineAssessment?: string;
  summary?: string;
  existingDetailedAnalysis?: Partial<DetailedAnalysisOutput> | null;
};

export type DetailedAnalysisOutput = {
  executiveTakeaway: string;
  workComposition: Array<{
    label: string;
    value: number;
    tone: Tone;
    description: string;
  }>;
  scoreDrivers: Array<{
    title: string;
    strength: 'Primary' | 'Secondary';
    detail: string;
  }>;
  durableAdvantage: string[];
  marketSignals: string[];
  roleEvolution: Array<{
    phase: string;
    title: string;
    detail: string;
  }>;
  ninetyDayPlan: Array<{
    title: string;
    detail: string;
  }>;
  toolingFocus: string[];
};

function isTone(value: string): value is Tone {
  return value === 'red' || value === 'amber' || value === 'emerald' || value === 'slate';
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

function normalizeWorkComposition(
  value: unknown,
  fallback: DetailedAnalysisOutput['workComposition']
): DetailedAnalysisOutput['workComposition'] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as { label?: unknown; value?: unknown; tone?: unknown; description?: unknown };
      if (typeof candidate.label !== 'string' || typeof candidate.description !== 'string' || typeof candidate.value !== 'number') {
        return null;
      }

      return {
        label: candidate.label.trim(),
        value: clamp(Math.round(candidate.value), 0, 100),
        tone: typeof candidate.tone === 'string' && isTone(candidate.tone) ? candidate.tone : 'slate',
        description: candidate.description.trim(),
      };
    })
    .filter(Boolean) as DetailedAnalysisOutput['workComposition'];

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeScoreDrivers(
  value: unknown,
  fallback: DetailedAnalysisOutput['scoreDrivers']
): DetailedAnalysisOutput['scoreDrivers'] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as { title?: unknown; strength?: unknown; detail?: unknown };
      if (typeof candidate.title !== 'string' || typeof candidate.detail !== 'string') {
        return null;
      }

      return {
        title: candidate.title.trim(),
        strength: candidate.strength === 'Primary' ? 'Primary' : 'Secondary',
        detail: candidate.detail.trim(),
      };
    })
    .filter(Boolean) as DetailedAnalysisOutput['scoreDrivers'];

  return normalized.length > 0 ? normalized.slice(0, 4) : fallback;
}

function normalizeRoleEvolution(
  value: unknown,
  fallback: DetailedAnalysisOutput['roleEvolution']
): DetailedAnalysisOutput['roleEvolution'] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as { phase?: unknown; title?: unknown; detail?: unknown };
      if (typeof candidate.phase !== 'string' || typeof candidate.title !== 'string' || typeof candidate.detail !== 'string') {
        return null;
      }

      return {
        phase: candidate.phase.trim(),
        title: candidate.title.trim(),
        detail: candidate.detail.trim(),
      };
    })
    .filter(Boolean) as DetailedAnalysisOutput['roleEvolution'];

  return normalized.length > 0 ? normalized.slice(0, 4) : fallback;
}

function normalizeNinetyDayPlan(
  value: unknown,
  fallback: DetailedAnalysisOutput['ninetyDayPlan']
): DetailedAnalysisOutput['ninetyDayPlan'] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as { title?: unknown; detail?: unknown };
      if (typeof candidate.title !== 'string' || typeof candidate.detail !== 'string') {
        return null;
      }

      return {
        title: candidate.title.trim(),
        detail: candidate.detail.trim(),
      };
    })
    .filter(Boolean) as DetailedAnalysisOutput['ninetyDayPlan'];

  return normalized.length > 0 ? normalized.slice(0, 4) : fallback;
}

function mergeDetailedAnalysis(
  fallback: DetailedAnalysisOutput,
  existing?: Partial<DetailedAnalysisOutput> | null
): DetailedAnalysisOutput {
  if (!existing) {
    return fallback;
  }

  return {
    executiveTakeaway:
      typeof existing.executiveTakeaway === 'string' && existing.executiveTakeaway.trim()
        ? existing.executiveTakeaway.trim()
        : fallback.executiveTakeaway,
    workComposition: normalizeWorkComposition(existing.workComposition, fallback.workComposition),
    scoreDrivers: normalizeScoreDrivers(existing.scoreDrivers, fallback.scoreDrivers),
    durableAdvantage: normalizeStringArray(existing.durableAdvantage, 6).length > 0
      ? normalizeStringArray(existing.durableAdvantage, 6)
      : fallback.durableAdvantage,
    marketSignals: normalizeStringArray(existing.marketSignals, 6).length > 0
      ? normalizeStringArray(existing.marketSignals, 6)
      : fallback.marketSignals,
    roleEvolution: normalizeRoleEvolution(existing.roleEvolution, fallback.roleEvolution),
    ninetyDayPlan: normalizeNinetyDayPlan(existing.ninetyDayPlan, fallback.ninetyDayPlan),
    toolingFocus: normalizeStringArray(existing.toolingFocus, 8).length > 0
      ? normalizeStringArray(existing.toolingFocus, 8)
      : fallback.toolingFocus,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeTitle(jobTitle: string): string {
  return jobTitle.trim().toLowerCase();
}

function computeWorkComposition(score: number) {
  const automatable = clamp(Math.round(score * 0.38), 18, 42);
  const augmentable = clamp(Math.round(34 + score * 0.24), 32, 52);
  let humanCritical = 100 - automatable - augmentable;

  if (humanCritical < 18) {
    const deficit = 18 - humanCritical;
    humanCritical = 18;
    return [automatable, Math.max(30, augmentable - deficit), humanCritical];
  }

  return [automatable, augmentable, humanCritical];
}

function buildGenericAnalysis(input: DetailedAnalysisInput): DetailedAnalysisOutput {
  const [automatable, augmentable, humanCritical] = computeWorkComposition(input.automationRiskScore);
  const highRiskTasks = input.highRiskTasks && input.highRiskTasks.length > 0
    ? input.highRiskTasks
    : ['Routine documentation', 'Standard reporting', 'Repeatable operational workflows'];
  const lowRiskTasks = input.lowRiskTasks && input.lowRiskTasks.length > 0
    ? input.lowRiskTasks
    : ['Strategic planning', 'Stakeholder communication', 'Complex decision making'];
  const futureSkills = input.futureSkills && input.futureSkills.length > 0
    ? input.futureSkills
    : ['AI collaboration', 'Critical thinking', 'Communication'];

  return {
    executiveTakeaway:
      input.summary ||
      `${input.jobTitle} faces meaningful AI-driven workflow change. The highest pressure is on repeatable work, while value shifts toward judgment, coordination, and domain-specific decision making.`,
    workComposition: [
      {
        label: 'Automate Now',
        value: automatable,
        tone: 'red',
        description: 'Repeatable, rules-based work AI can handle with limited supervision.',
      },
      {
        label: 'AI-Augmented',
        value: augmentable,
        tone: 'amber',
        description: 'Work that stays human-owned but gets faster with copilots and workflow automation.',
      },
      {
        label: 'Human-Critical',
        value: humanCritical,
        tone: 'emerald',
        description: 'Work requiring trust, judgment, negotiation, leadership, or context synthesis.',
      },
    ],
    scoreDrivers: [
      {
        title: 'Routine workflow exposure',
        strength: 'Primary',
        detail: `Tasks such as ${highRiskTasks.slice(0, 2).join(' and ')} create the core automation pressure in this role.`,
      },
      {
        title: 'Human judgment remains valuable',
        strength: 'Secondary',
        detail: `Responsibilities like ${lowRiskTasks.slice(0, 2).join(' and ')} still depend on context and trade-off decisions.`,
      },
      {
        title: 'Skills transition will determine resilience',
        strength: 'Secondary',
        detail: `The next layer of protection comes from building capabilities like ${futureSkills.slice(0, 2).join(' and ')}.`,
      },
    ],
    durableAdvantage: lowRiskTasks,
    marketSignals: [
      `Hiring expectations are shifting from pure execution to AI-enabled output quality in ${input.sector}.`,
      'Teams are increasingly rewarding people who can redesign workflows, not just complete tasks faster.',
      `The timeline signal is ${input.timelineAssessment || 'still emerging'}, which points to gradual but material role redesign rather than overnight replacement.`,
    ],
    roleEvolution: [
      {
        phase: 'Now',
        title: 'Execution starts compressing',
        detail: 'AI begins handling first-draft and repetitive work, reducing the value of pure task throughput.',
      },
      {
        phase: 'Next 6-12 Months',
        title: 'Workflow ownership matters more',
        detail: 'People who can validate outputs, structure processes, and raise quality standards pull ahead.',
      },
      {
        phase: '12-24 Months',
        title: 'Role shifts toward leverage',
        detail: 'The highest-value contributors combine domain depth, AI fluency, and cross-functional decision making.',
      },
    ],
    ninetyDayPlan: [
      {
        title: 'Audit your task mix',
        detail: 'Separate what you do into automatable, augmentable, and human-critical buckets.',
      },
      {
        title: 'Adopt one repeatable AI workflow',
        detail: 'Choose a narrow workflow where AI can save time without reducing quality or accountability.',
      },
      {
        title: 'Strengthen the human moat',
        detail: `Deliberately spend more time on ${lowRiskTasks[0] || 'high-context work'} and less on low-value repeatable work.`,
      },
    ],
    toolingFocus: futureSkills,
  };
}

function buildSoftwareEngineerAnalysis(input: DetailedAnalysisInput): DetailedAnalysisOutput {
  const [automatable, augmentable] = computeWorkComposition(input.automationRiskScore);
  const humanCritical = 100 - automatable - augmentable;
  const highRiskTasks = input.highRiskTasks && input.highRiskTasks.length > 0
    ? input.highRiskTasks
    : ['Boilerplate code generation', 'Basic unit test creation', 'Documentation drafts'];
  const lowRiskTasks = input.lowRiskTasks && input.lowRiskTasks.length > 0
    ? input.lowRiskTasks
    : ['System architecture decisions', 'Cross-team technical leadership', 'Incident response under ambiguity'];
  const futureSkills = input.futureSkills && input.futureSkills.length > 0
    ? input.futureSkills
    : ['AI workflow design', 'System design', 'Product thinking', 'Technical communication'];

  return {
    executiveTakeaway:
      input.summary ||
      'Software engineering is not disappearing, but the definition of a strong engineer is changing quickly. AI compresses low-level implementation work and increases the premium on architecture, product judgment, reliability, and technical leadership.',
    workComposition: [
      {
        label: 'Automate Now',
        value: automatable,
        tone: 'red',
        description: 'Boilerplate implementation, repetitive tests, scaffolding, and first-draft technical writing.',
      },
      {
        label: 'AI-Augmented',
        value: augmentable,
        tone: 'amber',
        description: 'Debugging, refactoring, investigation, and delivery planning become faster with AI assistance but still need engineer review.',
      },
      {
        label: 'Human-Critical',
        value: humanCritical,
        tone: 'emerald',
        description: 'Architecture trade-offs, reliability ownership, product judgment, and ambiguous problem solving remain durable.',
      },
    ],
    scoreDrivers: [
      {
        title: 'Implementation work is compressing fast',
        strength: 'Primary',
        detail: `AI already accelerates ${highRiskTasks.slice(0, 2).join(' and ')} which lowers the value of pure output volume.`,
      },
      {
        title: 'Architectural judgment still resists automation',
        strength: 'Primary',
        detail: `Work such as ${lowRiskTasks.slice(0, 2).join(' and ')} remains difficult to automate because it depends on trade-offs and accountability.`,
      },
      {
        title: 'Hiring signals are shifting toward leverage',
        strength: 'Secondary',
        detail: 'Teams increasingly favor engineers who can orchestrate tools, own systems, and deliver outcomes across product, infra, and business constraints.',
      },
    ],
    durableAdvantage: [
      'Architecture and system boundary decisions',
      'Complex debugging under incomplete information',
      'Cross-functional translation between product, design, and engineering',
      'Reliability, security, and incident ownership',
      'Mentorship and technical direction',
    ],
    marketSignals: [
      'The market is rewarding fewer engineers who can ship more through AI-enabled workflows.',
      'Junior execution-only work is under the most pressure; ownership and system-level thinking are becoming the differentiators.',
      `A ${input.riskLevel.toLowerCase()} exposure score in engineering usually means role redesign before full replacement, with the sharpest shift appearing over ${input.timelineAssessment || 'the next 2-3 years'}.`,
    ],
    roleEvolution: [
      {
        phase: 'Now',
        title: 'Engineer as AI operator',
        detail: 'Strong engineers are expected to use copilots for implementation, tests, and exploration rather than writing every first draft manually.',
      },
      {
        phase: 'Next 6-12 Months',
        title: 'Engineer as system owner',
        detail: 'Value shifts toward validation, architecture, observability, performance, and coordinating output across tools and teammates.',
      },
      {
        phase: '12-24 Months',
        title: 'Engineer as business lever',
        detail: 'The strongest profiles combine technical depth with product judgment, cost awareness, and the ability to redesign workflows around AI.',
      },
    ],
    ninetyDayPlan: [
      {
        title: 'Map your engineering work by leverage',
        detail: 'List which tasks are first-draft friendly, which need review, and which require deep ownership so you can shift effort toward the last two categories.',
      },
      {
        title: 'Productize one AI-assisted workflow',
        detail: 'Pick one repeatable workflow such as PR drafting, incident analysis, or test creation and make it measurably faster with a defined review standard.',
      },
      {
        title: 'Build visible ownership',
        detail: 'Take responsibility for one area like performance, reliability, architecture, or team enablement where AI cannot replace accountability.',
      },
    ],
    toolingFocus: futureSkills,
  };
}

export function getDetailedAnalysis(input: DetailedAnalysisInput): DetailedAnalysisOutput {
  const role = normalizeTitle(input.jobTitle);
  const fallback = role === 'software engineer' || role === 'software developer'
    ? buildSoftwareEngineerAnalysis(input)
    : buildGenericAnalysis(input);

  return mergeDetailedAnalysis(fallback, input.existingDetailedAnalysis);
}

export function getToneClasses(tone: Tone): { bar: string; chip: string } {
  if (tone === 'red') {
    return { bar: 'bg-red-500', chip: 'bg-red-100 text-red-700' };
  }
  if (tone === 'amber') {
    return { bar: 'bg-amber-500', chip: 'bg-amber-100 text-amber-700' };
  }
  if (tone === 'emerald') {
    return { bar: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-700' };
  }

  return { bar: 'bg-slate-500', chip: 'bg-slate-100 text-slate-700' };
}
