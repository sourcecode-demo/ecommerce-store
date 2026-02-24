# Tulasi Silks

A modern e-commerce platform for traditional silk sarees and ethnic wear, offering a seamless shopping experience with features like product categorization, user authentication, and admin dashboard.

## Features

- 🎨 Theme customization with dark/light mode support
- 🔍 Desktop search bar in navbar for quick product searches
- 🛍️ Product categorization and filtering
- 🔐 User authentication and authorization
- 📱 Responsive design for all devices
- 🎯 Admin dashboard for product management
- 🖼️ Cloudinary integration for image uploads
- 🚀 Fast and optimized performance

## Tech Stack

- React + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui for UI components
- React Query for data fetching
- React Router for navigation
- Cloudinary for image management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/silkway-shopper.git
   cd silkway-shopper
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in the `.env` file.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `[http://localhost:5173](https://tulasi-silks.vercel.app/)`.

### Running Tests

The project uses Vitest and Testing Library for component testing:

```bash
npm run test           # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Project Structure

```
silkway-shopper/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions and configurations
│   ├── pages/         # Page components
│   ├── styles/        # Global styles and Tailwind config
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── .env.example       # Example environment variables
└── package.json       # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Cloudinary](https://cloudinary.com/)
