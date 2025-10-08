/**
 * Application configuration
 * Feature flags, runtime settings, etc.
 */

export const FEATURE_FLAGS = {
  // Authentication features
  ENABLE_REGISTRATION: true,
  ENABLE_LOGIN: true,
  ENABLE_ADMIN_PANEL: true,
  
  // Phone number features
  ENABLE_PHONE_SEARCH: true,
  ENABLE_PHONE_FILTERS: true,
  ENABLE_PHONE_SORTING: true,
  ENABLE_WHATSAPP_INTEGRATION: true,
  ENABLE_CALL_INTEGRATION: true,
  
  // Ad type features
  ENABLE_PREMIUM_ADS: true,
  ENABLE_GOLD_ADS: true,
  ENABLE_STANDARD_ADS: true,
  
  // Statistics and tracking
  ENABLE_VISITOR_TRACKING: true,
  ENABLE_SALES_TRACKING: true,
  ENABLE_STATISTICS_DISPLAY: true,
  
  // Feedback and support
  ENABLE_FEEDBACK_SYSTEM: true,
  ENABLE_QA_SECTION: true,
  ENABLE_ABOUT_PAGE: true,
  
  // Technical features
  ENABLE_PWA: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_AUTO_REFRESH: true,
  
  // Debug and development
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production'
} as const;

export const RUNTIME_CONFIG = {
  // API configuration
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },

  // UI configuration
  ui: {
    animationDuration: 300, // milliseconds
    debounceDelay: 300, // milliseconds for search
    toastDuration: 3000, // 3 seconds
    modalCloseDelay: 2000, // 2 seconds for success modals
  },

  // Performance configuration
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    chunkSize: 244 * 1024, // 244KB
  },

  // Security configuration
  security: {
    enableCSRFProtection: true,
    enableXSSProtection: true,
    sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
    passwordMinLength: 6,
  },

  // Cache configuration
  cache: {
    enableBrowserCache: true,
    enableServiceWorkerCache: true,
    cacheVersion: '1.0.0',
    maxCacheSize: 50 * 1024 * 1024, // 50MB
  }
} as const;

/**
 * Environment-based configuration
 */
export function getAppConfig() {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    ...RUNTIME_CONFIG,
    environment: {
      isDev,
      isProd,
      isClient: typeof window !== 'undefined',
      isServer: typeof window === 'undefined',
    },
    features: {
      ...FEATURE_FLAGS,
      // Override some flags based on environment
      ENABLE_DEBUG_MODE: isDev,
      ENABLE_CONSOLE_LOGS: isDev,
      ENABLE_ERROR_REPORTING: isProd,
    }
  };
}

/**
 * Feature flag checker
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Runtime configuration getter
 */
export function getRuntimeConfig<T extends keyof typeof RUNTIME_CONFIG>(
  section: T
): typeof RUNTIME_CONFIG[T] {
  return RUNTIME_CONFIG[section];
}
