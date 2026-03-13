import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  sector: string;
  description: string;
  automationRisk: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  summary: string;
  highRiskTasks: string[];
  lowRiskTasks: string[];
  futureSkills: string[];
  estimatedTimeline: string;
  contentSections: {
    overview: string;
    taskBreakdown: string;
    skillsNeeded: string;
    actionPlan: string;
  };
  detailedAnalysis?: {
    executiveTakeaway: string;
    workComposition: Array<{
      label: string;
      value: number;
      tone: 'red' | 'amber' | 'emerald' | 'slate';
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
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    sector: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    automationRisk: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High'],
      required: true,
    },
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
    detailedAnalysis: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
