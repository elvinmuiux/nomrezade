'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/ui/NumbersListing';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';

export default function NaxtelPage() {
  const prefixes = ['060'];
  const operatorName = 'naxtel';

  return (
    <DataProvider>
      <SearchFilterProvider>
        <SearchAndFilter
          showTypeFilter={true}
          showPrefixFilter={true}
        />
        <NumbersPageTemplate
          pageTitle="Naxtel nömrələri"
          operatorPrefixes={prefixes}
          operatorName={operatorName}
        />
      </SearchFilterProvider>
    </DataProvider>
  );
}
