# Third-Party Code

## Dependencies

- **next** — Framework providing both the frontend (App Router) and API routes
  in a single project, avoiding the need for a separate backend server.
- **react**, **react-dom** — Required peer dependencies of Next.js.
- **better-sqlite3** — Synchronous SQLite driver. Chosen over async drivers
  (e.g. `sqlite3`, `node-sqlite3`) because this is a single-user, local-only
  app with no concurrent-write concerns, so a synchronous API keeps the code
  simpler with no meaningful performance cost.

## Dev Dependencies

- **typescript** — Static typing across app and API code.
- **@types/better-sqlite3** — Type definitions for the SQLite driver.
- **eslint**, **eslint-config-next** — Linting, scaffolded by `create-next-app`.
- **vitest** — Test runner; chosen for its fast Vite-native setup and
  first-class TypeScript support with minimal config.
- **@vitejs/plugin-react** — Allows Vitest to process JSX/TSX in test files.
- **@testing-library/react** — Utilities for testing React components.
- **@testing-library/jest-dom** — Extra DOM assertion matchers used in tests.
- **jsdom** — Simulated browser DOM environment required for component tests
  to run under Node.