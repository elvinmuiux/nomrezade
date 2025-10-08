import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET - Fetch all feedbacks
export async function GET() {
  try {
    console.log('🔍 GET /api/feedback - Starting request');

    // Check database connection
    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Prisma client not initialized' },
        { status: 500 }
      );
    }

    // Check DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set');
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          details: 'DATABASE_URL environment variable is not set',
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL
          }
        },
        { status: 500 }
      );
    }

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: String(dbError) },
        { status: 500 }
      );
    }

    // Fetch feedbacks from MongoDB
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { date: 'desc' }
    });

    console.log(`📝 Found ${feedbacks.length} feedbacks`);

    // Convert Date objects to ISO strings for JSON serialization
    const serializedFeedbacks = feedbacks.map(feedback => ({
      ...feedback,
      date: feedback.date.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: serializedFeedbacks,
      metadata: {
        count: feedbacks.length,
        storage: 'MongoDB'
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server xətası',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST - Create a new feedback
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/feedback - Starting request');

    // Check database connection
    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Prisma client not initialized' },
        { status: 500 }
      );
    }

    // Check DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set');
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          details: 'DATABASE_URL environment variable is not set',
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL
          }
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, phone, rating, feedbackType, subject, message } = body;

    if (!name || !email || !phone || !rating || !feedbackType || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: String(dbError) },
        { status: 500 }
      );
    }

    // Create new feedback in MongoDB
    const newFeedback = await prisma.feedback.create({
      data: {
        name,
        email,
        phone,
        rating: parseInt(rating),
        feedbackType: feedbackType.toUpperCase(),
        subject,
        message,
        date: new Date(),
        timestamp: Date.now()
      }
    });

    console.log('✅ Feedback created successfully:', newFeedback.id);

    return NextResponse.json({
      success: true,
      data: {
        ...newFeedback,
        date: newFeedback.date.toISOString()
      },
      message: 'Feedback created successfully'
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server xətası',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
