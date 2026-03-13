import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Report } from '@/database/mongodb/schemas/Report';
import { Job } from '@/database/mongodb/schemas/Job';
import { analyzeJobRiskWithProvider, type LLMProvider } from '@/backend/services/aiOrchestrator';
import { analyzeResume, analyzeResumeFile } from '@/backend/services/resumeParser';
import { createRateLimitMiddleware } from '@/backend/middleware/rateLimit';

// Rate limit: 3 analyses per hour per IP
const rateLimiter = createRateLimitMiddleware({
  maxRequests: 3,
  windowMs: 3600000, // 1 hour
});

export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResponse = await rateLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    await dbConnect();

    const formData = await request.formData();
    const jobId = formData.get('jobId') as string;
    const email = formData.get('email') as string;
    const resumeText = formData.get('resumeText') as string;
    const provider = (formData.get('provider') as LLMProvider) || 'openai';
    const resumeFile = formData.get('resumeFile') as File | null;

    // Validate input
    if (!jobId || typeof jobId !== 'string' || jobId.trim().length === 0) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    if (email && !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // Validate file type
    const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (resumeFile && !allowedFileTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    let extractedInfo: { keyTasks: string[]; skills: string[]; fullText?: string } = { keyTasks: [], skills: [] };

    let parsingWarning: string | null = null;

    if (resumeFile && resumeFile.size > 0) {
      try {
        const parsedFile = await analyzeResumeFile(resumeFile);
        extractedInfo = {
          keyTasks: parsedFile.keyTasks,
          skills: parsedFile.skills,
          fullText: parsedFile.fullText,
        };
      } catch (parseError) {
        console.error('Resume file parse error:', parseError);
        parsingWarning = 'We could not parse the uploaded resume file. Analysis was generated using selected role data.';
      }
    } else if (resumeText?.trim()) {
      const parsedText = await analyzeResume(resumeText);
      extractedInfo = {
        keyTasks: parsedText.keyTasks,
        skills: parsedText.skills,
        fullText: parsedText.fullText,
      };
    }

    const riskResult = await analyzeJobRiskWithProvider(
      {
        jobTitle: job.title,
        sector: job.sector,
        tasks: extractedInfo.keyTasks,
        resumeText: extractedInfo.fullText,
        jobDescription: job.description,
        baselineHighRiskTasks: job.highRiskTasks,
        baselineLowRiskTasks: job.lowRiskTasks,
        baselineFutureSkills: job.futureSkills,
        baselineSummary: job.summary,
      },
      provider
    );

    const shareToken = Math.random().toString(36).substring(2, 15);

    const report = new Report({
      jobId: job._id.toString(),
      jobTitle: job.title,
      analysisJson: riskResult.analysis,
      llmProvider: riskResult.providerUsed,
      llmModel: riskResult.modelUsed,
      email,
      shareToken,
    });

    await report.save();

    return NextResponse.json({
      success: true,
      reportId: report._id.toString(),
      shareToken,
      providerUsed: riskResult.providerUsed,
      modelUsed: riskResult.modelUsed,
      analysis: riskResult.analysis,
      job: {
        id: job._id.toString(),
        title: job.title,
        sector: job.sector,
      },
      shareLink: `/results/${shareToken}`,
      ...(parsingWarning ? { warning: parsingWarning } : {}),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze job' }, { status: 500 });
  }
}
