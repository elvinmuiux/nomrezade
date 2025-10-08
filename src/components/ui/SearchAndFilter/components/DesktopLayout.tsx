'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';
import { useSearchHandler } from '../hooks/useSearchHandler';
import { DEFAULT_PREFIXES, DEFAULT_TYPES } from '../SearchAndFilter';
import type { SearchAndFilterProps, DropdownState, DropdownRefs } from '../types';
import styles from '../SearchAndFilter.module.css';

interface DesktopLayoutProps extends SearchAndFilterProps {
  dropdownState: DropdownState;
  dropdownRefs: DropdownRefs;
  dropdownSetters: {
    setIsTypeDropdownOpen: (open: boolean) => void;
    setIsPrefixDropdownOpen: (open: boolean) => void;
  };
  isLoading?: boolean;
}

export default function DesktopLayout({
  showTypeFilter = false,
  showPrefixFilter = true,
  searchPlaceholder,
  dropdownState,
  dropdownRefs,
  dropdownSetters,
  isLoading = false,
}: DesktopLayoutProps) {
  const { selectedType, selectedPrefix, setSelectedType, setSelectedPrefix } = useSearchFilter();
  const { handleSearchChange, inputValue } = useSearchHandler();

  return (
    <div className={styles.desktopLayout}>
      {/* Type Filter */}
      {showTypeFilter && (
        <div className={styles.filterContainer} ref={dropdownRefs.typeDropdownRef}>
          <div 
            className={styles.customSelect}
            onClick={() => !isLoading && dropdownSetters.setIsTypeDropdownOpen(!dropdownState.isTypeDropdownOpen)}
          >
            <span className={styles.selectValue}>
              {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Tip"}
            </span>
            <ChevronDown className={`${styles.chevron} ${dropdownState.isTypeDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
          </div>
          {dropdownState.isTypeDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div 
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedType('');
                  dropdownSetters.setIsTypeDropdownOpen(false);
                }}
              >
                {"Tip"}
              </div>
              {DEFAULT_TYPES.map((type: string, index: number) => (
                <div 
                  key={`${type}-${index}`}
                  className={`${styles.dropdownItem} ${selectedType === type ? styles.dropdownItemSelected : ''}`}
                  onClick={() => {
                    setSelectedType(type);
                    dropdownSetters.setIsTypeDropdownOpen(false);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prefix Filter */}
      {showPrefixFilter && (
        <div className={styles.filterContainer} ref={dropdownRefs.prefixDropdownRef}>
          <div 
            className={styles.customSelect}
            onClick={() => !isLoading && dropdownSetters.setIsPrefixDropdownOpen(!dropdownState.isPrefixDropdownOpen)}
          >
            <span className={styles.selectValue}>
              {selectedPrefix || "Prefiks"}
            </span>
            <ChevronDown className={`${styles.chevron} ${dropdownState.isPrefixDropdownOpen ? styles.chevronOpen : ''}`} size={16} />
          </div>
          {dropdownState.isPrefixDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div 
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedPrefix('');
                  dropdownSetters.setIsPrefixDropdownOpen(false);
                }}
              >
                {"Prefiks"}
              </div>
              {DEFAULT_PREFIXES.map((prefix: string, index: number) => (
                <div 
                  key={`${prefix}-${index}`}
                  className={`${styles.dropdownItem} ${selectedPrefix === prefix ? styles.dropdownItemSelected : ''}`}
                  onClick={() => {
                    setSelectedPrefix(prefix);
                    dropdownSetters.setIsPrefixDropdownOpen(false);
                  }}
                >
                  {prefix}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="tel"
          placeholder={searchPlaceholder}
          value={inputValue}
          onChange={handleSearchChange}
          className={styles.searchInput}
          maxLength={undefined}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
    </div>
  );
}
