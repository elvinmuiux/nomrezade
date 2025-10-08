'use client';

import React, { useState, useEffect } from 'react';
import { useDropdownState } from './hooks';
import { DesktopLayout, MobileLayout } from './components';
import type { SearchAndFilterProps } from './types';
import styles from './SearchAndFilter.module.css';

// Constants
export const DEFAULT_PREFIXES = ['010', '050', '051', '055', '060', '070', '077', '099'];
export const DEFAULT_TYPES = ['standard', 'premium', 'gold'];
export const DEFAULT_SEARCH_PLACEHOLDER = 'Nömrə axtarın...';
export const ADMIN_SEARCH_PLACEHOLDER = 'Nömrə axtar (216-77-77, 216, 767...)...';
export const DROPDOWN_MAX_HEIGHT = 200;
export const SEARCH_INPUT_MAX_LENGTH = 13;

export default function SearchAndFilter({
  showTypeFilter = false,
  showPrefixFilter = true,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  className = ''
}: SearchAndFilterProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { dropdownState, dropdownRefs, dropdownSetters } = useDropdownState(isLoading);

  useEffect(() => {
    // Sayfa yüklendiğinde skeleton göster, sonra normal komponenti göster
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms skeleton göster

    return () => clearTimeout(timer);
  }, []);

  const containerClass = `${styles.container} ${className}`;
  
  if (isLoading) {
    return (
      <div className={`${styles.skeleton} ${className}`}>
        {/* Desktop Skeleton Layout */}
        <div className={styles.skeletonDesktopLayout}>
          {showTypeFilter && (
            <div className={styles.skeletonFilterContainer}>
              <div className={styles.skeletonCustomSelect}></div>
            </div>
          )}
          {showPrefixFilter && (
            <div className={styles.skeletonFilterContainer}>
              <div className={styles.skeletonCustomSelect}></div>
            </div>
          )}
          <div className={styles.skeletonSearchContainer}>
            <div className={styles.skeletonSearchInput}></div>
          </div>
        </div>

        {/* Mobile Skeleton Layout */}
        <div className={styles.skeletonMobileLayout}>
          <div className={styles.skeletonMobileFiltersRow}>
            {showTypeFilter && (
              <div className={styles.skeletonFilterContainer}>
                <div className={styles.skeletonCustomSelect}></div>
              </div>
            )}
            {showPrefixFilter && (
              <div className={styles.skeletonFilterContainer}>
                <div className={styles.skeletonCustomSelect}></div>
              </div>
            )}
          </div>
          <div className={styles.skeletonMobileSearchContainer}>
            <div className={styles.skeletonMobileSearchInput}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={containerClass}>
      {/* Desktop Layout: All filters in one row */}
      <DesktopLayout
        showTypeFilter={showTypeFilter}
        showPrefixFilter={showPrefixFilter}
        searchPlaceholder={searchPlaceholder}
     
        dropdownState={dropdownState}
        dropdownRefs={dropdownRefs}
        dropdownSetters={{
          setIsTypeDropdownOpen: dropdownSetters.setIsTypeDropdownOpen,
          setIsPrefixDropdownOpen: dropdownSetters.setIsPrefixDropdownOpen,
        }}
        isLoading={isLoading}
      />

      {/* Mobile Layout: Filters on top row, search below */}
      <MobileLayout
        showTypeFilter={showTypeFilter}
        showPrefixFilter={showPrefixFilter}
        searchPlaceholder={searchPlaceholder}
   
        dropdownState={dropdownState}
        dropdownRefs={dropdownRefs}
        dropdownSetters={{
          setIsMobileTypeDropdownOpen: dropdownSetters.setIsMobileTypeDropdownOpen,
          setIsMobilePrefixDropdownOpen: dropdownSetters.setIsMobilePrefixDropdownOpen,
        }}
        isLoading={isLoading}
      />
    </div>
  );
}