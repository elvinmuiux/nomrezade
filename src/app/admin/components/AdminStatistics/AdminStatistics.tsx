'use client';

import React, { useMemo, useEffect, useState } from 'react';
import styles from './AdminStatistics.module.css';
import type { PhoneNumber } from '../../lib/types/types';
import { apiService } from '@/shared/services/ApiService';

interface AdminStatisticsProps {
  filteredNumbers: PhoneNumber[];
  loading?: boolean;
}

const AdminStatistics = React.memo<AdminStatisticsProps>(({ filteredNumbers, loading = false }) => {
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(0);
  const [monthlyLoading, setMonthlyLoading] = useState<boolean>(true);

  const statistics = useMemo(() => {
    const total = filteredNumbers.length;
    const standard = filteredNumbers.filter(n => n.type === 'standard').length;
    const premium = filteredNumbers.filter(n => n.type === 'premium').length;
    const gold = filteredNumbers.filter(n => n.type === 'gold').length;
    const sellers = filteredNumbers.filter(n => n.isSeller).length;

    return { total, standard, premium, gold, sellers };
  }, [filteredNumbers]);

  // Fetch monthly visitor statistics
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        setMonthlyLoading(true);
        const response = await apiService.getMonthlyStats();
        if (response.success && response.data) {
          setMonthlyVisitors(response.data.pageViews);
        }
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      } finally {
        setMonthlyLoading(false);
      }
    };

    fetchMonthlyStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.statsSection}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.skeletonStatTitle}></div>
            <div className={styles.skeletonStatNumber}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsSection}>
      <div className={styles.statCard}>
        <h3>Aylıq Ziyarətçi</h3>
        <p className={styles.statNumber}>
          {monthlyLoading ? '...' : monthlyVisitors.toLocaleString()}
        </p>
      </div>
      <div className={styles.statCard}>
        <h3>Ümumi Nömrələr</h3>
        <p className={styles.statNumber}>{statistics.total}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Standard</h3>
        <p className={styles.statNumber}>{statistics.standard}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Premium</h3>
        <p className={styles.statNumber}>{statistics.premium}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Gold</h3>
        <p className={styles.statNumber}>{statistics.gold}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Satıcılar</h3>
        <p className={styles.statNumber}>{statistics.sellers}</p>
      </div>
    </div>
  );
});

AdminStatistics.displayName = 'AdminStatistics';

export default AdminStatistics;




