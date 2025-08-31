import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/leads-storage';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email presence
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Save lead to MongoDB
    const lead = await createLead({
      name: 'Newsletter Subscriber',
      email,
      phone: '', // optional
      source: 'newsletter',
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: { id: lead.id },
    });

  } catch (error: any) {
    console.error('Error processing newsletter subscription:', error);

    // Handle duplicate email
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
