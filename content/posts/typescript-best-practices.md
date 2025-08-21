---
title: 'TypeScript Best Practices: Writing Better Code in 2024'
description: 'Master TypeScript with these essential best practices covering type safety, code organization, performance, and maintainability for modern applications.'
date: '2024-01-12'
tags: ['typescript', 'best-practices', 'javascript', 'web-development']
---

# TypeScript Best Practices: Writing Better Code in 2024

TypeScript has revolutionized JavaScript development by adding static type checking and modern language features. Here are the essential best practices every TypeScript developer should follow to write robust, maintainable code.

## Configuration Best Practices

### Strict Mode Configuration

Always enable strict mode in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Path Mapping

Use path mapping for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

## Type Definition Best Practices

### Prefer Interfaces Over Type Aliases

For object shapes, use interfaces as they're more extensible:

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use type aliases for unions, primitives, and computed types
type Status = 'loading' | 'success' | 'error';
type UserKeys = keyof User;
```

### Use Discriminated Unions for State Management

```typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState = {
  status: 'success';
  data: User[];
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AppState = LoadingState | SuccessState | ErrorState;

// TypeScript can now narrow types automatically
function handleState(state: AppState) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Loaded ${state.data.length} users`; // data is available
    case 'error':
      return `Error: ${state.error}`; // error is available
  }
}
```

## Generic Best Practices

### Use Meaningful Generic Names

```typescript
// Bad
function map<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

// Good
function mapArray<TInput, TOutput>(
  items: TInput[],
  transform: (item: TInput) => TOutput
): TOutput[] {
  return items.map(transform);
}
```

### Constrain Generics When Possible

```typescript
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(
  entities: T[],
  id: string,
  updates: Partial<T>
): T[] {
  return entities.map(entity =>
    entity.id === id ? { ...entity, ...updates } : entity
  );
}
```

## Error Handling Best Practices

### Use Result Types for Better Error Handling

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await fetchUser('123');
if (result.success) {
  console.log(result.data.name); // Type-safe access
} else {
  console.error(result.error.message);
}
```

## Performance and Bundle Size

### Use Type-Only Imports

```typescript
// Good - doesn't include the module in the bundle
import type { User } from './types';
import type { ComponentProps } from 'react';

// Only import what you need at runtime
import { validateEmail } from './utils';
```

### Prefer const Assertions

```typescript
// Good - creates readonly tuple type
const colors = ['red', 'green', 'blue'] as const;
type Color = (typeof colors)[number]; // 'red' | 'green' | 'blue'

// Good - creates readonly object type
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;
```

## Code Organization

### Barrel Exports

Use index files to create clean import paths:

```typescript
// src/components/index.ts
export { Button } from './Button';
export { Modal } from './Modal';
export { Input } from './Input';

// Usage
import { Button, Modal, Input } from '@/components';
```

### Separate Types from Implementation

```typescript
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

// services/userService.ts
import type { User, CreateUserRequest } from '@/types/user';

export class UserService {
  async createUser(request: CreateUserRequest): Promise<User> {
    // implementation
  }
}
```

## Testing Best Practices

### Type Your Test Data

```typescript
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

// Use factory functions for test data
function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    ...overrides,
  };
}
```

## Common Pitfalls to Avoid

1. **Don't use `any`** - Use `unknown` instead and narrow the type
2. **Don't ignore TypeScript errors** - Fix them or use proper type assertions
3. **Don't over-engineer types** - Keep them simple and focused
4. **Don't forget about runtime validation** - TypeScript types are compile-time only

## Conclusion

Following these TypeScript best practices will help you:

- Write more maintainable and bug-free code
- Improve developer experience with better IDE support
- Create more robust applications with compile-time safety
- Build scalable codebases that grow with your team

Remember, TypeScript is a tool to help you write better JavaScript. Embrace its features, but don't let perfect typing prevent you from shipping great software!

---

_Want to learn more about TypeScript? Check out my other posts on advanced TypeScript patterns and React with TypeScript best practices._
