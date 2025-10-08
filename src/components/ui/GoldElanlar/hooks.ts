'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiService, type PhoneNumber } from '@/shared/services/ApiService';

interface GoldAd {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: 'gold';
  description: string;
  isVip: boolean;
  provider: string;
  prefix: string;
  sold: boolean;
  createdAt: string;
}

interface GoldElanlarState {
  ads: GoldAd[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  totalItems: number;
}

interface GoldElanlarActions {
  loadAds: () => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => void;
  handleContact: (contactNumber: string, phoneNumber: string) => void;
}

export function useGoldAds(): GoldElanlarState & GoldElanlarActions {
  const [state, setState] = useState<GoldElanlarState>({
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
      const result = await apiService.getPhoneNumbersByType('gold', 50);
      
      if (result.success && result.data) {
        // Convert MongoDB data to component format
        const processedAds: GoldAd[] = result.data.map((ad: PhoneNumber) => ({
          id: ad.id,
          phoneNumber: ad.phoneNumber,
          price: ad.price,
          contactPhone: ad.contactPhone || '050-444-44-22',
          type: 'gold' as const,
          description: ad.description || '',
          isVip: ad.isVip || false,
          provider: ad.operator.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()).replace('Nar Mobile', 'Nar-Mobile') || '',
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
          error: result.error || 'Gold elanlar yüklənərkən xəta baş verdi',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error loading gold ads:', error);
      setState(prev => ({
        ...prev,
        error: 'Gold elanlar yüklənərkən xəta baş verdi',
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