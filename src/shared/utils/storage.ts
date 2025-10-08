/**
 * Storage utility functions
 * Client-side session management only
 */

// Storage utilities class
export class StorageUtils {
  static setItem(key: string, value: unknown): boolean {
    return setStorageItem(key, value);
  }

  static getItem<T>(key: string, defaultValue?: T): T | null {
    return getStorageItem(key, defaultValue);
  }

  static removeItem(key: string): void {
    removeStorageItem(key);
  }

  static clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }

  static isAvailable(): boolean {
    return isStorageAvailable();
  }
}

/**
 * LocalStorage'a güvenli şekilde veri kaydeder
 */
export function setStorageItem(key: string, value: unknown): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * LocalStorage'dan güvenli şekilde veri okur
 */
export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  try {
    if (typeof window === 'undefined') return defaultValue || null;
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue || null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue || null;
  }
}

/**
 * LocalStorage'dan veri siler
 */
export function removeStorageItem(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * LocalStorage'ın mevcut olup olmadığını kontrol eder
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
