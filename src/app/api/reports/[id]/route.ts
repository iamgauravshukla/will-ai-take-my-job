import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Report } from '@/database/mongodb/schemas/Report';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const report = await Report.findById(id).lean();
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Report fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}
