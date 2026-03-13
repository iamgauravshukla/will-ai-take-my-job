import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  firstName?: string;
  jobTitle?: string;
  sector?: string;
  subscriptionStatus: 'active' | 'inactive' | 'unsubscribed';
  source: 'landing_page' | 'report_completion' | 'job_page';
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please provide a valid email'],
    },
    firstName: String,
    jobTitle: String,
    sector: String,
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'unsubscribed'],
      default: 'active',
    },
    source: {
      type: String,
      enum: ['landing_page', 'report_completion', 'job_page'],
      required: true,
    },
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ createdAt: -1 });

export const Subscriber = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
