/**
 * GoldElanlar Component Types
 * Type definitions for Gold Ads component - Based on PremiumElanlar structure
 */

export interface GoldAd {
  id: number | string;
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  type: 'gold';
  description?: string;
  isVip?: boolean;
  provider?: string;
  prefix?: string;
  sold?: boolean;
  createdAt?: string;
}

export interface GoldElanlarProps {
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onContact?: (phoneNumber: string, contactPhone: string) => void;
}

export interface GoldCardProps {
  ad: GoldAd;
  onContact: (phoneNumber: string, contactPhone: string) => void;
  className?: string;
}

export interface GoldElanlarState {
  ads: GoldAd[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  totalItems: number;
}

export interface GoldElanlarActions {
  loadAds: () => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  handleContact: (phoneNumber: string, contactPhone: string) => void;
}
