'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/ui/NumbersListing';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';

export default function NarMobilePage() {
  const prefixes = ['070', '077'];
  const operatorName = 'nar-mobile';

  return (
    <DataProvider>
      <SearchFilterProvider>
        <SearchAndFilter
          showTypeFilter={true}
          showPrefixFilter={true}
        />
        <NumbersPageTemplate
          pageTitle="Nar-Mobile nömrələri"
          operatorPrefixes={prefixes}
          operatorName={operatorName}
        />
      </SearchFilterProvider>
    </DataProvider>
  );
}
