/**
 * Utility functions with improved type safety and reusability
 */

// Re-export existing utilities
export { cn } from '../utils';
export { debounce } from '../utils';

// Export all functions from modules, resolving naming conflicts
export * from './async';
export * from './dom';
export * from './format';
export * from './string';

// Export date functions
export {
  formatDate as formatDateString,
  formatDateISO,
  getRelativeTime,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfDay,
  endOfDay,
  addDays,
  subtractDays,
  daysDifference,
  isValidDate as isValidDateObject,
  parseDate,
} from './date';

// Export validation functions
export {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isValidCreditCard,
  validatePasswordStrength,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isInRange,
  matchesPattern,
  isValidDate as isValidDateInput,
  isFutureDate,
  isPastDate,
  isValidNumber,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isAlphabetic,
  isAlphanumeric,
  isValidHexColor,
  isValidSlug,
  hasUniqueValues,
  hasRequiredProperties,
  createValidator,
  validateFormData,
  sanitizeString,
  validateAndSanitize,
} from './validation';

// Export array functions
export {
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  chunk,
  flatten,
  intersection,
  difference,
  shuffle,
  sample,
  isEmpty as isArrayEmpty,
  first,
  last,
  partition,
} from './array';

// Export object functions with aliases for conflicts
export {
  deepClone,
  isEmpty as isObjectEmpty,
  pick,
  omit,
  get,
  set,
  has,
  deepMerge,
  flatten as flattenObject,
  unflatten,
  transformKeys,
  filterObject,
  mapValues,
  invert,
  isEqual,
} from './object';
