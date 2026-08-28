# absorbDemo

## Project Overview

**ABSØRB** is an innovative smart noise barrier designed to reduce sound levels through advanced insulation and absorption layers, minimizing noise impact on workers and surrounding communities. The barrier features a groundbreaking layer made from processed date pits, which efficiently absorbs sound frequencies while supporting environmental sustainability.

Additionally, ABSØRB integrates an intelligent anomaly detection system that analyzes sound patterns to detect any unusual changes in equipment sounds before failures or incidents occur. The barrier is 100% reusable and designed to withstand harsh construction site conditions.

This repository contains the **demo dashboard** showcasing the ABSØRB project concept and its capabilities.

---

## Technical Overview

**absorbDemo** is a TypeScript-based React application designed to showcase best practices in modern web development. It combines powerful tools and libraries to create a scalable, maintainable, and feature-rich dashboard.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Component Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with animations
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: TanStack React Query
- **Data Visualization**: Recharts
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Testing**: Vitest + Playwright + Testing Library
- **Linting**: ESLint

## Key Features

- **Component-Rich UI**: Includes accordion, dialogs, dropdowns, modals, tabs, tooltips, and more via shadcn/ui
- **Form Management**: Robust form handling with validation using React Hook Form and Zod
- **Dark Mode Support**: Built-in theme switching with next-themes
- **Charts & Visualization**: Data visualization capabilities with Recharts
- **Responsive Design**: Fully responsive layouts with Tailwind CSS
- **Carousel Support**: Embla Carousel integration for content sliders
- **Accessible Components**: WCAG-compliant UI primitives from Radix UI
- **Testing Infrastructure**: Unit tests, component tests, and E2E tests ready to use

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement (HMR).

### Build

```bash
npm run build
```

Builds the project for production.

```bash
npm run build:dev
```

Builds with development optimizations.

### Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

### Linting

```bash
npm run lint
```

Checks code quality with ESLint.

### Preview

```bash
npm run preview
```

Previews the production build locally.

## Project Structure

```
absorbDemo/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Production build output
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Language Composition

- **TypeScript**: 98.1%
- **CSS**: 1.2%
- **Other**: 0.7%

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Contributing

This is a private repository. For contributions, please refer to the project's contribution guidelines.

## License

See LICENSE file for details.

---

Built with ❤️ using modern web technologies.
