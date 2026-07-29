# Project Outline — Tick (To-Do App)

**Status:** Initial scaffold complete and verified (build + typecheck passing).

---

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) — frontend + API routes in one project
- **better-sqlite3** — synchronous SQLite driver for local, single-user persistence
- **Vitest** — test runner, with `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- **Regular CSS (CSS Modules)** — no Tailwind
- **src/ directory** structure

---

## Installed Packages

### Dependencies
| Package | Why |
|---|---|
| `next` | Framework — provides frontend, routing, and API routes in a single project |
| `react`, `react-dom` | Required by Next.js |
| `better-sqlite3` | Synchronous SQLite access, well suited to a single-user local app with no concurrent-write concerns |

### Dev Dependencies
| Package | Why |
|---|---|
| `typescript`, `@types/*` | Type safety across app and API code |
| `eslint`, `eslint-config-next` | Linting, scaffolded default with `create-next-app` |
| `vitest` | Test runner |
| `@vitejs/plugin-react` | Enables Vitest to process React/JSX in tests |
| `@testing-library/react` | Component testing utilities |
| `@testing-library/jest-dom` | Extra DOM assertion matchers for tests |
| `jsdom` | Simulated DOM environment for Vitest |
| `@types/better-sqlite3` | Type definitions for the SQLite driver |

*(This table should be finalized against the actual `package.json` before submission — the "Third-Party Code" doc must match what's shipped.)*

---

## Current File Structure

```
tick/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          # active task list (placeholder)
│   │   ├── globals.css
│   │   ├── archive/
│   │   │   └── page.tsx                      # archived tasks page (placeholder)
│   │   └── api/
│   │       └── tasks/
│   │           ├── route.ts                  # GET, POST (stub handlers)
│   │           └── [id]/
│   │               ├── route.ts              # PATCH (stub handler)
│   │               └── archive/
│   │                   └── route.ts          # PATCH (stub handler)
│   │
│   ├── lib/
│   │   └── tasks.ts                          # types (TaskInput, Task) + stubbed
│   │                                          #   createTask, updateTask, archiveTask,
│   │                                          #   listTasks, isOverdue (implemented)
│   │
│   ├── components/                           # not yet created
│   └── styles/                               # not yet created
│
├── tests/
│   ├── tasks.test.ts                         # placeholder
│   └── api.test.ts                           # placeholder
│
├── data/                                     # not yet created — SQLite file will live here
│
├── docs/                                     # not yet created
│   ├── third-party-code.md
│   ├── database-design.md
│   └── running-it.md
│
├── ai-transcripts/
│   └── 01-project-planning.md
│
├── public/
├── vitest.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## Verified So Far

- [x] `npm install` completes, `better-sqlite3` compiles/loads
- [x] `npm run build` — compiles and passes TypeScript checks
- [x] Routes present and correctly typed: `/`, `/archive`, `/api/tasks`, `/api/tasks/[id]`, `/api/tasks/[id]/archive`
- [ ] `npm test` — pending confirmation
- [ ] `npm run dev` manual check of `/` and `/archive` — pending confirmation
- [ ] `better-sqlite3` runtime sanity check (`:memory:` DB) — pending confirmation

---

## Not Yet Implemented

- `lib/db.ts` — SQLite connection singleton
- `lib/schema.sql` + `lib/migrate.ts` — schema definition and migration runner
- Real logic inside `createTask`, `updateTask`, `archiveTask`, `listTasks` (currently TODO stubs)
- API route bodies wired to `lib/tasks.ts` (currently dummy stub responses)
- Frontend components (`TaskList`, `TaskForm`, `TaskRow`, `SortControls`)
- CSS Modules for styling
- Real tests replacing placeholders (creation, archive behavior, overdue rule)
- Documentation (`docs/`)

---

## Next Steps

1. Confirm remaining verification checklist items (tests, dev server, SQLite sanity check)
2. Commit the verified scaffold
3. Build `lib/db.ts`, `schema.sql`, `migrate.ts`
4. Implement real logic in `lib/tasks.ts` against SQLite
5. Wire API routes to real logic
6. Write first real tests (`isOverdue`, archive behavior)
7. Build frontend list view + form