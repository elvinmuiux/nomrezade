/**
 * Mobile Layout Component
 * Mobile view for Premium Elanlar
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumCard from './PremiumCard';
import type { PremiumAd } from '../types';
import styles from '../PremiumElanlar.module.css';

interface MobileLayoutProps {
  ads: PremiumAd[];
  loading: boolean;
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  onContact: (phoneNumber: string, contactPhone: string) => void;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export default function MobileLayout({
  ads,
  loading,
  currentIndex,
  totalItems,
  onNext,
  onPrev,
  onContact,
  onViewAll,
  showViewAll = true
}: MobileLayoutProps) {
  if (loading) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileTitleSection}>
            <div className={styles.mobileCountBadge}>
              <span className={styles.mobileCountNumber}>0</span>
            </div>
            <h2 className={styles.mobileTitle}>Premium Elanlar</h2>
          </div>
          {showViewAll && (
            <button className={styles.mobileViewAllButton} disabled>
              Hamısına bax
            </button>
          )}
        </div>
        
        <div className={styles.mobileCardContainer}>
          <div className={styles.mobileSkeletonCard}>
            <div className={styles.mobileSkeletonHeader}>
              <div className={styles.mobileSkeletonPhoneNumber}></div>
              <div className={styles.mobileSkeletonTag}></div>
            </div>
            <div className={styles.mobileSkeletonFooter}>
              <div className={styles.mobileSkeletonPrice}></div>
              <div className={styles.mobileSkeletonButton}></div>
            </div>
            <div className={styles.mobileSkeletonProgress}></div>
          </div>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileTitleSection}>
            <div className={styles.mobileCountBadge}>
              <span className={styles.mobileCountNumber}>0</span>
            </div>
            <h2 className={styles.mobileTitle}>Premium Elanlar</h2>
          </div>
        </div>
        <div className={styles.mobileEmptyState}>
          <p>Hal-hazırda elanımız mövcud deyil.</p>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  return (
    <div className={styles.mobileContainer}>
      {/* Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileTitleSection}>
          <div className={styles.mobileCountBadge}>
            <span className={styles.mobileCountNumber}>{ads.length}</span>
          </div>
          <h2 className={styles.mobileTitle}>Premium Elanlar</h2>
        </div>
        {showViewAll && onViewAll && (
          <button 
            className={styles.mobileViewAllButton}
            onClick={onViewAll}
          >
            Hamısına bax
          </button>
        )}
      </div>

      {/* Card Container */}
      <div className={styles.mobileCardContainer}>
        {/* Navigation Buttons */}
        {totalItems > 1 && (
          <>
            <button 
              className={`${styles.mobileNavButton} ${styles.mobileNavButtonLeft}`}
              onClick={onPrev}
              aria-label="Əvvəlki elan"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className={`${styles.mobileNavButton} ${styles.mobileNavButtonRight}`}
              onClick={onNext}
              aria-label="Növbəti elan"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Current Card */}
        {currentAd && (
          <PremiumCard
            ad={currentAd}
            onContact={onContact}
            className={styles.mobileCard}
          />
        )}
      </div>

      {/* Progress Indicator */}
      {totalItems > 1 && (
        <div className={styles.mobileProgressIndicator}>
          <div className={styles.mobileProgressTrack}>
            <div 
              className={styles.mobileProgressThumb}
              style={{ 
                width: `${(1 / totalItems) * 100}%`,
                transform: `translateX(${(currentIndex / totalItems) * 100}%)`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
