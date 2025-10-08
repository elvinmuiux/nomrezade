'use client';

import React from 'react';
import NumbersPageTemplate from '@/components/ui/NumbersListing';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';

export default function AzercellPage() {
  const prefixes = ['010', '050', '051'];
  const operatorName = 'azercell';

  return (
    <DataProvider>
      <SearchFilterProvider>
        <SearchAndFilter
          showTypeFilter={true}
          showPrefixFilter={true}
        />
        <NumbersPageTemplate
          pageTitle="Azercell nömrələri"
          operatorPrefixes={prefixes}
          operatorName={operatorName}
        />
      </SearchFilterProvider>
    </DataProvider>
  );
}
