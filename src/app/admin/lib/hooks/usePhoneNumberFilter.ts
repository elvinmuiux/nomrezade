import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';
import type { PhoneNumber } from '../types/types';

export const usePhoneNumberFilter = (phoneNumbers: PhoneNumber[]) => {
  const [filteredNumbers, setFilteredNumbers] = useState<PhoneNumber[]>([]);
  
  // Use SearchFilterContext for filter values
  const { searchTerm, selectedPrefix, selectedType } = useSearchFilter();

  // Memoized filter function for better performance
  const filterNumbers = useCallback((numbers: PhoneNumber[], search: string, prefix: string, type: string) => {
    if (!numbers.length) return [];

    let filtered = numbers;
    
    // Apply search filter - Support prefixless and partial search
    if (search && search.trim().length > 0) {
      const searchValue = search.trim();
      const searchDigits = searchValue.replace(/\D/g, '');
      
      if (searchDigits.length >= 2) {
        filtered = filtered.filter(number => {
          const phoneDigits = number.phoneNumber.replace(/\D/g, '');
          
          // Full phone search (with prefix)
          const fullMatch = phoneDigits.includes(searchDigits);
          
          // Prefixless search (without first 3 digits)
          const phoneWithoutPrefix = phoneDigits.slice(3);
          const prefixlessMatch = phoneWithoutPrefix.includes(searchDigits);
          
          return fullMatch || prefixlessMatch;
        });
      } else {
        // For very short searches, don't show results
        filtered = [];
      }
    }
    
    // Apply prefix filter
    if (prefix) {
      filtered = filtered.filter(number => number.prefix === prefix);
    }
    
    // Apply type filter
    if (type) {
      filtered = filtered.filter(number => number.type === type);
    }
    
    return filtered;
  }, []);

  // Memoized filtered numbers
  const memoizedFilteredNumbers = useMemo(() => {
    return filterNumbers(phoneNumbers, searchTerm, selectedPrefix, selectedType);
  }, [phoneNumbers, searchTerm, selectedPrefix, selectedType, filterNumbers]);

  // Update filtered numbers when memoized result changes
  useEffect(() => {
    setFilteredNumbers(memoizedFilteredNumbers);
  }, [memoizedFilteredNumbers]);

  return {
    filteredNumbers,
    searchTerm,
    selectedPrefix,
    selectedType
  };
};

