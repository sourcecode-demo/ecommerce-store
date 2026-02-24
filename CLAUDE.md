# Tulasi Silks - AI Assistant Guidelines

## Project Overview
Tulasi Silks is a modern e-commerce platform for traditional silk sarees and ethnic wear. The project is built with React, TypeScript, and Vite, utilizing Tailwind CSS for styling and Shadcn/UI for components.

## Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **UI Library**: Shadcn/UI (Radix Primitives), Lucide React (Icons)
- **State Management**: React Context (Auth, Theme, Cart), React Query
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod
- **Image Management**: Cloudinary

## Build & Run Commands
- **Start Development Server**: `npm run dev` (Runs on port 5173 by default)
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Lint Code**: `npm run lint`

## Code Style & Conventions

### TypeScript
- Use strict typing; avoid `any` wherever possible.
- Define interfaces for props and data models (e.g., `interface Product { ... }`).
- Use functional components with `React.FC` or direct function definitions.

### Components
- **Structure**: `src/components/[category]/[ComponentName].tsx`
- **Naming**: PascalCase for components (e.g., `ProductCard.tsx`), camelCase for utility functions and hooks.
- **Exports**: Use named exports or default exports consistently (currently mixed, prefer default for pages/major components).

### Styling (Tailwind CSS)
- Use utility classes for styling.
- Use `cn()` utility from `src/lib/utils.ts` for conditional class merging.
- Follow the design system defined in `tailwind.config.ts` (colors like `saree-maroon`, `saree-gold`).
- Responsive design: Mobile-first approach using `md:`, `lg:` prefixes.

### State Management
- Use `React Query` for server state (fetching products, categories).
- Use `Context` for global UI state (Theme, Auth).
- Avoid Redux unless complexity demands it.

## Workflow Guidelines

### Development Process
1.  **Analysis**: Understand the requirements and existing code before making changes.
2.  **Implementation**: Write clean, maintainable code following the project's style.
3.  **Testing**: Verify changes manually or via tests (if available). *Note: "Test-first" is encouraged where applicable.*
4.  **Linting**: Ensure no linting errors before finishing a task.

### Git & Jira Integration
- **Branch Naming**: `ai-{ticket-key}` (e.g., `ai-TUL-101`).
- **Commits**: Descriptive messages linking to the ticket (e.g., `feat: add search bar to navbar (TUL-101)`).
- **Security**: NEVER commit secrets or API keys. Use `.env` files.
- **Pull Requests**: Open PRs with clear descriptions and link back to the Jira ticket.

## Directory Structure
- `src/components`: Reusable UI components.
- `src/pages`: Route components (pages).
- `src/lib`: Utilities, helpers, and configurations (Cloudinary, utils).
- `src/contexts`: React Context providers.
- `src/hooks`: Custom React hooks.
- `src/types`: Shared TypeScript definitions.
