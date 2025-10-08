/**
 * Components Index - Centralized component exports
 * 
 * This file provides a clean API for importing components throughout the application.
 * Components are organized by category for better maintainability.
 */

// Layout Components
export { default as MainLayout } from './layout/MainLayout/MainLayout';
export { default as PageTemplate } from './layout/PageTemplate/PageTemplate';
export { default as Sidebar } from './layout/Sidebar/Sidebar';

// Common Components (Authentication, Data Providers, Tracking)
export * from './common';

// Feature Components (Specialized pages)
export * from './pages';

// UI Components
export { default as Logo } from './ui/Logo/Logo';
export { default as Navigation } from './ui/Navigation/Navigation';
export { default as OperatorSection } from './ui/OperatorSection/OperatorSection';
export { default as GoldElanlar } from './ui/GoldElanlar';
export { default as NumbersListing } from './ui/NumbersListing';
export { default as SearchAndFilter } from './ui/SearchAndFilter';
export { default as PremiumElanlar } from './ui/PremiumElanlar';

// Re-export types
export type { NumbersListingProps } from './ui/NumbersListing';
export type { PremiumElanlarProps } from './ui/PremiumElanlar';