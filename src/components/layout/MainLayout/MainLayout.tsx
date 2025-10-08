import React from 'react';
import styles from './MainLayout.module.css';
import Sidebar from '../Sidebar/Sidebar';
import VisitorTracker from '@/components/common/tracking/VisitorTracker';
import { SearchFilterProvider } from '@/shared/contexts/SearchFilterContext';

interface MainLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <SearchFilterProvider>
      <div className={`${styles.layout} ${className}`}>
        <VisitorTracker />
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {children}
          </div>
        </main>
      </div>
    </SearchFilterProvider>
  );
};

export default MainLayout;
