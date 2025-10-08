/**
 * Desktop Layout Component
 * Desktop view for Premium Elanlar
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumCard from './PremiumCard';
import type { PremiumAd } from '../types';
import styles from '../PremiumElanlar.module.css';

interface DesktopLayoutProps {
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

export default function DesktopLayout({
  ads,
  loading,
  currentIndex,
  totalItems,
  onNext,
  onPrev,
  onContact,
  onViewAll,
  showViewAll = true
}: DesktopLayoutProps) {
  if (loading) {
    return (
      <div className={styles.desktopContainer}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.countBadge}>
              <span className={styles.countNumber}>0</span>
            </div>
            <h2 className={styles.title}>Premium Elanlar</h2>
          </div>
          {showViewAll && (
            <button className={styles.viewAllButton} disabled>
              Hamısına bax
            </button>
          )}
        </div>
        
        <div className={styles.cardsContainer}>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonHeader}>
                <div className={styles.skeletonPhoneNumber}></div>
                <div className={styles.skeletonTag}></div>
              </div>
              <div className={styles.skeletonFooter}>
                <div className={styles.skeletonPrice}></div>
                <div className={styles.skeletonButton}></div>
              </div>
              <div className={styles.skeletonProgress}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className={styles.desktopContainer}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.countBadge}>
              <span className={styles.countNumber}>0</span>
            </div>
            <h2 className={styles.title}>Premium Elanlar</h2>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>Hal-hazırda elanımız mövcud deyil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.desktopContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.countBadge}>
            <span className={styles.countNumber}>{ads.length}</span>
          </div>
          <h2 className={styles.title}>Premium Elanlar</h2>
        </div>
        {showViewAll && onViewAll && (
          <button 
            className={styles.viewAllButton}
            onClick={onViewAll}
          >
            Hamısına bax
          </button>
        )}
      </div>

      {/* Cards Container */}
      <div className={styles.cardsContainer}>
        {/* Navigation Buttons */}
        {totalItems > 4 && (
          <>
            <button 
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={onPrev}
              aria-label="Əvvəlki elanlar"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={onNext}
              aria-label="Növbəti elanlar"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Cards */}
        <div className={styles.cardsWrapper}>
          {ads.slice(currentIndex, currentIndex + 4).map((ad, index) => (
            <PremiumCard
              key={`${ad.id}-${index}`}
              ad={ad}
              onContact={onContact}
              className={styles.desktopCard}
            />
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      {totalItems > 4 && (
        <div className={styles.progressIndicator}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressThumb}
              style={{ 
                width: `${(4 / totalItems) * 100}%`,
                transform: `translateX(${(currentIndex / totalItems) * 100}%)`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
