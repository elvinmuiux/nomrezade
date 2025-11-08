import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET - Fetch current statistics
export async function GET() {
  try {
    console.log('🔍 GET /api/statistics - Starting request');
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_START: process.env.DATABASE_URL?.substring(0, 10) || 'Not set'
    });

    // Check database connection
    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed', 
          details: 'Prisma client not initialized',
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL
          }
        },
        { status: 500 }
      );
    }

    // Check DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set');
      return NextResponse.json(
        {
          success: false,
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

    console.log('🔍 Prisma client check:', {
      prismaExists: !!prisma,
      prismaType: typeof prisma,
      prismaMethods: prisma ? Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)) : 'N/A'
    });

    // Test database connection first
    try {
      console.log('🔍 Attempting database connection...');
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      console.error('❌ Database error details:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed', 
          details: String(dbError),
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL,
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL
          }
        },
        { status: 500 }
      );
    }

    // Get or create statistics record
    let stats = await prisma.statistics.findFirst();
    
    if (!stats) {
      // Create initial statistics record
      stats = await prisma.statistics.create({
        data: {
          totalVisitors: 1250,
          todayVisitors: 150,
          totalSold: 847,
          totalListings: 0
        }
      });
      console.log('📊 Created initial statistics record');
    }

    // Update total listings count
    const totalListings = await prisma.phoneNumber.count({
      where: { status: 'ACTIVE' }
    });

    // Update statistics with current data
    const updatedStats = await prisma.statistics.update({
      where: { id: stats.id },
      data: {
        totalListings: totalListings,
        lastUpdated: new Date()
      }
    });

    console.log('✅ Successfully processed statistics');

    return NextResponse.json({
      success: true,
      data: {
        activeUsers: updatedStats.todayVisitors,
        soldNumbers: updatedStats.totalSold,
        totalListings: updatedStats.totalListings,
        totalVisitors: updatedStats.totalVisitors,
        lastUpdated: updatedStats.lastUpdated.toISOString()
      },
      metadata: {
        storage: 'MongoDB',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Fallback statistics
    return NextResponse.json({
      success: false,
      error: 'Server xətası',
      details: error instanceof Error ? error.message : String(error),
      fallback: {
        activeUsers: 150,
        soldNumbers: 847,
        totalListings: 0,
        totalVisitors: 1250,
        lastUpdated: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// POST - Update statistics
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/statistics - Starting request');
    
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
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Action is required',
          details: 'Please provide an action parameter'
        },
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

    // Get or create statistics record
    let stats = await prisma.statistics.findFirst();
    
    if (!stats) {
      stats = await prisma.statistics.create({
        data: {
          totalVisitors: 0,
          todayVisitors: 0,
          totalSold: 0,
          totalListings: 0
        }
      });
      console.log('📊 Created initial statistics record');
    }

    let updatedStats = stats;

    switch (action) {
      case 'increment_users':
        updatedStats = await prisma.statistics.update({
          where: { id: stats.id },
          data: {
            totalVisitors: { increment: 1 },
            todayVisitors: { increment: 1 },
            lastUpdated: new Date()
          }
        });
        break;

      case 'increment_sold':
        updatedStats = await prisma.statistics.update({
          where: { id: stats.id },
          data: {
            totalSold: { increment: 1 },
            lastUpdated: new Date()
          }
        });
        break;

      case 'increment_visitor':
        updatedStats = await prisma.statistics.update({
          where: { id: stats.id },
          data: {
            totalVisitors: { increment: 1 },
            todayVisitors: { increment: 1 },
            lastUpdated: new Date()
          }
        });
        break;

      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid action',
            details: 'Valid actions: increment_users, increment_sold, increment_visitor'
          },
          { status: 400 }
        );
    }

    console.log('✅ Successfully updated statistics');

    return NextResponse.json({
      success: true,
      data: {
        updated: true,
        stats: {
          activeUsers: updatedStats.todayVisitors,
          soldNumbers: updatedStats.totalSold,
          totalListings: updatedStats.totalListings,
          totalVisitors: updatedStats.totalVisitors,
          lastUpdated: updatedStats.lastUpdated.toISOString()
        }
      },
      metadata: {
        action,
        storage: 'MongoDB',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Server xətası', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}