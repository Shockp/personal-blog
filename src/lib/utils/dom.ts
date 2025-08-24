/**
 * DOM utility functions with type safety
 */

/**
 * Checks if code is running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safely gets an element by ID
 */
export function getElementById<T extends HTMLElement = HTMLElement>(
  id: string
): T | null {
  if (!isBrowser()) return null;
  return document.getElementById(id) as T | null;
}

/**
 * Safely queries a single element
 */
export function querySelector<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T | null {
  if (!isBrowser()) return null;
  return parent.querySelector<T>(selector);
}

/**
 * Safely queries multiple elements
 */
export function querySelectorAll<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T[] {
  if (!isBrowser()) return [];
  return Array.from(parent.querySelectorAll<T>(selector));
}

/**
 * Adds event listener with automatic cleanup
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Window | Document,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  if (!isBrowser()) return () => {};

  element.addEventListener(type, listener as EventListener, options);

  return () => {
    element.removeEventListener(type, listener as EventListener, options);
  };
}

/**
 * Gets element dimensions
 */
export function getElementDimensions(element: HTMLElement): {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
} {
  if (!isBrowser()) {
    return { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
  }

  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
}

/**
 * Gets viewport dimensions
 */
export function getViewportDimensions(): {
  width: number;
  height: number;
} {
  if (!isBrowser()) {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Checks if element is in viewport
 */
export function isElementInViewport(
  element: HTMLElement,
  threshold = 0
): boolean {
  if (!isBrowser()) return false;

  const rect = element.getBoundingClientRect();
  const viewport = getViewportDimensions();

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= viewport.height + threshold &&
    rect.right <= viewport.width + threshold
  );
}

/**
 * Scrolls element into view smoothly
 */
export function scrollIntoView(
  element: HTMLElement,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }
): void {
  if (!isBrowser()) return;
  element.scrollIntoView(options);
}

/**
 * Gets scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  if (!isBrowser()) return { x: 0, y: 0 };

  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Sets scroll position
 */
export function setScrollPosition(x: number, y: number, smooth = false): void {
  if (!isBrowser()) return;

  if (smooth) {
    window.scrollTo({ left: x, top: y, behavior: 'smooth' });
  } else {
    window.scrollTo(x, y);
  }
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch {
    return false;
  }
}

/**
 * Gets computed style property
 */
export function getComputedStyleProperty(
  element: HTMLElement,
  property: string
): string {
  if (!isBrowser()) return '';
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Checks if element has class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Adds class to element
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

/**
 * Removes class from element
 */
export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

/**
 * Toggles class on element
 */
export function toggleClass(
  element: HTMLElement,
  className: string,
  force?: boolean
): boolean {
  return element.classList.toggle(className, force);
}

/**
 * Creates a DOM element with attributes
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: Partial<HTMLElementTagNameMap[K]> = {},
  children: (Node | string)[] = []
): HTMLElementTagNameMap[K] {
  if (!isBrowser()) {
    return {} as HTMLElementTagNameMap[K];
  }

  const element = document.createElement(tagName);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value as string;
    } else if (key === 'textContent') {
      element.textContent = value as string;
    } else if (key === 'innerHTML') {
      element.innerHTML = value as string;
    } else {
      (element as Record<string, unknown>)[key] = value;
    }
  });

  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Removes element from DOM
 */
export function removeElement(element: HTMLElement): void {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(
  container: HTMLElement = document.body
): HTMLElement[] {
  if (!isBrowser()) return [];

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return querySelectorAll<HTMLElement>(focusableSelectors, container).filter(
    element => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
      );
    }
  );
}

/**
 * Traps focus within a container
 */
export function trapFocus(container: HTMLElement): () => void {
  if (!isBrowser()) return () => {};

  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Detects if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detects if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (!isBrowser()) return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Gets device pixel ratio
 */
export function getDevicePixelRatio(): number {
  if (!isBrowser()) return 1;

  return window.devicePixelRatio || 1;
}

/**
 * Checks if device supports touch
 */
export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as Record<string, unknown>)
      .msMaxTouchPoints as number) > 0
  );
}

/**
 * Debounced resize observer
 */
export function observeResize(
  element: HTMLElement,
  callback: (entry: ResizeObserverEntry) => void,
  debounceMs = 100
): () => void {
  if (!isBrowser() || !window.ResizeObserver) {
    return () => {};
  }

  let timeoutId: NodeJS.Timeout;

  const debouncedCallback = (entries: ResizeObserverEntry[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      entries.forEach(callback);
    }, debounceMs);
  };

  const observer = new ResizeObserver(debouncedCallback);
  observer.observe(element);

  return () => {
    clearTimeout(timeoutId);
    observer.disconnect();
  };
}
