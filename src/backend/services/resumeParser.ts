import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import path from 'node:path';

let pdfWorkerConfigured = false;

function configurePdfWorker(): void {
  if (pdfWorkerConfigured) {
    return;
  }

  try {
    const workerPath = path.join(process.cwd(), 'node_modules', 'pdf-parse', 'dist', 'pdf-parse', 'cjs', 'pdf.worker.mjs');
    PDFParse.setWorker(workerPath);
    pdfWorkerConfigured = true;
  } catch (error) {
    console.warn('Unable to configure pdf worker path for pdf-parse:', error);
  }
}

export interface ExtractedResume {
  fullText: string;
  keyTasks: string[];
  skills: string[];
  jobTitle: string;
  experience: string;
}

export async function parseResumeText(text: string): Promise<ExtractedResume> {
  const normalizedText = text.replace(/\r\n/g, '\n').trim();

  const jobTitleMatch = normalizedText.match(/(?:title|position|role|as\s+\w+)[\s:]+([^\n]+)/i);
  const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : 'Unknown Role';

  const taskPatterns = [/(?:^|\n)[-•]\s+(.+?)(?=\n|$)/gm, /(?:^|\n)(?:\d+\.|[a-z]\))\s+(.+?)(?=\n|$)/gm];

  const keyTasks: string[] = [];
  taskPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(normalizedText)) !== null) {
      if (match[1] && match[1].length > 10) {
        keyTasks.push(match[1].trim());
      }
    }
  });

  const skillKeywords = [
    'Python',
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'Leadership',
    'Communication',
    'Project Management',
    'Data Analysis',
    'Machine Learning',
    'AI',
    'Analytics',
  ];

  const skills = skillKeywords.filter((skill) => new RegExp(`\\b${skill}\\b`, 'i').test(normalizedText));

  return {
    fullText: normalizedText,
    keyTasks: keyTasks.slice(0, 12),
    skills: [...new Set(skills)],
    jobTitle,
    experience: `${keyTasks.length} responsibilities extracted`,
  };
}

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    configurePdfWorker();
    const parser = new PDFParse({ data: buffer, useWorkerFetch: false });

    try {
      const parsed = await parser.getText();
      return parsed.text || '';
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }

  if (extension === 'docx') {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value || '';
  }

  return buffer.toString('utf-8');
}

export async function analyzeResume(resumeText: string): Promise<ExtractedResume> {
  return parseResumeText(resumeText);
}

export async function analyzeResumeFile(file: File): Promise<ExtractedResume> {
  const text = await extractTextFromFile(file);
  return parseResumeText(text);
}
