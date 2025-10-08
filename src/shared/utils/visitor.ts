/**
 * Visitor tracking utilities
 */

import { StorageUtils } from './storage';

interface VisitorData {
  date: string;
  count: number;
  uniqueVisitors: Set<string>;
}

interface StorageVisitorData {
  date: string;
  count: number;
  uniqueVisitors: string[];
}

export class VisitorUtils {
  private static readonly VISITORS_KEY = 'daily_visitors';
  private static readonly SESSION_KEY = 'visitor_session';

  /**
   * Track a new visitor for today
   */
  static trackVisitor(): void {
    const today = new Date().toDateString();
    
    // Check if this is a new session
    const existingSession = sessionStorage.getItem(this.SESSION_KEY);
    
    if (!existingSession) {
      // Generate a simple visitor ID for this session
      const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(this.SESSION_KEY, visitorId);
      
      // Get existing visitor data
      const visitorStats = this.getVisitorStats();
      
      // Initialize today's data if it doesn't exist
      if (!visitorStats[today]) {
        visitorStats[today] = {
          date: today,
          count: 0,
          uniqueVisitors: new Set()
        };
      }
      
      // Add this visitor to today's stats
      visitorStats[today].uniqueVisitors.add(visitorId);
      visitorStats[today].count = visitorStats[today].uniqueVisitors.size;
      
      // Clean up old data (keep only last 30 days)
      this.cleanupOldData(visitorStats);
      
      // Save updated data
      this.saveVisitorStats(visitorStats);
    }
  }

  /**
   * Get visitor statistics from storage
   */
  private static getVisitorStats(): { [key: string]: VisitorData } {
    const existingData = StorageUtils.getItem<{ [key: string]: StorageVisitorData }>(this.VISITORS_KEY);
    const visitorStats: { [key: string]: VisitorData } = {};
    
    if (existingData) {
      // Convert back to proper format with Set objects
      Object.keys(existingData).forEach(date => {
        visitorStats[date] = {
          date: existingData[date].date,
          count: existingData[date].count,
          uniqueVisitors: new Set(existingData[date].uniqueVisitors || [])
        };
      });
    }
    
    return visitorStats;
  }

  /**
   * Save visitor statistics to storage
   */
  private static saveVisitorStats(visitorStats: { [key: string]: VisitorData }): void {
    // Convert Sets to arrays for storage
    const storageData: { [key: string]: StorageVisitorData } = {};
    Object.keys(visitorStats).forEach(date => {
      storageData[date] = {
        date: visitorStats[date].date,
        count: visitorStats[date].count,
        uniqueVisitors: Array.from(visitorStats[date].uniqueVisitors)
      };
    });
    
    StorageUtils.setItem(this.VISITORS_KEY, storageData);
  }

  /**
   * Clean up visitor data older than 30 days
   */
  private static cleanupOldData(visitorStats: { [key: string]: VisitorData }): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(visitorStats).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete visitorStats[date];
      }
    });
  }

  /**
   * Get today's visitor count
   */
  static getTodayVisitorCount(): number {
    const today = new Date().toDateString();
    const visitorStats = this.getVisitorStats();
    return visitorStats[today]?.count || 0;
  }

  /**
   * Get total visitor count for all days
   */
  static getTotalVisitorCount(): number {
    const visitorStats = this.getVisitorStats();
    return Object.values(visitorStats).reduce((total, day) => total + day.count, 0);
  }

  /**
   * Check if current session is already tracked
   */
  static isSessionTracked(): boolean {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  }
}
