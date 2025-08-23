/**
 * Main types export file
 * Centralized exports for all TypeScript interfaces and types
 */

// Blog-related types
export * from './blog';

// Common utility types
export * from './common';

// UI component types
export * from './ui';

// Advanced utility types
export * from './utils';

// Re-export commonly used types for convenience
export type {
  // Blog types
  BlogPost,
  BlogPostSummary,
  PostMetadata,
  BlogPostFrontmatter,
  TagWithCount,
  BlogStats,
  Pagination,
  PaginatedBlogPosts,
  BlogFilterOptions,
  SearchResult,
  BlogNavigation,
  TocEntry,
} from './blog';

export type {
  // Common types
  ApiResponse,
  AppError,
  LoadingState,
  FormField,
  FormState,
  SortConfig,
  FilterConfig,
  SearchConfig,
  ValidationResult,
  Option,
  MenuItem,
  BreadcrumbItem,
  Notification,
  ModalConfig,
  TableColumn,
  Theme,
} from './common';

export type {
  // UI types
  BaseComponentProps,
  DisableableProps,
  LoadableProps,
  ButtonVariant,
  ButtonSize,
  InputVariant,
  InputSize,
  ModalSize,
  ToastType,
  ToastPosition,
  ColorScheme,
  Breakpoint,
  ButtonProps,
  InputProps,
  SelectProps,
  ModalProps,
  Toast,
  ToastContextValue,
  DropdownProps,
  PaginationProps,
  EmptyStateProps,
  ThemeConfig,
  ResponsiveValue,
  StyleProps,
} from './ui';

export type {
  // Utility types
  PartialBy,
  RequiredBy,
  OptionalExcept,
  PickByType,
  OmitByType,
  Nullable,
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  Mutable,
  DeepMutable,
  Flatten,
  UnionToIntersection,
  FunctionParams,
  FunctionReturn,
  PromiseType,
  ArrayElement,
  ValueOf,
  KeysOf,
  Brand,
  Opaque,
  Path,
  PathValue,
  DiscriminatedUnion,
  Tagged,
  ExtractTag,
  Match,
  EventHandler,
  AsyncEventHandler,
  Callback,
  AsyncCallback,
  Predicate,
  AsyncPredicate,
  Transformer,
  AsyncTransformer,
  Comparator,
  Serializer,
  Validator,
  Builder,
  Fluent,
  Updater,
  Lens,
  Option as FunctionalOption,
  Some,
  None,
  Result,
  Ok,
  Err,
  Either,
  Left,
  Right,
} from './utils';
