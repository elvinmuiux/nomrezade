'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService, type Statistics } from '@/shared/services/ApiService';

interface UseStatisticsReturn {
  stats: Statistics;
  loading: boolean;
  error: string | null;
  incrementUsers: () => Promise<void>;
  incrementSold: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const DEFAULT_STATS: Statistics = {
  activeUsers: 1250,
  soldNumbers: 847,
  totalListings: 0,
  totalVisitors: 1250,
  lastUpdated: new Date().toISOString()
};

export function useStatistics(): UseStatisticsReturn {
  const [stats, setStats] = useState<Statistics>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get client IP (simplified) - Not used in centralized API
  // const getClientInfo = () => {
  //   return {
  //     userAgent: navigator.userAgent,
  //     ip: 'client_ip' // In production, this would be handled server-side
  //   };
  // };

  // Fetch current statistics
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.getStatistics();
      
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Increment active users
  const incrementUsers = useCallback(async () => {
    try {
      const result = await apiService.updateStatistics('increment_users');
      
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error incrementing users:', err);
    }
  }, []);

  // Increment sold numbers
  const incrementSold = useCallback(async () => {
    try {
      const result = await apiService.updateStatistics('increment_sold');
      
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error incrementing sold numbers:', err);
    }
  }, []);

  // Refresh statistics
  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-increment users on first visit (with rate limiting)
  useEffect(() => {
    const hasIncrementedToday = localStorage.getItem('stats_incremented_today');
    const today = new Date().toDateString();

    if (hasIncrementedToday !== today) {
      // Increment users after a short delay to ensure page is loaded
      const timer = setTimeout(() => {
        incrementUsers().then(() => {
          localStorage.setItem('stats_incremented_today', today);
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [incrementUsers]);

  return {
    stats,
    loading,
    error,
    incrementUsers,
    incrementSold,
    refreshStats
  };
}
