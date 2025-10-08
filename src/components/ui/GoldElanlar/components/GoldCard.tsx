/**
 * Gold Card Component
 * Individual gold ad card - Based on PremiumCard structure
 */

import React from 'react';
import { formatPriceSimple } from '@/shared/utils/format';
import type { GoldCardProps } from '../types';
import styles from '../GoldElanlar.module.css';

export default function GoldCard({ ad, onContact, className = '' }: GoldCardProps) {
  const handleContact = () => {
    onContact(ad.phoneNumber, ad.contactPhone || '050-444-44-22');
  };

  return (
    <div className={`${styles.goldCard} ${className}`}>
      <div className={styles.cardHeader}>
        <span className={styles.phoneNumber}>{ad.phoneNumber}</span>
        <span className={styles.goldTag}>Gold</span>
      </div>
      
      <div className={styles.cardFooter}>
        <span className={styles.price}>
          <span className={styles.priceAmount}>{formatPriceSimple(ad.price)}</span>
          <span className={styles.priceSymbol}>₼</span>
        </span>
        <button 
          className={styles.contactButton}
          onClick={handleContact}
        >
          <span className={styles.contactText}>Sifariş</span>
        </button>
      </div>
    </div>
  );
}
