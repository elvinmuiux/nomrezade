import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 GET /api/debug/env - Starting request');
    
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      // Don't expose actual DATABASE_URL for security
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_STARTS_WITH: process.env.DATABASE_URL?.substring(0, 10) || 'Not set'
    };

    console.log('✅ Successfully processed environment check');

    return NextResponse.json({
      success: true,
      data: {
        environment: envCheck,
        message: 'Environment variables check'
      },
      metadata: {
        timestamp: new Date().toISOString(),
        endpoint: 'debug/env'
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      success: false,
      error: 'Environment check failed',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
