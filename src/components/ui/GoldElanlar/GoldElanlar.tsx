/**
 * GoldElanlar Main Component
 * Gold Ads component with responsive design - Based on PremiumElanlar structure
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGoldAds } from './hooks';
import { DesktopLayout, MobileLayout } from './components';
import type { GoldElanlarProps } from './types';
import styles from './GoldElanlar.module.css';

export default function GoldElanlar({
  className = '',
  showViewAll = true,
  onViewAll,
  onContact
}: GoldElanlarProps) {
  const router = useRouter();
  
  const {
    ads,
    loading,
    error,
    currentIndex,
    totalItems,
    nextSlide,
    prevSlide,
    handleContact
  } = useGoldAds();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push('/gold-elanlar');
    }
  };

  const handleContactClick = (phoneNumber: string, contactPhone: string) => {
    if (onContact) {
      onContact(phoneNumber, contactPhone);
    } else {
      handleContact(phoneNumber, contactPhone);
    }
  };

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Desktop Layout */}
      <DesktopLayout
        ads={ads}
        loading={loading}
        currentIndex={currentIndex}
        totalItems={totalItems}
        onNext={nextSlide}
        onPrev={prevSlide}
        onContact={handleContactClick}
        onViewAll={handleViewAll}
        showViewAll={showViewAll}
      />

      {/* Mobile Layout */}
      <MobileLayout
        ads={ads}
        loading={loading}
        currentIndex={currentIndex}
        totalItems={totalItems}
        onNext={nextSlide}
        onPrev={prevSlide}
        onContact={handleContactClick}
        onViewAll={handleViewAll}
        showViewAll={showViewAll}
      />
    </div>
  );
}
