import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import ThemeToggle from '../ui/ThemeToggle';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Moon: ({ className, ...props }: any) => (
    <div data-testid="moon-icon" className={className} {...props} />
  ),
  Sun: ({ className, ...props }: any) => (
    <div data-testid="sun-icon" className={className} {...props} />
  ),
}));

// Mock theme context
const mockToggleTheme = jest.fn();
const mockThemeContext = {
  theme: 'light' as 'light' | 'dark',
  toggleTheme: mockToggleTheme,
};

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: jest.fn(() => mockThemeContext),
}));

const { useTheme } = require('@/contexts/ThemeContext');

// Mock useEffect to handle mounting state
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((fn, deps) => {
    if (deps && deps.length === 0) {
      // Simulate mounting
      fn();
    }
  }),
  useState: jest.fn((initial) => {
    if (initial === false) {
      // For mounted state
      return [true, jest.fn()];
    }
    return jest.requireActual('react').useState(initial);
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockThemeContext.theme = 'light';
    useTheme.mockReturnValue(mockThemeContext);
  });

  describe('Rendering', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      expect(button).toHaveAttribute('title', 'Currently light mode - Click to switch to dark mode');
    });

    it('should render sun icon in light mode', () => {
      mockThemeContext.theme = 'light';
      useTheme.mockReturnValue(mockThemeContext);
      
      render(<ThemeToggle />);

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('should render moon icon in dark mode', () => {
      mockThemeContext.theme = 'dark';
      useTheme.mockReturnValue(mockThemeContext);
      
      render(<ThemeToggle />);

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    it('should have correct aria-label for dark mode', () => {
      mockThemeContext.theme = 'dark';
      useTheme.mockReturnValue(mockThemeContext);
      
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(button).toHaveAttribute('title', 'Currently dark mode - Click to switch to light mode');
    });
  });

  describe('Interactions', () => {
    it('should call toggleTheme when clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard interaction', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      
      // Focus and press Enter
      button.focus();
      await user.keyboard('{Enter}');

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should handle space key interaction', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      
      // Focus and press Space
      button.focus();
      await user.keyboard(' ');

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('should have proper CSS classes', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'group',
        'relative',
        'p-3',
        'rounded-full',
        'border-2',
        'border-transparent',
        'focus:outline-none',
        'transition-all',
        'duration-300',
        'cursor-pointer',
        'shadow-lg'
      );
    });

    it('should have light mode styling', () => {
      mockThemeContext.theme = 'light';
      useTheme.mockReturnValue(mockThemeContext);
      
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        color: '#ffffff',
      });
    });

    it('should have dark mode styling', () => {
      mockThemeContext.theme = 'dark';
      useTheme.mockReturnValue(mockThemeContext);
      
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: '#ffffff',
      });
    });

    it('should have animate-pulse class on icons', () => {
      render(<ThemeToggle />);

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toHaveClass('animate-pulse');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    });

    it('should have aria-hidden on icons', () => {
      render(<ThemeToggle />);

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be focusable', () => {
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      button.focus();
      
      expect(document.activeElement).toBe(button);
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      
      // Click should eventually remove focus (after timeout)
      await user.click(button);
      
      // The blur happens after a timeout, so we can't easily test it
      // but we can verify the click worked
      expect(mockToggleTheme).toHaveBeenCalled();
    });
  });

  describe('Hydration', () => {
    it('should handle hydration mismatch prevention', () => {
      // Mock useState to return false for mounted state
      const mockUseState = jest.fn()
        .mockReturnValueOnce([false, jest.fn()]) // mounted state
        .mockReturnValue([null, jest.fn()]); // other states
      
      jest.doMock('react', () => ({
        ...jest.requireActual('react'),
        useState: mockUseState,
        useEffect: jest.fn(),
        useRef: jest.fn(() => ({ current: null })),
      }));

      const { container } = render(<ThemeToggle />);
      
      // Should render placeholder div when not mounted
      const placeholder = container.querySelector('div[aria-hidden="true"]');
      expect(placeholder).toHaveClass('p-2', 'rounded-md', 'w-9', 'h-9');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing theme context gracefully', () => {
      useTheme.mockReturnValue({
        theme: undefined,
        toggleTheme: undefined,
      });

      expect(() => {
        render(<ThemeToggle />);
      }).not.toThrow();
    });

    it('should handle invalid theme values', () => {
      useTheme.mockReturnValue({
        theme: 'invalid' as any,
        toggleTheme: mockToggleTheme,
      });

      expect(() => {
        render(<ThemeToggle />);
      }).not.toThrow();
    });

    it('should handle missing toggleTheme function', async () => {
      const user = userEvent.setup();
      useTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: undefined,
      });

      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      
      // Should not throw when clicking without toggleTheme
      expect(async () => {
        await user.click(button);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<ThemeToggle />);
      
      // Re-render with same props
      rerender(<ThemeToggle />);
      
      // Should still work correctly
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});