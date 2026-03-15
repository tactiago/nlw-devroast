# Dev Roast — Project Patterns

## Stack

- **Next.js 16** (App Router, `src/` directory)
- **TypeScript** (strict, `type` over `interface`)
- **Tailwind CSS 4** (theme tokens via `@theme inline` in `globals.css`)
- **tailwind-variants** (`tv`) for component variants — never use `twMerge` directly
- **Biome** for linting/formatting (tabs, double quotes, organize imports)
- **@base-ui/react** for behavioral primitives (Switch, etc.)
- **shiki** for server-side syntax highlighting (vesper theme)

## Fonts

- **Sans**: system default (`--default-font-family`)
- **Mono**: JetBrains Mono via `next/font/google` (`--font-mono`)

## Design Tokens

All colors, spacing, and radii live in `src/app/globals.css` under `@theme inline`. Use Tailwind classes referencing these tokens (e.g. `bg-bg-page`, `text-accent-green`, `border-border-primary`).

## Component Patterns

UI components live in `src/components/ui/`. See `src/components/ui/AGENTS.md` for detailed rules on:

- Simple components (variants via `tv()`, named exports)
- Composition pattern (sub-components via `Object.assign` for dot notation)

## API / Data Fetching

- **tRPC** como camada de API (TanStack React Query). Ver `src/trpc/AGENTS.md` para detalhes.
- Server Components por padrão; prefetch + HydrateClient para SSR.
- Suspense + skeleton para loading states.
- Client Components quando necessário (ex.: NumberFlow para animação de números).

## Key Rules

- Always named exports, never `export default` (except Next.js pages)
- Server Components by default; `"use client"` only when needed
- Navbar is in `src/app/layout.tsx` (shared across all pages)
- Page content uses `max-w` + `mx-auto` for centered layout
