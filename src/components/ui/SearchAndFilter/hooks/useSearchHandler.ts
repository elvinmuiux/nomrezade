'use client';

import { useState, useEffect } from 'react';
import { useSearchFilter } from '@/shared/contexts/SearchFilterContext';

export function useSearchHandler() {
  const { setSearchTerm, searchTerm: contextSearchTerm } = useSearchFilter();
  const [inputValue, setInputValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits for processing
    const digits = e.target.value.replace(/\D/g, '');

    // Format for display as user types: 3-2-2 pattern (e.g., 222-22-22)
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 5) {
      // For 6 or more digits show 3-2-remaining (commonly 7 digits total)
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    }

    // Update input value shown in the field (formatted)
    setInputValue(formatted);

    // Update search term in context using raw digits (filter hook will clean again)
    if (digits.length >= 2) {
      setSearchTerm(digits);
    } else {
      setSearchTerm('');
    }
  };

  // Keep inputValue in sync when searchTerm in context changes (e.g., cleared)
  useEffect(() => {
    const digits = (contextSearchTerm || '').replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    }
    setInputValue(formatted);
  }, [contextSearchTerm]);

  return {
    handleSearchChange,
    inputValue,
  };
}
