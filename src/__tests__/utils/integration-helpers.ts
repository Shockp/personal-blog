import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockWindowSize, VIEWPORT_SIZES } from './test-utils';

// Navigation helpers
export const navigationHelpers = {
  async clickNavLink(linkName: string) {
    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: new RegExp(linkName, 'i') });
    await user.click(link);
    return link;
  },

  async navigateToHome() {
    return this.clickNavLink('home');
  },

  async navigateToBlog() {
    return this.clickNavLink('blog');
  },

  async navigateToAbout() {
    return this.clickNavLink('about');
  },

  async clickLogo() {
    const user = userEvent.setup();
    const logo = screen.getByLabelText(/homepage/i);
    await user.click(logo);
    return logo;
  },

  async openMobileMenu() {
    const user = userEvent.setup();
    const menuButton = screen.getByLabelText(/open.*menu/i);
    await user.click(menuButton);
    return menuButton;
  },

  async closeMobileMenu() {
    const user = userEvent.setup();
    const closeButton = screen.getByLabelText(/close.*menu/i);
    await user.click(closeButton);
    return closeButton;
  },
};

// Search and filtering helpers
export const searchHelpers = {
  async searchForPosts(query: string) {
    const user = userEvent.setup();
    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
    await user.clear(searchInput);
    await user.type(searchInput, query);
    return searchInput;
  },

  async clearSearch() {
    const user = userEvent.setup();
    const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
    await user.clear(searchInput);
    return searchInput;
  },

  async selectTag(tagName: string) {
    const user = userEvent.setup();
    const tag = screen.getByRole('button', { name: new RegExp(tagName, 'i') });
    await user.click(tag);
    return tag;
  },

  async selectSortOption(option: string) {
    const user = userEvent.setup();
    const sortSelect = screen.getByRole('combobox') || screen.getByLabelText(/sort/i);
    await user.selectOptions(sortSelect, option);
    return sortSelect;
  },

  async waitForSearchResults() {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  },
};

// Post interaction helpers
export const postHelpers = {
  async clickPostCard(postTitle: string) {
    const user = userEvent.setup();
    const postCard = screen.getByRole('article', { name: new RegExp(postTitle, 'i') }) ||
                    screen.getByText(postTitle).closest('article') ||
                    screen.getByText(postTitle);
    await user.click(postCard);
    return postCard;
  },

  async clickReadMore(postTitle?: string) {
    const user = userEvent.setup();
    let readMoreButton;
    
    if (postTitle) {
      const postCard = screen.getByText(postTitle).closest('article');
      readMoreButton = within(postCard!).getByRole('link', { name: /read more/i });
    } else {
      readMoreButton = screen.getByRole('link', { name: /read more/i });
    }
    
    await user.click(readMoreButton);
    return readMoreButton;
  },

  async waitForPostContent() {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  },

  getPostCards() {
    return screen.getAllByRole('article');
  },

  getPostTitles() {
    const articles = this.getPostCards();
    return articles.map(article => {
      const heading = within(article).getByRole('heading');
      return heading.textContent;
    });
  },
};

// Responsive testing helpers
export const responsiveHelpers = {
  async testMobileView() {
    mockWindowSize(VIEWPORT_SIZES.mobile.width, VIEWPORT_SIZES.mobile.height);
    await waitFor(() => {
      // Wait for responsive changes to take effect
    }, { timeout: 1000 });
  },

  async testTabletView() {
    mockWindowSize(VIEWPORT_SIZES.tablet.width, VIEWPORT_SIZES.tablet.height);
    await waitFor(() => {
      // Wait for responsive changes to take effect
    }, { timeout: 1000 });
  },

  async testDesktopView() {
    mockWindowSize(VIEWPORT_SIZES.desktop.width, VIEWPORT_SIZES.desktop.height);
    await waitFor(() => {
      // Wait for responsive changes to take effect
    }, { timeout: 1000 });
  },

  async testLargeView() {
    mockWindowSize(VIEWPORT_SIZES.large.width, VIEWPORT_SIZES.large.height);
    await waitFor(() => {
      // Wait for responsive changes to take effect
    }, { timeout: 1000 });
  },

  isMobileMenuVisible() {
    const mobileMenuButton = screen.queryByLabelText(/open.*menu/i);
    return mobileMenuButton !== null;
  },

  isDesktopNavVisible() {
    const desktopNav = screen.queryByRole('navigation');
    return desktopNav !== null;
  },
};

// Theme testing helpers
export const themeHelpers = {
  async toggleTheme() {
    const user = userEvent.setup();
    const themeToggle = screen.getByRole('button', { name: /theme/i }) ||
                       screen.getByTestId('theme-toggle');
    await user.click(themeToggle);
    return themeToggle;
  },

  getCurrentTheme() {
    const html = document.documentElement;
    return html.classList.contains('dark') ? 'dark' : 'light';
  },
};

// Error handling helpers
export const errorHelpers = {
  async waitForErrorMessage() {
    await waitFor(() => {
      expect(screen.getByRole('alert') || screen.getByText(/error/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  },

  async waitForNotFoundPage() {
    await waitFor(() => {
      expect(screen.getByText(/404/i) || screen.getByText(/not found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  },

  getErrorMessage() {
    return screen.queryByRole('alert') || screen.queryByText(/error/i);
  },
};

// Loading state helpers
export const loadingHelpers = {
  async waitForLoadingToStart() {
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  },

  async waitForLoadingToFinish() {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 5000 });
  },

  isLoading() {
    return screen.queryByText(/loading/i) !== null;
  },
};

// Accessibility helpers
export const a11yHelpers = {
  async testKeyboardNavigation() {
    const user = userEvent.setup();
    
    // Test tab navigation
    await user.tab();
    const firstFocusable = document.activeElement;
    
    await user.tab();
    const secondFocusable = document.activeElement;
    
    return { firstFocusable, secondFocusable };
  },

  async testEscapeKey() {
    const user = userEvent.setup();
    await user.keyboard('{Escape}');
  },

  async testEnterKey() {
    const user = userEvent.setup();
    await user.keyboard('{Enter}');
  },

  checkAriaLabels() {
    const elementsWithAriaLabel = screen.getAllByLabelText(/.+/);
    return elementsWithAriaLabel.length > 0;
  },
};