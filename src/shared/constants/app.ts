/**
 * Uygulama genelindeki sabit değerler
 */

export const APP_CONFIG = {
  NAME: 'Nomrezade.az',
  TITLE: 'Nomrezade.az - Sizin Nömrələriniz bizdə',
  DESCRIPTION: 'Azərbaycanın ən böyük nömrə bazarı',
  DOMAIN: 'nomrezade.az',
  CONTACT_PHONE: '050-444-44-22',
  CONTACT_EMAIL: 'info@nomrezade.az',
  WHATSAPP_NUMBER: '994504444422',
  
  // Admin panel - password is now handled server-side via Server Actions
  // ADMIN_PASSWORD removed for security reasons
  
  // Pagination
  ITEMS_PER_PAGE: 20,
  MAX_ITEMS_PER_PAGE: 100,
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/*', '.pdf', '.doc', '.docx'],
  
  // Feedback
  MAX_FEEDBACKS: 100,
  FEEDBACK_PROTECTION_PERIOD: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
  
  // Cache
  CACHE_DURATION: 30000, // 30 seconds
  
  // Statistics
  REFRESH_INTERVAL: 30000 // 30 seconds
} as const;

export const VALIDATION_RULES = {
  PHONE: {
    MIN_LENGTH: 9,
    MAX_LENGTH: 13,
    PATTERN: /^0\([0-9]{2,3}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  PRICE: {
    MIN: 0,
    MAX: 999999
  }
} as const;

export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  BREAKPOINTS: {
    MOBILE: 580,
    TABLET: 768,
    DESKTOP: 992,
    LARGE_DESKTOP: 1200
  },
  ANIMATION_DURATION: 300
} as const;
