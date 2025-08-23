/**
 * Sorting-related constants
 * Dropdown options and labels for sorting functionality
 */

import type { DropdownOption } from '@/components/ui/common';

// Sort dropdown options
export const SORT_DROPDOWN_OPTIONS: DropdownOption[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
] as const;

// Sort option parsing helpers
export const SORT_VALUE_SEPARATOR = '-';

// Sort labels
export const SORT_LABELS = {
  NEWEST_FIRST: 'Newest First',
  OLDEST_FIRST: 'Oldest First',
  TITLE_A_TO_Z: 'Title A-Z',
  TITLE_Z_TO_A: 'Title Z-A',
  SORT_BY_PLACEHOLDER: 'Sort by',
} as const;

// Helper function to create sort value
export const createSortValue = (sortBy: string, sortOrder: string): string => {
  return `${sortBy}${SORT_VALUE_SEPARATOR}${sortOrder}`;
};

// Helper function to parse sort value
export const parseSortValue = (
  value: string
): { sortBy: string; sortOrder: string } => {
  const [sortBy, sortOrder] = value.split(SORT_VALUE_SEPARATOR);
  return {
    sortBy: sortBy || 'date',
    sortOrder: sortOrder || 'desc',
  };
};
