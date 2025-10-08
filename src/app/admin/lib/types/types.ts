export interface PhoneNumber {
  id: string; // Changed from number to string for MongoDB ObjectId
  phoneNumber: string;
  price: number;
  contactPhone?: string;
  type: 'standard' | 'gold' | 'premium';
  description?: string;
  isSeller?: boolean;
  operator?: string;
  prefix?: string;
  status?: string;
  isVip?: boolean;
  isFeatured?: boolean;
  sold?: boolean;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  viewCount?: number;
  favoriteCount?: number;
  tags?: string[];
}

export interface FormData {
  phoneNumber: string;
  price: string;
  contactPhone: string;
  type: 'standard' | 'gold' | 'premium';
  description: string;
  isSeller: boolean;
}
