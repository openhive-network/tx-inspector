# Transaction Inspector

## Project Overview

Transaction Inspector is a web application for analyzing HIVE blockchain transactions. It allows users to:
- Verify transaction signatures and public keys
- Validate transaction authority paths (direct signing or delegated authority)
- Check if required authorities are satisfied
- Display transaction metadata (ID, signature digest, TaPoS data, expiration)
- Analyze transaction operations and their authority requirements
- View hexadecimal and JSON representations of transaction data

The app accepts transactions in multiple formats: transaction hash/ID, JSON, binary/hexadecimal, or uploaded files.

## Tech Stack

**Core:**
- Nuxt 3 (v3.13.2) - Vue 3 meta-framework (SSR disabled, SPA mode)
- Vue 3 with Composition API (`<script setup>` syntax)
- TypeScript
- Pinia for state management

**UI:**
- Tailwind CSS with CSS variables
- shadcn-nuxt (New York style)
- Vuetify 3 with Material Design 3 blueprint
- Radix Vue / Reka UI for headless components
- Cytoscape for graph visualization

**Blockchain:**
- @hiveio/wax - HIVE blockchain interaction library
- @hiveio/component-binary-view - Binary transaction display

**Testing:**
- Playwright for E2E tests

**Package Manager:** pnpm (v10.0.0)

## Directory Structure

```
├── components/
│   ├── shadcn/          # Generic shadcn-nuxt components
│   └── ui/              # Domain-specific components
│       ├── TrxForm.vue         # Transaction input form
│       ├── TrxTable.vue        # Transaction metadata display
│       ├── OperationsTable.vue # Operations breakdown
│       ├── AuthTable.vue       # Required authorities
│       ├── AuthorityPathTable.vue   # Authority path visualization
│       └── AuthorityTraceGraph.vue  # Cytoscape authority graph
├── pages/
│   └── index.vue        # Main application page
├── layouts/
│   └── default.vue      # App layout with Vuetify wrapper
├── plugins/
│   ├── txInspector.ts   # Blockchain connection init
│   ├── formatter.ts     # Operation formatters (1280+ lines)
│   ├── vuetify.ts       # Vuetify setup
│   └── buffer.ts        # Browser Buffer polyfill
├── stores/
│   └── wax.ts           # Main Pinia store for transaction state
├── types/
│   └── wax.ts           # Blockchain-related TypeScript types
├── utils/
│   ├── txInspector.ts   # Transaction inspection logic
│   ├── requiredOperationAuthorities.ts
│   └── formatters.ts    # Formatting utilities
├── __tests__/           # Playwright E2E tests
│   ├── assets/mock/     # Test fixtures
│   └── detailed/        # Detailed test cases
└── scripts/ci-helpers/  # CI scripts
```

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (http://localhost:3000)
pnpm run build        # Build for production
pnpm run generate     # Generate static site
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint with auto-fix
pnpm run test         # Run Playwright E2E tests
```

**Environment Setup:**
Copy `.env.example` to `.env`:
- `NUXT_PUBLIC_BLOCK_EXPLORER_URL` - Block explorer URL
- `NUXT_PUBLIC_DEFAULT_CHAIN_ID` - HIVE chain ID
- `NUXT_PUBLIC_DEFAULT_ENDPOINT_URL` - HIVE API endpoint

## Key Files

- `nuxt.config.ts` - Nuxt configuration (SSR disabled, modules, runtime config)
- `tailwind.config.js` - Tailwind with custom theme colors (posting, active, owner)
- `components.json` - shadcn-nuxt configuration
- `.eslintrc.cjs` - ESLint with strict naming conventions
- `playwright.config.ts` - E2E test configuration
- `Dockerfile` - nginx-based container

## Coding Conventions

**TypeScript Naming:**
- Interfaces: `I` prefix, PascalCase (e.g., `ITransaction`)
- Type parameters: `T` prefix
- Enums: `E` prefix
- Classes: PascalCase
- Everything else: camelCase

**Vue:**
- Use `<script setup>` syntax
- Store references via `storeToRefs`
- shadcn components in `components/shadcn/`, custom in `components/ui/`

**Styling:**
- Tailwind CSS with CSS variables for theming
- Custom authority colors: posting (#0fbd86), active (#0fbabd), owner (#bd740f)
- Dark theme by default

**Commits:**
- Conventional commits format (feat, fix, docs, ci, chore, style, refactor, perf, test)
- Lowercase type and scope

## CI/CD Notes

**GitLab CI Stages:**
- `build` - Compile for pages and Docker
- `deploy` - GitLab Pages and Docker Registry

**Jobs:**
- `build4pages` - Static site for GitLab Pages
- `build_app_image` - Docker image with short SHA tag
- `push_protected_app_image` - Docker image with branch tag (protected branches only)
- `pages` - Deploy to GitLab Pages with branch-specific URLs

**Testing:**
- 20+ Playwright test projects covering authority scenarios, signature validation, edge cases
- Test fixtures in `__tests__/assets/mock/`
