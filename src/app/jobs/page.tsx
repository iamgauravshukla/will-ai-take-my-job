import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
    <main className="w-full min-h-screen bg-parchment text-ink relative">
      <div className="grain-overlay" />
      <Navigation />
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-6 relative z-10">
        {jobs.length > 0 ? (
          <JobsExplorer jobs={jobs} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="sm:col-span-2 lg:col-span-3 border-[2px] border-accent bg-accent/10 p-8 text-center text-ink">
              <p className="font-display text-3xl uppercase tracking-tight mb-2 text-accent">Unable to Load Jobs</p>
              <p className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">
                Database connection failed. This is typically due to MongoDB Atlas IP whitelist restrictions.
              </p>
              <div className="text-left bg-parchment p-6 border-[2px] border-accent">
                <p className="font-bold uppercase tracking-widest text-xs mb-3">Troubleshooting steps:</p>
                <ul className="space-y-3 font-medium opacity-90">
                  <li className="flex gap-2"><span className="text-accent font-bold">1.</span>Go to MongoDB Atlas cluster settings</li>
                  <li className="flex gap-2"><span className="text-accent font-bold">2.</span>Add your public IP to the IP whitelist (or use 0.0.0.0/0 for development)</li>
                  <li className="flex gap-2"><span className="text-accent font-bold">3.</span>Restart the Next.js dev server</li>
                </ul>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mt-6 opacity-60">
                For now, you can still view individual jobs directly (e.g., <Link href="/jobs/software-engineer" className="underline hover:text-accent">/jobs/software-engineer</Link>)
              </p>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
