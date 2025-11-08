import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

/**
 * Cron job endpoint to reset monthly statistics
 * This should be called on the 1st of every month
 * You can use services like Vercel Cron, GitHub Actions, or external cron services
 * 
 * Example cron expression: 0 0 1 * * (runs at midnight on the 1st of each month)
 */
export async function GET() {
  try {
    console.log('🔄 Cron job: Resetting monthly statistics');

    if (!prisma) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed' 
        },
        { status: 500 }
      );
    }

    await prisma.$connect();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    console.log('📅 Current month:', currentMonth);

    // Get or create monthly stats for current month
    let monthlyStats = await prisma.monthlyVisitorStats.findUnique({
      where: { month: currentMonth }
    });

    if (!monthlyStats) {
      // Create new month stats
      monthlyStats = await prisma.monthlyVisitorStats.create({
        data: {
          month: currentMonth,
          visitors: 0,
          pageViews: 0
        }
      });
      console.log('✅ Created new monthly stats for', currentMonth);
    } else {
      // Reset existing month stats (in case it's the 1st and stats already exist)
      monthlyStats = await prisma.monthlyVisitorStats.update({
        where: { id: monthlyStats.id },
        data: {
          visitors: 0,
          pageViews: 0,
          lastUpdated: new Date()
        }
      });
      console.log('✅ Reset monthly stats for', currentMonth);
    }

    // Get previous month for archival info
    const prevDate = new Date(now);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
    const previousMonth = `${prevYear}-${prevMonth}`;

    const prevMonthStats = await prisma.monthlyVisitorStats.findUnique({
      where: { month: previousMonth }
    });

    return NextResponse.json({
      success: true,
      message: 'Monthly statistics reset successfully',
      data: {
        currentMonth: {
          month: monthlyStats.month,
          visitors: monthlyStats.visitors,
          pageViews: monthlyStats.pageViews,
          lastUpdated: monthlyStats.lastUpdated.toISOString()
        },
        previousMonth: prevMonthStats ? {
          month: prevMonthStats.month,
          visitors: prevMonthStats.visitors,
          pageViews: prevMonthStats.pageViews,
          lastUpdated: prevMonthStats.lastUpdated.toISOString()
        } : null
      },
      metadata: {
        executedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to reset monthly statistics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
