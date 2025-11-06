import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import GoldElanlarPageClient from './GoldElanlarPageClient';

export default function GoldElanlarPage() {
  return (
    <DataProvider>
      <SearchFilterProvider>
        <GoldElanlarPageClient />
      </SearchFilterProvider>
    </DataProvider>
  );
}
