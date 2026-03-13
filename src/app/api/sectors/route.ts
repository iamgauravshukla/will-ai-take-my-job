import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Job } from '@/database/mongodb/schemas/Job';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const sectors = (await Job.distinct('sector')).filter((sector): sector is string => Boolean(sector)).sort((a, b) => a.localeCompare(b));

    return NextResponse.json({
      success: true,
      data: sectors,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Sectors fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sectors' }, { status: 500 });
  }
}
