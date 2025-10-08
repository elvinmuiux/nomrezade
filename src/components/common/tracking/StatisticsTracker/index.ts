/**
 * StatisticsTracker - User session tracking component
 * 
 * Features:
 * - Session-based user tracking
 * - Prevents duplicate counting using sessionStorage
 * - Integrates with useStatistics hook
 * - Tracks user activity on component mount
 * - Non-rendering component (returns null)
 */

export { default } from './StatisticsTracker';
export type { StatisticsTrackerProps } from './types';