import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SimpleFooter from '@/components/SimpleFooter';
import JobsExplorer from '@/components/jobs/JobsExplorer';
import { dbConnect } from '@/database/mongodb/connect';
import { Job } from '@/database/mongodb/schemas/Job';

export const metadata = {
  title: 'Jobs & AI Automation Risk | Will AI Take My Job?',
  description: 'Explore automation risk across job roles and industries with AI-powered insights.',
};

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  let jobs: Array<{
    _id: string;
    title: string;
    sector: string;
    slug: string;
    description: string;
    automationRisk: number;
  }> = [];

  try {
    await dbConnect();
    const dbJobs = await Job.find({}).sort({ title: 1 }).limit(200).lean();
    console.log('[/jobs] Found', dbJobs.length, 'jobs in database');
    jobs = dbJobs.map((job: any) => ({
      _id: String(job._id),
      title: job.title,
      sector: job.sector,
      slug: job.slug,
      description: job.description,
      automationRisk: job.automationRisk,
    }));
  } catch (err) {
    console.error('[/jobs] Database error:', err instanceof Error ? err.message : String(err));
    jobs = [];
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        {jobs.length > 0 ? (
          <JobsExplorer jobs={jobs} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-900 font-semibold mb-2">Unable to Load Jobs</p>
              <p className="text-red-700 text-sm mb-4">
                Database connection failed. This is typically due to MongoDB Atlas IP whitelist restrictions.
              </p>
              <div className="text-left text-red-700 text-sm bg-white rounded p-4 border border-red-200">
                <p className="font-mono mb-2">Troubleshooting steps:</p>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Go to MongoDB Atlas cluster settings</li>
                  <li>Add your public IP to the IP whitelist (or use 0.0.0.0/0 for development)</li>
                  <li>Restart the Next.js dev server</li>
                </ol>
              </div>
              <p className="text-red-700 text-xs mt-4">
                For now, you can still view individual jobs directly (e.g., <Link href="/jobs/software-engineer" className="underline">/jobs/software-engineer</Link>)
              </p>
            </div>
          </div>
        )}
      </section>
      <SimpleFooter />
    </main>
  );
}
