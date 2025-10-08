/**
 * Phone number ile ilgili tüm type tanımları
 */
import { AD_TYPES, OPERATORS } from '@/shared/constants';

export type AdType = typeof AD_TYPES[keyof typeof AD_TYPES];
export type OperatorName = typeof OPERATORS[keyof typeof OPERATORS];

// Statistics interface
export interface Statistics {
  activeUsers: number;
  soldNumbers: number;
  totalListings: number;
  totalVisitors: number;
  lastUpdated: string;
}

export interface PhoneNumber {
  id: number | string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: AdType;
  description?: string;
  isVip?: boolean;
  isSeller?: boolean;
  operator?: OperatorName;
  prefix?: string;
  sold?: boolean;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
}

export interface NumberAd extends PhoneNumber {
  provider: OperatorName;
}

// Form data types
export interface PhoneNumberFormData {
  phoneNumber: string;
  price: string;
  contactPhone: string;
  type: AdType;
  description: string;
  isSeller: boolean;
}

// Filter types
export interface PhoneFilters {
  searchTerm?: string;
  selectedPrefix?: string;
  selectedProvider?: OperatorName;
  selectedType?: AdType;
  priceRange?: {
    min: number;
    max: number;
  };
}

