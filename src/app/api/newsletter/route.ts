import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb/connect';
import { Subscriber } from '@/database/mongodb/schemas/Subscriber';
import { sanitizeEmail, sanitizeString, isValidEmail } from '@/backend/utils/sanitize';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, firstName, jobTitle, sector, source } = body;
    
    // Sanitize inputs
    const normalizedEmail = sanitizeEmail(email || '');
    const sanitizedFirstName = sanitizeString(firstName || '');
    const sanitizedJobTitle = sanitizeString(jobTitle || '');
    const sanitizedSector = sanitizeString(sector || '');
    const resolvedSource = ['landing_page', 'report_completion', 'job_page'].includes(source)
      ? source
      : 'landing_page';

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      // Reactivate if unsubscribed
      subscriber.subscriptionStatus = 'active';
      subscriber.firstName = sanitizedFirstName || subscriber.firstName;
      subscriber.jobTitle = sanitizedJobTitle || subscriber.jobTitle;
      subscriber.sector = sanitizedSector || subscriber.sector;
      subscriber.source = resolvedSource;
      await subscriber.save();
    } else {
      // Create new subscriber
      subscriber = new Subscriber({
        email: normalizedEmail,
        firstName: sanitizedFirstName,
        jobTitle: sanitizedJobTitle,
        sector: sanitizedSector,
        source: resolvedSource,
        subscriptionStatus: 'active',
      });
      await subscriber.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriberId: subscriber._id,
    });
  } catch (error: any) {
    console.error('Newsletter signup error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already subscribed', success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
