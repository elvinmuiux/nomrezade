/**
 * Statistics Service
 * MongoDB-based statistics storage and retrieval
 */

import { prisma } from '@/shared/lib/prisma';

export interface StatisticsData {
  activeUsers: number;
  totalAds: number;
  premiumAds: number;
  goldAds: number;
  standardAds: number;
  dailyViews: number;
  totalViews: number;
  newUsersToday: number;
  totalVisitors: number;
  todayVisitors: number;
  totalSold: number;
  totalListings: number;
  lastUpdated: string;
}

export default class StatisticsService {
  /**
   * Check if we're running in browser environment
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Visitor sayısını artırır
   */
  static async incrementVisitors(): Promise<void> {
    if (this.isBrowser()) return;

    try {
      await prisma.$connect();
      
      // Get or create statistics record
      let stats = await prisma.statistics.findFirst();
      
      if (!stats) {
        stats = await prisma.statistics.create({
          data: {
            totalVisitors: 0,
            todayVisitors: 0,
            totalSold: 0,
            totalListings: 0,
            lastUpdated: new Date()
          }
        });
      }

      // Increment visitors
      await prisma.statistics.update({
        where: { id: stats.id },
        data: {
          totalVisitors: stats.totalVisitors + 1,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error incrementing visitors:', error);
    }
  }

  /**
   * Satılan nömrə sayısını artırır
   */
  static async incrementSoldNumbers(): Promise<void> {
    if (this.isBrowser()) return;

    try {
      await prisma.$connect();
      
      // Get or create statistics record
      let stats = await prisma.statistics.findFirst();
      
      if (!stats) {
        stats = await prisma.statistics.create({
          data: {
            totalVisitors: 0,
            todayVisitors: 0,
            totalSold: 0,
            totalListings: 0,
            lastUpdated: new Date()
          }
        });
      }

      // Increment sold numbers
      await prisma.statistics.update({
        where: { id: stats.id },
        data: {
          totalSold: stats.totalSold + 1,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error incrementing sold numbers:', error);
    }
  }

  /**
   * Aktif istifadəçi sayısını artırır
   */
  static async incrementActiveUsers(): Promise<void> {
    if (this.isBrowser()) return;

    try {
      await prisma.$connect();
      
      // Get or create statistics record
      let stats = await prisma.statistics.findFirst();
      
      if (!stats) {
        stats = await prisma.statistics.create({
          data: {
            totalVisitors: 0,
            todayVisitors: 0,
            totalSold: 0,
            totalListings: 0,
            lastUpdated: new Date()
          }
        });
      }

      // Increment active users
      await prisma.statistics.update({
        where: { id: stats.id },
        data: {
          todayVisitors: stats.todayVisitors + 1,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error incrementing active users:', error);
    }
  }

  /**
   * Statistika məlumatlarını alır
   */
  static async getStatistics(): Promise<StatisticsData> {
    try {
      await prisma.$connect();
      
      // Get statistics from database
      const stats = await prisma.statistics.findFirst();
      
      if (!stats) {
        // Create default statistics if none exist
        const defaultStats = await prisma.statistics.create({
          data: {
            totalVisitors: 0,
            todayVisitors: 0,
            totalSold: 0,
            totalListings: 0,
            lastUpdated: new Date()
          }
        });

        return {
          activeUsers: 0,
          totalAds: 0,
          premiumAds: 0,
          goldAds: 0,
          standardAds: 0,
          dailyViews: 0,
          totalViews: 0,
          newUsersToday: 0,
          totalVisitors: defaultStats.totalVisitors,
          todayVisitors: defaultStats.todayVisitors,
          totalSold: defaultStats.totalSold,
          totalListings: defaultStats.totalListings,
          lastUpdated: defaultStats.lastUpdated.toISOString()
        };
      }

      // Get phone number counts
      const phoneNumberCounts = await prisma.phoneNumber.groupBy({
        by: ['type'],
        _count: {
          type: true
        }
      });

      const typeCounts = phoneNumberCounts.reduce((acc, item) => {
        acc[item.type.toLowerCase()] = item._count.type;
        return acc;
      }, {} as Record<string, number>);

      return {
        activeUsers: 0,
        totalAds: phoneNumberCounts.reduce((sum, item) => sum + item._count.type, 0),
        premiumAds: typeCounts.premium || 0,
        goldAds: typeCounts.gold || 0,
        standardAds: typeCounts.standard || 0,
        dailyViews: 0, // Could be implemented later
        totalViews: 0, // Could be implemented later
        newUsersToday: 0, // Could be implemented later
        totalVisitors: stats.totalVisitors,
        todayVisitors: stats.todayVisitors,
        totalSold: stats.totalSold,
        totalListings: stats.totalListings,
        lastUpdated: stats.lastUpdated.toISOString()
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      
      // Return default statistics on error
      return {
        activeUsers: 0,
        totalAds: 0,
        premiumAds: 0,
        goldAds: 0,
        standardAds: 0,
        dailyViews: 0,
        totalViews: 0,
        newUsersToday: 0,
        totalVisitors: 0,
        todayVisitors: 0,
        totalSold: 0,
        totalListings: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }
}
