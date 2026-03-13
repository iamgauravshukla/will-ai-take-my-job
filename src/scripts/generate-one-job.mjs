#!/usr/bin/env node
/**
 * Generate enhanced content for a single job (Software Engineer)
 * This tests the new rich content structure before rolling out to all 100 jobs
 */

import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!MONGODB_URI) throw new Error('MONGODB_URI required in .env.local');
if (!OPENAI_API_KEY && !GEMINI_API_KEY) {
  throw new Error('OPENAI_API_KEY or GEMINI_API_KEY required in .env.local');
}

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sector: { type: String, required: true },
    description: { type: String, required: true },
    automationRisk: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], required: true },
    summary: String,
    highRiskTasks: [String],
    lowRiskTasks: [String],
    futureSkills: [String],
    estimatedTimeline: String,
    contentSections: {
      overview: String,
      taskBreakdown: String,
      skillsNeeded: String,
      actionPlan: String,
    },
    detailedAnalysis: mongoose.Schema.Types.Mixed,
    seoOptimized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

// Test job definition
const jobDefinition = {
  title: 'Software Engineer',
  sector: 'Technology',
  description: 'Designs, builds, and maintains software applications',
  risk: 58,
};

function buildFallbackSEOContent(jobTitle, sector, automationRisk) {
  const riskBand = automationRisk >= 70 ? 'very high' : automationRisk >= 55 ? 'high' : automationRisk >= 40 ? 'medium' : 'low';
  const timeline = automationRisk >= 70 ? '1-2 years' : automationRisk >= 55 ? '2-3 years' : automationRisk >= 40 ? '3-5 years' : '5+ years';

  return {
    summary: `${jobTitle} in ${sector} has ${riskBand} automation exposure. Repetitive tasks are likely to automate first, while strategic and stakeholder-facing work remains durable.`,
    highRiskTasks: ['Routine data entry', 'Standardized reporting', 'Template-based documentation', 'Basic triage workflows', 'Repetitive coordination'],
    lowRiskTasks: ['Strategic planning', 'Stakeholder communication', 'Complex judgment calls', 'Cross-functional leadership'],
    futureSkills: ['AI tool fluency', 'Workflow design', 'Critical thinking', 'Communication', 'Domain expertise'],
    estimatedTimeline: timeline,
    contentSections: {
      overview: `${jobTitle} workflows are shifting toward AI-assisted execution in ${sector}. Professionals in this field face moderate disruption as AI handles routine tasks, but human judgment and strategic thinking remain irreplaceable.`,
      taskBreakdown: `High-Risk Tasks (automation-prone):\n• Data processing and entry\n• Report generation and formatting\n• Scheduling and coordination\n• Documentation and record-keeping\n• Quality checks and compliance\n\nFuture-Proof Tasks (human-centric):\n• Strategic decision-making\n• Relationship management\n• Creative problem solving\n• Leadership and mentoring\n• Complex negotiations`,
      skillsNeeded: `Key Skills to Develop:\n1. **AI Tool Fluency** — Learn to work alongside GenAI tools for productivity gains\n2. **Critical Analysis** — Develop deeper judgment on insights AI provides\n3. **Strategic Thinking** — Move from execution to planning and oversight\n4. **Communication** — Clear messaging becomes more important as execution automates\n5. **Continuous Learning** — Stay current with evolving AI capabilities in your domain`,
      actionPlan: `Immediate Actions (Next 3 Months):\n1. Audit your weekly tasks — identify which 30-50% could be AI-assisted\n2. Experiment with one AI tool relevant to your workflow (ChatGPT, Claude, etc.)\n3. Document your unique value beyond automatable tasks\n\nMid-Term Strategy (6-12 Months):\n1. Deepen expertise in non-automatable areas of your role\n2. Build competency in AI workflow design within your domain\n3. Seek cross-functional opportunities that leverage strategic skills\n\nLong-Term Career Development (1-3 Years):\n1. Transition toward roles emphasizing human judgment and leadership\n2. Develop specialized knowledge that's difficult to automate\n3. Build a track record of AI-enhanced value delivery`,
    },
    detailedAnalysis: buildFallbackDetailedAnalysis(jobTitle, sector, automationRisk, highRiskTasks, lowRiskTasks, futureSkills, timeline, summary),
  };
}

function normalizeArray(value, maxItems = 5) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeMappedArray(value, mapper, maxItems = 6) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => mapper(item))
    .filter(Boolean)
    .slice(0, maxItems);
}

function buildFallbackDetailedAnalysis(jobTitle, sector, automationRisk, highRiskTasks, lowRiskTasks, futureSkills, estimatedTimeline, summary) {
  const automatable = Math.max(18, Math.min(42, Math.round(automationRisk * 0.38)));
  const augmentable = Math.max(32, Math.min(52, Math.round(34 + automationRisk * 0.24)));
  let humanCritical = 100 - automatable - augmentable;
  if (humanCritical < 18) {
    humanCritical = 18;
  }

  return {
    executiveTakeaway: summary,
    workComposition: [
      { label: 'Automate Now', value: automatable, tone: 'red', description: 'Repeatable work AI can absorb quickly.' },
      { label: 'AI-Augmented', value: Math.max(30, augmentable - Math.max(0, 18 - (100 - automatable - augmentable))), tone: 'amber', description: 'Human-owned work accelerated by copilots and workflow automation.' },
      { label: 'Human-Critical', value: humanCritical, tone: 'emerald', description: 'Judgment-heavy work that stays human-led.' },
    ],
    scoreDrivers: [
      { title: 'Routine execution exposure', strength: 'Primary', detail: `Automation pressure is concentrated around ${highRiskTasks.slice(0, 2).join(' and ')}.` },
      { title: 'Human context still matters', strength: 'Secondary', detail: `${lowRiskTasks.slice(0, 2).join(' and ')} remain resilient because they depend on trade-offs and context.` },
      { title: 'Skill transition drives resilience', strength: 'Secondary', detail: `Capabilities like ${futureSkills.slice(0, 2).join(' and ')} will increasingly separate resilient professionals from replaceable workflows.` },
    ],
    durableAdvantage: lowRiskTasks,
    marketSignals: [
      `Hiring in ${sector} is shifting toward people who can combine domain depth with AI leverage.`,
      'Execution-only work is under more pressure than judgment-heavy work.',
      `The current change horizon is ${estimatedTimeline}.`,
    ],
    roleEvolution: [
      { phase: 'Now', title: 'Execution compresses', detail: 'AI handles more draft work and repeatable tasks.' },
      { phase: 'Next 6-12 Months', title: 'Validation becomes critical', detail: 'Human review, prioritization, and workflow ownership rise in value.' },
      { phase: '12-24 Months', title: 'Leverage beats volume', detail: 'Top performers use AI to deliver broader business outcomes, not just more output.' },
    ],
    ninetyDayPlan: [
      { title: 'Audit the workflow', detail: 'Map current work into automatable, augmentable, and human-critical buckets.' },
      { title: 'Adopt one AI system', detail: 'Choose a repeatable workflow and improve speed without lowering quality.' },
      { title: 'Raise the human moat', detail: `Deliberately spend more time on ${lowRiskTasks[0] || 'high-context work'} and less on low-leverage tasks.` },
    ],
    toolingFocus: futureSkills,
  };
}

function validateDetailedAnalysis(value, fallback) {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const workComposition = normalizeMappedArray(
    value.workComposition,
    (item) => {
      if (!item || typeof item !== 'object') return null;
      if (typeof item.label !== 'string' || typeof item.description !== 'string' || typeof item.value !== 'number') return null;
      return {
        label: item.label.trim(),
        value: Math.max(0, Math.min(100, Math.round(item.value))),
        tone: typeof item.tone === 'string' ? item.tone.trim() : 'slate',
        description: item.description.trim(),
      };
    },
    4
  );

  const scoreDrivers = normalizeMappedArray(
    value.scoreDrivers,
    (item) => {
      if (!item || typeof item !== 'object') return null;
      if (typeof item.title !== 'string' || typeof item.detail !== 'string') return null;
      return {
        title: item.title.trim(),
        strength: item.strength === 'Primary' ? 'Primary' : 'Secondary',
        detail: item.detail.trim(),
      };
    },
    4
  );

  const roleEvolution = normalizeMappedArray(
    value.roleEvolution,
    (item) => {
      if (!item || typeof item !== 'object') return null;
      if (typeof item.phase !== 'string' || typeof item.title !== 'string' || typeof item.detail !== 'string') return null;
      return {
        phase: item.phase.trim(),
        title: item.title.trim(),
        detail: item.detail.trim(),
      };
    },
    4
  );

  const ninetyDayPlan = normalizeMappedArray(
    value.ninetyDayPlan,
    (item) => {
      if (!item || typeof item !== 'object') return null;
      if (typeof item.title !== 'string' || typeof item.detail !== 'string') return null;
      return {
        title: item.title.trim(),
        detail: item.detail.trim(),
      };
    },
    4
  );

  return {
    executiveTakeaway:
      typeof value.executiveTakeaway === 'string' && value.executiveTakeaway.trim()
        ? value.executiveTakeaway.trim()
        : fallback.executiveTakeaway,
    workComposition: workComposition.length > 0 ? workComposition : fallback.workComposition,
    scoreDrivers: scoreDrivers.length > 0 ? scoreDrivers : fallback.scoreDrivers,
    durableAdvantage: normalizeArray(value.durableAdvantage, 6).length > 0 ? normalizeArray(value.durableAdvantage, 6) : fallback.durableAdvantage,
    marketSignals: normalizeArray(value.marketSignals, 6).length > 0 ? normalizeArray(value.marketSignals, 6) : fallback.marketSignals,
    roleEvolution: roleEvolution.length > 0 ? roleEvolution : fallback.roleEvolution,
    ninetyDayPlan: ninetyDayPlan.length > 0 ? ninetyDayPlan : fallback.ninetyDayPlan,
    toolingFocus: normalizeArray(value.toolingFocus, 8).length > 0 ? normalizeArray(value.toolingFocus, 8) : fallback.toolingFocus,
  };
}

function validateSEOContent(content, fallback) {
  if (!content || typeof content !== 'object') {
    return fallback;
  }

  const summary = typeof content.summary === 'string' && content.summary.trim() ? content.summary.trim() : fallback.summary;
  const highRiskTasks = normalizeArray(content.highRiskTasks).length ? normalizeArray(content.highRiskTasks) : fallback.highRiskTasks;
  const lowRiskTasks = normalizeArray(content.lowRiskTasks, 4).length ? normalizeArray(content.lowRiskTasks, 4) : fallback.lowRiskTasks;
  const futureSkills = normalizeArray(content.futureSkills).length ? normalizeArray(content.futureSkills) : fallback.futureSkills;
  const estimatedTimeline =
    typeof content.estimatedTimeline === 'string' && content.estimatedTimeline.trim()
      ? content.estimatedTimeline.trim()
      : fallback.estimatedTimeline;

  const sections = content.contentSections && typeof content.contentSections === 'object' ? content.contentSections : {};
  const contentSections = {
    overview:
      typeof sections.overview === 'string' && sections.overview.trim() ? sections.overview.trim() : fallback.contentSections.overview,
    taskBreakdown:
      typeof sections.taskBreakdown === 'string' && sections.taskBreakdown.trim()
        ? sections.taskBreakdown.trim()
        : fallback.contentSections.taskBreakdown,
    skillsNeeded:
      typeof sections.skillsNeeded === 'string' && sections.skillsNeeded.trim()
        ? sections.skillsNeeded.trim()
        : fallback.contentSections.skillsNeeded,
    actionPlan:
      typeof sections.actionPlan === 'string' && sections.actionPlan.trim() ? sections.actionPlan.trim() : fallback.contentSections.actionPlan,
  };

  return {
    summary,
    highRiskTasks,
    lowRiskTasks,
    futureSkills,
    estimatedTimeline,
    contentSections,
    detailedAnalysis: validateDetailedAnalysis(content.detailedAnalysis, fallback.detailedAnalysis),
  };
}

function parseJsonResponse(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim();
    if (codeBlock) {
      try {
        return JSON.parse(codeBlock);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function getErrorDetails(error) {
  const status = error?.response?.status;
  const message = error?.response?.data?.error?.message || error?.message || 'Unknown error';
  return { status, message };
}

async function generateWithGemini(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      { timeout: 30000 }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return parseJsonResponse(text);
  } catch (error) {
    console.error(`Gemini API error:`, getErrorDetails(error).message);
    throw error;
  }
}

async function generateWithOpenAI(prompt) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        temperature: 0.4,
        max_completion_tokens: 1800,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    return parseJsonResponse(text);
  } catch (error) {
    console.error(`OpenAI API error:`, getErrorDetails(error).message);
    throw error;
  }
}

async function generateSEOContent(jobTitle, sector, description, automationRisk) {
  const fallback = buildFallbackSEOContent(jobTitle, sector, automationRisk);

  try {
    const prompt = `Generate rich JSON for a dynamic job analysis page. Return ONLY valid JSON with no markdown.

Job Title: ${jobTitle}
Sector: ${sector}
Description: ${description}
Automation Risk Score: ${automationRisk}%

Create a JSON object with these exact fields:
{
  "summary": "2-3 sentence expert summary of AI impact on this role",
  "highRiskTasks": ["task1", "task2", "task3", "task4", "task5"],
  "lowRiskTasks": ["task1", "task2", "task3", "task4"],
  "futureSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "estimatedTimeline": "specific timeframe like '1-2 years', '2-3 years', '3-5 years', or '5+ years'",
  "contentSections": {
    "overview": "2-3 sentences describing AI's impact on the role",
    "taskBreakdown": "Detailed breakdown using \\n for line breaks",
    "skillsNeeded": "Detailed roadmap with ranked skills and explanations",
    "actionPlan": "Concrete 3-phase action plan using \\n for line breaks"
  },
  "detailedAnalysis": {
    "executiveTakeaway": "1-2 sentence value-dense takeaway for the page hero/overview",
    "workComposition": [
      {"label":"Automate Now","value":number,"tone":"red","description":"..."},
      {"label":"AI-Augmented","value":number,"tone":"amber","description":"..."},
      {"label":"Human-Critical","value":number,"tone":"emerald","description":"..."}
    ],
    "scoreDrivers": [
      {"title":"...","strength":"Primary","detail":"..."},
      {"title":"...","strength":"Primary","detail":"..."},
      {"title":"...","strength":"Secondary","detail":"..."}
    ],
    "durableAdvantage": ["...", "...", "...", "..."],
    "marketSignals": ["...", "...", "..."],
    "roleEvolution": [
      {"phase":"Now","title":"...","detail":"..."},
      {"phase":"Next 6-12 Months","title":"...","detail":"..."},
      {"phase":"12-24 Months","title":"...","detail":"..."}
    ],
    "ninetyDayPlan": [
      {"title":"...","detail":"..."},
      {"title":"...","detail":"..."},
      {"title":"...","detail":"..."}
    ],
    "toolingFocus": ["...", "...", "...", "...", "..."]
  }
}

Rules:
- Make the output concrete, role-specific, and data-oriented.
- workComposition values must sum to 100.
- Favor concise, scannable phrases over generic prose.
- Make the output useful for comparison cards, charts, and planning sections.`;

    try {
      const openaiResult = await generateWithOpenAI(prompt);
      if (openaiResult) {
        console.log('  ✓ Generated with OpenAI');
        return validateSEOContent(openaiResult, fallback);
      }
    } catch (openaiError) {
      console.warn(`  OpenAI failed - ${getErrorDetails(openaiError).message}. Trying Gemini...`);
    }

    try {
      const geminiResult = await generateWithGemini(prompt);
      if (geminiResult) {
        console.log('  ✓ Generated with Gemini');
        return validateSEOContent(geminiResult, fallback);
      }
    } catch (geminiError) {
      console.warn(`  Gemini failed - ${getErrorDetails(geminiError).message}. Using template fallback.`);
    }

    console.log('  ✓ Using template fallback');
    return fallback;
  } catch (error) {
    console.error('Generation failed:', error);
    return fallback;
  }
}

async function getRiskLevel(automationRisk) {
  if (automationRisk >= 70) return 'Very High';
  if (automationRisk >= 55) return 'High';
  if (automationRisk >= 40) return 'Medium';
  return 'Low';
}

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('Connected to MongoDB.\n');
    console.log(`Generating enhanced content for: ${jobDefinition.title}\n`);

    const seoContent = await generateSEOContent(
      jobDefinition.title,
      jobDefinition.sector,
      jobDefinition.description,
      jobDefinition.risk
    );

    const riskLevel = await getRiskLevel(jobDefinition.risk);
    const slug = jobDefinition.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const jobEntry = {
      title: jobDefinition.title,
      slug,
      sector: jobDefinition.sector,
      description: jobDefinition.description,
      automationRisk: jobDefinition.risk,
      riskLevel,
      summary: seoContent.summary,
      highRiskTasks: seoContent.highRiskTasks,
      lowRiskTasks: seoContent.lowRiskTasks,
      futureSkills: seoContent.futureSkills,
      estimatedTimeline: seoContent.estimatedTimeline,
      contentSections: seoContent.contentSections,
      detailedAnalysis: seoContent.detailedAnalysis,
      seoOptimized: true,
    };

    console.log('\n📝 Generated Content Structure:');
    console.log(`Title: ${jobEntry.title} (${riskLevel})`);
    console.log(`Risk Score: ${jobEntry.automationRisk}%`);
    console.log(`Timeline: ${jobEntry.estimatedTimeline}`);
    console.log(`High-Risk Tasks: ${jobEntry.highRiskTasks.length} items`);
    console.log(`Low-Risk Tasks: ${jobEntry.lowRiskTasks.length} items`);
    console.log(`Future Skills: ${jobEntry.futureSkills.length} items`);
    console.log(`Content Sections: ${Object.keys(jobEntry.contentSections).length} sections`);
    const da = jobEntry.detailedAnalysis;
    if (da) {
      console.log(`DetailedAnalysis: workComposition(${da.workComposition?.length ?? 0}), scoreDrivers(${da.scoreDrivers?.length ?? 0}), roleEvolution(${da.roleEvolution?.length ?? 0}), ninetyDayPlan(${da.ninetyDayPlan?.length ?? 0})`);
    }
    console.log('');

    // Upsert to MongoDB
    await Job.updateOne({ slug: jobEntry.slug }, { $set: jobEntry }, { upsert: true });

    console.log(`✅ Successfully upserted to MongoDB`);
    console.log(`\n📌 Preview the enhanced job at: /jobs/${jobEntry.slug}`);
    console.log(`   Share a personalized result at: /results/[shareable_token]\n`);
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
