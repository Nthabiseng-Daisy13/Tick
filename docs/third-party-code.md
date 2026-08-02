# Third-Party Code

## Database access — no third-party driver

**No third-party database driver is used.** Persistence is handled entirely
by Node's built-in `node:sqlite` module (`DatabaseSync`), available natively
from Node 22.5+ and no longer requiring the `--experimental-sqlite` flag as
of Node 22.13.0. This project originally used `better-sqlite3`, but that
package requires native compilation via `node-gyp` on install, which caused
real installation failures on Windows during development (missing Visual
Studio Build Tools, and separately, a broken npm optional-dependency cache
issue). Switching to the built-in module removes any native compilation step
entirely — a clean clone has nothing to compile, on any machine, regardless
of whether a C++ toolchain is installed.

## Dependencies

- **next** (16.2.12) — Framework providing both the frontend (App Router) and
  API routes in a single project, avoiding the need for a separate backend
  server.
- **react** (19.2.4), **react-dom** (19.2.4) — Required peer dependencies of
  Next.js for building the user interface.
- **react-datepicker** (9.1.0) — Provides a date/time picker for setting task
  due dates and times, replacing the browser's default date input with a
  more consistent, customizable interface across browsers.

## Dev Dependencies

- **typescript** (5.9.3) — Provides static typing throughout the application.
- **@types/node** (`<PASTE THE EXACT VERSION FROM YOUR package.json — see
  note below>`) — Type definitions for Node.js APIs, including `node:sqlite`.
  Bumped from the `@types/node@20.x` line originally scaffolded by
  `create-next-app`, because `node:sqlite` type definitions do not exist in
  that major version.
- **@types/react** (19.2.17), **@types/react-dom** (19.2.3) — Type
  definitions for React.
- **tsx** (4.23.1) — Runs TypeScript files directly from the command line,
  used to execute the database migration script without a separate
  compilation step.
- **eslint** (9.39.5), **eslint-config-next** (16.2.12) — Linting tools used
  to enforce code quality and recommended Next.js practices.
- **babel-plugin-react-compiler** (1.0.0) — Added automatically by the
  Next.js project template. <!-- TODO: confirm whether this is actually
  referenced in next.config.* before final submission — if unused, remove
  it; if it's enabling the React Compiler, replace this line with that
  justification. -->
- **vitest** (4.1.10) — Test runner chosen for its fast execution and
  first-class TypeScript support.
- **@vitejs/plugin-react** (6.0.4) — Enables Vitest to compile and test React
  JSX/TSX components.
- **@testing-library/react** (16.3.2) — Utilities for testing React
  components from the user's perspective.
- **@testing-library/jest-dom** (7.0.0) — Adds custom DOM matchers for
  clearer component tests.
- **jsdom** (29.1.1) — Simulates a browser environment so React component
  tests can run under Node.js. (Business-logic and API tests explicitly opt
  out of this via a `// @vitest-environment node` directive, since
  Node built-in modules like `node:sqlite` cannot be bundled for a
  browser-like test environment.)

---

*This document was prepared with the assistance of Claude Web (Sonnet 5) and ChatGPT (GPT-5.5). The dependencies selected, their justifications, and the final content were reviewed and verified by the author.*