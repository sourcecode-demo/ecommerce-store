/**
 * Test suite for EC-28: Move Search Bar to Navbar Center
 *
 * Covers:
 * 1. Desktop search input renders with correct placeholder
 * 2. Desktop search form has the `hidden md:flex` CSS classes (mobile-hidden)
 * 3. Typing in the search input updates its value
 * 4. Submitting the form navigates to /shop?search=<encoded-query>
 * 5. Empty / whitespace-only query does NOT navigate
 * 6. Special characters (XSS payload) are properly URL-encoded
 * 7. Search input is cleared after a successful navigation
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// ----------------------------------------------------------------
// react-router-dom mock – keeps MemoryRouter but lets us assert
// navigate() calls without actually changing the URL.
// ----------------------------------------------------------------
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ----------------------------------------------------------------
// Helper – wraps Navbar in a MemoryRouter so Link / NavLink render
// ----------------------------------------------------------------
function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

// ----------------------------------------------------------------
// Tests
// ----------------------------------------------------------------
describe('Navbar – EC-28: Search Bar', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  // 1. Renders search input with correct placeholder on desktop
  it('renders the desktop search input with the correct placeholder', () => {
    renderNavbar();

    const input = screen.getByPlaceholderText('Search for sarees...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  // 2. Desktop search form is hidden on mobile (has class `hidden md:flex`)
  it('desktop search form carries the `hidden md:flex` visibility classes', () => {
    renderNavbar();

    // The <form> wrapping the search input is the container we target.
    const input = screen.getByPlaceholderText('Search for sarees...');
    const form = input.closest('form');
    expect(form).not.toBeNull();
    // Must have BOTH classes so Tailwind hides on mobile and shows on md+
    expect(form).toHaveClass('hidden');
    expect(form).toHaveClass('md:flex');
  });

  // 3. Typing in the search input updates its displayed value
  it('reflects typed text in the search input', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Kanjivaram');

    expect(input).toHaveValue('Kanjivaram');
  });

  // 4. Submitting with a valid query navigates to /shop?search=<encoded-query>
  it('navigates to /shop?search=<query> when form is submitted with a non-empty value', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Banarasi silk');

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent('Banarasi silk')}`
    );
  });

  // 5a. Empty string does NOT navigate
  it('does NOT navigate when the search input is empty', () => {
    renderNavbar();

    const input = screen.getByPlaceholderText('Search for sarees...');
    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // 5b. Whitespace-only string does NOT navigate
  it('does NOT navigate when the search input contains only whitespace', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, '   ');

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // 6. Special characters / XSS payload are URL-encoded, never injected raw
  it('properly URL-encodes a special-character / XSS payload in the search query', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const xssPayload = '<script>alert(1)</script>';
    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, xssPayload);

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    const calledWith: string = mockNavigate.mock.calls[0][0];

    // Must not contain a raw < or > in the URL
    expect(calledWith).not.toContain('<script>');
    expect(calledWith).not.toContain('</script>');

    // Must equal the properly encoded form
    expect(calledWith).toBe(
      `/shop?search=${encodeURIComponent(xssPayload)}`
    );
  });

  // 7. Search input is cleared after successful navigation
  it('clears the search input after a successful form submission', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const input = screen.getByPlaceholderText('Search for sarees...');
    await user.type(input, 'Patola');

    const form = input.closest('form')!;
    fireEvent.submit(form);

    // navigate was called (guard that the submission was valid)
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    // Input value must be reset to empty string
    expect(input).toHaveValue('');
  });
});
