'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchFilterContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPrefix: string;
  setSelectedPrefix: (prefix: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  resetFilters: () => void;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

interface SearchFilterProviderProps {
  children: ReactNode;
}

export function SearchFilterProvider({ children }: SearchFilterProviderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedPrefix('');
    setSelectedType('');
  };

  const value: SearchFilterContextType = {
    searchTerm,
    setSearchTerm,
    selectedPrefix,
    setSelectedPrefix,
    selectedType,
    setSelectedType,
    resetFilters,
  };

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
}
