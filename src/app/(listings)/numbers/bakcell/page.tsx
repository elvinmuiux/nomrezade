'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/ui/NumbersListing';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';

export default function BakcellPage() {
  const prefixes = ['055', '099'];
  const operatorName = 'bakcell';

  return (
    <DataProvider>
      <SearchFilterProvider>
        <SearchAndFilter
          showTypeFilter={true}
          showPrefixFilter={true}
        />
        <NumbersPageTemplate
          pageTitle="Bakcell nömrələri"
          operatorPrefixes={prefixes}
          operatorName={operatorName}
        />
      </SearchFilterProvider>
    </DataProvider>
  );
}