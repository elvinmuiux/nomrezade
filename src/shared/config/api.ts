/**
 * API configuration and endpoints
 */

export const API_ENDPOINTS = {
  // Admin endpoints
  admin: {
    base: "/api/admin",
    numbers: "/api/admin/numbers",
  },

  // Debug endpoints
  debug: {
    kv: "/api/debug/kv",
    migrate: "/api/debug/migrate",
    clear: "/api/debug/clear",
    status: "/api/debug/status",
  },

  // Statistics endpoints
  statistics: {
    visitors: "/api/statistics/visitors",
    sales: "/api/statistics/sales",
    general: "/api/statistics/general",
  },
} as const;

export const API_CONFIG = {
  // Request configuration
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second

  // Response configuration
  maxResponseSize: 10 * 1024 * 1024, // 10MB

  // Headers
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Rate limiting
  rateLimit: {
    requests: 100,
    window: 60 * 1000, // 1 minute
  },
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * API response types
 */
export const API_RESPONSE_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

/**
 * Build API URL with base path
 */
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string>
): string {
  let url = endpoint;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  return url;
}

/**
 * Get API configuration for environment
 */
export function getApiConfig() {
  const isDev = process.env.NODE_ENV === "development";

  return {
    ...API_CONFIG,
    baseUrl: isDev
      ? "https://nomrezade.vercel.app"
      : process.env.NEXT_PUBLIC_SITE_URL || "",
    enableLogging: isDev,
    enableDebug: isDev,
  };
}
