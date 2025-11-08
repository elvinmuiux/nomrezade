import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// Helper function to get current month in YYYY-MM format
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// GET - Fetch monthly visitor statistics
export async function GET() {
  try {
    console.log('📊 GET /api/admin/monthly-stats - Starting request');

    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed', 
          details: 'Prisma client not initialized'
        },
        { status: 500 }
      );
    }

    await prisma.$connect();

    const currentMonth = getCurrentMonth();
    console.log('📅 Current month:', currentMonth);

    // Get or create monthly stats for current month
    let monthlyStats = await prisma.monthlyVisitorStats.findUnique({
      where: { month: currentMonth }
    });

    if (!monthlyStats) {
      // Create stats for current month
      monthlyStats = await prisma.monthlyVisitorStats.create({
        data: {
          month: currentMonth,
          visitors: 0,
          pageViews: 0
        }
      });
      console.log('✅ Created monthly stats for', currentMonth);
    }

    console.log('✅ Monthly stats retrieved:', monthlyStats);

    return NextResponse.json({
      success: true,
      data: {
        month: monthlyStats.month,
        visitors: monthlyStats.visitors,
        pageViews: monthlyStats.pageViews,
        lastUpdated: monthlyStats.lastUpdated.toISOString()
      },
      metadata: {
        storage: 'MongoDB',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      success: false,
      error: 'Server xətası',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST - Update monthly visitor statistics
export async function POST(request: NextRequest) {
  try {
    console.log('📊 POST /api/admin/monthly-stats - Starting request');

    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Prisma client not initialized' },
        { status: 500 }
      );
    }

    await prisma.$connect();

    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Action is required',
          details: 'Valid actions: increment_visitor, increment_pageview, reset_month'
        },
        { status: 400 }
      );
    }

    const currentMonth = getCurrentMonth();

    // Get or create monthly stats for current month
    let monthlyStats = await prisma.monthlyVisitorStats.findUnique({
      where: { month: currentMonth }
    });

    if (!monthlyStats) {
      monthlyStats = await prisma.monthlyVisitorStats.create({
        data: {
          month: currentMonth,
          visitors: 0,
          pageViews: 0
        }
      });
    }

    let updatedStats;

    switch (action) {
      case 'increment_visitor':
        updatedStats = await prisma.monthlyVisitorStats.update({
          where: { id: monthlyStats.id },
          data: {
            visitors: { increment: 1 },
            lastUpdated: new Date()
          }
        });
        console.log('✅ Incremented monthly visitors');
        break;

      case 'increment_pageview':
        updatedStats = await prisma.monthlyVisitorStats.update({
          where: { id: monthlyStats.id },
          data: {
            pageViews: { increment: 1 },
            lastUpdated: new Date()
          }
        });
        console.log('✅ Incremented monthly pageviews');
        break;

      case 'reset_month':
        // This should be called by a cron job on the 1st of each month
        updatedStats = await prisma.monthlyVisitorStats.update({
          where: { id: monthlyStats.id },
          data: {
            visitors: 0,
            pageViews: 0,
            lastUpdated: new Date()
          }
        });
        console.log('✅ Reset monthly stats for', currentMonth);
        break;

      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid action',
            details: 'Valid actions: increment_visitor, increment_pageview, reset_month'
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        month: updatedStats.month,
        visitors: updatedStats.visitors,
        pageViews: updatedStats.pageViews,
        lastUpdated: updatedStats.lastUpdated.toISOString()
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
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
