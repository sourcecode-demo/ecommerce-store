# Changelog

All notable changes to the Tulasi Silks project are documented in this file.

## [Unreleased]

### Added (EC-28)
- Centered search bar in navbar for desktop view (responsive: hidden on mobile, visible on `md:` breakpoint and above)
- Search functionality navigates to `/shop?search={query}` and clears input after submission
- Vitest + React Testing Library test framework integration
- Comprehensive test suite for Navbar component (8 tests covering search functionality, navigation, and responsive behavior)
- Test scripts: `npm run test` and `npm run test:coverage`

### Changed
- Navbar layout now features a prominent centered search input between navigation links and action icons on desktop
- Removed non-functional search icon from right-side icons group

### Technical Details
- Test file: `src/components/layout/Navbar.test.tsx`
- Config update: `vite.config.ts` with Vitest configuration
- Dependencies: Added Vitest and testing-library packages to `package.json`
- All tests passing with full coverage for navbar search feature

## Notes for Contributors
- When updating navbar or search functionality, ensure corresponding tests in `Navbar.test.tsx` are updated
- Follow the testing patterns established in the Navbar test suite for new feature testing
- Refer to CLAUDE.md for testing guidelines and patterns
