'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';
import { useSearchHandler } from '../hooks/useSearchHandler';
import { DEFAULT_PREFIXES, DEFAULT_TYPES } from '../SearchAndFilter';
import type { SearchAndFilterProps, DropdownState, DropdownRefs } from '../types';
import styles from '../SearchAndFilter.module.css';

interface MobileLayoutProps extends SearchAndFilterProps {
  dropdownState: DropdownState;
  dropdownRefs: DropdownRefs;
  dropdownSetters: {
    setIsMobileTypeDropdownOpen: (open: boolean) => void;
    setIsMobilePrefixDropdownOpen: (open: boolean) => void;
  };
  isLoading?: boolean;
}

export default function MobileLayout({
  showTypeFilter = false,
  showPrefixFilter = true,
  searchPlaceholder,
  dropdownState,
  dropdownRefs,
  dropdownSetters,
  isLoading = false,
}: MobileLayoutProps) {
  const { selectedType, selectedPrefix, setSelectedType, setSelectedPrefix } = useSearchFilter();
  const { handleSearchChange, inputValue } = useSearchHandler();

  return (
    <div className={styles.mobileLayout}>
      {/* Top Row: Type and Prefix Filters */}
      <div className={styles.mobileFiltersRow}>
        {showTypeFilter && (
          <div className={styles.mobileFilterContainer} ref={dropdownRefs.mobileTypeDropdownRef}>
            <div 
              className={styles.mobileCustomSelect}
              onClick={() => !isLoading && dropdownSetters.setIsMobileTypeDropdownOpen(!dropdownState.isMobileTypeDropdownOpen)}
            >
            <span className={styles.mobileSelectValue}>
                {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Tip"}
            </span>
              <ChevronDown className={`${styles.mobileChevron} ${dropdownState.isMobileTypeDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
            </div>
            {dropdownState.isMobileTypeDropdownOpen && (
              <div className={styles.mobileDropdownMenu}>
                <div 
                  className={styles.mobileDropdownItem}
                  onClick={() => {
                    setSelectedType('');
                    dropdownSetters.setIsMobileTypeDropdownOpen(false);
                  }}
                >
                  Tip
                </div>
                {DEFAULT_TYPES.map((type: string, index: number) => (
                  <div 
                    key={`${type}-${index}`}
                    className={`${styles.mobileDropdownItem} ${selectedType === type ? styles.dropdownItemSelected : ''}`}
                    onClick={() => {
                      setSelectedType(type);
                      dropdownSetters.setIsMobileTypeDropdownOpen(false);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showPrefixFilter && (
          <div className={styles.mobileFilterContainer} ref={dropdownRefs.mobilePrefixDropdownRef}>
            <div 
              className={styles.mobileCustomSelect}
              onClick={() => !isLoading && dropdownSetters.setIsMobilePrefixDropdownOpen(!dropdownState.isMobilePrefixDropdownOpen)}
            >
              <span className={styles.mobileSelectValue}>
                  {selectedPrefix || 'Prefiks'}
              </span>
              <ChevronDown className={`${styles.mobileChevron} ${dropdownState.isMobilePrefixDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
            </div>
            {dropdownState.isMobilePrefixDropdownOpen && (
              <div className={styles.mobileDropdownMenu}>
                <div 
                  className={styles.mobileDropdownItem}
                  onClick={() => {
                    setSelectedPrefix('');
                    dropdownSetters.setIsMobilePrefixDropdownOpen(false);
                  }}
                >
                  {"Prefiks"}
                </div>
                {DEFAULT_PREFIXES.map((prefix: string, index: number) => (
                  <div 
                    key={`${prefix}-${index}`}
                    className={`${styles.mobileDropdownItem} ${selectedPrefix === prefix ? styles.dropdownItemSelected : ''}`}
                    onClick={() => {
                      setSelectedPrefix(prefix);
                      dropdownSetters.setIsMobilePrefixDropdownOpen(false);
                    }}
                  >
                    {prefix}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: Search Input */}
      <div className={styles.mobileSearchContainer}>
        <Search className={styles.mobileSearchIcon} size={20} />
        <input
          type="tel"
          placeholder={searchPlaceholder}
          value={inputValue}
          onChange={handleSearchChange}
          className={styles.mobileSearchInput}
          maxLength={undefined}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
    </div>
  );
}
