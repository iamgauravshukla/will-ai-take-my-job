import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required in .env.local');
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
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

const jobs = [
  {
    title: 'Software Engineer',
    slug: 'software-engineer',
    sector: 'Technology',
    description: 'Designs, builds, tests, and maintains software applications and platforms.',
    automationRisk: 58,
    riskLevel: 'High',
    summary: 'Routine coding and testing can be accelerated by AI, while architecture and product thinking remain high-value.',
    highRiskTasks: ['Unit test generation', 'Boilerplate coding', 'Basic debugging'],
    lowRiskTasks: ['System architecture design', 'Cross-team planning', 'Tradeoff decisions'],
    futureSkills: ['System Design', 'AI-Augmented Development', 'Leadership'],
    estimatedTimeline: '2-3 years',
    contentSections: {
      overview: 'Software engineering is evolving toward AI-assisted workflows.',
      taskBreakdown: 'Implementation tasks automate first; design and decision tasks remain human-led.',
      skillsNeeded: 'Architecture, product sense, and communication become critical.',
      actionPlan: 'Adopt AI coding tools and invest in design-level problem solving.',
    },
  },
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    sector: 'Data Science',
    description: 'Collects, processes, and interprets data to support business decisions.',
    automationRisk: 72,
    riskLevel: 'Very High',
    summary: 'Data wrangling and basic reporting are rapidly automating, while business framing remains differentiating.',
    highRiskTasks: ['Dashboard generation', 'Data cleanup', 'Recurring reporting'],
    lowRiskTasks: ['Business context framing', 'Stakeholder storytelling', 'Strategic recommendations'],
    futureSkills: ['Business Strategy', 'Experiment Design', 'Narrative Communication'],
    estimatedTimeline: '1-2 years',
    contentSections: {
      overview: 'Analyst workflows increasingly rely on automated BI and LLM copilots.',
      taskBreakdown: 'Routine SQL/report tasks are high-risk; interpretation remains low-risk.',
      skillsNeeded: 'Decision science and communication skills become essential.',
      actionPlan: 'Move from dashboard production to strategic advisory capability.',
    },
  },
  {
    title: 'Product Manager',
    slug: 'product-manager',
    sector: 'Technology',
    description: 'Defines product strategy, priorities, and delivery execution across teams.',
    automationRisk: 41,
    riskLevel: 'Medium',
    summary: 'Documentation and synthesis automate, while product judgment and stakeholder alignment remain core.',
    highRiskTasks: ['PRD drafting', 'Status summarization', 'Backlog grooming support'],
    lowRiskTasks: ['Roadmap prioritization', 'Stakeholder alignment', 'Strategic tradeoffs'],
    futureSkills: ['AI Product Strategy', 'Market Sensing', 'Cross-functional Leadership'],
    estimatedTimeline: '3-5 years',
    contentSections: {
      overview: 'Product management remains highly human due to ambiguity and prioritization.',
      taskBreakdown: 'Execution mechanics automate faster than strategic decisions.',
      skillsNeeded: 'Strategy, influence, and customer insight become more valuable.',
      actionPlan: 'Use AI for execution speed and focus more on strategic outcomes.',
    },
  },
  {
    title: 'Graphic Designer',
    slug: 'graphic-designer',
    sector: 'Marketing & Advertising',
    description: 'Creates visual concepts, branding assets, and communication materials.',
    automationRisk: 65,
    riskLevel: 'High',
    summary: 'Template creation is automating quickly, while art direction and brand systems remain durable.',
    highRiskTasks: ['Template design', 'Simple image editing', 'Variant generation'],
    lowRiskTasks: ['Creative direction', 'Brand system development', 'Narrative visual identity'],
    futureSkills: ['Creative Direction', 'Brand Strategy', 'Human-centered Design'],
    estimatedTimeline: '2-3 years',
    contentSections: {
      overview: 'AI tools increase design output speed and reduce repetitive production effort.',
      taskBreakdown: 'Production tasks face higher risk than conceptual direction work.',
      skillsNeeded: 'Taste, strategy, and brand systems are key long-term skills.',
      actionPlan: 'Pair AI generation with stronger direction and storytelling capabilities.',
    },
  },
  {
    title: 'Accountant',
    slug: 'accountant',
    sector: 'Finance & Banking',
    description: 'Manages financial records, compliance tasks, and reporting cycles.',
    automationRisk: 69,
    riskLevel: 'High',
    summary: 'Reconciliation and reporting automate, while advisory and regulatory judgment stay human-centric.',
    highRiskTasks: ['Reconciliation', 'Data entry', 'Compliance report preparation'],
    lowRiskTasks: ['Advisory analysis', 'Client relationship management', 'Risk interpretation'],
    futureSkills: ['Financial Advisory', 'Automation Oversight', 'Regulatory Strategy'],
    estimatedTimeline: '1-3 years',
    contentSections: {
      overview: 'Accounting functions are rapidly digitizing with automation layers.',
      taskBreakdown: 'Transactional tasks are high risk; advisory tasks are lower risk.',
      skillsNeeded: 'Advisory expertise and complex judgment become critical.',
      actionPlan: 'Shift from processing to insight-driven financial guidance.',
    },
  },
  {
    title: 'Marketing Manager',
    slug: 'marketing-manager',
    sector: 'Marketing & Advertising',
    description: 'Plans and executes campaigns, positioning, and growth strategies.',
    automationRisk: 53,
    riskLevel: 'Medium',
    summary: 'Campaign execution is increasingly automated, while strategy and brand insight remain key.',
    highRiskTasks: ['Ad copy variants', 'Campaign scheduling', 'Performance summaries'],
    lowRiskTasks: ['Go-to-market strategy', 'Brand positioning', 'Audience insight synthesis'],
    futureSkills: ['Growth Strategy', 'AI Campaign Orchestration', 'Brand Leadership'],
    estimatedTimeline: '2-4 years',
    contentSections: {
      overview: 'Marketing teams are adopting AI for content and optimization at scale.',
      taskBreakdown: 'Execution tasks automate faster than strategic planning tasks.',
      skillsNeeded: 'Strategic differentiation and brand insight are durable advantages.',
      actionPlan: 'Automate tactical work and expand strategic ownership.',
    },
  },
  {
    title: 'HR Manager',
    slug: 'hr-manager',
    sector: 'Human Resources',
    description: 'Oversees hiring, employee relations, and talent programs.',
    automationRisk: 46,
    riskLevel: 'Medium',
    summary: 'Screening and admin workflows automate while people leadership and culture remain central.',
    highRiskTasks: ['Resume screening', 'Interview scheduling', 'Policy documentation'],
    lowRiskTasks: ['Conflict resolution', 'Leadership coaching', 'Organizational design'],
    futureSkills: ['Workforce Strategy', 'Change Management', 'Coaching'],
    estimatedTimeline: '3-5 years',
    contentSections: {
      overview: 'HR teams use AI for efficiency in recruiting and administration.',
      taskBreakdown: 'Coordination and screening are high-risk tasks for automation.',
      skillsNeeded: 'Human judgment and organizational leadership are resilient skills.',
      actionPlan: 'Use AI for admin support and invest in strategic people leadership.',
    },
  },
  {
    title: 'Customer Support Specialist',
    slug: 'customer-support-specialist',
    sector: 'Retail & E-commerce',
    description: 'Resolves customer issues via chat, email, and call channels.',
    automationRisk: 74,
    riskLevel: 'Very High',
    summary: 'Tier-1 interactions are automating quickly, while high-empathy and complex cases remain human-led.',
    highRiskTasks: ['FAQ responses', 'Ticket triage', 'Order status communication'],
    lowRiskTasks: ['Escalation handling', 'Empathy-based conflict resolution', 'Account recovery support'],
    futureSkills: ['Customer Advocacy', 'Escalation Management', 'Service Design'],
    estimatedTimeline: '1-2 years',
    contentSections: {
      overview: 'Support operations are heavily impacted by conversational AI adoption.',
      taskBreakdown: 'Standard responses are high risk; nuanced conversations are lower risk.',
      skillsNeeded: 'Empathy, service design, and complex issue ownership matter more.',
      actionPlan: 'Move toward specialist and escalation-driven support roles.',
    },
  },
  {
    title: 'Project Manager',
    slug: 'project-manager',
    sector: 'Technology',
    description: 'Coordinates project planning, execution, and delivery with cross-functional teams.',
    automationRisk: 49,
    riskLevel: 'Medium',
    summary: 'Status tracking automates, while stakeholder coordination and risk decisions remain essential.',
    highRiskTasks: ['Status reporting', 'Task tracking updates', 'Timeline reminders'],
    lowRiskTasks: ['Risk negotiation', 'Stakeholder management', 'Delivery tradeoff decisions'],
    futureSkills: ['Program Strategy', 'AI Workflow Design', 'Executive Communication'],
    estimatedTimeline: '3-5 years',
    contentSections: {
      overview: 'Project management will increasingly rely on AI-assisted coordination.',
      taskBreakdown: 'Administrative coordination automates faster than leadership tasks.',
      skillsNeeded: 'Program-level strategy and communication become differentiators.',
      actionPlan: 'Delegate admin to automation and focus on strategic delivery leadership.',
    },
  },
  {
    title: 'Financial Analyst',
    slug: 'financial-analyst',
    sector: 'Finance & Banking',
    description: 'Builds financial models, forecasts, and analytical reports for decisions.',
    automationRisk: 66,
    riskLevel: 'High',
    summary: 'Model generation and baseline analysis automate while scenario judgment remains valuable.',
    highRiskTasks: ['Baseline forecasting', 'Variance reports', 'Model template generation'],
    lowRiskTasks: ['Scenario interpretation', 'Strategic recommendations', 'Executive communication'],
    futureSkills: ['Strategic Finance', 'Decision Modeling', 'AI Governance'],
    estimatedTimeline: '2-3 years',
    contentSections: {
      overview: 'Financial analytics roles are rapidly adopting AI-assisted planning.',
      taskBreakdown: 'Standardized analysis is high-risk, strategic interpretation is lower-risk.',
      skillsNeeded: 'Business strategy and communication are critical for resilience.',
      actionPlan: 'Evolve from report generation to high-context decision advisory.',
    },
  },
];

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('Connected to MongoDB');

    const bulk = jobs.map((job) => ({
      updateOne: {
        filter: { slug: job.slug },
        update: { $set: job },
        upsert: true,
      },
    }));

    const result = await Job.bulkWrite(bulk, { ordered: false });
    console.log('Seed complete');
    console.log({
      insertedOrUpdated: jobs.length,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    });
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
