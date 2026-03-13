import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Job } from '@/database/mongodb/schemas/Job';
import { getCachedOrCompute, CACHE_KEYS } from '@/backend/middleware/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = Number.isNaN(rawLimit) ? 20 : Math.min(Math.max(rawLimit, 1), 100);
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');

    // If there's a search or sector filter, skip cache and query directly
    if (search || sector) {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (search) {
        query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
      }
      if (sector) query.sector = sector;

      const jobs = await Job.find(query).sort({ title: 1 }).skip(skip).limit(limit).exec();
      const total = await Job.countDocuments(query);

      return NextResponse.json({
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        cached: false,
      }, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // For paginated requests without search, use cache
    const cacheKey = sector ? CACHE_KEYS.SECTOR_JOBS(sector) : CACHE_KEYS.ALL_JOBS;
    const cachedData = await getCachedOrCompute(
      `${cacheKey}:page:${page}:limit:${limit}`,
      async () => {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (sector) query.sector = sector;

        const jobs = await Job.find(query).sort({ title: 1 }).skip(skip).limit(limit).exec();
        const total = await Job.countDocuments(query);

        return {
          jobs,
          total,
          pages: Math.ceil(total / limit),
        };
      },
      600000 // Cache for 10 minutes
    );

    return NextResponse.json({
      success: true,
      data: cachedData.jobs,
      pagination: {
        page,
        limit,
        total: cachedData.total,
        pages: cachedData.pages,
      },
      cached: true,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

