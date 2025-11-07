'use client';

import React, { useMemo, useState, useEffect } from 'react';
import styles from './AdminStatistics.module.css';
import type { PhoneNumber } from '../../lib/types/types';

interface AdminStatisticsProps {
  filteredNumbers: PhoneNumber[];
  loading?: boolean;
}

interface PageRatings {
  activeUsers: number;
  soldNumbers: number;
  totalVisitors: number;
  totalListings: number;
  lastUpdated: string;
}

const AdminStatistics = React.memo<AdminStatisticsProps>(({ filteredNumbers, loading = false }) => {
  const [pageRatings, setPageRatings] = useState<PageRatings>({
    activeUsers: 0,
    soldNumbers: 0,
    totalVisitors: 0,
    totalListings: 0,
    lastUpdated: new Date().toISOString()
  });
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Check if selected month is current month
  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return selectedMonth === currentMonth;
  }, [selectedMonth]);

  // Display ratings based on selected month
  const displayRatings = useMemo(() => {
    if (isCurrentMonth) {
      return pageRatings;
    }
    // Return empty stats for non-current months
    return {
      activeUsers: 0,
      soldNumbers: 0,
      totalVisitors: 0,
      totalListings: 0,
      lastUpdated: new Date().toISOString()
    };
  }, [isCurrentMonth, pageRatings]);

  const statistics = useMemo(() => {
    const total = filteredNumbers.length;
    const standard = filteredNumbers.filter(n => n.type === 'standard').length;
    const premium = filteredNumbers.filter(n => n.type === 'premium').length;
    const gold = filteredNumbers.filter(n => n.type === 'gold').length;
    const sellers = filteredNumbers.filter(n => n.isSeller).length;

    return { total, standard, premium, gold, sellers };
  }, [filteredNumbers]);

  // Fetch page ratings from API
  useEffect(() => {
    const fetchPageRatings = async () => {
      try {
        setRatingsLoading(true);
        const response = await fetch('/api/statistics');
        const result = await response.json();
        
        if (result.success && result.data) {
          setPageRatings(result.data);
        }
      } catch (error) {
        console.error('Error fetching page ratings:', error);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchPageRatings();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPageRatings, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.statsSection}>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.skeletonStatTitle}></div>
            <div className={styles.skeletonStatNumber}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Phone Numbers Statistics */}
      <div className={styles.statsSection}>
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

      {/* Page Ratings Section - Admin Only */}
      <div className={styles.pageRatingsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWithSelect}>
            <h2 className={styles.sectionTitle}>
              📊 Səhifə Reytinqi
            </h2>
            <select 
              className={styles.monthSelect}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Ay seçin"
            >
              <option value="2025-11">Noyabr 2025</option>
              <option value="2025-10">Oktyabr 2025</option>
              <option value="2025-09">Sentyabr 2025</option>
              <option value="2025-08">Avqust 2025</option>
              <option value="2025-07">İyul 2025</option>
              <option value="2025-06">İyun 2025</option>
              <option value="2025-05">May 2025</option>
              <option value="2025-04">Aprel 2025</option>
              <option value="2025-03">Mart 2025</option>
              <option value="2025-02">Fevral 2025</option>
              <option value="2025-01">Yanvar 2025</option>
            </select>
          </div>
          <div className={styles.headerInfo}>
            <span className={styles.lastUpdateText}>
              {isCurrentMonth ? (
                <>
                  Son yeniləmə: {new Date(displayRatings.lastUpdated).toLocaleString('az-AZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </>
              ) : (
                <>Seçilmiş ay üçün məlumat yoxdur</>
              )}
            </span>
            <div className={styles.monthlyInfoHeader}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span>Statistikalar hər ayın 1-də avtomatik sıfırlanır</span>
            </div>
          </div>
        </div>
        
        {ratingsLoading ? (
          <div className={styles.ratingsGrid}>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className={styles.ratingCard}>
                <div className={styles.skeletonStatTitle}></div>
                <div className={styles.skeletonStatNumber}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.ratingsGrid}>
            <div className={`${styles.ratingCard} ${styles.activeUsers}`}>
              <div className={styles.ratingIcon}>👥</div>
              <div className={styles.ratingContent}>
                <h4>Aktiv İstifadəçilər</h4>
                <p className={styles.ratingNumber}>
                  {isCurrentMonth ? displayRatings.activeUsers.toLocaleString() : '—'}
                </p>
                <span className={styles.ratingLabel}>
                  {isCurrentMonth ? 'Bu ay ziyarət' : 'Məlumat yoxdur'}
                </span>
              </div>
            </div>
            
            <div className={`${styles.ratingCard} ${styles.soldNumbers}`}>
              <div className={styles.ratingIcon}>💰</div>
              <div className={styles.ratingContent}>
                <h4>Satılmış Nömrələr</h4>
                <p className={styles.ratingNumber}>
                  {isCurrentMonth ? displayRatings.soldNumbers.toLocaleString() : '—'}
                </p>
                <span className={styles.ratingLabel}>
                  {isCurrentMonth ? 'Bu ay satış' : 'Məlumat yoxdur'}
                </span>
              </div>
            </div>
            
            <div className={`${styles.ratingCard} ${styles.totalVisitors}`}>
              <div className={styles.ratingIcon}>📈</div>
              <div className={styles.ratingContent}>
                <h4>Ümumi Ziyarətçilər</h4>
                <p className={styles.ratingNumber}>
                  {isCurrentMonth ? displayRatings.totalVisitors.toLocaleString() : '—'}
                </p>
                <span className={styles.ratingLabel}>
                  {isCurrentMonth ? 'Bu ay toplam' : 'Məlumat yoxdur'}
                </span>
              </div>
            </div>
            
            <div className={`${styles.ratingCard} ${styles.totalListings}`}>
              <div className={styles.ratingIcon}>📱</div>
              <div className={styles.ratingContent}>
                <h4>Aktiv Elanlar</h4>
                <p className={styles.ratingNumber}>
                  {displayRatings.totalListings.toLocaleString()}
                </p>
                <span className={styles.ratingLabel}>Hal-hazırda</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

AdminStatistics.displayName = 'AdminStatistics';

export default AdminStatistics;


