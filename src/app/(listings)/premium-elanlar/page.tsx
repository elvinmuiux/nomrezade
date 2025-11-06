import React from 'react';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import PremiumElanlarPageClient from './PremiumElanlarPageClient';

const PremiumPage = () => {
  return (
    <DataProvider>
      <SearchFilterProvider>
        <PremiumElanlarPageClient />
      </SearchFilterProvider>
    </DataProvider>
  );
};

export default PremiumPage;
