# Tick — Project Context & Development Guide

**Purpose of this file:** a complete, self-contained snapshot of the project —
what it is, what's built, why key decisions were made, and what's left — so
that development can be picked up cold, including by a different LLM session
with no prior conversation history.

> This file is for development context. It is **not** one of the three
> required grading documents — those live in `docs/` (`third-party-code.md`,
> `database-design.md`, `running-it.md`) and must stay accurate independently
> of this file.

---

## 1. What this project is

A **local-first to-do app** built for a university software design lab. Key
constraints from the brief:

- Runs entirely on the user's own machine via Node/npm — no deployment, no
  user accounts, single user.
- Tasks have exactly four fields: **Title, Description, Due Date, Topic**.
- Tasks can be **created, edited, and archived — never deleted**.
- Exactly **three fixed statuses**: `Todo`, `In-Progress`, `Complete` — not
  user-customizable.
- **Overdue** must be indicated, but is explicitly **not a fourth status**.
- The task list must be **viewable and sortable** by topic, status, and due
  date.
- Data must **persist across restarts**.
- Submission requires: 3+ real (non-trivial) tests runnable from one
  documented command, and three specific markdown docs (see `docs/`).

Everything beyond this feature set (calendar view, statistics page) is a
personal extension layered on top, not part of the graded requirement — see
§8.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) | Frontend + API routes in one project, no separate backend needed |
| Database | SQLite via `better-sqlite3` | Synchronous driver, appropriate for a single-user local app with no concurrent-write concerns |
| Test runner | Vitest + `@testing-library/react` + `jsdom` | Fast, Vite-native, minimal config, supports both business-logic and component tests |
| Styling | Plain CSS Modules | No Tailwind, per explicit project choice |
| Directory layout | `src/` | All app code lives under `src/`; `tests/`, `docs/`, `public/`, config files stay at project root |

Full dependency list with individual justifications is in
`docs/third-party-code.md` — keep that file in sync with `package.json` as
the source of truth; don't duplicate reasoning here that could drift out of
sync.

---

## 3. Database design (implemented, documented, tested)

Single table, no foreign keys. Full rationale is in
`docs/database-design.md` — summarized here for quick reference:

```sql
CREATE TABLE tasks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      TEXT NOT NULL,              -- ISO 8601 date/datetime string
  topic         TEXT NOT NULL,               -- free text, no topics table
  status        TEXT NOT NULL DEFAULT 'Todo'
                  CHECK (status IN ('Todo', 'In-Progress', 'Complete')),
  archived_at   TEXT DEFAULT NULL,           -- NULL = active; timestamp = archived
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
```

**Load-bearing design decisions — do not casually change these:**

1. **Archiving is a nullable timestamp on the same row**, never a delete,
   never a copy to another table.
2. **Archiving and `status` are independent.** A task can be archived in any
   status. Archiving never modifies `status`.
3. **Overdue is never stored.** It's computed at read time:
   `due_date < now() AND status != 'Complete'`. This logic exists in exactly
   one place: `isOverdue()` in `src/lib/tasks.ts`. Every layer above it
   (API, frontend) reads the already-computed `is_overdue` field rather than
   recalculating it.
4. **`status` is enum-constrained at the DB level** via `CHECK`, not just
   validated in application code.
5. **Topic is free text**, not a normalized `topics` table — there's currently
   no topic-management requirement. (This will need to change if the
   "editable topic dropdown" idea from §8 is implemented — see the note
   there.)

---

## 4. Business logic layer — `src/lib/`

- **`db.ts`** — SQLite connection singleton. Path resolved from
  `process.env.DB_PATH` if set (used by tests for a throwaway file),
  otherwise defaults to `data/todo.db`. Exports `getDb()` and
  `resetDbConnection()` (the latter needed so tests can force a fresh
  connection after swapping `DB_PATH`).
- **`schema.sql`** — the `CREATE TABLE`/index statements above.
- **`migrate.ts`** — applies `schema.sql` to whatever `getDb()` points at.
  Exported as `migrate()` (used directly by tests) and runnable standalone
  via `npm run migrate`.
- **`tasks.ts`** — all business logic. No Next.js imports — this is
  deliberate, so it's testable as plain TypeScript without spinning up the
  app. Exports:
  - `createTask(data: TaskInput): TaskWithOverdue`
  - `updateTask(id, data: Partial<TaskInput>): TaskWithOverdue` — partial
    update, only provided fields change
  - `archiveTask(id): TaskWithOverdue`
  - `getTaskById(id): TaskWithOverdue | null`
  - `listTasks(opts: { sort?, direction?, includeArchived? }): TaskWithOverdue[]`
    — `sort` is checked against a **whitelist** (`topic`, `status`,
    `due_date`) before being interpolated into SQL, since column/direction
    names can't be parameterized the normal way
  - `isOverdue(task, now = new Date()): boolean` — pure function, no DB
    access, takes an injectable `now` for deterministic testing
  - `getStats(): TaskStats` — aggregate counts for the statistics page
    (active/archived totals, counts by status, overdue count, completion
    rate, counts by topic). Reuses `listTasks`/`isOverdue` rather than
    duplicating the overdue rule in raw SQL.

**Convention to preserve:** every function that mutates data re-fetches and
returns the row via `getTaskById` afterward, rather than trusting the
in-memory value — keeps the return value provably in sync with what's
actually in the database.

---

## 5. API layer — `src/app/api/`

Thin wrappers only — no business logic lives in route handlers.

| Route | Method | Calls | Notes |
|---|---|---|---|
| `/api/tasks` | GET | `listTasks` | Query params: `?sort=`, `?archived=true\|false` |
| `/api/tasks` | POST | `createTask` | Returns 201 + created task, or 400 on validation failure |
| `/api/tasks/[id]` | PATCH | `updateTask` | 404 if task doesn't exist, 400 on invalid status |
| `/api/tasks/[id]/archive` | PATCH | `archiveTask` | 404 if task doesn't exist |
| `/api/stats` | GET | `getStats` | No params |

There is **no DELETE route anywhere** — this is intentional, architectural
enforcement of "cannot be deleted."

Next.js 16 note: dynamic route params (`[id]`) are typed as a `Promise` and
must be awaited — `const { id } = await params;` — this is a Next 16 change
from earlier versions.

---

## 6. Frontend

### Layout & navigation
`src/app/layout.tsx` — sidebar layout (not a top header). Sidebar contains
the brand mark (`DaisyIcon` + "Tick" wordmark) and nav links: **Active**,
**Archive**, **Calendar**, **Statistics**.

### Pages
| Path | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Active task list |
| `/archive` | `app/archive/page.tsx` | Archived tasks (same components, `archived=true`) |
| `/calendar` | `app/calendar/page.tsx` | Month grid, client-side only, no calendar library |
| `/stats` | `app/stats/page.tsx` | Aggregate counts, completion bar, per-status/per-topic breakdowns |

### Components — `src/components/`
- **`TaskList.tsx`** — the only component that talks to the API. Fetches on
  mount and whenever sort changes; refetches after every mutation. Renders
  `SortControls`, `TaskForm` (conditionally, for create/edit), and a list of
  `TaskRow`.
- **`TaskRow.tsx`** — presentational only. Displays task data; status
  changes via an inline colored-pill `<select>`; Edit/Archive buttons call
  back up to `TaskList`. `showArchiveAction` prop hides the Archive button on
  the archive page (can't re-archive an archived task).
- **`TaskForm.tsx`** — shared between create and edit (`initialTask` prop
  distinguishes the two). Status field only shown when editing (new tasks
  always start as `Todo`). Client-side validation on the three required
  fields; values trimmed before submit.
- **`SortControls.tsx`** — three toggle buttons (topic/status/due date),
  `aria-pressed` reflects active state.
- **`DaisyIcon.tsx`** — small inline SVG brand mark, white petals + accent
  center dot, reused in the sidebar.

### Visual design system
Palette is fixed to four specific colors the project owner supplied, plus
one **derived** dark ink color for text legibility (none of the four are
dark enough to use as text):

```css
--paper: #f9f5f6;        /* page background, lightest */
--border/todo-bg: #f8e8ee;
--in-progress-bg: #fdcedf;
--sidebar/complete-bg: #f2bed1;   /* deepest of the four */
--ink (derived, not in the original 4): #4a2a37;
--sidebar-ink (derived): #5c2e42;
--overdue: #d64550;      /* deliberately NOT part of the pink family —
                             a warning signal needs to stay visually
                             distinct from neutral status colors */
```

Status pills (Todo/In-Progress/Complete) are differentiated by **pink
intensity** (lightest → mid → deepest) rather than by hue — Overdue is the
only non-pink signal anywhere in the UI. If pills ever feel too similar at a
glance, the fix is to widen the contrast between the three tiers, not to
introduce new hues, to keep the palette request intact.

No Tailwind. No CDN font loading (app is meant to work fully offline/local —
system font stack only).

**Explicit assumption on record:** an early design reference image showed a
fixed 3-column Kanban board. That structure was **not** adopted, because the
brief requires a single list sortable by topic/status/due date — a
permanent 3-column split would work against that requirement. Only the
visual language (sidebar, cards, colored pills) was borrowed from the
reference, not the Kanban structure itself.

---

## 7. Testing

Three test files, all runnable via the single documented command:

```bash
npm test
```

- **`tests/tasks.test.ts`** — business logic layer, against its own
  throwaway SQLite file (`data/test-tasks.db`, deleted after each test).
  Covers: task creation (all 4 fields persist), edit persistence, archiving
  (removed from active list, retrievable both via `includeArchived` and
  `getTaskById`), sorting by all three required columns, and `isOverdue`
  (both the true case and the Complete-task-not-overdue edge case).

- **`tests/api.test.ts`** — calls the actual route handler functions
  directly (no running server needed — `GET`/`POST`/`PATCH` are just
  functions taking a `Request`), against a **separate** throwaway file
  (`data/test-api.db`) so it never collides with `tasks.test.ts`. Exists
  specifically because passing business-logic tests doesn't prove the HTTP
  layer (status codes, query param parsing, request body parsing) is
  correct. Covers create/list/sort/update/archive plus a 404-on-missing-task
  case and a 400-on-invalid-input case.

- **`tests/components/*.test.tsx`** — `TaskRow`, `TaskForm`, `SortControls`,
  using `@testing-library/react` + `jsdom`. Covers rendering, conditional UI
  (overdue flag shown/hidden, archive button shown/hidden, create vs edit
  mode), and callback firing with correct arguments on every user action
  (status change, edit, archive, cancel, sort).

**Deliberately not automated:** responsive CSS layout (`@media` breakpoints).
`jsdom` doesn't compute real layout, so a test here would either always pass
regardless of correctness or require a much heavier tool (e.g. Playwright)
that wasn't judged worth the added dependency/scope for this lab. Responsive
behavior should be verified manually by resizing the browser — worth a line
in `docs/running-it.md` or a QA notes section saying so explicitly, so this
isn't mistaken for an oversight.

**Test infrastructure conventions to preserve:**
- Every test file that touches the DB sets its own unique `DB_PATH` before
  importing `db.ts`, and resets/deletes the file in `beforeEach`/`afterEach`
  via `resetDbConnection()`.
- Component tests build a `makeTask(overrides)` helper rather than
  duplicating a full task object in every test.
- `vitest.config.ts` uses `environment: 'jsdom'` globally and
  `tests/setup.ts` imports `@testing-library/jest-dom` once for all files.

---

## 8. Deliberately deferred / not yet built

These were discussed but **explicitly not started**, because each has real
implications worth planning for rather than bolting on:

- **Due time** (not just due date) — would extend `due_date` to a full ISO
  datetime rather than adding a new column, to keep the `isOverdue`
  comparison (`due_date < now()`) working unchanged at finer precision.
  Low risk.
- **User-editable topic list (dropdown)** — this **reverses a documented
  decision**: topic is currently free text specifically because there's no
  topic-management requirement, and `docs/database-design.md` justifies that
  choice explicitly. Implementing this means introducing a `topics` table, a
  foreign key on `tasks`, a migration path for existing free-text values,
  and a rewrite of that section of the docs. Do this **last**, and update
  `docs/database-design.md` as part of the same change, not after.
- **Calendar and Statistics pages** — these ARE built (§6), included here
  only to note they were originally proposed alongside due-time/topics but
  carried no schema risk, which is why they were built first.

---

## 9. Documentation status (`docs/`)

- **`database-design.md`** — complete, matches shipped schema.
- **`third-party-code.md`** — matches `package.json`; one flagged item:
  confirm whether `babel-plugin-react-compiler` is actually referenced in
  `next.config.*` — if not wired up, either remove the dependency or note
  honestly that it's an unused scaffold default, don't leave an unverified
  justification in place.
- **`running-it.md`** — structurally complete (install → migrate → dev/build
  → test) but has **two placeholders that must be filled before
  submission**: the real `node --version` output, and the actual repo URL.
  This file should be tested literally from a clean clone before submission
  — that's exactly what the marked functional walkthrough will do.

---

## 10. Remaining checklist before submission

- [ ] Fill in `running-it.md` placeholders (Node version, repo URL)
- [ ] Verify/resolve the `babel-plugin-react-compiler` question in
      `third-party-code.md`
- [ ] Full clean-clone walkthrough of `running-it.md`, literally, start to
      finish
- [ ] Review `git log` for commit count (6+ required) and message quality —
      spread across multiple real sessions, not one bulk dump
- [ ] Confirm `npm test` runs standalone with no manual setup step (it
      should — each test file manages its own throwaway DB)
- [ ] Manual responsive-layout check across breakpoints (not automated —
      see §7)
- [ ] AI-usage transcripts up to date in `ai-transcripts/` (currently two
      files: `01-project-planning.md`, `02-implementation-and-frontend.md`)

---

## 11. Conventions to preserve if extending this project

- Business logic never imports from Next.js — keep `lib/` framework-agnostic
  and testable in isolation.
- API routes stay thin: parse request → call `lib/` function → shape
  response. No query logic in route handlers.
- Any new sortable/filterable column must go through the same whitelist
  pattern as `SORTABLE_COLUMNS` in `tasks.ts` — never interpolate raw
  user-supplied strings into SQL.
- Any new derived value (like `is_overdue`) should be computed once in
  `lib/tasks.ts` and attached to the object returned to callers — never
  recomputed independently in the API layer or the frontend.
- New components should stay presentational where possible; only
  `TaskList`-style container components should own `fetch` calls.
- New CSS should use the existing CSS variables (`globals.css`) rather than
  introducing new hardcoded colors, to keep the four-color constraint intact.