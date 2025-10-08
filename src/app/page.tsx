import NumbersPageTemplate from '@/components/ui/NumbersListing';
import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import SearchAndFilter from '@/components/ui/SearchAndFilter/SearchAndFilter';
import PremiumElanlar from '@/components/ui/PremiumElanlar';
import GoldElanlar from '@/components/ui/GoldElanlar';

function HomePage() {
  return (
    <DataProvider>
      <SearchFilterProvider>
        {/* Search and Filter Section */}
        <SearchAndFilter
          showTypeFilter={true}
          showPrefixFilter={true}
        />

        {/* Gold Elanlar Section */}
        <GoldElanlar 
          showViewAll={true}
        />
        
        {/* Premium Elanlar Section */}
        <PremiumElanlar 
          showViewAll={true}
        />
        
        <NumbersPageTemplate
          pageTitle="Bütün Nömrələr"
        />
      </SearchFilterProvider>
    </DataProvider>
  );
}

export default HomePage;
