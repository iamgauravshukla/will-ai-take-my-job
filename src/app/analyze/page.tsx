'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

      if (email.trim()) {
        void fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            source: 'report_completion',
            jobTitle: selectedJob?.title,
            sector: selectedSector,
          }),
        }).catch(() => undefined);
      }

      setAnalysisResult(data);
      setStep(4);
      router.push(data.shareLink);
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
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      s <= step ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && <div className="flex-1 mx-2 h-1 bg-slate-200"></div>}
                </div>
              ))}
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Analyze Your Career Risk</h1>
              <p className="text-slate-600">
                {step === 1 && 'Step 1 of 4: Select your industry'}
                {step === 2 && 'Step 2 of 4: Choose your job title'}
                {step === 3 && 'Step 3 of 4: Add details & run analysis'}
                {step === 4 && 'Step 4 of 4: Opening your full report'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What&apos;s your industry?</h2>
              {sectorsLoading && sectors.length === 0 && <p className="mb-4 text-slate-500">Loading industries...</p>}
              <div className="grid md:grid-cols-2 gap-4">
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => {
                      setSelectedSector(sector);
                      setStep(2);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left font-medium ${
                      selectedSector === sector
                        ? 'border-indigo-600 bg-indigo-100 text-indigo-950 ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose your job title</h2>
              <p className="text-slate-600 mb-6">Showing roles in {selectedSector}</p>

              <div className="max-h-80 overflow-auto rounded-xl border border-slate-200 divide-y divide-slate-100 mb-6">
                {jobsLoading && <p className="p-4 text-slate-500">Loading jobs...</p>}
                {!jobsLoading && jobs.length === 0 && <p className="p-4 text-slate-500">No jobs found in this sector yet.</p>}
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJobId(job._id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition ${
                      selectedJobId === job._id
                        ? 'bg-indigo-100 border-l-4 border-indigo-600'
                        : 'bg-white border-l-4 border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <p className={`font-semibold ${selectedJobId === job._id ? 'text-indigo-950' : 'text-slate-900'}`}>{job.title}</p>
                    <p className={`text-sm line-clamp-1 ${selectedJobId === job._id ? 'text-indigo-700' : 'text-slate-600'}`}>{job.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={() => selectedJobId && setStep(3)}
                  disabled={!selectedJobId || jobsLoading}
                  className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Add your details</h2>
              <p className="text-slate-600 mb-6">Optional details improve analysis quality.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Analysis Provider</label>
                  <select
                    value={provider}
                    onChange={(event) => setProvider(event.target.value as 'gemini' | 'openai')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="gemini">Gemini</option>
                    <option value="openai">OpenAI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume (PDF/DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-indigo-700"
                  />
                  <p className="text-xs text-slate-500 mt-2">If no file is uploaded, text input below is used.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Resume text / role description (optional)</label>
                  <textarea
                    value={resumeText}
                    onChange={(event) => setResumeText(event.target.value)}
                    placeholder="Paste your top responsibilities, tools, and current focus areas..."
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-6">
                <p className="text-sm text-slate-600">
                  Analyzing for <span className="font-semibold text-slate-900">{selectedJob?.title || 'Selected role'}</span> in{' '}
                  <span className="font-semibold text-slate-900">{selectedSector}</span>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={submitAnalysis}
                  disabled={loading || !selectedJobId}
                  className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Generating Report...' : 'Generate Report'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && analysisResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Opening your full shareable report</h2>
              <p className="text-slate-600 mb-6">
                Your analysis is complete. If the redirect does not happen automatically, open the full report below.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/results/${analysisResult.shareToken}`}
                  className="flex-1 text-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Open Shareable Report
                </Link>
                <button
                  onClick={resetFlow}
                  className="px-6 py-3 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
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
