import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  userId?: string;
  jobId: string;
  jobTitle: string;
  analysisJson: {
    automationRiskScore: number;
    riskLevel: string;
    highRiskTasks: string[];
    lowRiskTasks: string[];
    futureSkills: string[];
    timelineAssessment: string;
    confidenceLevel: string;
    summary: string;
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
  };
  llmProvider: 'gemini' | 'openai' | 'fallback';
  llmModel: string;
  email?: string;
  isPublished: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userId: String,
    jobId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    analysisJson: {
      type: Schema.Types.Mixed,
      required: true,
    },
    llmProvider: {
      type: String,
      enum: ['gemini', 'openai', 'fallback'],
      default: 'gemini',
      required: true,
    },
    llmModel: {
      type: String,
      required: true,
      default: 'gemini-2.0-flash',
    },
    email: String,
    isPublished: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
