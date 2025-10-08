// Re-export types from centralized directories
export type { Statistics } from '../types/phone';

// MongoDB-based StatisticsManager class
import { Statistics } from '../types/phone';
import { prisma } from './prisma';

const DEFAULT_STATS: Statistics = {
  activeUsers: 10000,
  soldNumbers: 50000,
  totalListings: 0,
  totalVisitors: 10000,
  lastUpdated: new Date().toISOString()
};

export class StatisticsManager {
  static async getStats(): Promise<Statistics> {
    try {
      await prisma.$connect();
      
      const stats = await prisma.statistics.findFirst();
      
      if (!stats) {
        // Create default statistics if none exist
        const defaultStats = await prisma.statistics.create({
          data: {
            totalVisitors: DEFAULT_STATS.totalVisitors,
            todayVisitors: 0,
            totalSold: DEFAULT_STATS.soldNumbers,
            totalListings: DEFAULT_STATS.totalListings,
            lastUpdated: new Date()
          }
        });

        return {
          activeUsers: DEFAULT_STATS.activeUsers,
          soldNumbers: defaultStats.totalSold,
          totalListings: defaultStats.totalListings,
          totalVisitors: defaultStats.totalVisitors,
          lastUpdated: defaultStats.lastUpdated.toISOString()
        };
      }

      return {
        activeUsers: DEFAULT_STATS.activeUsers, // This is calculated differently
        soldNumbers: stats.totalSold,
        totalListings: stats.totalListings,
        totalVisitors: stats.totalVisitors,
        lastUpdated: stats.lastUpdated.toISOString()
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return DEFAULT_STATS;
    }
  }

  static async incrementActiveUsers(): Promise<Statistics> {
    try {
      await prisma.$connect();
      
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

      const updatedStats = await prisma.statistics.update({
        where: { id: stats.id },
        data: {
          todayVisitors: stats.todayVisitors + 1,
          lastUpdated: new Date()
        }
      });

      return {
        activeUsers: DEFAULT_STATS.activeUsers,
        soldNumbers: updatedStats.totalSold,
        totalListings: updatedStats.totalListings,
        totalVisitors: updatedStats.totalVisitors,
        lastUpdated: updatedStats.lastUpdated.toISOString()
      };
    } catch (error) {
      console.error('Error incrementing active users:', error);
      return DEFAULT_STATS;
    }
  }

  static async incrementSoldNumbers(): Promise<Statistics> {
    try {
      await prisma.$connect();
      
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

      const updatedStats = await prisma.statistics.update({
        where: { id: stats.id },
        data: {
          totalSold: stats.totalSold + 1,
          lastUpdated: new Date()
        }
      });

      return {
        activeUsers: DEFAULT_STATS.activeUsers,
        soldNumbers: updatedStats.totalSold,
        totalListings: updatedStats.totalListings,
        totalVisitors: updatedStats.totalVisitors,
        lastUpdated: updatedStats.lastUpdated.toISOString()
      };
    } catch (error) {
      console.error('Error incrementing sold numbers:', error);
      return DEFAULT_STATS;
    }
  }

  static formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + ',000+';
    }
    return num.toString();
  }

  static async resetStats(): Promise<Statistics> {
    try {
      await prisma.$connect();
      
      // Delete existing statistics
      await prisma.statistics.deleteMany();
      
      // Create new default statistics
      const defaultStats = await prisma.statistics.create({
        data: {
          totalVisitors: DEFAULT_STATS.totalVisitors,
          todayVisitors: 0,
          totalSold: DEFAULT_STATS.soldNumbers,
          totalListings: DEFAULT_STATS.totalListings,
          lastUpdated: new Date()
        }
      });

      return {
        activeUsers: DEFAULT_STATS.activeUsers,
        soldNumbers: defaultStats.totalSold,
        totalListings: defaultStats.totalListings,
        totalVisitors: defaultStats.totalVisitors,
        lastUpdated: defaultStats.lastUpdated.toISOString()
      };
    } catch (error) {
      console.error('Error resetting statistics:', error);
      return DEFAULT_STATS;
    }
  }
}

export default StatisticsManager;
