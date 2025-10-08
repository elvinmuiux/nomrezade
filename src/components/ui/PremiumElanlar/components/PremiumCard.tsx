/**
 * Premium Card Component
 * Individual premium ad card
 */

import React from 'react';
import { formatPriceSimple } from '@/shared/utils/format';
import type { PremiumCardProps } from '../types';
import styles from '../PremiumElanlar.module.css';

export default function PremiumCard({ ad, onContact, className = '' }: PremiumCardProps) {
  const handleContactClick = () => {
    onContact(ad.phoneNumber, ad.contactPhone || '050-444-44-22');
  };

  return (
    <div className={`${styles.premiumCard} ${className}`}>
      {/* Phone Number and Premium Tag */}
      <div className={styles.cardHeader}>
        <span className={styles.phoneNumber}>
          {ad.phoneNumber}
        </span>
        <span className={styles.premiumTag}>
          PREMİUM
        </span>
      </div>

      {/* Price and Contact Button */}
      <div className={styles.cardFooter}>
        <span className={styles.price}>
          <span className={styles.priceAmount}>{formatPriceSimple(ad.price)}</span>
          <span className={styles.priceSymbol}>₼</span>
        </span>
        <button 
          className={styles.contactButton}
          onClick={handleContactClick}
          aria-label={`${ad.phoneNumber} nömrəsi ilə əlaqə qur`}
        >
          
          <span className={styles.contactText}>
            SİFARİŞ
          </span>
        </button>
      </div>

    </div>
  );
}
