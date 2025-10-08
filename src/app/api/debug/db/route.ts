import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/debug/db - Starting database debug');
    
    const debugInfo: Record<string, unknown> = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
        DATABASE_URL_START: process.env.DATABASE_URL?.substring(0, 15) || 'Not set'
      },
      prisma: {
        exists: !!prisma,
        type: typeof prisma,
        methods: prisma ? Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)).slice(0, 10) : 'N/A'
      }
    };

    // Test Prisma connection
    const connectionTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      await prisma.$connect();
      connectionTest.success = true;
      
      // Test a simple query
      const stats = await prisma.statistics.findFirst();
      debugInfo.database = {
        connected: true,
        statsExists: !!stats,
        statsCount: stats ? 1 : 0
      };
      
    } catch (error) {
      connectionTest.success = false;
      connectionTest.error = error instanceof Error ? error.message : String(error);
      debugInfo.database = {
        connected: false,
        error: connectionTest.error
      };
    }

    console.log('✅ Database debug completed');

    return NextResponse.json({
      success: true,
      data: debugInfo,
      metadata: {
        timestamp: new Date().toISOString(),
        endpoint: 'debug/db'
      }
    });

  } catch (error) {
    console.error('❌ Debug API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
