'use client';

import React from 'react';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';
import GoldElanlar from '@/components/ui/GoldElanlar';
import PremiumElanlar from '@/components/ui/PremiumElanlar';
import NumbersPageTemplate from '@/components/ui/NumbersListing';

export default function HomePageInnerClient() {
  const { hasActiveSearch } = useSearchFilter();

  return (
    <>
      {/* Search and Filter Section */}
      <SearchAndFilter
        showTypeFilter={true}
        showPrefixFilter={true}
      />

      {/* Hide featured sections while user is searching */}
      {!hasActiveSearch && (
        <>
          <GoldElanlar showViewAll={true} />
          <PremiumElanlar showViewAll={true} />
        </>
      )}

      <NumbersPageTemplate pageTitle="Bütün Nömrələr" />
    </>
  );
}
