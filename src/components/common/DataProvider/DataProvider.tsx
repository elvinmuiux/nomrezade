'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService, type PhoneNumber } from '@/shared/services/ApiService';

export interface PhoneAd {
  id: string | number;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: 'standard' | 'premium' | 'gold';
  isVip?: boolean;
  description?: string;
  provider?: string;
  prefix?: string;
  sold?: boolean;
  createdAt?: string;
}

interface DataProviderProps {
  children: React.ReactNode;
}

interface DataContextType {
  phoneNumbers: PhoneAd[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: DataProviderProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use centralized API service
      const result = await apiService.getPhoneNumbers({ 
        status: 'active', 
        limit: 200 
      });
      
      if (result.success && result.data) {
        // Convert MongoDB data to component format
        const processedAds: PhoneAd[] = result.data.map((ad: PhoneNumber) => ({
          id: ad.id,
          phoneNumber: ad.phoneNumber,
          price: ad.price,
          contactPhone: ad.contactPhone || '(050) 444-44-22',
          type: ad.type.toLowerCase() as 'standard' | 'premium' | 'gold',
          isVip: ad.isVip || false,
          description: ad.description || '',
          provider: ad.operator.replace('_', ' ') || '',
          prefix: ad.prefix || '',
          sold: ad.status === 'SOLD',
          createdAt: ad.createdAt
        }));
        
        setPhoneNumbers(processedAds);
        console.log(`Loaded ${processedAds.length} phone numbers from MongoDB`);
      } else {
        setError(result.error || 'Veri yüklənərkən xəta baş verdi');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Veri yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const contextValue: DataContextType = {
    phoneNumbers,
    loading,
    error,
    loadData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function useDataProvider() {
  return useData();
}