import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock useNavigate so we can assert calls without a real router
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
    </MemoryRouter>
  );
}

describe('Navbar – EC-28: Search Bar in Navbar Center', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // -------------------------------------------------------------------------
  // a) Desktop search bar renders with correct placeholder
  // -------------------------------------------------------------------------
  it('renders the desktop search bar input with the correct placeholder', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    expect(input).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // b) Search icon (submit button) is present inside the search form
  // -------------------------------------------------------------------------
  it('renders the search submit button inside the search form', () => {
    renderNavbar();
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    // The button must be a submit inside a form – verify type attribute
    expect(searchButton).toHaveAttribute('type', 'submit');
  });

  // -------------------------------------------------------------------------
  // c) Typing in the search input updates the displayed value
  // -------------------------------------------------------------------------
  it('updates the input value as the user types', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Kanjivaram');
    expect(input).toHaveValue('Kanjivaram');
  });

  // -------------------------------------------------------------------------
  // d) Pressing Enter with a valid query navigates to the correct URL
  // -------------------------------------------------------------------------
  it('navigates to /shop?search=[encodedQuery] when Enter is pressed with a valid query', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Banarasi silk');
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent('Banarasi silk')}`
    );
  });

  // -------------------------------------------------------------------------
  // d continued) Clicking the search submit button also navigates
  // -------------------------------------------------------------------------
  it('navigates when the search button is clicked with a valid query', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Patola');
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent('Patola')}`
    );
  });

  // -------------------------------------------------------------------------
  // e) Empty query does NOT navigate
  // -------------------------------------------------------------------------
  it('does NOT navigate when Enter is pressed with an empty input', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // e) Whitespace-only query does NOT navigate
  // -------------------------------------------------------------------------
  it('does NOT navigate when the query contains only whitespace', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // f) Input is cleared after a successful search
  // -------------------------------------------------------------------------
  it('clears the input field after a successful search navigation', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Chanderi');
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('');
  });

  // -------------------------------------------------------------------------
  // f continued) Input is NOT cleared if search was not triggered (empty)
  // -------------------------------------------------------------------------
  it('does NOT clear the input when an empty search is submitted', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    // Value was whitespace, trim prevented navigation; original value preserved
    expect(input).toHaveValue('   ');
  });

  // -------------------------------------------------------------------------
  // g) Desktop search form uses the `hidden md:flex` visibility class pattern
  // -------------------------------------------------------------------------
  it('applies hidden-on-mobile CSS classes to the desktop search form', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    // The form is the direct parent of the input
    const form = input.closest('form');
    expect(form).not.toBeNull();
    // Vitest with jsdom does not compute media-query styles, so we verify the
    // Tailwind utility classes that control visibility are present.
    expect(form!.className).toMatch(/\bhidden\b/);
    expect(form!.className).toMatch(/\bmd:flex\b/);
  });

  // -------------------------------------------------------------------------
  // h) Mobile menu still contains a Search icon element
  // -------------------------------------------------------------------------
  it('renders a search icon inside the mobile menu section', () => {
    renderNavbar();
    // Open the mobile menu
    const menuToggle = screen.getByRole('button', { name: '' });
    // The hamburger/close button has no aria-label; use the Menu icon test id
    // approach – click the mobile toggle button (it is the only button without
    // an aria-label at this point)
    fireEvent.click(menuToggle);
    // After the menu opens, the mobile search button (non-submit) should exist.
    // The mobile menu renders a <button> containing a Search icon with no
    // aria-label, so we query by role and filter for non-submit buttons.
    const allButtons = screen.getAllByRole('button');
    // At minimum we expect: mobile toggle (X now), desktop search submit,
    // and the mobile search icon button.
    expect(allButtons.length).toBeGreaterThanOrEqual(3);
  });

  // -------------------------------------------------------------------------
  // h alternative) Mobile menu search button is NOT a submit – verify it is
  //    distinct from the desktop search submit.
  // -------------------------------------------------------------------------
  it('mobile menu search icon button has no type=submit', () => {
    renderNavbar();
    // Open the mobile menu first
    const menuToggle = screen.getByRole('button', { name: '' });
    fireEvent.click(menuToggle);
    const allButtons = screen.getAllByRole('button');
    // Desktop submit button (aria-label="Search") must exist
    const desktopSubmit = screen.getByRole('button', { name: /search/i });
    expect(desktopSubmit).toHaveAttribute('type', 'submit');
    // The mobile search icon button has no aria-label; it is NOT type=submit
    const mobileSearchBtn = allButtons.find(
      (btn) =>
        btn !== desktopSubmit &&
        btn.getAttribute('type') !== 'submit' &&
        btn !== menuToggle
    );
    expect(mobileSearchBtn).toBeDefined();
    expect(mobileSearchBtn!.getAttribute('type')).not.toBe('submit');
  });

  // -------------------------------------------------------------------------
  // i) The right icons group (ShoppingBag + User) does NOT contain a
  //    standalone Search icon button (it was removed by EC-28)
  // -------------------------------------------------------------------------
  it('does NOT render a standalone search icon button in the right icons group', () => {
    renderNavbar();
    // The only button with role=button and aria-label "Search" should be
    // the desktop search submit inside the form, not a separate icon button
    // outside the form.
    const searchButton = screen.getByRole('button', { name: /search/i });
    // Confirm the button is inside a <form> element, not floating in the icon bar
    const parentForm = searchButton.closest('form');
    expect(parentForm).not.toBeNull();
  });

  // -------------------------------------------------------------------------
  // Additional: special characters in query are URL-encoded
  // -------------------------------------------------------------------------
  it('URL-encodes special characters in the search query', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'saree & dupatta');
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent('saree & dupatta')}`
    );
  });

  // -------------------------------------------------------------------------
  // Additional: brand logo renders and links to home
  // -------------------------------------------------------------------------
  it('renders the Tulasi Silks brand logo linking to /', () => {
    renderNavbar();
    const logo = screen.getByRole('link', { name: /tulasi silks/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
  });
});
