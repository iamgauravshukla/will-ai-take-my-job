import type { MetadataRoute } from 'next';
import { dbConnect } from '@/database/mongodb/connect';
import { Job } from '@/database/mongodb/schemas/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/analyze`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    await dbConnect();
    const jobs = await Job.find({}, { slug: 1, updatedAt: 1 }).lean();
    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${base}/jobs/${job.slug}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...jobRoutes];
  } catch {
    return staticRoutes;
  }
}
