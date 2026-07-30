# Third-Party Code

## Dependencies

- **next** (16.2.12) — Framework providing both the frontend (App Router) and
  API routes in a single project, avoiding the need for a separate backend
  server.
- **react**, **react-dom** (19.2.4) — Required peer dependencies of Next.js.
- **better-sqlite3** (^13.0.2) — Synchronous SQLite driver. Chosen over async
  drivers (e.g. `sqlite3`) because this is a single-user, local-only app with
  no concurrent-write concerns, so a synchronous API keeps the code simpler
  with no meaningful performance cost.

## Dev Dependencies

- **typescript** (^5) — Static typing across app and API code.
- **@types/node**, **@types/react**, **@types/react-dom** — Type definitions
  for Node.js and React APIs, scaffolded by `create-next-app`.
- **@types/better-sqlite3** (^7.6.13) — Type definitions for the SQLite
  driver.
- **tsx** (^4.23.1) — Runs TypeScript files directly from the command line,
  used to execute `src/lib/migrate.ts` without a separate compile step.
- **eslint**, **eslint-config-next** (^9 / 16.2.12) — Linting, scaffolded by
  `create-next-app`.
- **babel-plugin-react-compiler** (1.0.0) — Scaffolded automatically by
  `create-next-app` to support React's compiler-based optimizations.
- **vitest** (^4.1.10) — Test runner; chosen for its fast Vite-native setup
  and first-class TypeScript support with minimal config.
- **@vitejs/plugin-react** (^6.0.4) — Allows Vitest to process JSX/TSX in
  test files.
- **@testing-library/react** (^16.3.2) — Utilities for testing React
  components.
- **@testing-library/jest-dom** (^7.0.0) — Extra DOM assertion matchers used
  in tests.
- **jsdom** (^29.1.1) — Simulated browser DOM environment required for
  component tests to run under Node.



[This document was written with the assistance of Claude Web Sonnet 5 ]