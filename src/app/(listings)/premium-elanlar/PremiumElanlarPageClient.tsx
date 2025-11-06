'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NumbersPageTemplate from '@/components/ui/NumbersListing';
import styles from './premium-elanlar-page.module.css';
import { useDataProvider } from '@/components/common/DataProvider';

export default function PremiumElanlarPageClient() {
  const router = useRouter();
  const { phoneNumbers } = useDataProvider();

  const premiumNumbers = useMemo(() => {
    if (!phoneNumbers || !phoneNumbers.length) return [];
    const filtered = phoneNumbers.filter(n => n.type === 'premium');
    // Tarihe göre azalan, sonra fiyata göre azalan sıralama
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      if (dateA !== dateB) return dateB - dateA;
      return (b.price || 0) - (a.price || 0);
    });
    return filtered;
  }, [phoneNumbers]);

  return (
    <div>
      <NumbersPageTemplate
        pageTitle="Premium Elanlar"
        filteredNumbers={premiumNumbers}
        headerRight={
          <button className={styles.backButton} onClick={() => router.back()} aria-label="Geri dön" title="Geri dön">
            ← Geri dön
          </button>
        }
      />
    </div>
  );
}