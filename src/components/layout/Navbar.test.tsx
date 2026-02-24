import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock useNavigate so we can assert calls without real routing
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper: render Navbar inside a MemoryRouter
function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
});

// ---------------------------------------------------------------------------
// Search input rendering
// ---------------------------------------------------------------------------
describe('Desktop search input rendering', () => {
  it('renders the search input element', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    expect(input).toBeInTheDocument();
  });

  it('has placeholder text "Search for sarees..."', () => {
    renderNavbar();
    expect(
      screen.getByPlaceholderText('Search for sarees...')
    ).toHaveAttribute('placeholder', 'Search for sarees...');
  });

  it('input wrapper carries the "hidden md:flex" classes for desktop-only display', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');
    // The immediate wrapper of the relative div is the hidden md:flex container
    const outerWrapper = input.closest('.relative')?.parentElement;
    expect(outerWrapper).toBeTruthy();
    expect(outerWrapper!.className).toMatch(/hidden/);
    expect(outerWrapper!.className).toMatch(/md:flex/);
  });

  it('renders the Search icon inside the input container', () => {
    const { container } = renderNavbar();
    // Lucide Search renders as an svg inside the relative div alongside the input
    const relativeDiv = container.querySelector('.relative');
    expect(relativeDiv).toBeTruthy();
    const svgIcon = relativeDiv!.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('input is of type "text"', () => {
    renderNavbar();
    expect(screen.getByPlaceholderText('Search for sarees...')).toHaveAttribute(
      'type',
      'text'
    );
  });
});

// ---------------------------------------------------------------------------
// Controlled input — state updates on typing
// ---------------------------------------------------------------------------
describe('Controlled input state', () => {
  it('updates the displayed value as the user types', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText(
      'Search for sarees...'
    ) as HTMLInputElement;

    await user.type(input, 'Kanjivaram');
    expect(input.value).toBe('Kanjivaram');
  });

  it('starts with an empty value', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText(
      'Search for sarees...'
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('reflects each keystroke in the input value', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText(
      'Search for sarees...'
    ) as HTMLInputElement;

    await user.type(input, 'silk');
    expect(input.value).toBe('silk');

    await user.clear(input);
    expect(input.value).toBe('');

    await user.type(input, 'banarasi');
    expect(input.value).toBe('banarasi');
  });
});

// ---------------------------------------------------------------------------
// Navigation on Enter key
// ---------------------------------------------------------------------------
describe('handleSearch — Enter key navigation', () => {
  it('navigates to /shop?search=[query] on Enter with a valid query', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    await user.type(input, 'Kanjivaram{Enter}');

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent('Kanjivaram')}`
    );
  });

  it('does NOT navigate when Enter is pressed with an empty input', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    await user.click(input);
    await user.keyboard('{Enter}');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does NOT navigate when Enter is pressed with whitespace-only input', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('trims leading/trailing whitespace before navigating', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    await user.type(input, '  silk saree  {Enter}');

    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent('silk saree')}`
    );
  });

  it('does NOT navigate when a non-Enter key is pressed', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    await user.type(input, 'silk');
    await user.keyboard('{Tab}');

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Special-character encoding
// ---------------------------------------------------------------------------
describe('Special characters are URL-encoded', () => {
  it('encodes spaces as %20', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    await user.type(input, 'silk saree{Enter}');

    const expectedUrl = `/shop?search=${encodeURIComponent('silk saree')}`;
    expect(mockNavigate).toHaveBeenCalledWith(expectedUrl);
    expect(expectedUrl).toContain('%20');
  });

  it('encodes ampersand and equals characters', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    const query = 'red & gold=saree';
    await user.type(input, `${query}{Enter}`);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent(query)}`
    );
  });

  it('encodes slash and question-mark characters', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    const query = 'saree/dupatta?color=red';
    await user.type(input, `${query}{Enter}`);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent(query)}`
    );
  });

  it('encodes unicode / non-ASCII characters', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const input = screen.getByPlaceholderText('Search for sarees...');

    const query = 'सिल्क';
    // userEvent cannot type Unicode directly; use fireEvent to set the value
    fireEvent.change(input, { target: { value: query } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/shop?search=${encodeURIComponent(query)}`
    );
  });
});

// ---------------------------------------------------------------------------
// Navigation links
// ---------------------------------------------------------------------------
describe('Navigation links are present', () => {
  it('renders the Home link', () => {
    renderNavbar();
    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Shop link', () => {
    renderNavbar();
    const shopLinks = screen.getAllByRole('link', { name: /shop/i });
    expect(shopLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Categories link', () => {
    renderNavbar();
    const categoryLinks = screen.getAllByRole('link', { name: /categories/i });
    expect(categoryLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Contact link', () => {
    renderNavbar();
    const contactLinks = screen.getAllByRole('link', { name: /contact/i });
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('Home link points to "/"', () => {
    renderNavbar();
    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    expect(homeLinks[0]).toHaveAttribute('href', '/');
  });

  it('Shop link points to "/shop"', () => {
    renderNavbar();
    const shopLinks = screen.getAllByRole('link', { name: /shop/i });
    const shopLink = shopLinks.find(
      (el) => el.getAttribute('href') === '/shop'
    );
    expect(shopLink).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Cart icon
// ---------------------------------------------------------------------------
describe('Cart icon', () => {
  it('renders a link to /cart', () => {
    renderNavbar();
    const cartLinks = screen.getAllByRole('link').filter(
      (el) => el.getAttribute('href') === '/cart'
    );
    expect(cartLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the ShoppingBag icon inside the cart link', () => {
    const { container } = renderNavbar();
    const cartLink = container.querySelector('a[href="/cart"]');
    expect(cartLink).toBeTruthy();
    expect(cartLink!.querySelector('svg')).toBeInTheDocument();
  });

  it('shows a badge with count on the cart icon', () => {
    renderNavbar();
    // The badge span contains "0" as the initial count
    const cartLinks = screen.getAllByRole('link').filter(
      (el) => el.getAttribute('href') === '/cart'
    );
    // At least one cart link exists on desktop
    expect(cartLinks[0].textContent).toContain('0');
  });
});

// ---------------------------------------------------------------------------
// User / login icon
// ---------------------------------------------------------------------------
describe('User / login icon', () => {
  it('renders a link to /login', () => {
    renderNavbar();
    const loginLinks = screen.getAllByRole('link').filter(
      (el) => el.getAttribute('href') === '/login'
    );
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the User icon svg inside the login link', () => {
    const { container } = renderNavbar();
    const loginLink = container.querySelector('a[href="/login"]');
    expect(loginLink).toBeTruthy();
    expect(loginLink!.querySelector('svg')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------------------
describe('Mobile menu', () => {
  it('mobile menu is hidden by default', () => {
    const { container } = renderNavbar();
    // The mobile menu div has class "md:hidden"
    const mobileMenu = container.querySelector('.md\\:hidden.mt-4');
    expect(mobileMenu).not.toBeInTheDocument();
  });

  it('toggles mobile menu open on hamburger button click', async () => {
    const user = userEvent.setup();
    const { container } = renderNavbar();
    const menuButton = container.querySelector('button.md\\:hidden');
    expect(menuButton).toBeTruthy();

    await user.click(menuButton!);

    const mobileMenu = container.querySelector('.md\\:hidden.mt-4');
    expect(mobileMenu).toBeInTheDocument();
  });

  it('closes mobile menu on second hamburger button click', async () => {
    const user = userEvent.setup();
    const { container } = renderNavbar();
    const menuButton = container.querySelector('button.md\\:hidden');

    await user.click(menuButton!);
    await user.click(menuButton!);

    const mobileMenu = container.querySelector('.md\\:hidden.mt-4');
    expect(mobileMenu).not.toBeInTheDocument();
  });

  it('mobile menu contains a Search icon button', async () => {
    const user = userEvent.setup();
    const { container } = renderNavbar();
    const menuButton = container.querySelector('button.md\\:hidden');

    await user.click(menuButton!);

    const mobileMenu = container.querySelector('.md\\:hidden.mt-4');
    const searchButton = mobileMenu!.querySelector('button');
    expect(searchButton).toBeTruthy();
    expect(searchButton!.querySelector('svg')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Brand / Logo
// ---------------------------------------------------------------------------
describe('Logo / brand', () => {
  it('renders "Tulasi Silks" brand text', () => {
    renderNavbar();
    expect(screen.getByText('Tulasi Silks')).toBeInTheDocument();
  });

  it('brand text links to "/"', () => {
    renderNavbar();
    const brandLink = screen.getByText('Tulasi Silks').closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
  });
});
