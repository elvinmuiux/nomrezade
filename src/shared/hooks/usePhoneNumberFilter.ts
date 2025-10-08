'use client';

import { useState, useMemo } from 'react';
import type { PhoneAd } from '@/components/common/DataProvider';

export interface FilterOptions {
  searchTerm?: string;
  selectedPrefix?: string;
  selectedType?: string;
  showTypeFilter?: boolean;
  showPrefixFilter?: boolean;
  operatorName?: string;
}

export function usePhoneNumberFilter(
  phoneNumbers: PhoneAd[], 
  operatorPrefixes?: string[],
  externalFilters?: {
    searchTerm?: string;
    selectedPrefix?: string;
    selectedType?: string;
    operatorName?: string;
  }
) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [internalSelectedPrefix, setInternalSelectedPrefix] = useState<string>('');
  const [internalSelectedType, setInternalSelectedType] = useState<string>('');

  // Use external filters if provided, otherwise use internal state
  const searchTerm = externalFilters?.searchTerm !== undefined ? externalFilters.searchTerm : internalSearchTerm;
  const selectedPrefix = externalFilters?.selectedPrefix !== undefined ? externalFilters.selectedPrefix : internalSelectedPrefix;
  const selectedType = externalFilters?.selectedType !== undefined ? externalFilters.selectedType : internalSelectedType;

  // Get unique prefixes
  const getUniquePrefixes = () => {
    if (operatorPrefixes) return operatorPrefixes;
    const prefixes = phoneNumbers.map((ad: PhoneAd) => ad.prefix);
    return [...new Set(prefixes)].filter(Boolean).sort();
  };

  // Get unique types
  const getUniqueTypes = () => {
    const types = phoneNumbers.map((ad: PhoneAd) => ad.type);
    return [...new Set(types)].filter(Boolean).sort();
  };

  // Filter phone numbers based on current filters
  const filteredNumbers = useMemo(() => {
    if (!phoneNumbers.length) return [];
    
    return phoneNumbers.filter((ad: PhoneAd) => {
      if (!ad || !ad.phoneNumber) return false;
      
      const phoneDigits = ad.phoneNumber.replace(/[^0-9]/g, '');
      
      // Operator filter - if operatorName is provided, filter by operator
      if (externalFilters?.operatorName) {
        const normalizedOperator = ad.provider?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()).replace('Nar Mobile', 'Nar-Mobile') || '';
        const normalizedOperatorName = externalFilters.operatorName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()).replace('Nar Mobile', 'Nar-Mobile');
        
        if (normalizedOperator !== normalizedOperatorName) {
          return false;
        }
      }
      
      // Type filter
      if (selectedType && ad.type !== selectedType) {
        return false;
      }
      
      // Prefix filter
      if (selectedPrefix && ad.prefix !== selectedPrefix) {
        return false;
      }
      
      // Search filter - Support prefixless and partial search (admin panel compatibility)
      if (searchTerm) {
        const cleanSearchTerm = searchTerm.replace(/[^0-9]/g, '');
        if (cleanSearchTerm && cleanSearchTerm.length >= 2) {
          // Full phone search (with prefix)
          const fullMatch = phoneDigits.includes(cleanSearchTerm);
          
          // Prefixless search (without first 3 digits)
          const phoneWithoutPrefix = phoneDigits.slice(3);
          const prefixlessMatch = phoneWithoutPrefix.includes(cleanSearchTerm);
          
          if (!fullMatch && !prefixlessMatch) {
            return false;
          }
        } else if (cleanSearchTerm && cleanSearchTerm.length < 2) {
          // For very short searches, don't show results
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by creation date descending (newest first), then by price descending
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      
      if (dateA !== dateB) {
        return dateB - dateA; // Newest first
      }
      
      return b.price - a.price; // If same date, sort by price descending
    });
  }, [phoneNumbers, searchTerm, selectedPrefix, selectedType, externalFilters?.operatorName]);

  // Reset all filters
  const resetFilters = () => {
    setInternalSearchTerm('');
    setInternalSelectedPrefix('');
    setInternalSelectedType('');
  };

  return {
    // Current filter values
    searchTerm,
    selectedPrefix,
    selectedType,
    
    // Filter setters (use internal setters when external filters are not provided)
    setSearchTerm: externalFilters?.searchTerm !== undefined ? () => {} : setInternalSearchTerm,
    setSelectedPrefix: externalFilters?.selectedPrefix !== undefined ? () => {} : setInternalSelectedPrefix,
    setSelectedType: externalFilters?.selectedType !== undefined ? () => {} : setInternalSelectedType,
    
    // Filtered results
    filteredNumbers,
    
    // Available options
    availablePrefixes: getUniquePrefixes(),
    availableTypes: getUniqueTypes(),
    
    // Utilities
    resetFilters,
    hasActiveFilters: !!(searchTerm || selectedPrefix || selectedType),
    totalCount: phoneNumbers.length,
    filteredCount: filteredNumbers.length
  };
}