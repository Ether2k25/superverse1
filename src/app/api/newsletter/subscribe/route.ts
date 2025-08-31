import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/leads-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to MongoDB
    await createLead({
      name: 'Newsletter Subscriber',
      email,
      phone: '', // No phone for newsletter subscriptions
      source: 'newsletter',
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    });
  } catch (error: any) {
    console.error('Error processing newsletter subscription:', error);
    
    if (error.message.includes("already exists")) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
