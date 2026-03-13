import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Report } from '@/database/mongodb/schemas/Report';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    await dbConnect();
    const { token } = await params;

    const report = await Report.findOne({ shareToken: token }).lean();
    if (!report) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Result fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
  }
}
