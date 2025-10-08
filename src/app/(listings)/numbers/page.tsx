import NumbersPageTemplate from '@/components/ui/NumbersListing';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';

export default function NumbersPage() {
  return (
    <DataProvider>
      <SearchFilterProvider>
        <SearchAndFilter
          showTypeFilter={true}
          showPrefixFilter={true}
        />
        <NumbersPageTemplate
          pageTitle="Bütün Nömrələr"
        />
      </SearchFilterProvider>
    </DataProvider>
  );
}
