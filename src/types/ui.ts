/**
 * UI-specific TypeScript interfaces
 */

/**
 * Base component props that all components can extend
 */
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

/**
 * Props for components that can be disabled
 */
export interface DisableableProps {
  disabled?: boolean;
}

/**
 * Props for components with loading states
 */
export interface LoadableProps {
  loading?: boolean;
  loadingText?: string;
}

/**
 * Button variant types
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Input variant types
 */
export type InputVariant = 'default' | 'filled' | 'outline';

/**
 * Input size types
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Modal size types
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position types
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Animation duration types
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow';

/**
 * Spacing scale types
 */
export type SpacingScale =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24;

/**
 * Color scheme types
 */
export type ColorScheme = 'light' | 'dark' | 'auto';

/**
 * Breakpoint types
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Icon props interface
 */
export interface IconProps extends BaseComponentProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

/**
 * Button props interface
 */
export interface ButtonProps
  extends BaseComponentProps,
    DisableableProps,
    LoadableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

/**
 * Input props interface
 */
export interface InputProps extends BaseComponentProps, DisableableProps {
  variant?: InputVariant;
  size?: InputSize;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

/**
 * Textarea props interface
 */
export interface TextareaProps extends BaseComponentProps, DisableableProps {
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

/**
 * Select option interface
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Select props interface
 */
export interface SelectProps<T = string>
  extends BaseComponentProps,
    DisableableProps {
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

/**
 * Modal props interface
 */
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  description?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

/**
 * Toast notification interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

/**
 * Toast context interface
 */
export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Dropdown item interface
 */
export interface DropdownItem {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

/**
 * Dropdown props interface
 */
export interface DropdownProps extends BaseComponentProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  offset?: number;
  closeOnItemClick?: boolean;
}

/**
 * Pagination props interface
 */
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  size?: ButtonSize;
}

/**
 * Empty state props interface
 */
export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

/**
 * Loading spinner props interface
 */
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: number;
  color?: string;
  thickness?: number;
}

/**
 * Avatar props interface
 */
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: number;
  fallback?: string;
  shape?: 'circle' | 'square';
}

/**
 * Badge props interface
 */
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Card props interface
 */
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: SpacingScale;
  children: React.ReactNode;
}

/**
 * Skeleton props interface
 */
export interface SkeletonProps extends BaseComponentProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Progress bar props interface
 */
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

/**
 * Accordion item interface
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

/**
 * Accordion props interface
 */
export interface AccordionProps extends BaseComponentProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

/**
 * Tab item interface
 */
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * Tabs props interface
 */
export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, string>;
  };
  spacing: Record<SpacingScale, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<Breakpoint, string>;
  animation: {
    duration: Record<AnimationDuration, string>;
    easing: Record<string, string>;
  };
}

/**
 * Responsive value type
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Style props interface for responsive design
 */
export interface StyleProps {
  margin?: ResponsiveValue<SpacingScale>;
  marginTop?: ResponsiveValue<SpacingScale>;
  marginRight?: ResponsiveValue<SpacingScale>;
  marginBottom?: ResponsiveValue<SpacingScale>;
  marginLeft?: ResponsiveValue<SpacingScale>;
  marginX?: ResponsiveValue<SpacingScale>;
  marginY?: ResponsiveValue<SpacingScale>;
  padding?: ResponsiveValue<SpacingScale>;
  paddingTop?: ResponsiveValue<SpacingScale>;
  paddingRight?: ResponsiveValue<SpacingScale>;
  paddingBottom?: ResponsiveValue<SpacingScale>;
  paddingLeft?: ResponsiveValue<SpacingScale>;
  paddingX?: ResponsiveValue<SpacingScale>;
  paddingY?: ResponsiveValue<SpacingScale>;
  width?: ResponsiveValue<string | number>;
  height?: ResponsiveValue<string | number>;
  minWidth?: ResponsiveValue<string | number>;
  minHeight?: ResponsiveValue<string | number>;
  maxWidth?: ResponsiveValue<string | number>;
  maxHeight?: ResponsiveValue<string | number>;
}
