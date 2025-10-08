'use client';

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/layout/PageTemplate/PageTemplate';
import styles from './page.module.css';

interface FeedbackData {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  feedbackType: string;
  subject: string;
  message: string;
  date: string;
  timestamp: number;
}

export default function EvaluationPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [reviewStats, setReviewStats] = useState({
    recentReviews: 0,
    oldReviews: 0,
    protectedHours: 6
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch feedbacks from MongoDB via API
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        const allFeedbacks = result.data.map((feedback: {
          id: string;
          name: string;
          email: string;
          phone: string;
          rating: number;
          feedbackType: string;
          subject: string;
          message: string;
          date: string;
        }) => ({
          id: feedback.id,
          name: feedback.name,
          email: feedback.email,
          phone: feedback.phone,
          rating: feedback.rating,
          feedbackType: feedback.feedbackType,
          subject: feedback.subject,
          message: feedback.message,
          date: feedback.date,
          timestamp: new Date(feedback.date).getTime()
        }));
        
        // Sort by timestamp (newest first)
        allFeedbacks.sort((a: FeedbackData, b: FeedbackData) => b.timestamp - a.timestamp);
        
        setFeedbacks(allFeedbacks);
        setTotalFeedbacks(allFeedbacks.length);

        // Calculate review age statistics
        const protectionPeriod = 6 * 60 * 60 * 1000; // 6 hours
        const currentTime = Date.now();
        const recentCount = allFeedbacks.filter((feedback: FeedbackData) => 
          currentTime - feedback.timestamp < protectionPeriod
        ).length;
        
        setReviewStats({
          recentReviews: recentCount,
          oldReviews: allFeedbacks.length - recentCount,
          protectedHours: 6
        });

        // Calculate average rating
        if (allFeedbacks.length > 0) {
          const totalRating = allFeedbacks.reduce((sum: number, feedback: FeedbackData) => 
            sum + feedback.rating, 0
          );
          setAverageRating(Math.round((totalRating / allFeedbacks.length) * 10) / 10);
        }
      } else {
        setError('Failed to load feedbacks');
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getFeedbackTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      'GENERAL': 'Ümumi',
      'COMPLAINT': 'Şikayət',
      'SUGGESTION': 'Təklif',
      'BUG_REPORT': 'Xəta Bildirişi'
    };
    return types[type] || type;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 3) return '#FF9800';
    return '#F44336';
  };

  if (loading) {
    return (
      <PageTemplate>
        <div className={styles.container}>
          <div className={styles.loading}>
            <h2>Rəylər yüklənir...</h2>
          </div>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Xəta: {error}</h2>
            <button onClick={loadFeedbacks} className={styles.retryButton}>
              Yenidən cəhd et
            </button>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Müştəri Rəyləri</h1>
          <p>İstifadəçilərimizin bizim haqqımızda düşüncələri</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Ümumi Reytinq</h3>
            <div className={styles.rating}>
              <span className={styles.ratingNumber}>{averageRating}</span>
              <span className={styles.ratingStars}>{getRatingStars(Math.round(averageRating))}</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <h3>Ümumi Rəy Sayı</h3>
            <div className={styles.count}>{totalFeedbacks}</div>
          </div>
          
          <div className={styles.statCard}>
            <h3>Son 6 Saat</h3>
            <div className={styles.count}>{reviewStats.recentReviews}</div>
          </div>
        </div>

        <div className={styles.feedbacks}>
          <h2>Son Rəylər</h2>
          {feedbacks.length === 0 ? (
            <div className={styles.noFeedbacks}>
              <p>Hələ rəy yoxdur</p>
            </div>
          ) : (
            <div className={styles.feedbackList}>
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <div className={styles.userInfo}>
                      <h4>{feedback.name}</h4>
                      <span className={styles.feedbackType}>
                        {getFeedbackTypeText(feedback.feedbackType)}
                      </span>
                    </div>
                    <div className={styles.rating}>
                      <span 
                        className={styles.ratingStars}
                        style={{ color: getRatingColor(feedback.rating) }}
                      >
                        {getRatingStars(feedback.rating)}
                      </span>
                      <span className={styles.date}>
                        {formatDate(feedback.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.feedbackContent}>
                    <h5>{feedback.subject}</h5>
                    <p>{feedback.message}</p>
                  </div>
                  
                  <div className={styles.feedbackMeta}>
                    <span className={styles.contact}>
                      📧 {feedback.email}
                    </span>
                    <span className={styles.contact}>
                      📱 {feedback.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}