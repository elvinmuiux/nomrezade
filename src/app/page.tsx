import { DataProvider } from '@/components/common/DataProvider';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';
import HomePageInnerClient from './HomePageInnerClient';

function HomePage() {
  return (
    <DataProvider>
      <SearchFilterProvider>
        <HomePageInnerClient />
      </SearchFilterProvider>
    </DataProvider>
  );
}
// Home page content is rendered inside a client component (HomePageInnerClient)
// to safely use client-only hooks like `useSearchFilter`.

export default HomePage;
