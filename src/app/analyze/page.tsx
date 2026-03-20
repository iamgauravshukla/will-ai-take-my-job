'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

type Job = {
  _id: string;
  title: string;
  sector: string;
  slug: string;
  description: string;
};

type AnalysisResponse = {
  success: boolean;
  reportId: string;
  shareToken: string;
  shareLink: string;
  analysis: {
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
  job: {
    id: string;
    title: string;
    sector: string;
  };
};

export default function AnalyzePage() {
  const [step, setStep] = useState(1);
  const [sectors, setSectors] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [email, setEmail] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<'gemini' | 'openai'>('openai');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSectors = async () => {
      setSectorsLoading(true);
      try {
        const response = await fetch('/api/sectors', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load sectors');
        }
        const data = await response.json();
        setSectors(data.data || []);
        setError('');
      } catch {
        setError('Unable to load sectors. Please refresh and try again.');
      } finally {
        setSectorsLoading(false);
      }
    };

    loadSectors();
  }, []);

  useEffect(() => {
    if (!selectedSector) {
      setJobs([]);
      setSelectedJobId('');
      return;
    }

    const loadJobs = async () => {
      setJobsLoading(true);
      try {
        const params = new URLSearchParams({ sector: selectedSector, limit: '100' });
        const response = await fetch(`/api/jobs?${params.toString()}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load jobs');
        }
        const data = await response.json();
        setJobs(data.data || []);
        setSelectedJobId('');
        setError('');
      } catch {
        setJobs([]);
        setSelectedJobId('');
        setError('Unable to load jobs for selected sector.');
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, [selectedSector]);

  const selectedJob = useMemo(() => jobs.find((job) => job._id === selectedJobId), [jobs, selectedJobId]);

  const submitAnalysis = async () => {
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('jobId', selectedJobId);
      formData.append('provider', provider);
      if (email.trim()) formData.append('email', email.trim());
      if (resumeText.trim()) formData.append('resumeText', resumeText.trim());
      if (resumeFile) formData.append('resumeFile', resumeFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate report');
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);

      if (email.trim()) {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            source: 'report_completion',
            jobTitle: selectedJob?.title,
            sector: selectedSector,
          }),
        });
      }

      setStep(4);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedSector('');
    setSelectedJobId('');
    setResumeText('');
    setResumeFile(null);
    setProvider('openai');
    setEmail('');
    setAnalysisResult(null);
    setError('');
  };

  return (
    <main className="w-full min-h-screen bg-parchment text-ink relative">
      <div className="grain-overlay" />
      <Navigation />

      <div className="pt-32 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center justify-between mb-12">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-12 h-12 flex items-center justify-center font-display text-2xl border-[2px] transition-all ${
                      s <= step 
                        ? 'bg-ink border-ink text-parchment' 
                        : 'bg-transparent border-ink/20 text-ink/40'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 mx-4 h-[2px] transition-all ${
                      s < step ? 'bg-ink' : 'bg-ink/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tight mb-4">
                Analyze Your Career Risk
              </h1>
              <p className="text-lg opacity-80 font-medium tracking-wide uppercase">
                {step === 1 && 'Step 1 of 4: Select your industry'}
                {step === 2 && 'Step 2 of 4: Choose your job title'}
                {step === 3 && 'Step 3 of 4: Add details & run analysis'}
                {step === 4 && 'Step 4 of 4: Your report is ready'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-8 border-[2px] border-accent bg-accent/10 px-6 py-4 text-accent font-bold uppercase tracking-widest text-sm">
              ERROR: {error}
            </div>
          )}

          {step === 1 && (
            <div className="bg-parchment border-[2px] border-ink p-8 md:p-12">
              <h2 className="font-display text-3xl uppercase tracking-tight mb-8">What is your industry?</h2>
              {sectorsLoading && sectors.length === 0 && <p className="mb-6 opacity-60 font-bold uppercase tracking-widest text-xs">Loading industries...</p>}
              <div className="grid md:grid-cols-2 gap-4">
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => {
                      setSelectedSector(sector);
                      setStep(2);
                    }}
                    className={`p-5 border-[2px] transition-all text-left font-display text-xl tracking-wide uppercase ${
                      selectedSector === sector
                        ? 'border-ink bg-ink text-parchment'
                        : 'border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink/5'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-parchment border-[2px] border-ink p-8 md:p-12">
              <h2 className="font-display text-3xl uppercase tracking-tight mb-2">Choose your job title</h2>
              <p className="opacity-60 mb-8 font-bold uppercase tracking-widest text-xs">Showing roles in {selectedSector}</p>

              <div className="max-h-[400px] overflow-auto border-[2px] border-ink/20 divide-y-[2px] divide-ink/10 mb-8 custom-scrollbar">
                {jobsLoading && <p className="p-6 opacity-60 font-bold uppercase tracking-widest text-xs">Loading jobs...</p>}
                {!jobsLoading && jobs.length === 0 && <p className="p-6 opacity-60 font-bold uppercase tracking-widest text-xs">No jobs found in this sector yet.</p>}
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJobId(job._id)}
                    className={`w-full text-left p-5 transition-all outline-none ${
                      selectedJobId === job._id
                        ? 'bg-ink text-parchment'
                        : 'hover:bg-ink/5'
                    }`}
                  >
                    <p className="font-bold uppercase tracking-widest text-sm mb-1">{job.title}</p>
                    <p className={`text-xs line-clamp-1 ${selectedJobId === job._id ? 'opacity-70' : 'opacity-60'}`}>{job.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 border-[2px] border-ink font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-parchment transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => selectedJobId && setStep(3)}
                  disabled={!selectedJobId || jobsLoading}
                  className="flex-1 px-8 py-4 border-[2px] border-ink font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:hover:bg-accent transition-colors text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-parchment border-[2px] border-ink p-8 md:p-12">
              <h2 className="font-display text-3xl uppercase tracking-tight mb-2">Add your details</h2>
              <p className="opacity-60 mb-8 font-bold uppercase tracking-widest text-xs">Optional details improve analysis quality.</p>

              <div className="space-y-6 mb-10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Analysis Provider</label>
                  <select
                    value={provider}
                    onChange={(event) => setProvider(event.target.value as 'gemini' | 'openai')}
                    className="w-full px-5 py-4 bg-transparent border-[2px] border-ink focus:outline-none focus:border-accent font-bold text-sm appearance-none"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="gemini">Gemini</option>
                    <option value="openai">OpenAI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 bg-transparent border-[2px] border-ink focus:outline-none focus:border-accent font-medium text-sm placeholder:opacity-40"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Upload Resume (PDF/DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                    className="w-full px-5 py-3 bg-transparent border-[2px] border-ink focus:outline-none focus:border-accent font-medium text-sm file:mr-6 file:border-[2px] file:border-ink file:bg-transparent file:px-4 file:py-2 file:font-bold file:uppercase file:tracking-widest file:text-xs file:text-ink hover:file:bg-ink hover:file:text-parchment file:cursor-pointer file:transition-colors"
                    style={{ borderRadius: 0 }}
                  />
                  <p className="text-xs opacity-60 mt-3 font-medium">If no file is uploaded, text input below is used.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-3">Resume text / role description (optional)</label>
                  <textarea
                    value={resumeText}
                    onChange={(event) => setResumeText(event.target.value)}
                    placeholder="Paste your top responsibilities, tools, and current focus areas..."
                    rows={6}
                    className="w-full px-5 py-4 bg-transparent border-[2px] border-ink focus:outline-none focus:border-accent font-medium text-sm placeholder:opacity-40"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="border-[2px] border-ink bg-ink/5 p-5 mb-8">
                <p className="text-sm font-medium">
                  ANALYZING ROLE:{' '}
                  <span className="font-bold uppercase tracking-widest mx-1">{selectedJob?.title || 'Selected role'}</span>
                  IN SECTOR:{' '}
                  <span className="font-bold uppercase tracking-widest ml-1">{selectedSector}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-4 border-[2px] border-ink font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-parchment transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={submitAnalysis}
                  disabled={loading || !selectedJobId}
                  className="flex-1 px-8 py-4 border-[2px] border-ink font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors text-sm disabled:opacity-50 disabled:hover:bg-accent"
                >
                  {loading ? 'Generating Report...' : 'Generate Report'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && analysisResult && (
            <div className="bg-parchment border-[2px] border-ink p-8 md:p-12">
              <h2 className="font-display text-4xl uppercase tracking-tight mb-8">Your Analysis</h2>

              <div className="bg-ink text-parchment border-[2px] border-ink p-8 md:p-10 mb-8">
                <div className="font-display text-8xl md:text-9xl text-accent mb-4 leading-none">
                  {analysisResult.analysis.automationRiskScore}%
                </div>
                <p className="font-display leading-none text-4xl uppercase tracking-tight mb-6">
                  {analysisResult.analysis.riskLevel} Risk
                </p>
                <p className="text-lg opacity-80 leading-relaxed font-medium">
                  {analysisResult.analysis.summary}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-tight mb-4 flex items-center gap-3">
                    <span className="w-4 h-4 bg-accent border-[2px] border-ink shrink-0" />
                    High-Risk Tasks
                  </h3>
                  <ul className="space-y-3 font-medium opacity-80">
                    {analysisResult.analysis.highRiskTasks.map((task, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="font-bold mt-0.5">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-tight mb-4 flex items-center gap-3">
                    <span className="w-4 h-4 bg-[#81B69D] border-[2px] border-ink shrink-0" />
                    Future Skills
                  </h3>
                  <ul className="space-y-3 font-medium opacity-80">
                    {analysisResult.analysis.futureSkills.map((skill, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="font-bold mt-0.5">•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-[2px] border-ink p-6 mb-10 bg-ink/5">
                <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-2">Timeline assessment</p>
                <p className="font-bold text-lg">{analysisResult.analysis.timelineAssessment}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/results/${analysisResult.shareToken}`}
                  className="flex-1 flex items-center justify-center px-8 py-4 border-[2px] border-ink font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors text-sm text-center"
                >
                  Open Shareable Report
                </Link>
                <button
                  onClick={resetFlow}
                  className="px-8 py-4 border-[2px] border-ink font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-parchment transition-colors text-sm"
                >
                  Analyze Another Role
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
