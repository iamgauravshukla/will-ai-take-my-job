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

// Comprehensive job list covering 100+ roles across sectors
const jobDefinitions = [
  // Technology (20 roles)
  { title: 'Software Engineer', sector: 'Technology', description: 'Designs, builds, and maintains software applications', risk: 58 },
  { title: 'Frontend Developer', sector: 'Technology', description: 'Builds user-facing web and mobile interfaces', risk: 50 },
  { title: 'Backend Developer', sector: 'Technology', description: 'Develops server-side logic and APIs', risk: 55 },
  { title: 'DevOps Engineer', sector: 'Technology', description: 'Manages infrastructure, deployment, and monitoring', risk: 42 },
  { title: 'Data Engineer', sector: 'Technology', description: 'Builds and maintains data pipelines and warehouses', risk: 45 },
  { title: 'Machine Learning Engineer', sector: 'Technology', description: 'Develops and deploys ML models and systems', risk: 35 },
  { title: 'QA Engineer', sector: 'Technology', description: 'Tests software and ensures quality standards', risk: 63 },
  { title: 'Systems Administrator', sector: 'Technology', description: 'Manages IT infrastructure and user support', risk: 68 },
  { title: 'Database Administrator', sector: 'Technology', description: 'Maintains databases and ensures data integrity', risk: 52 },
  { title: 'Security Engineer', sector: 'Technology', description: 'Implements and monitors security systems', risk: 38 },
  { title: 'UX/UI Designer', sector: 'Technology', description: 'Designs user experiences and interfaces', risk: 48 },
  { title: 'Product Manager', sector: 'Technology', description: 'Defines product strategy and roadmap', risk: 41 },
  { title: 'Project Manager', sector: 'Technology', description: 'Coordinates tech projects and team execution', risk: 49 },
  { title: 'Tech Lead', sector: 'Technology', description: 'Leads technical teams and architecture decisions', risk: 32 },
  { title: 'Solutions Architect', sector: 'Technology', description: 'Designs technology solutions for clients', risk: 36 },
  { title: 'IT Support Specialist', sector: 'Technology', description: 'Provides technical support to end users', risk: 70 },
  { title: 'Cloud Architect', sector: 'Technology', description: 'Designs cloud infrastructure and strategies', risk: 40 },
  { title: 'Network Engineer', sector: 'Technology', description: 'Manages and maintains network infrastructure', risk: 55 },
  { title: 'Software Tester', sector: 'Technology', description: 'Tests software for defects and usability', risk: 65 },
  { title: 'Technical Writer', sector: 'Technology', description: 'Documents technical processes and features', risk: 55 },

  // Finance & Banking (15 roles)
  { title: 'Financial Analyst', sector: 'Finance & Banking', description: 'Analyzes financial data and builds models', risk: 66 },
  { title: 'Accountant', sector: 'Finance & Banking', description: 'Manages financial records and compliance', risk: 69 },
  { title: 'Bookkeeper', sector: 'Finance & Banking', description: 'Records and maintains financial transactions', risk: 78 },
  { title: 'Tax Accountant', sector: 'Finance & Banking', description: 'Prepares tax returns and ensures compliance', risk: 60 },
  { title: 'Auditor', sector: 'Finance & Banking', description: 'Examines financial records for accuracy', risk: 64 },
  { title: 'Investment Analyst', sector: 'Finance & Banking', description: 'Evaluates investment opportunities', risk: 52 },
  { title: 'Credit Analyst', sector: 'Finance & Banking', description: 'Assesses credit risk for loan applications', risk: 71 },
  { title: 'Loan Officer', sector: 'Finance & Banking', description: 'Processes and approves loan applications', risk: 67 },
  { title: 'Risk Manager', sector: 'Finance & Banking', description: 'Identifies and mitigates financial risks', risk: 44 },
  { title: 'Compliance Officer', sector: 'Finance & Banking', description: 'Ensures regulatory compliance', risk: 48 },
  { title: 'Financial Planner', sector: 'Finance & Banking', description: 'Advises clients on financial goals', risk: 39 },
  { title: 'Treasury Analyst', sector: 'Finance & Banking', description: 'Manages corporate money and liquidity', risk: 58 },
  { title: 'Payroll Specialist', sector: 'Finance & Banking', description: 'Processes payroll and benefits', risk: 75 },
  { title: 'Billing Specialist', sector: 'Finance & Banking', description: 'Manages customer billing and invoicing', risk: 76 },
  { title: 'Collections Specialist', sector: 'Finance & Banking', description: 'Recovers outstanding payments', risk: 73 },

  // Marketing & Advertising (15 roles)
  { title: 'Marketing Manager', sector: 'Marketing & Advertising', description: 'Plans and executes marketing campaigns', risk: 53 },
  { title: 'Content Marketing Manager', sector: 'Marketing & Advertising', description: 'Creates and manages content strategy', risk: 44 },
  { title: 'Social Media Manager', sector: 'Marketing & Advertising', description: 'Manages social media presence and engagement', risk: 57 },
  { title: 'Digital Marketing Specialist', sector: 'Marketing & Advertising', description: 'Executes digital marketing campaigns', risk: 54 },
  { title: 'SEO Specialist', sector: 'Marketing & Advertising', description: 'Optimizes web content for search engines', risk: 51 },
  { title: 'PPC Specialist', sector: 'Marketing & Advertising', description: 'Manages paid advertising campaigns', risk: 56 },
  { title: 'Graphic Designer', sector: 'Marketing & Advertising', description: 'Creates visual marketing materials', risk: 65 },
  { title: 'Video Producer', sector: 'Marketing & Advertising', description: 'Produces video content for marketing', risk: 46 },
  { title: 'Brand Manager', sector: 'Marketing & Advertising', description: 'Manages brand positioning and identity', risk: 38 },
  { title: 'Market Research Analyst', sector: 'Marketing & Advertising', description: 'Researches market trends and consumer behavior', risk: 49 },
  { title: 'Copywriter', sector: 'Marketing & Advertising', description: 'Writes marketing copy and messaging', risk: 47 },
  { title: 'Email Marketing Specialist', sector: 'Marketing & Advertising', description: 'Manages email marketing campaigns', risk: 61 },
  { title: 'Customer Insights Manager', sector: 'Marketing & Advertising', description: 'Analyzes customer data and insights', risk: 50 },
  { title: 'Growth Manager', sector: 'Marketing & Advertising', description: 'Drives product and user growth', risk: 45 },
  { title: 'Event Marketing Coordinator', sector: 'Marketing & Advertising', description: 'Plans and executes marketing events', risk: 52 },

  // Human Resources (12 roles)
  { title: 'HR Manager', sector: 'Human Resources', description: 'Oversees hiring, relations, and talent programs', risk: 46 },
  { title: 'Recruiter', sector: 'Human Resources', description: 'Identifies and recruits talent', risk: 53 },
  { title: 'Talent Acquisition Manager', sector: 'Human Resources', description: 'Leads recruiting and hiring strategy', risk: 47 },
  { title: 'Compensation Analyst', sector: 'Human Resources', description: 'Analyzes and manages compensation programs', risk: 57 },
  { title: 'Benefits Administrator', sector: 'Human Resources', description: 'Administers employee benefits programs', risk: 62 },
  { title: 'Training Specialist', sector: 'Human Resources', description: 'Develops and delivers employee training', risk: 43 },
  { title: 'HR Business Partner', sector: 'Human Resources', description: 'Provides strategic HR support to business units', risk: 40 },
  { title: 'Employee Relations Manager', sector: 'Human Resources', description: 'Manages employee issues and relations', risk: 42 },
  { title: 'Organizational Development Manager', sector: 'Human Resources', description: 'Drives organizational improvement initiatives', risk: 36 },
  { title: 'Payroll Administrator', sector: 'Human Resources', description: 'Manages payroll processing and records', risk: 74 },
  { title: 'HRIS Analyst', sector: 'Human Resources', description: 'Manages HR information systems', risk: 55 },
  { title: 'Compliance Specialist', sector: 'Human Resources', description: 'Ensures HR compliance with regulations', risk: 58 },

  // Sales (12 roles)
  { title: 'Sales Representative', sector: 'Sales', description: 'Sells products and services to customers', risk: 48 },
  { title: 'Account Executive', sector: 'Sales', description: 'Manages large accounts and account growth', risk: 35 },
  { title: 'Business Development Manager', sector: 'Sales', description: 'Identifies new business opportunities', risk: 37 },
  { title: 'Sales Manager', sector: 'Sales', description: 'Manages sales team and targets', risk: 44 },
  { title: 'Inside Sales Representative', sector: 'Sales', description: 'Sells products via phone and email', risk: 55 },
  { title: 'Territory Manager', sector: 'Sales', description: 'Manages sales in assigned territory', risk: 46 },
  { title: 'Account Manager', sector: 'Sales', description: 'Maintains and grows existing accounts', risk: 39 },
  { title: 'Sales Development Representative', sector: 'Sales', description: 'Generates leads and initiates sales processes', risk: 59 },
  { title: 'Enterprise Sales Representative', sector: 'Sales', description: 'Sells enterprise solutions', risk: 36 },
  { title: 'Channel Manager', sector: 'Sales', description: 'Manages sales through channel partners', risk: 47 },
  { title: 'Retail Store Manager', sector: 'Sales', description: 'Manages retail store operations and sales', risk: 54 },
  { title: 'Sales Operations Analyst', sector: 'Sales', description: 'Supports sales operations and analytics', risk: 61 },

  // Customer Support & Service (12 roles)
  { title: 'Customer Support Specialist', sector: 'Customer Support & Service', description: 'Resolves customer issues via chat, email, phone', risk: 74 },
  { title: 'Customer Service Representative', sector: 'Customer Support & Service', description: 'Provides customer service support', risk: 76 },
  { title: 'Technical Support Specialist', sector: 'Customer Support & Service', description: 'Provides technical customer support', risk: 64 },
  { title: 'Support Manager', sector: 'Customer Support & Service', description: 'Manages customer support team', risk: 52 },
  { title: 'Quality Assurance Manager', sector: 'Customer Support & Service', description: 'Monitors support quality and performance', risk: 53 },
  { title: 'Chatbot Specialist', sector: 'Customer Support & Service', description: 'Develops and manages chatbot systems', risk: 45 },
  { title: 'Knowledge Manager', sector: 'Customer Support & Service', description: 'Creates and maintains knowledge bases', risk: 58 },
  { title: 'Customer Experience Manager', sector: 'Customer Support & Service', description: 'Improves customer experience', risk: 41 },
  { title: 'Billing Support Specialist', sector: 'Customer Support & Service', description: 'Handles billing inquiries and issues', risk: 72 },
  { title: 'Escalations Manager', sector: 'Customer Support & Service', description: 'Manages escalated customer issues', risk: 48 },
  { title: 'Customer Onboarding Specialist', sector: 'Customer Support & Service', description: 'Onboards new customers', risk: 50 },
  { title: 'Support Engineer', sector: 'Customer Support & Service', description: 'Provides technical support for products', risk: 62 },

  // Operations (12 roles)
  { title: 'Operations Manager', sector: 'Operations', description: 'Manages operations and processes', risk: 50 },
  { title: 'Supply Chain Manager', sector: 'Operations', description: 'Manages supply chain and logistics', risk: 51 },
  { title: 'Procurement Specialist', sector: 'Operations', description: 'Manages purchasing and procurement', risk: 56 },
  { title: 'Warehouse Manager', sector: 'Operations', description: 'Manages warehouse operations', risk: 58 },
  { title: 'Logistics Coordinator', sector: 'Operations', description: 'Coordinates shipments and logistics', risk: 63 },
  { title: 'Inventory Manager', sector: 'Operations', description: 'Manages inventory levels and accuracy', risk: 67 },
  { title: 'Process Analyst', sector: 'Operations', description: 'Analyzes and improves business processes', risk: 47 },
  { title: 'Data Analyst', sector: 'Operations', description: 'Analyzes operational data', risk: 72 },
  { title: 'Operational Risk Manager', sector: 'Operations', description: 'Identifies and mitigates operational risks', risk: 43 },
  { title: 'Quality Manager', sector: 'Operations', description: 'Ensures product/service quality', risk: 54 },
  { title: 'Facilities Manager', sector: 'Operations', description: 'Manages office facilities and maintenance', risk: 46 },
  { title: 'Business Analyst', sector: 'Operations', description: 'Analyzes business requirements and processes', risk: 48 },

  // Data & Analytics (10 roles)
  { title: 'Data Analyst', sector: 'Data & Analytics', description: 'Collects and analyzes data for insights', risk: 72 },
  { title: 'Data Scientist', sector: 'Data & Analytics', description: 'Develops data models and algorithms', risk: 48 },
  { title: 'Analytics Manager', sector: 'Data & Analytics', description: 'Leads analytics team and strategy', risk: 45 },
  { title: 'Business Intelligence Analyst', sector: 'Data & Analytics', description: 'Develops BI dashboards and reports', risk: 68 },
  { title: 'Data Architect', sector: 'Data & Analytics', description: 'Designs data systems and infrastructure', risk: 42 },
  { title: 'Reporting Analyst', sector: 'Data & Analytics', description: 'Creates reports from business data', risk: 75 },
  { title: 'Insights Manager', sector: 'Data & Analytics', description: 'Develops consumer/market insights', risk: 44 },
  { title: 'Data Quality Analyst', sector: 'Data & Analytics', description: 'Ensures data quality and accuracy', risk: 61 },
  { title: 'Analytics Engineer', sector: 'Data & Analytics', description: 'Builds analytics infrastructure and tools', risk: 49 },
  { title: 'Research Analyst', sector: 'Data & Analytics', description: 'Conducts research and analysis', risk: 46 },

  // Design (8 roles)
  { title: 'Graphic Designer', sector: 'Design', description: 'Creates visual content and designs', risk: 65 },
  { title: 'Product Designer', sector: 'Design', description: 'Designs products and user experiences', risk: 44 },
  { title: 'UX Designer', sector: 'Design', description: 'Designs user experiences', risk: 42 },
  { title: 'UI Designer', sector: 'Design', description: 'Designs user interfaces', risk: 48 },
  { title: 'Design Manager', sector: 'Design', description: 'Leads design team and strategy', risk: 37 },
  { title: 'Web Designer', sector: 'Design', description: 'Designs websites', risk: 56 },
  { title: 'Motion Designer', sector: 'Design', description: 'Creates motion graphics and animations', risk: 51 },
  { title: 'Brand Designer', sector: 'Design', description: 'Designs brand identity and assets', risk: 52 },

  // Legal & Compliance (8 roles)
  { title: 'Lawyer', sector: 'Legal & Compliance', description: 'Provides legal advice and services', risk: 24 },
  { title: 'Compliance Officer', sector: 'Legal & Compliance', description: 'Ensures regulatory compliance', risk: 48 },
  { title: 'Compliance Analyst', sector: 'Legal & Compliance', description: 'Analyzes compliance requirements', risk: 53 },
  { title: 'Contract Manager', sector: 'Legal & Compliance', description: 'Manages contracts and agreements', risk: 50 },
  { title: 'Paralegal', sector: 'Legal & Compliance', description: 'Supports lawyers and legal processes', risk: 48 },
  { title: 'Legal Administrator', sector: 'Legal & Compliance', description: 'Administers legal department', risk: 58 },
  { title: 'Regulatory Affairs Specialist', sector: 'Legal & Compliance', description: 'Manages regulatory affairs', risk: 46 },
  { title: 'Risk Compliance Manager', sector: 'Legal & Compliance', description: 'Manages risk and compliance', risk: 45 },

  // Education (8 roles)
  { title: 'Teacher', sector: 'Education', description: 'Teaches students in classroom setting', risk: 28 },
  { title: 'Online Instructor', sector: 'Education', description: 'Teaches courses online', risk: 35 },
  { title: 'Curriculum Developer', sector: 'Education', description: 'Develops educational curriculum', risk: 42 },
  { title: 'Training Manager', sector: 'Education', description: 'Creates and delivers training programs', risk: 43 },
  { title: 'Education Consultant', sector: 'Education', description: 'Advises on education strategies', risk: 35 },
  { title: 'Instructional Designer', sector: 'Education', description: 'Designs learning experiences', risk: 44 },
  { title: 'Learning Systems Manager', sector: 'Education', description: 'Manages learning management systems', risk: 51 },
  { title: 'Academic Advisor', sector: 'Education', description: 'Advises students on academics', risk: 39 },
];

function parseJsonFromText(rawText) {
  if (typeof rawText !== 'string' || !rawText.trim()) {
    return null;
  }

  const text = rawText.trim();

  try {
    return JSON.parse(text);
  } catch {
    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
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
    const deficit = 18 - humanCritical;
    humanCritical = 18;
    return {
      executiveTakeaway: summary,
      workComposition: [
        { label: 'Automate Now', value: automatable, tone: 'red', description: 'Repeatable work AI can absorb quickly.' },
        { label: 'AI-Augmented', value: Math.max(30, augmentable - deficit), tone: 'amber', description: 'Human-owned work accelerated by copilots and workflow automation.' },
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

  return {
    executiveTakeaway: summary,
    workComposition: [
      { label: 'Automate Now', value: automatable, tone: 'red', description: 'Repeatable work AI can absorb quickly.' },
      { label: 'AI-Augmented', value: augmentable, tone: 'amber', description: 'Human-owned work accelerated by copilots and workflow automation.' },
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

function buildFallbackSEOContent(jobTitle, sector, automationRisk) {
  const riskBand = automationRisk >= 70 ? 'very high' : automationRisk >= 55 ? 'high' : automationRisk >= 40 ? 'medium' : 'low';
  const timeline = automationRisk >= 70 ? '1-2 years' : automationRisk >= 55 ? '2-3 years' : automationRisk >= 40 ? '3-5 years' : '5+ years';
  const summary = `${jobTitle} in ${sector} has ${riskBand} automation exposure. Repetitive tasks are likely to automate first, while strategic and stakeholder-facing work remains durable.`;
  const highRiskTasks = ['Routine data entry', 'Standardized reporting', 'Template-based documentation', 'Basic triage workflows', 'Repetitive coordination'];
  const lowRiskTasks = ['Strategic planning', 'Stakeholder communication', 'Complex judgment calls', 'Cross-functional leadership'];
  const futureSkills = ['AI tool fluency', 'Workflow design', 'Critical thinking', 'Communication', 'Domain expertise'];

  return {
    summary,
    highRiskTasks,
    lowRiskTasks,
    futureSkills,
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

function getAxiosErrorDetails(error) {
  const status = error?.response?.status;
  const message = error?.response?.data?.error?.message || error?.message || 'Unknown error';
  return { status, message };
}

async function generateWithGemini(prompt) {
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
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 1400,
      },
    },
    { timeout: 15000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseJsonFromText(text);
}

async function generateWithOpenAI(prompt) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: OPENAI_MODEL,
      temperature: 0.4,
      max_completion_tokens: 1400,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    },
    {
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'content-type': 'application/json',
      },
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  return parseJsonFromText(text);
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
    "durableAdvantage": ["...", "...", "..."],
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
    "toolingFocus": ["...", "...", "...", "..."]
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
        return validateSEOContent(openaiResult, fallback);
      }
    } catch (openaiError) {
      const details = getAxiosErrorDetails(openaiError);
      console.warn(`OpenAI failed for ${jobTitle} (status: ${details.status || 'N/A'}) - ${details.message}. Falling back to Gemini/template.`);
    }

    try {
      const geminiResult = await generateWithGemini(prompt);
      if (geminiResult) {
        return validateSEOContent(geminiResult, fallback);
      }
    } catch (geminiError) {
      const details = getAxiosErrorDetails(geminiError);
      console.warn(
        `Gemini failed for ${jobTitle} (status: ${details.status || 'N/A'}) - ${details.message}. Using template fallback.`
      );
    }

    return fallback;
  } catch (error) {
    const details = getAxiosErrorDetails(error);
    console.error(`Failed to generate content for ${jobTitle} (status: ${details.status || 'N/A'}):`, details.message);
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
    console.log('Connected to MongoDB. Generating 100+ job entries...\n');
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
      console.log(`Using OpenAI model: ${OPENAI_MODEL}`);
    } else {
      console.log('OpenAI primary unavailable; using Gemini as primary fallback.');
    }
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      console.log(`Gemini fallback enabled: ${GEMINI_MODEL}`);
    } else {
      console.log('Gemini fallback disabled (no valid GEMINI_API_KEY)');
    }
    console.log('');

    const jobs = [];
    let processedCount = 0;
    let failedCount = 0;

    for (const jobDef of jobDefinitions) {
      processedCount++;
      console.log(`[${processedCount}/${jobDefinitions.length}] Generating content for: ${jobDef.title}...`);

      const seoContent = await generateSEOContent(
        jobDef.title,
        jobDef.sector,
        jobDef.description,
        jobDef.risk
      );

      const riskLevel = await getRiskLevel(jobDef.risk);
      const slug = jobDef.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const jobEntry = {
        title: jobDef.title,
        slug,
        sector: jobDef.sector,
        description: jobDef.description,
        automationRisk: jobDef.risk,
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

      jobs.push(jobEntry);
      console.log(`✅ Generated: ${jobDef.title} (${riskLevel})\n`);

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (jobs.length === 0) {
      console.log('❌ No jobs generated. Check API keys and quota.');
      process.exitCode = 1;
      return;
    }

    console.log(`\n📝 Seeding ${jobs.length} jobs to MongoDB...`);

    const bulk = jobs.map((job) => ({
      updateOne: {
        filter: { slug: job.slug },
        update: { $set: job },
        upsert: true,
      },
    }));

    const result = await Job.bulkWrite(bulk, { ordered: false });

    console.log('\n✅ SEO Generation Complete');
    console.log({
      generated: jobs.length,
      failed: failedCount,
      totalProcessed: processedCount,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    });
  } catch (error) {
    console.error('Generation failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
