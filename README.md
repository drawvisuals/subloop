# Subloop

A minimal subscription manager that helps users track their subscriptions.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling (mapped to Figma tokens)
- **React Router** for routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── Layout/    # Layout components (AppLayout, etc.)
├── config/        # Configuration files
│   └── tokens.ts  # Figma design tokens (TODO: populate from Figma)
├── pages/         # Page components (will be added as features are built)
├── routes/        # Route definitions and guards
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
    └── accessibility.ts  # A11y helpers
```

## Design Tokens

**Important:** Before implementing UI features, populate `src/config/tokens.ts` with actual Figma design tokens:

- Colors
- Typography (fonts, sizes, line heights)
- Spacing scale
- Border radius values
- Shadows/elevation

The UI must match Figma spacing, typography, colors, and hierarchy exactly (per PRD Section 3).

## Development Guidelines

- Use semantic HTML elements
- Ensure all components are accessible (ARIA labels, keyboard navigation)
- Mobile-responsive design required
- No placeholder colors, fonts, or spacing — all must come from Figma tokens
- Keep architecture simple and readable

## Documentation

See [PRD.md](./PRD.md) for complete product requirements and specifications.
