/**
 * PremiumElanlar Main Component
 * Premium Ads component with responsive design
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePremiumAds } from './hooks';
import { DesktopLayout, MobileLayout } from './components';
import type { PremiumElanlarProps } from './types';
import styles from './PremiumElanlar.module.css';

export default function PremiumElanlar({
  className = '',
  showViewAll = true,
  onViewAll,
  onContact
}: PremiumElanlarProps) {
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
  } = usePremiumAds();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push('/premium-elanlar');
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
