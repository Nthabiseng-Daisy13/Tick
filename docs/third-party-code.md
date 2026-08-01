# Third-Party Code

## Dependencies

- **next** (16.2.12) — Framework providing both the frontend (App Router) and API routes in a single project, avoiding the need for a separate backend server.
- **react** (19.2.4), **react-dom** (19.2.4) — Required peer dependencies of Next.js for building the user interface.
- **better-sqlite3** (13.0.2) — Synchronous SQLite driver. Chosen because the application is local-first and single-user, making a synchronous API simple and appropriate.
- **react-datepicker** (9.1.0) — Provides a modern, customizable calendar for selecting task due dates, replacing the browser's default date picker with a more consistent user experience.

## Dev Dependencies

- **typescript** (5.9.3) — Provides static typing throughout the application.
- **@types/node** (20.19.43), **@types/react** (19.2.17), **@types/react-dom** (19.2.3) — Type definitions for Node.js and React.
- **@types/better-sqlite3** (7.6.13) — Type definitions for Better SQLite3.
- **tsx** (4.23.1) — Runs TypeScript files directly from the command line, used to execute the database migration script without a separate compilation step.
- **eslint** (9.39.5), **eslint-config-next** (16.2.12) — Linting tools used to enforce code quality and recommended Next.js practices.
- **babel-plugin-react-compiler** (1.0.0) — Added by the Next.js project template to support React compiler optimizations.
- **vitest** (4.1.10) — Test runner chosen for its fast execution and first-class TypeScript support.
- **@vitejs/plugin-react** (6.0.4) — Enables Vitest to compile and test React JSX/TSX components.
- **@testing-library/react** (16.3.2) — Utilities for testing React components from the user's perspective.
- **@testing-library/jest-dom** (7.0.0) — Adds custom DOM matchers for clearer component tests.
- **jsdom** (29.1.1) — Simulates a browser environment so React component tests can run under Node.js.

---

*This document was prepared with the assistance of Claude Web (Sonnet 5) and ChatGPT (GPT-5.5). The dependencies selected, their justifications, and the final content were reviewed and verified by the author.*