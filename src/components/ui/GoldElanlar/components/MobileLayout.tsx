/**
 * Mobile Layout Component
 * Mobile view for Gold Elanlar - Based on PremiumElanlar structure
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldCard from './GoldCard';
import type { GoldAd } from '../types';
import styles from '../GoldElanlar.module.css';

interface MobileLayoutProps {
  ads: GoldAd[];
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
            <h2 className={styles.mobileTitle}>Gold Elanlar</h2>
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
            <h2 className={styles.mobileTitle}>Gold Elanlar</h2>
          </div>
        </div>
        <div className={styles.mobileEmptyState}>
          <p>Hal-hazırda elanımız mövcud deyil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mobileContainer}>
      {/* Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileTitleSection}>
          <div className={styles.mobileCountBadge}>
            <span className={styles.mobileCountNumber}>{ads.length}</span>
          </div>
          <h2 className={styles.mobileTitle}>Gold Elanlar</h2>
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

        {/* Card */}
        <div className={styles.mobileCardWrapper}>
          {ads.slice(currentIndex, currentIndex + 1).map((ad, index) => (
            <GoldCard
              key={`${ad.id}-${index}`}
              ad={ad}
              onContact={onContact}
              className={styles.mobileCard}
            />
          ))}
        </div>
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
