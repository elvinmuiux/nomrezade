import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// POST - Reset statistics (Admin only)
export async function POST() {
  try {
    console.log('🔄 POST /api/statistics/reset - Starting request');
    
    // Check database connection
    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Prisma client not initialized' },
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

    // Get statistics record
    const stats = await prisma.statistics.findFirst();
    
    if (!stats) {
      // Create fresh statistics
      await prisma.statistics.create({
        data: {
          totalVisitors: 0,
          todayVisitors: 0,
          totalSold: 0,
          totalListings: 0
        }
      });
      console.log('📊 Created fresh statistics record');
    } else {
      // Reset existing statistics
      await prisma.statistics.update({
        where: { id: stats.id },
        data: {
          totalVisitors: 0,
          todayVisitors: 0,
          totalSold: 0,
          totalListings: 0,
          lastUpdated: new Date()
        }
      });
      console.log('🔄 Statistics reset to 0');
    }

    console.log('✅ Successfully reset statistics');

    return NextResponse.json({
      success: true,
      message: 'Statistikalar sıfırlandı',
      data: {
        activeUsers: 0,
        soldNumbers: 0,
        totalListings: 0,
        totalVisitors: 0,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
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
