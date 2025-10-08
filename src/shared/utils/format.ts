/**
 * Formatting utility functions
 * Date, time, currency, text formatting
 */

/**
 * Tarixi Azərbaycan formatında formatlar
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('az-AZ');
}

/**
 * Tarixi tam formatda göstərir
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('az-AZ');
}

/**
 * Qiyməti formatlar: 1500 AZN
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0 AZN';
  
  return `${numPrice.toLocaleString('az-AZ')} AZN`;
}

/**
 * Qiyməti sadə formatda göstərir: 1,500
 */
export function formatPriceSimple(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0';
  
  return numPrice.toLocaleString('az-AZ');
}

/**
 * Sayını formatlar: 1,234
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('az-AZ');
}

/**
 * Mətni kəsir və "..." əlavə edir
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Mətni capitalize edir (ilk hərfi böyük)
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Mətni title case'ə çevirir
 */
export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * URL slug oluşturur
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ə]/g, 'e')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ş]/g, 's')
    .replace(/[ğ]/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * File boyutunu formatlar: 5.2 MB
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Zaman fərqini göstərir: "2 saat əvvəl"
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - past.getTime();
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  
  if (diffMs < minute) {
    return 'İndi';
  } else if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    return `${mins} dəqiqə əvvəl`;
  } else if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} saat əvvəl`;
  } else if (diffMs < month) {
    const days = Math.floor(diffMs / day);
    return `${days} gün əvvəl`;
  } else if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} ay əvvəl`;
  } else {
    const years = Math.floor(diffMs / year);
    return `${years} il əvvəl`;
  }
}

/**
 * Percentage formatlar: 85%
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
}

/**
 * Müddəti formatlar: "30 gün"
 */
export function formatDuration(days: number): string {
  if (days === 1) return '1 gün';
  if (days < 30) return `${days} gün`;
  if (days === 30) return '1 ay';
  
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  
  if (remainingDays === 0) {
    return `${months} ay`;
  } else {
    return `${months} ay ${remainingDays} gün`;
  }
}
