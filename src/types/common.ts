/**
 * Common TypeScript interfaces and types used across the application
 */

/**
 * Generic API response interface
 */
export interface ApiResponse<T = unknown> {
  /** Response data */
  data: T;
  /** Success status */
  success: boolean;
  /** Error message (if any) */
  message?: string;
  /** Additional metadata */
  meta?: Record<string, unknown>;
}

/**
 * Generic error interface
 */
export interface AppError {
  /** Error message */
  message: string;
  /** Error code for programmatic handling */
  code: string;
  /** HTTP status code (if applicable) */
  status?: number;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Loading state interface
 */
export interface LoadingState {
  /** Whether currently loading */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Loading progress (0-100) */
  progress?: number;
}

/**
 * Generic form field interface
 */
export interface FormField<T = string> {
  /** Field value */
  value: T;
  /** Field error message */
  error?: string;
  /** Whether field has been touched */
  touched: boolean;
  /** Whether field is valid */
  isValid: boolean;
}

/**
 * Generic form state interface
 */
export interface FormState<T extends Record<string, unknown>> {
  /** Form field values */
  values: T;
  /** Form field errors */
  errors: Partial<Record<keyof T, string>>;
  /** Form field touched state */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether form is valid */
  isValid: boolean;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Whether form has been submitted */
  isSubmitted: boolean;
}

/**
 * Generic sort configuration
 */
export interface SortConfig<T extends string = string> {
  /** Field to sort by */
  field: T;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Generic filter configuration
 */
export interface FilterConfig<T = unknown> {
  /** Filter field */
  field: string;
  /** Filter operator */
  operator:
    | 'equals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte';
  /** Filter value */
  value: T;
}

/**
 * Generic search configuration
 */
export interface SearchConfig {
  /** Search query */
  query: string;
  /** Fields to search in */
  fields?: string[];
  /** Case sensitive search */
  caseSensitive?: boolean;
  /** Exact match */
  exactMatch?: boolean;
}

/**
 * Generic validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings?: string[];
}

/**
 * Generic option interface for dropdowns, selects, etc.
 */
export interface Option<T = string> {
  /** Option label (displayed to user) */
  label: string;
  /** Option value (used programmatically) */
  value: T;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Additional option data */
  data?: Record<string, unknown>;
}

/**
 * Generic menu item interface
 */
export interface MenuItem {
  /** Menu item label */
  label: string;
  /** Menu item URL or action */
  href?: string;
  /** Menu item icon */
  icon?: string;
  /** Whether item is active */
  active?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Submenu items */
  children?: MenuItem[];
}

/**
 * Generic breadcrumb item interface
 */
export interface BreadcrumbItem {
  /** Breadcrumb label */
  label: string;
  /** Breadcrumb URL */
  href?: string;
  /** Whether this is the current page */
  current?: boolean;
}

/**
 * Generic notification interface
 */
export interface Notification {
  /** Unique notification ID */
  id: string;
  /** Notification title */
  title: string;
  /** Notification message */
  message?: string;
  /** Notification type */
  type: 'success' | 'error' | 'warning' | 'info';
  /** Auto-dismiss timeout (ms) */
  timeout?: number;
  /** Whether notification is dismissible */
  dismissible?: boolean;
  /** Notification actions */
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

/**
 * Generic modal configuration
 */
export interface ModalConfig {
  /** Modal title */
  title: string;
  /** Modal content */
  content?: string;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether modal is closable */
  closable?: boolean;
  /** Whether to show backdrop */
  backdrop?: boolean;
  /** Modal actions */
  actions?: Array<{
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    action: () => void;
  }>;
}

/**
 * Generic table column configuration
 */
export interface TableColumn<T = unknown> {
  /** Column key */
  key: string;
  /** Column header label */
  label: string;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: string | number;
  /** Cell renderer function */
  render?: (value: unknown, row: T) => React.ReactNode;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
}

/**
 * Generic theme interface
 */
export interface Theme {
  /** Theme name */
  name: string;
  /** Color palette */
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
  };
  /** Typography settings */
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
  };
  /** Spacing scale */
  spacing: Record<string, string>;
  /** Border radius scale */
  borderRadius: Record<string, string>;
}
