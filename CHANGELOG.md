# Changelog

All notable changes to Tulasi Silks will be documented in this file.

## [Unreleased]

### Added
- **Navbar Search Bar (EC-28)**: Moved search functionality to center of navbar on desktop. Features a centered 300px search input with rounded styling, `saree-gold` focus ring, and integrated search icon. On Enter key or submit button click, navigates to `/shop?search=[query]`. Mobile preserves search icon in mobile menu. Input validates and trims whitespace before search.
- **Test Infrastructure**: Added Vitest configuration with @testing-library/react for component testing. Test setup includes DOM testing utilities and window/global mocks. Run tests with `npm run test`.
- **Navbar Component Tests**: 15 comprehensive tests for Navbar component covering search functionality, navigation, mobile menu, and accessibility.

