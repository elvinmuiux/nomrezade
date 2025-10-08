/**
 * PremiumElanlar Component Types
 * Type definitions for Premium Ads component
 */

export interface PremiumAd {
  id: number | string;
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  type: 'premium';
  description?: string;
  isSeller?: boolean;
  operator?: string;
  prefix?: string;
  sold?: boolean;
  createdAt?: string;
}

export interface PremiumElanlarProps {
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onContact?: (phoneNumber: string, contactPhone: string) => void;
}

export interface PremiumCardProps {
  ad: PremiumAd;
  onContact: (phoneNumber: string, contactPhone: string) => void;
  className?: string;
}

export interface PremiumElanlarState {
  ads: PremiumAd[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  totalItems: number;
}

export interface PremiumElanlarActions {
  loadAds: () => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  handleContact: (phoneNumber: string, contactPhone: string) => void;
}
