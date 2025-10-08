'use client';

import { useState, useRef, useEffect } from 'react';
import type { DropdownState, DropdownRefs } from '../types';

export function useDropdownState(isLoading: boolean = false) {
  // Custom dropdown states
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isPrefixDropdownOpen, setIsPrefixDropdownOpen] = useState(false);
  const [isMobileTypeDropdownOpen, setIsMobileTypeDropdownOpen] = useState(false);
  const [isMobilePrefixDropdownOpen, setIsMobilePrefixDropdownOpen] = useState(false);

  // Refs for dropdown containers
  const typeDropdownRef = useRef<HTMLDivElement | null>(null);
  const prefixDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileTypeDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobilePrefixDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (prefixDropdownRef.current && !prefixDropdownRef.current.contains(event.target as Node)) {
        setIsPrefixDropdownOpen(false);
      }
      if (mobileTypeDropdownRef.current && !mobileTypeDropdownRef.current.contains(event.target as Node)) {
        setIsMobileTypeDropdownOpen(false);
      }
      if (mobilePrefixDropdownRef.current && !mobilePrefixDropdownRef.current.contains(event.target as Node)) {
        setIsMobilePrefixDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownState: DropdownState = {
    isTypeDropdownOpen,
    isPrefixDropdownOpen,
    isMobileTypeDropdownOpen,
    isMobilePrefixDropdownOpen,
  };

  const dropdownRefs: DropdownRefs = {
    typeDropdownRef,
    prefixDropdownRef,
    mobileTypeDropdownRef,
    mobilePrefixDropdownRef,
  };

  const dropdownSetters = {
    setIsTypeDropdownOpen: (open: boolean) => {
      if (!isLoading) {
        setIsTypeDropdownOpen(open);
      }
    },
    setIsPrefixDropdownOpen: (open: boolean) => {
      if (!isLoading) {
        setIsPrefixDropdownOpen(open);
      }
    },
    setIsMobileTypeDropdownOpen: (open: boolean) => {
      if (!isLoading) {
        setIsMobileTypeDropdownOpen(open);
      }
    },
    setIsMobilePrefixDropdownOpen: (open: boolean) => {
      if (!isLoading) {
        setIsMobilePrefixDropdownOpen(open);
      }
    },
  };

  return {
    dropdownState,
    dropdownRefs,
    dropdownSetters,
  };
}
