/**
 * Central configuration exports
 * Main entry point for all configuration modules
 */

// Re-export all configuration modules
export * from './app';
export * from './api';

// Import configuration functions
import { getAppConfig } from './app';
import { getApiConfig } from './api';

// Configuration type definitions
export interface Config {
  app: ReturnType<typeof getAppConfig>;
  api: ReturnType<typeof getApiConfig>;
}

/**
 * Get complete application configuration
 */
export function getConfig(): Config {
  return {
    app: getAppConfig(),
    api: getApiConfig(),
  };
}

/**
 * Environment detection utilities
 */
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
} as const;

/**
 * Configuration validation
 */
export function validateConfig(): boolean {
  try {
    const config = getConfig();
    
    // Basic validation checks
    if (!config.app || !config.api) {
      console.error('Missing required configuration sections');
      return false;
    }

    // Environment-specific validations
    if (ENV.isProduction) {
      // Production-specific validations
      if (!process.env.DATABASE_URL) {
        console.error('Missing required DATABASE_URL environment variable for production');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Configuration validation error:', error);
    return false;
  }
}

/**
 * Configuration loader with error handling
 */
export function loadConfig(): Config | null {
  try {
    if (!validateConfig()) {
      return null;
    }
    
    return getConfig();
  } catch (error) {
    console.error('Failed to load configuration:', error);
    return null;
  }
}
