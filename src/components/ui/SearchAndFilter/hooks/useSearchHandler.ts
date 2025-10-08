'use client';

import { useState } from 'react';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';

export function useSearchHandler() {
  const { setSearchTerm } = useSearchFilter();
  const [inputValue, setInputValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    
    // Update input value for display
    setInputValue(value);
    
    // Update search term if 2 or more characters (admin panel compatibility)
    if (value.length >= 2) {
      setSearchTerm(value);
    } else {
      // Clear search term if less than 2 characters
      setSearchTerm('');
    }
  };

  return {
    handleSearchChange,
    inputValue,
  };
}
