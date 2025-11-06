'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NumbersPageTemplate from '@/components/ui/NumbersListing';
import styles from './gold-elanlar-page.module.css';
import { useDataProvider } from '@/components/common/DataProvider';

export default function GoldElanlarPageClient() {
  const router = useRouter();
  const { phoneNumbers } = useDataProvider();

  const goldNumbers = useMemo(() => {
    if (!phoneNumbers || !phoneNumbers.length) return [];
    const filtered = phoneNumbers.filter(n => n.type === 'gold');
    // sort by createdAt desc, then price desc
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
        pageTitle="Gold Elanlar"
        filteredNumbers={goldNumbers}
        headerRight={
          <button className={styles.backButton} onClick={() => router.back()} aria-label="Geri dön" title="Geri dön">
            ← Geri dön
          </button>
        }
      />
    </div>
  );
}
