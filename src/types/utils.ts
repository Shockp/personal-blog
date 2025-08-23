/**
 * Utility TypeScript types for enhanced type safety
 */

/**
 * Makes specified properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specified properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Makes all properties optional except specified ones
 */
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Creates a type with only specified properties
 */
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Creates a type without specified property types
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Makes properties nullable
 */
export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

/**
 * Makes properties non-nullable
 */
export type NonNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Deep required type
 */
export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/**
 * Mutable type (opposite of readonly)
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Deep mutable type
 */
export type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

/**
 * Flatten nested object types
 */
export type Flatten<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

/**
 * Union to intersection type
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Get function parameters as object
 */
export type FunctionParams<T extends (...args: unknown[]) => unknown> =
  Parameters<T>;

/**
 * Get function return type
 */
export type FunctionReturn<T extends (...args: unknown[]) => unknown> =
  ReturnType<T>;

/**
 * Extract promise type
 */
export type PromiseType<T extends Promise<unknown>> =
  T extends Promise<infer U> ? U : never;

/**
 * Array element type
 */
export type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer U)[] ? U : never;

/**
 * Object values type
 */
export type ValueOf<T extends Record<PropertyKey, unknown>> = T[keyof T];

/**
 * Object keys as union type
 */
export type KeysOf<T extends Record<PropertyKey, unknown>> = keyof T;

/**
 * Strict extract (no never)
 */
export type StrictExtract<T, U extends T> = T extends U ? T : never;

/**
 * Strict exclude (no never)
 */
export type StrictExclude<T, U extends T> = T extends U ? never : T;

/**
 * Conditional type helper
 */
export type If<C extends boolean, T, F> = C extends true ? T : F;

/**
 * Check if type is any
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Check if type is never
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Check if type is unknown
 */
export type IsUnknown<T> =
  IsAny<T> extends true ? false : unknown extends T ? true : false;

/**
 * Check if two types are equal
 */
export type IsEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

/**
 * Brand type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Opaque type for nominal typing
 */
export type Opaque<T, K> = T & { readonly __opaque__: K };

/**
 * Tuple to union type
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];

/**
 * Union to tuple type (limited)
 */
export type UnionToTuple<T> =
  UnionToIntersection<T extends unknown ? (t: T) => T : never> extends (
    _: unknown
  ) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];

/**
 * String literal utilities
 */
export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];

export type Join<T extends string[], D extends string> = T extends []
  ? ''
  : T extends [string]
    ? T[0]
    : T extends [string, ...infer U]
      ? U extends string[]
        ? `${T[0]}${D}${Join<U, D>}`
        : never
      : string;

export type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
    ? Trim<T>
    : S;

export type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

export type Uncapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : S;

/**
 * Number utilities
 */
export type IsPositive<N extends number> = `${N}` extends `-${string}`
  ? false
  : true;

export type IsNegative<N extends number> = `${N}` extends `-${string}`
  ? true
  : false;

export type IsZero<N extends number> = N extends 0 ? true : false;

/**
 * Object path utilities
 */
export type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends ArrayLike<unknown>
      ? K | `${K}.${Path<T[K], Exclude<keyof T[K], keyof unknown[]>>}`
      : K | `${K}.${Path<T[K], keyof T[K]>}`
    : K
  : never;

export type PathValue<
  T,
  P extends Path<T>,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Utility for creating discriminated unions
 */
export type DiscriminatedUnion<T, K extends keyof T> = T extends unknown
  ? { [P in K]: T[P] } & T
  : never;

/**
 * Utility for creating tagged unions
 */
export type Tagged<
  T extends Record<string, unknown>,
  Tag extends string,
> = T & {
  readonly _tag: Tag;
};

/**
 * Utility for extracting tag from tagged union
 */
export type ExtractTag<T> = T extends { readonly _tag: infer U } ? U : never;

/**
 * Utility for matching tagged unions
 */
export type Match<
  T extends { _tag: string },
  P extends Record<T['_tag'], unknown>,
> = {
  [K in T['_tag']]: (value: Extract<T, { _tag: K }>) => P[K];
};

/**
 * Utility for creating state machines
 */
export type StateMachine<
  S extends string,
  E extends Record<string, unknown>,
> = Record<S, Partial<Record<keyof E, S>>>;

/**
 * Utility for creating event handlers
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Utility for creating async event handlers
 */
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

/**
 * Utility for creating callback functions
 */
export type Callback<T = unknown> = (value: T) => void;

/**
 * Utility for creating async callback functions
 */
export type AsyncCallback<T = unknown> = (value: T) => Promise<void>;

/**
 * Utility for creating predicate functions
 */
export type Predicate<T = unknown> = (value: T) => boolean;

/**
 * Utility for creating async predicate functions
 */
export type AsyncPredicate<T = unknown> = (value: T) => Promise<boolean>;

/**
 * Utility for creating transformer functions
 */
export type Transformer<T = unknown, U = unknown> = (value: T) => U;

/**
 * Utility for creating async transformer functions
 */
export type AsyncTransformer<T = unknown, U = unknown> = (
  value: T
) => Promise<U>;

/**
 * Utility for creating comparator functions
 */
export type Comparator<T = unknown> = (a: T, b: T) => number;

/**
 * Utility for creating serializer functions
 */
export type Serializer<T = unknown> = {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
};

/**
 * Utility for creating validator functions
 */
export type Validator<T = unknown> = {
  validate: (value: unknown) => value is T;
  parse: (value: unknown) => T | null;
};

/**
 * Utility for creating builder pattern
 */
export type Builder<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => Builder<T>;
} & {
  build: () => T;
};

/**
 * Utility for creating fluent interface
 */
export type Fluent<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown
    ? (...args: Parameters<T[K]>) => Fluent<T>
    : T[K];
};

/**
 * Utility for creating immutable updates
 */
export type Updater<T> = (current: T) => T;

/**
 * Utility for creating lens-like operations
 */
export type Lens<S, A> = {
  get: (s: S) => A;
  set: (a: A) => (s: S) => S;
};

/**
 * Utility for creating option types
 */
export type Option<T> = Some<T> | None;

export type Some<T> = {
  readonly _tag: 'Some';
  readonly value: T;
};

export type None = {
  readonly _tag: 'None';
};

/**
 * Utility for creating result types
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;

export type Ok<T> = {
  readonly _tag: 'Ok';
  readonly value: T;
};

export type Err<E> = {
  readonly _tag: 'Err';
  readonly error: E;
};

/**
 * Utility for creating either types
 */
export type Either<L, R> = Left<L> | Right<R>;

export type Left<L> = {
  readonly _tag: 'Left';
  readonly left: L;
};

export type Right<R> = {
  readonly _tag: 'Right';
  readonly right: R;
};