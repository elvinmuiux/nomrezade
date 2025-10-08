/**
 * API response ve request type'ları
 */

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string | string[];
  storage?: string;
  timestamp?: string;
}

// API Error types
export interface ApiError {
  error: string;
  details?: string | string[];
  status?: number;
}

// Admin API types
export interface AdminApiRequest {
  phoneNumber: string;
  price: string;
  contactPhone: string;
  type: string;
  description?: string;
  isSeller?: boolean;
}

export interface AdminUpdateRequest extends AdminApiRequest {
  id: string | number;
}

// Data API types
export interface DataApiResponse {
  [key: string]: unknown[];
}

// Debug API types
export interface KVDebugResponse {
  key: string;
  exists: boolean;
  data?: unknown;
  dataKeys?: string[];
  error?: string;
}

export interface MigrationStatus {
  available: boolean;
  reason?: string;
  environment: {
    NODE_ENV: string;
    VERCEL: string;
    isProduction: boolean;
    isVercel: boolean;
  };
}

export interface MigrationResult {
  key: string;
  success: boolean;
  dataKeys?: string[];
  totalItems?: number;
  error?: string;
}

export interface MigrationResponse {
  success: boolean;
  message: string;
  results: MigrationResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Statistics API types
export interface StatisticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalSold: number;
  totalListings: number;
  lastUpdated: string;
}
