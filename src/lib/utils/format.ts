/**
 * Formatting utility functions with type safety
 */

/**
 * Formats a number with locale-specific formatting
 */
export function formatNumber(
  num: number,
  options: Intl.NumberFormatOptions = {},
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(
  num: number,
  decimals = 2,
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formats a number with compact notation (1K, 1M, etc.)
 */
export function formatCompactNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Formats a phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  format: 'US' | 'international' = 'US'
): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (format === 'US' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (format === 'international' && cleaned.length >= 10) {
    const countryCode = cleaned.slice(0, -10);
    const areaCode = cleaned.slice(-10, -7);
    const exchange = cleaned.slice(-7, -4);
    const number = cleaned.slice(-4);

    return countryCode
      ? `+${countryCode} (${areaCode}) ${exchange}-${number}`
      : `(${areaCode}) ${exchange}-${number}`;
  }

  return phoneNumber;
}

/**
 * Formats a credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19); // Max 16 digits + 3 spaces
}

/**
 * Masks sensitive information
 */
export function maskString(
  str: string,
  visibleStart = 4,
  visibleEnd = 4,
  maskChar = '*'
): string {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskLength = str.length - visibleStart - visibleEnd;
  const mask = maskChar.repeat(maskLength);

  return start + mask + end;
}

/**
 * Formats a duration in milliseconds to human-readable format
 */
export function formatDuration(
  ms: number,
  format: 'short' | 'long' = 'short'
): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (format === 'short') {
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours % 24 > 0)
    parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`);
  if (minutes % 60 > 0)
    parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0)
    parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);

  return parts.join(', ');
}

/**
 * Formats bytes per second to human-readable format
 */
export function formatBandwidth(bytesPerSecond: number): string {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Formats a list of items with proper grammar
 */
export function formatList(
  items: string[],
  conjunction: 'and' | 'or' = 'and'
): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1]!;
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
}

/**
 * Formats a range of numbers
 */
export function formatRange(
  start: number,
  end: number,
  separator = '–'
): string {
  return `${start}${separator}${end}`;
}

/**
 * Formats initials from a full name
 */
export function formatInitials(
  firstName: string,
  lastName?: string,
  maxLength = 2
): string {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map(name => name!.charAt(0).toUpperCase())
    .slice(0, maxLength);

  return initials.join('');
}

/**
 * Formats a URL to display format (removes protocol, www, etc.)
 */
export function formatDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;

    // Remove www. prefix
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    // Add path if it's not just '/'
    const path = urlObj.pathname !== '/' ? urlObj.pathname : '';

    return hostname + path;
  } catch {
    return url;
  }
}

/**
 * Formats a hex color to RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : null;
}

/**
 * Formats RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}