import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Job } from '@/database/mongodb/schemas/Job';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();

    const { slug } = await params;
    const job = await Job.findOne({ slug });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Job fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
