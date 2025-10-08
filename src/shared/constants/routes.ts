/**
 * API endpoint konstantları
 * Tüm API route'ları burada merkezi olarak yönetilir
 */

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN: {
    BASE: '/api/admin',
    NUMBERS: '/api/admin/numbers',
    LISTINGS: '/api/admin/listings'
  },
  
  // Debug endpoints
  DEBUG: {
    BASE: '/api/debug',
    KV: '/api/debug/kv',
    MIGRATE: '/api/debug/migrate'
  },
  
  // Statistics endpoints
  STATISTICS: '/api/statistics'
} as const;

export const ROUTES = {
  HOME: '/',
  NUMBERS: '/numbers',
  POST_AD: '/post-ad',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  COOPERATION: '/cooperation',
  FEEDBACK: '/feedback',
  QA: '/qa',
  EVALUATION: '/evaluation',
  
  // Operator specific routes
  OPERATORS: {
    AZERCELL: '/numbers/azercell',
    BAKCELL: '/numbers/bakcell',
    NAXTEL: '/numbers/naxtel',
    NAR_MOBILE: '/numbers/nar-mobile'
  },
  
  // Ad type routes
  ADS: {
    PREMIUM: '/premium-elanlar',
    GOLD: '/gold-elanlar',
    STANDARD: '/numbers'
  }
} as const;

// Helper fonksiyonlar
export const getOperatorRoute = (operator: string): string => {
  const operatorKey = operator.toUpperCase().replace(' ', '_') as keyof typeof ROUTES.OPERATORS;
  return ROUTES.OPERATORS[operatorKey] || ROUTES.NUMBERS;
};
