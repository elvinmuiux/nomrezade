/**
 * Phone number utility functions
 * Telefon numarası formatı, validation, parsing
 */

import { VALIDATION_RULES, getOperatorFromPrefix } from '@/shared/constants';

/**
 * Telefon numarasından prefix çıkarır
 */
export function extractPrefix(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  return cleaned.slice(0, 3);
}

/**
 * Telefon numarasını formatlar: 050-123-45-67
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/[^0-9]/g, '');
  
  if (digits.length < 3) return digits;
  if (digits.length < 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
}

/**
 * Telefon numarasını full format'a çevirir: 0(55)-123-45-67
 */
export function formatFullPhoneNumber(prefix: string, phoneNumber: string): string {
  return `0(${prefix})-${phoneNumber}`;
}

/**
 * Telefon numarasının geçerliliğini kontrol eder
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const digits = phoneNumber.replace(/[^0-9]/g, '');
  return digits.length >= VALIDATION_RULES.PHONE.MIN_LENGTH && 
         digits.length <= VALIDATION_RULES.PHONE.MAX_LENGTH;
}

/**
 * Telefon numarasını normalize eder (sadece rakamlar)
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^0-9]/g, '');
}

/**
 * Contact phone formatını düzenler
 */
export function formatContactPhone(phone: string): string {
  const value = phone.replace(/\D/g, '');
  let formatted = '';
  
  if (value.length > 0) {
    if (value.length <= 3) {
      formatted = value;
    } else if (value.length <= 6) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length <= 8) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 10)}`;
    }
  }
  
  return formatted;
}

/**
 * WhatsApp link oluşturur
 */
export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/994${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Telefon zəngi linki oluşturur
 */
export function createCallLink(phoneNumber: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `tel:+994${cleanPhone}`;
}

/**
 * Prefix'den operator adını alır
 */
export function getOperatorByPrefix(prefix: string): string {
  return getOperatorFromPrefix(prefix);
}

/**
 * Telefon numarası arama fonksiyonu
 */
export function searchInPhoneNumber(phoneNumber: string, searchTerm: string): boolean {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  const cleanSearch = normalizePhoneNumber(searchTerm);
  
  if (!cleanSearch) return true;
  
  // Prefix olmadan arama (ilk 3 rakamı atla)
  const phoneWithoutPrefix = cleanPhone.slice(3);
  return cleanPhone.includes(cleanSearch) || phoneWithoutPrefix.includes(cleanSearch);
}

/**
 * Telefon numarasında arama terimini vurgular
 */
export function highlightSearchInPhone(phoneNumber: string, searchTerm: string): {
  before: string;
  highlighted: string;
  after: string;
} | null {
  if (!searchTerm.trim()) return null;
  
  const searchDigits = searchTerm.replace(/\D/g, '');
  if (!searchDigits) return null;
  
  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const matchIndex = phoneDigits.indexOf(searchDigits);
  
  if (matchIndex === -1) return null;
  
  let digitCount = 0;
  let highlightStart = -1;
  let highlightEnd = -1;
  
  for (let i = 0; i < phoneNumber.length; i++) {
    if (/\d/.test(phoneNumber[i])) {
      if (digitCount === matchIndex) highlightStart = i;
      if (digitCount === matchIndex + searchDigits.length - 1) {
        highlightEnd = i + 1;
        break;
      }
      digitCount++;
    }
  }
  
  if (highlightStart !== -1 && highlightEnd !== -1) {
    return {
      before: phoneNumber.slice(0, highlightStart),
      highlighted: phoneNumber.slice(highlightStart, highlightEnd),
      after: phoneNumber.slice(highlightEnd)
    };
  }
  
  return null;
}
