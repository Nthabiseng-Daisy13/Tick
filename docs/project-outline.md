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


# Tick — Project Summary

**A local-first to-do app.** Next.js (App Router, TypeScript), SQLite via
better-sqlite3, Vitest, CSS Modules. No auth, single user, runs entirely on
the user's own machine.

---

## 1. Project Structure

```
tick/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # active task list — NOT YET BUILT
│   │   ├── archive/page.tsx                  # archived tasks page — NOT YET BUILT
│   │   ├── layout.tsx, globals.css
│   │   └── api/
│   │       └── tasks/
│   │           ├── route.ts                  # GET (list+sort+filter), POST (create) ✅
│   │           └── [id]/
│   │               ├── route.ts              # PATCH (edit) ✅
│   │               └── archive/route.ts      # PATCH (archive) ✅
│   │
│   ├── lib/
│   │   ├── db.ts                             # SQLite connection singleton ✅
│   │   ├── schema.sql                        # tasks table definition ✅
│   │   ├── migrate.ts                        # applies schema.sql ✅
│   │   └── tasks.ts                          # business logic — createTask,
│   │                                          #   updateTask, archiveTask,
│   │                                          #   listTasks, isOverdue ✅
│   │
│   ├── components/                           # NOT YET BUILT
│   └── styles/                               # NOT YET BUILT
│
├── tests/
│   └── tasks.test.ts                         # 7 tests, business logic layer ✅
│
├── docs/
│   ├── third-party-code.md                   # ✅ (2 placeholders to fill in)
│   ├── database-design.md                    # ✅ complete
│   └── running-it.md                         # ✅ (2 placeholders to fill in)
│
├── ai-transcripts/
│   └── 01-project-planning.md
│
└── data/todo.db                              # created by `npm run migrate`
```

---

## 2. What's Implemented

### Database layer ✅
- Single `tasks` table: `title`, `description`, `due_date`, `topic`, `status`,
  `archived_at`, `created_at`, `updated_at`
- `status` constrained via `CHECK` to `Todo` / `In-Progress` / `Complete`
- Archiving = nullable `archived_at` timestamp — no delete, no copy-table,
  independent of `status`
- Overdue is **never stored** — derived at read time from `due_date` + `status`
- Indexes on `topic`, `status`, `due_date`, `archived_at`

### Business logic (`lib/tasks.ts`) ✅
- `createTask`, `updateTask` (partial updates), `archiveTask`, `listTasks`
  (whitelisted sort column + archived filter), `isOverdue` (pure function)
- All DB access parameterized, no Next.js dependency — testable in isolation

### API layer ✅
- `GET /api/tasks` — list, with `?sort=` and `?archived=` query params
- `POST /api/tasks` — create
- `PATCH /api/tasks/[id]` — edit
- `PATCH /api/tasks/[id]/archive` — archive
- Manually verified end-to-end via dev server (create → list → sort → update
  → archive → filter → restart-persists)

### Testing ✅
- `tests/tasks.test.ts` — 7 tests against a throwaway SQLite file (never the
  real `data/todo.db`), covering: task creation persists all 4 fields, edits
  persist on reload, archiving removes from active list but stays retrievable,
  sorting by topic/status/due_date, and the overdue rule (including the
  Complete-task edge case)
- Satisfies rubric minimum (3+ tests, deterministic, throwaway DB, single
  documented command: `npm test`)

### Documentation
- `database-design.md` — ✅ complete, matches shipped schema
- `third-party-code.md` — ✅ matches actual `package.json`; one dependency
  (`babel-plugin-react-compiler`) needs a quick check for whether it's
  actually wired up in `next.config.*` or should be removed
- `running-it.md` — ✅ structurally complete (install → migrate → dev/build →
  test); needs the real Node version and repo URL pasted in before submission

---

## 3. What's Next

1. **Frontend — task list page** (`app/page.tsx`)
   Fetch from `/api/tasks`, render active tasks, sort controls (topic/status/
   due date), visible overdue flag (not a status).

2. **Frontend — archive page** (`app/archive/page.tsx`)
   Fetch with `?archived=true`, read-only or lightly editable view.

3. **Frontend — create/edit form**
   4 required fields, status dropdown limited to the 3 fixed values.

4. **Components + CSS Modules**
   `TaskList`, `TaskForm`, `TaskRow`, `SortControls`, styled with plain CSS
   Modules (no Tailwind).

5. **Documentation placeholders**
   Fill in real Node version + repo URL in `running-it.md`; verify
   `babel-plugin-react-compiler` entry in `third-party-code.md`.

6. **Full clean-clone walkthrough**
   Test `running-it.md` literally from a fresh clone before submission —
   this is exactly what the functional walkthrough marking will do.

7. **Commit hygiene check**
   Confirm work is spread across enough distinct, well-described commits
   (rubric wants 6+, spread over multiple sessions) — worth reviewing
   `git log` before the deadline.