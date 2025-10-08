import { useState, useCallback, useMemo, useEffect } from 'react';
import { apiService, type PhoneNumber } from '@/shared/services/ApiService';
import type { PhoneNumber as AdminPhoneNumber } from '../types/types';

export const usePhoneNumberData = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<AdminPhoneNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load phone numbers from MongoDB via API
  const loadPhoneNumbers = useCallback(async () => {
    console.log('🔍 usePhoneNumberData: Starting to load phone numbers');
    setLoading(true);
    setError('');
    
    try {
      // Use centralized API service
      const result = await apiService.getPhoneNumbers();
      
      if (result.success && result.data) {
        // Convert API data to admin format
        const adminNumbers: AdminPhoneNumber[] = result.data.map((phone: PhoneNumber) => ({
          id: phone.id,
          phoneNumber: phone.phoneNumber,
          price: phone.price,
          contactPhone: phone.contactPhone,
          type: phone.type.toLowerCase() as 'standard' | 'premium' | 'gold',
          operator: phone.operator.toLowerCase() as 'azercell' | 'bakcell' | 'naxtel' | 'nar-mobile',
          prefix: phone.prefix,
          status: phone.status.toLowerCase() as 'active' | 'sold' | 'expired' | 'draft',
          isVip: phone.isVip,
          isSeller: phone.isSeller,
          description: phone.description,
          createdAt: phone.createdAt,
          updatedAt: phone.updatedAt,
          expiresAt: phone.expiresAt,
          seller: phone.seller,
          location: phone.location
        }));
        
        setPhoneNumbers(adminNumbers);
        console.log(`✅ usePhoneNumberData: Loaded ${adminNumbers.length} phone numbers from MongoDB`);
      } else {
        console.error('❌ usePhoneNumberData: API error:', result.error);
        setError(result.error || 'Phone numbers yüklənərkən xəta baş verdi');
      }
    } catch (error) {
      console.error('❌ usePhoneNumberData: Error loading phone numbers:', error);
      setError('Phone numbers yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load phone numbers on mount
  useEffect(() => {
    console.log('🔍 usePhoneNumberData: Auto-loading phone numbers on mount');
    loadPhoneNumbers();
  }, [loadPhoneNumbers]);

  // Memoized return values
  return useMemo(() => ({
    phoneNumbers,
    loading,
    error,
    loadPhoneNumbers,
    setError
  }), [phoneNumbers, loading, error, loadPhoneNumbers]);
};