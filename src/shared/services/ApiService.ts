/**
 * Centralized API Service
 * Single source of truth for all API calls
 */

// Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  metadata?: {
    storage?: string;
    timestamp?: string;
    [key: string]: unknown;
  };
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: 'STANDARD' | 'PREMIUM' | 'GOLD';
  operator: 'AZERCELL' | 'BAKCELL' | 'NAXTEL' | 'NAR_MOBILE';
  prefix: string;
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'DRAFT';
  isVip: boolean;
  isSeller: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  seller?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  location?: {
    id: string;
    city?: string;
    region?: string;
  };
}

export interface CreatePhoneNumberRequest {
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: 'standard' | 'premium' | 'gold';
  description?: string;
  isSeller?: boolean;
  isVip?: boolean;
}

export interface UpdatePhoneNumberRequest extends CreatePhoneNumberRequest {
  id: string;
}

export interface PhoneNumberFilters {
  type?: 'standard' | 'premium' | 'gold';
  operator?: 'azercell' | 'bakcell' | 'naxtel' | 'nar-mobile';
  status?: 'active' | 'sold' | 'expired' | 'draft';
  limit?: number;
  offset?: number;
}

export interface Statistics {
  activeUsers: number;
  soldNumbers: number;
  totalListings: number;
  totalVisitors: number;
  lastUpdated: string;
}

export interface UpdateStatisticsRequest {
  action: 'increment_users' | 'increment_sold' | 'increment_visitor';
}

export interface MonthlyStats {
  month: string; // Format: YYYY-MM
  visitors: number;
  pageViews: number;
  lastUpdated: string;
}

// API Service Class
class ApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }

  /**
   * Generic API request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      };

      console.log(`🔍 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const result = await response.json();

      console.log(`✅ API Response: ${response.status} ${url}`, {
        success: result.success,
        dataLength: result.data ? (Array.isArray(result.data) ? result.data.length : 1) : 0
      });

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error)
      };
    }
  }

  // ===== PHONE NUMBERS API =====

  /**
   * Get all phone numbers with filters
   */
  async getPhoneNumbers(filters: PhoneNumberFilters = {}): Promise<ApiResponse<PhoneNumber[]>> {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.operator) params.append('operator', filters.operator);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/api/admin/numbers${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PhoneNumber[]>(endpoint);
  }

  /**
   * Get phone numbers by type (for components)
   */
  async getPhoneNumbersByType(type: 'standard' | 'premium' | 'gold', limit = 50): Promise<ApiResponse<PhoneNumber[]>> {
    return this.getPhoneNumbers({ type, status: 'active', limit });
  }

  /**
   * Get phone numbers by operator
   */
  async getPhoneNumbersByOperator(operator: 'azercell' | 'bakcell' | 'naxtel' | 'nar-mobile', limit = 100): Promise<ApiResponse<PhoneNumber[]>> {
    return this.getPhoneNumbers({ operator, status: 'active', limit });
  }

  /**
   * Create new phone number
   */
  async createPhoneNumber(data: CreatePhoneNumberRequest): Promise<ApiResponse<PhoneNumber>> {
    return this.request<PhoneNumber>('/api/admin/numbers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Update existing phone number
   */
  async updatePhoneNumber(data: UpdatePhoneNumberRequest): Promise<ApiResponse<PhoneNumber>> {
    return this.request<PhoneNumber>('/api/admin/numbers', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete phone number
   */
  async deletePhoneNumber(id: string): Promise<ApiResponse<PhoneNumber>> {
    return this.request<PhoneNumber>(`/api/admin/numbers?id=${id}`, {
      method: 'DELETE'
    });
  }

  // ===== STATISTICS API =====

  /**
   * Get statistics
   */
  async getStatistics(): Promise<ApiResponse<Statistics>> {
    return this.request<Statistics>('/api/statistics');
  }

  /**
   * Update statistics
   */
  async updateStatistics(action: UpdateStatisticsRequest['action']): Promise<ApiResponse<Statistics>> {
    return this.request<Statistics>('/api/statistics', {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }

  /**
   * Increment sold numbers
   */
  async incrementSold(): Promise<ApiResponse<Statistics>> {
    return this.updateStatistics('increment_sold');
  }

  /**
   * Increment visitors
   */
  async incrementVisitors(): Promise<ApiResponse<Statistics>> {
    return this.updateStatistics('increment_visitor');
  }

  // ===== MONTHLY STATISTICS API =====

  /**
   * Get monthly visitor statistics
   */
  async getMonthlyStats(): Promise<ApiResponse<MonthlyStats>> {
    return this.request<MonthlyStats>('/api/admin/monthly-stats');
  }

  /**
   * Update monthly statistics
   */
  async updateMonthlyStats(action: 'increment_visitor' | 'increment_pageview' | 'reset_month'): Promise<ApiResponse<MonthlyStats>> {
    return this.request<MonthlyStats>('/api/admin/monthly-stats', {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }

  /**
   * Increment monthly visitors
   */
  async incrementMonthlyVisitors(): Promise<ApiResponse<MonthlyStats>> {
    return this.updateMonthlyStats('increment_visitor');
  }

  /**
   * Increment monthly page views
   */
  async incrementMonthlyPageViews(): Promise<ApiResponse<MonthlyStats>> {
    return this.updateMonthlyStats('increment_pageview');
  }

  // ===== ENHANCED API =====

  /**
   * Get enhanced data by operator and type
   */
  async getEnhancedData(operator: string, type: string): Promise<ApiResponse<unknown>> {
    return this.request(`/api/enhanced/${operator}/${type}`);
  }

  /**
   * Get admin enhanced data
   */
  async getAdminEnhancedData(operator: string, type: string): Promise<ApiResponse<unknown>> {
    return this.request(`/api/admin/enhanced/${operator}/${type}`);
  }

  // ===== DEBUG API =====

  /**
   * Get environment info
   */
  async getEnvironmentInfo(): Promise<ApiResponse<unknown>> {
    return this.request('/api/debug/env');
  }
}

// Export singleton instance
export const apiService = new ApiService();
