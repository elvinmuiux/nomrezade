/**
 * Common Components
 * Shared components used across multiple pages and features
 */

// Authentication components
export { default as AuthButtons } from './AuthButtons/AuthButtons';

// Data providers
export { DataProvider, useDataProvider } from './DataProvider';
export type { PhoneAd } from './DataProvider';

// Tracking components
export { default as StatisticsTracker } from './tracking/StatisticsTracker';
export { default as VisitorTracker } from './tracking/VisitorTracker';

// Re-export tracking types
export type { StatisticsTrackerProps } from './tracking/StatisticsTracker';
export type { VisitorTrackerProps } from './tracking/VisitorTracker';