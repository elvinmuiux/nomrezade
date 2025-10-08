'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiService, type PhoneNumber } from '@/shared/services/ApiService';

interface PremiumAd {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: 'premium';
  description: string;
  isSeller: boolean;
  operator: string;
  prefix: string;
  sold: boolean;
  createdAt: string;
}

interface PremiumElanlarState {
  ads: PremiumAd[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  totalItems: number;
}

interface PremiumElanlarActions {
  loadAds: () => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => void;
  handleContact: (contactNumber: string, phoneNumber: string) => void;
}

export function usePremiumAds(): PremiumElanlarState & PremiumElanlarActions {
  const [state, setState] = useState<PremiumElanlarState>({
    ads: [],
    loading: true,
    error: null,
    currentIndex: 0,
    totalItems: 0
  });

  const loadAds = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Use centralized API service
      const result = await apiService.getPhoneNumbersByType('premium', 50);
      
      if (result.success && result.data) {
        // Convert MongoDB data to component format
        const processedAds: PremiumAd[] = result.data.map((ad: PhoneNumber) => ({
          id: ad.id,
          phoneNumber: ad.phoneNumber,
          price: ad.price,
          contactPhone: ad.contactPhone || '050-444-44-22',
          type: 'premium' as const,
          description: ad.description || '',
          isSeller: ad.isSeller || false,
          operator: ad.operator.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()).replace('Nar Mobile', 'Nar-Mobile') || '',
          prefix: ad.prefix || '',
          sold: ad.status === 'SOLD',
          createdAt: ad.createdAt
        }));

        // Sort by creation date descending (newest first)
        const sortedAds = processedAds
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setState(prev => ({
          ...prev,
          ads: sortedAds,
          totalItems: sortedAds.length,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Premium elanlar yüklənərkən xəta baş verdi',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error loading premium ads:', error);
      setState(prev => ({
        ...prev,
        error: 'Premium elanlar yüklənərkən xəta baş verdi',
        loading: false
      }));
    }
  }, []);

  const nextSlide = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.totalItems
    }));
  }, []);

  const prevSlide = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.totalItems - 1 : prev.currentIndex - 1
    }));
  }, []);

  const handleContact = useCallback((contactNumber: string) => {
    // Handle contact logic here
    window.location.href = `tel:${contactNumber.replace(/[^0-9]/g, '')}`;
  }, []);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  return {
    ...state,
    loadAds,
    nextSlide,
    prevSlide,
    handleContact
  };
}