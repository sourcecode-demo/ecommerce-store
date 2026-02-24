/**
 * Tests for EC-28: Move Search Bar to Navbar Center
 *
 * Covers:
 * - Search form renders on desktop with correct placeholder
 * - Typing in the input updates state (controlled input)
 * - Pressing Enter with a valid query navigates to /shop?search=[encoded]
 * - Empty queries do NOT trigger navigation
 * - Whitespace-only queries do NOT trigger navigation
 * - XSS payloads are properly URL-encoded
 * - Input is cleared after a successful submission
 * - Search form has the `hidden md:flex` CSS classes (not shown on mobile)
 * - Desktop nav links render correctly (Home, Categories, Shop, Contact)
 * - Cart and user icon links are present
 * - Mobile menu toggle works without affecting search form
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// ----- helpers -----

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

// ----- test suites -----

describe('Navbar – Search Bar (EC-28)', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  // ------------------------------------------------------------------ render
  describe('Search form renders on desktop', () => {
    it('renders a search input with the correct placeholder text', () => {
      renderNavbar();
      const input = screen.getByPlaceholderText('Search for sarees...');
      expect(input).toBeInTheDocument();
    });

    it('renders the search input as a text input', () => {
      renderNavbar();
      const input = screen.getByPlaceholderText('Search for sarees...');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('search form carries the hidden md:flex classes (desktop-only visibility)', () => {
      renderNavbar();
      const input = screen.getByPlaceholderText('Search for sarees...');
      // The <form> wrapping the input must contain the desktop-only classes
      const form = input.closest('form');
      expect(form).not.toBeNull();
      expect(form!.className).toMatch(/hidden/);
      expect(form!.className).toMatch(/md:flex/);
    });

    it('search input starts with an empty value', () => {
      renderNavbar();
      const input = screen.getByPlaceholderText('Search for sarees...');
      expect(input).toHaveValue('');
    });
  });

  // ---------------------------------------------------------- controlled input
  describe('Typing updates the controlled input value', () => {
    it('reflects typed text in the input', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'Kanjivaram saree');
      expect(input).toHaveValue('Kanjivaram saree');
    });

    it('updates value on each keystroke', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'abc');
      expect(input).toHaveValue('abc');
    });
  });

  // ----------------------------------------------------- valid search submit
  describe('Submitting a valid query', () => {
    it('navigates to /shop?search=[query] when Enter is pressed', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'silk saree');
      await user.keyboard('{Enter}');

      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/shop?search=silk%20saree');
    });

    it('navigates when the search button is clicked', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'banarasi');

      const form = input.closest('form')!;
      const submitBtn = within(form).getByRole('button');
      await user.click(submitBtn);

      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/shop?search=banarasi');
    });

    it('trims leading/trailing whitespace before building the URL', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, '  patola  ');
      await user.keyboard('{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/shop?search=patola');
    });
  });

  // --------------------------------------------------------- input clears after submit
  describe('Input is cleared after a successful submission', () => {
    it('resets the input value to empty string after navigating', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'chanderi');
      await user.keyboard('{Enter}');

      expect(input).toHaveValue('');
    });
  });

  // -------------------------------------------------------- empty / whitespace guard
  describe('Empty or whitespace-only queries do NOT navigate', () => {
    it('does not call navigate when input is empty and Enter is pressed', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not call navigate when query is only spaces', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, '   ');
      await user.keyboard('{Enter}');

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not call navigate when query is only tabs', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      // fireEvent used here because userEvent does not forward raw tab characters
      fireEvent.change(input, { target: { value: '\t\t' } });
      fireEvent.submit(input.closest('form')!);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------------ XSS encoding
  describe('XSS payloads are properly URL-encoded', () => {
    it('encodes <script> tags in the query string', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      const xss = '<script>alert("xss")</script>';
      await user.type(input, xss);
      await user.keyboard('{Enter}');

      const call = mockNavigate.mock.calls[0][0] as string;
      // The raw angle brackets must NOT appear in the URL
      expect(call).not.toContain('<');
      expect(call).not.toContain('>');
      // The encoded form must be present
      expect(call).toContain('%3Cscript%3E');
      expect(call).toContain('%3C%2Fscript%3E');
    });

    it('encodes double-quote characters', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, '"evil"');
      await user.keyboard('{Enter}');

      const call = mockNavigate.mock.calls[0][0] as string;
      expect(call).not.toContain('"');
      expect(call).toContain('%22');
    });

    it('encodes ampersand characters that could inject extra query params', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'silk&category=all');
      await user.keyboard('{Enter}');

      const call = mockNavigate.mock.calls[0][0] as string;
      // Raw ampersand must not appear after ?search=
      expect(call).not.toContain('silk&category');
      expect(call).toContain('%26');
    });

    it('encodes hash characters', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'saree#section');
      await user.keyboard('{Enter}');

      const call = mockNavigate.mock.calls[0][0] as string;
      expect(call).toContain('%23');
    });
  });

  // --------------------------------------------- desktop nav links
  describe('Desktop navigation links render correctly', () => {
    it('renders the Home link', () => {
      renderNavbar();
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    });

    it('renders the Categories link', () => {
      renderNavbar();
      expect(screen.getByRole('link', { name: 'Categories' })).toBeInTheDocument();
    });

    it('renders the Shop link', () => {
      renderNavbar();
      // Multiple "Shop" links may exist (desktop + mobile); just confirm at least one
      const shopLinks = screen.getAllByRole('link', { name: 'Shop' });
      expect(shopLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the Contact link', () => {
      renderNavbar();
      expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    });

    it('renders the Tulasi Silks brand logo link pointing to /', () => {
      renderNavbar();
      const logo = screen.getByRole('link', { name: /tulasi silks/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
    });
  });

  // ----------------------------------------- cart and user icon links
  describe('Cart and user icon links are present', () => {
    it('renders a link to /cart', () => {
      renderNavbar();
      const cartLinks = screen.getAllByRole('link').filter((l) => l.getAttribute('href') === '/cart');
      expect(cartLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders a link to /login', () => {
      renderNavbar();
      const loginLinks = screen.getAllByRole('link').filter((l) => l.getAttribute('href') === '/login');
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ------------------------------------------ mobile menu does not expose search form
  describe('Mobile search form is NOT a separate visible form', () => {
    it('the search <form> element uses hidden class – confirms it is desktop-only', () => {
      renderNavbar();
      const form = screen.getByPlaceholderText('Search for sarees...').closest('form')!;
      // jsdom does not evaluate media queries, so we check the class attribute directly
      expect(form.className).toContain('hidden');
    });

    it('mobile menu toggle does not create a second search input', async () => {
      renderNavbar();
      const user = userEvent.setup();

      // The mobile hamburger button is the one with the md:hidden class.
      // getAllByRole returns all buttons; pick the one whose class includes md:hidden.
      const allButtons = screen.getAllByRole('button');
      const menuButton = allButtons.find((btn) => btn.className.includes('md:hidden'));
      expect(menuButton).toBeDefined();
      await user.click(menuButton!);

      // Still only one search input in the document
      const inputs = screen.getAllByPlaceholderText('Search for sarees...');
      expect(inputs).toHaveLength(1);
    });
  });

  // ------------------------------------------ navigation URL format
  describe('Navigation URL format', () => {
    it('URL starts with /shop?search=', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'test');
      await user.keyboard('{Enter}');

      const url = mockNavigate.mock.calls[0][0] as string;
      expect(url).toMatch(/^\/shop\?search=/);
    });

    it('spaces are encoded as %20 (encodeURIComponent behaviour)', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'pure silk');
      await user.keyboard('{Enter}');

      const url = mockNavigate.mock.calls[0][0] as string;
      expect(url).toBe('/shop?search=pure%20silk');
    });

    it('single word query produces correct URL without extra encoding', async () => {
      renderNavbar();
      const user = userEvent.setup();
      const input = screen.getByPlaceholderText('Search for sarees...');

      await user.type(input, 'Kanjivaram');
      await user.keyboard('{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/shop?search=Kanjivaram');
    });
  });
});
