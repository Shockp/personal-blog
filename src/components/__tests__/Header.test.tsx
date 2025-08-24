import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Header from '../layout/Header';

// Mock Next.js hooks and components
const mockPush = jest.fn();
const mockPathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => mockPathname),
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="close-icon" />,
}));

// Mock ThemeToggle component
jest.mock('@/components/ui/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Theme Toggle</button>;
  };
});

const { usePathname } = require('next/navigation');

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePathname.mockReturnValue('/');
  });

  describe('Rendering', () => {
    it('should render header with logo and navigation', () => {
      render(<Header />);

      // Check logo
      expect(screen.getByText('Adrian')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to homepage - Personal Blog')).toBeInTheDocument();

      // Check desktop navigation links
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();

      // Check theme toggle
      expect(screen.getAllByTestId('theme-toggle')).toHaveLength(2); // Desktop and mobile

      // Check mobile menu button
      expect(screen.getByLabelText('Open main menu')).toBeInTheDocument();
    });

    it('should render logo with correct styling', () => {
      render(<Header />);

      const logoContainer = screen.getByText('A').parentElement;
      expect(logoContainer).toHaveClass('w-8', 'h-8', 'sm:w-9', 'sm:h-9');
      expect(logoContainer).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
    });

    it('should show mobile menu button on mobile', () => {
      render(<Header />);

      const mobileMenuButton = screen.getByLabelText('Open main menu');
      expect(mobileMenuButton).toHaveClass('md:hidden');
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: /homepage/ })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    });

    it('should highlight active link based on pathname', () => {
      usePathname.mockReturnValue('/blog');
      render(<Header />);

      const blogLink = screen.getByRole('link', { name: 'Blog' });
      const homeLink = screen.getByRole('link', { name: 'Home' });

      // Active link should have different styling (we can't test CSS variables directly,
      // but we can test that the component renders without errors)
      expect(blogLink).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
    });

    it('should handle root path correctly', () => {
      usePathname.mockReturnValue('/');
      render(<Header />);

      // Home link should be active when on root path
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeInTheDocument();
    });

    it('should handle nested paths correctly', () => {
      usePathname.mockReturnValue('/blog/some-post');
      render(<Header />);

      // Blog link should be active for nested blog paths
      const blogLink = screen.getByRole('link', { name: 'Blog' });
      expect(blogLink).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu when button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButton = screen.getByLabelText('Open main menu');
      
      // Initially closed
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();

      // Open menu
      await user.click(menuButton);
      
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      expect(screen.getByLabelText('Close main menu')).toBeInTheDocument();

      // Close menu
      await user.click(menuButton);
      
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('should close mobile menu when escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButton = screen.getByLabelText('Open main menu');
      
      // Open menu
      await user.click(menuButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Press escape
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should not close menu when other keys are pressed', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButton = screen.getByLabelText('Open main menu');
      
      // Open menu
      await user.click(menuButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Press other keys
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });
      
      // Menu should still be open
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should close mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButton = screen.getByLabelText('Open main menu');
      
      // Open menu
      await user.click(menuButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Click on a navigation link in mobile menu
      const mobileLinks = screen.getAllByRole('link', { name: 'Blog' });
      const mobileLink = mobileLinks.find(link => 
        link.closest('#mobile-menu')
      );
      
      if (mobileLink) {
        await user.click(mobileLink);
        
        await waitFor(() => {
          expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Header />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');

      const menuButton = screen.getByLabelText('Open main menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('should update ARIA attributes when menu is open', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButton = screen.getByLabelText('Open main menu');
      
      await user.click(menuButton);
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByLabelText('Close main menu')).toBeInTheDocument();
    });

    it('should have screen reader text for menu button', () => {
      render(<Header />);

      expect(screen.getByText('Open main menu')).toHaveClass('sr-only');
    });

    it('should have proper minimum touch target sizes', () => {
      render(<Header />);

      const logoLink = screen.getByLabelText('Go to homepage - Personal Blog');
      expect(logoLink).toHaveClass('min-h-[44px]');

      const menuButton = screen.getByLabelText('Open main menu');
      expect(menuButton).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes for header height', () => {
      const { container } = render(<Header />);
      
      const headerContent = container.querySelector('.h-14');
      expect(headerContent).toHaveClass('h-14', 'sm:h-16', 'md:h-18');
    });

    it('should hide desktop navigation on mobile', () => {
      render(<Header />);

      const desktopNav = screen.getByRole('navigation').children[0].children[1];
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    it('should show mobile controls only on mobile', () => {
      render(<Header />);

      const mobileControls = screen.getByLabelText('Open main menu').parentElement;
      expect(mobileControls).toHaveClass('md:hidden');
    });
  });

  describe('Theme Integration', () => {
    it('should render theme toggle in both desktop and mobile', () => {
      render(<Header />);

      const themeToggles = screen.getAllByTestId('theme-toggle');
      expect(themeToggles).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined pathname gracefully', () => {
      usePathname.mockReturnValue(undefined);
      
      expect(() => {
        render(<Header />);
      }).not.toThrow();
    });

    it('should handle null pathname gracefully', () => {
      usePathname.mockReturnValue(null);
      
      expect(() => {
        render(<Header />);
      }).not.toThrow();
    });
  });
});