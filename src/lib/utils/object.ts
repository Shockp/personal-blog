/**
 * Object utility functions with type safety
 */

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as Record<string, unknown>)[key] = deepClone(
        (obj as Record<string, unknown>)[key]
      );
    });
    return cloned;
  }
  return obj;
}

/**
 * Checks if an object is empty
 */
export function isEmpty(obj: object): boolean {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj } as Omit<T, K>;
  keys.forEach(key => {
    delete (result as Record<string, unknown>)[key as string];
  });
  return result;
}

/**
 * Gets a nested property value safely
 */
export function get<T = unknown>(
  obj: unknown,
  path: string | string[],
  defaultValue?: T
): T {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;

  for (const key of keys) {
    if (
      result === null ||
      result === undefined ||
      typeof result !== 'object' ||
      !(key in result)
    ) {
      return defaultValue as T;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result as T;
}

/**
 * Sets a nested property value
 */
export function set<T extends object>(
  obj: T,
  path: string | string[],
  value: unknown
): T {
  const keys = Array.isArray(path) ? path : path.split('.');
  const result = deepClone(obj);
  let current = result as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]!] = value;
  return result;
}

/**
 * Checks if an object has a nested property
 */
export function has(obj: unknown, path: string | string[]): boolean {
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;

  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object' ||
      !(key in current)
    ) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return true;
}

/**
 * Merges multiple objects deeply
 */
export function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const result = {} as T;

  for (const obj of objects) {
    if (!obj) continue;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          (result as Record<string, unknown>)[key] = deepMerge(
            (result as Record<string, unknown>)[key] || {},
            value as Record<string, unknown>
          );
        } else {
          (result as Record<string, unknown>)[key] = value;
        }
      }
    }
  }

  return result;
}

/**
 * Flattens a nested object
 */
export function flatten(
  obj: object,
  prefix = '',
  separator = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey, separator));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Unflattens a flattened object
 */
export function unflatten(
  obj: Record<string, unknown>,
  separator = '.'
): object {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split(separator);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]!;
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]!] = value;
  }

  return result;
}

/**
 * Transforms object keys
 */
export function transformKeys<T extends object>(
  obj: T,
  transformer: (key: string) => string
): unknown {
  if (Array.isArray(obj)) {
    return obj.map(item =>
      typeof item === 'object' && item !== null
        ? transformKeys(item, transformer)
        : item
    );
  }

  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = transformer(key);
      result[newKey] =
        typeof value === 'object' && value !== null
          ? transformKeys(value, transformer)
          : value;
    }

    return result;
  }

  return obj;
}

/**
 * Filters object properties
 */
export function filterObject<T extends object>(
  obj: T,
  predicate: (key: string, value: unknown) => boolean
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (predicate(key, value)) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}

/**
 * Maps object values
 */
export function mapValues<T extends object, U>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;

  for (const [key, value] of Object.entries(obj)) {
    result[key as keyof T] = mapper(value, key as keyof T);
  }

  return result;
}

/**
 * Inverts an object (swaps keys and values)
 */
export function invert<T extends Record<string | number, string | number>>(
  obj: T
): Record<T[keyof T], keyof T> {
  const result = {} as Record<T[keyof T], keyof T>;

  for (const [key, value] of Object.entries(obj)) {
    result[value as T[keyof T]] = key as keyof T;
  }

  return result;
}

/**
 * Compares two objects for deep equality
 */
export function isEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return obj1 === obj2;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (
      !isEqual(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key]
      )
    )
      return false;
  }

  return true;
}
