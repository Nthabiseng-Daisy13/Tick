# AI Usage Transcript — Project Planning & Setup

**Tool used:** Claude (Anthropic) Web Sonnet 5
**Purpose:** Breaking down lab requirements, planning architecture, and scaffolding the Next.js/SQLite project structure.

---

## Exchange 1: Requirements breakdown and planning

**Prompt:**
> I have a lab in software design that requires creating a to-do app. I want you to breakdown the specifications, what exactly is expected and required and assist with the planning. A breakdown and step-by-step assistance on where to start and the workflow. this plan must include: requirements breakdown, database, APIs, business logic, frontend, testing and deployment. Along with documentation and how to best go on about it. Output a structured answer in the form form of text

**Response summary:**
Claude broke the brief into: functional requirements (CRUD/archive-not-delete, fixed 3 statuses, derived overdue flag, sortable list, persistence), hidden rubric traps (overdue must not be stored as a column/status, archive must be a flag not a copy-table, commit history matters as much as DB design), a suggested stack (Next.js + better-sqlite3 + Vitest + regular CSS), a full database schema with `archived_at` timestamp and `CHECK` constraint on status, an API route table, a business-logic module design (`lib/tasks.ts`) isolated from routes for testability, a testing strategy requiring a throwaway DB and deterministic date handling, a documentation outline matching the three required rubric sections, a session-by-session commit plan, and guidance on the AI-usage transcript requirement.

**Constraint stated up front by author:** requirements must include requirements breakdown, database, APIs, business logic, frontend, testing, deployment, and documentation — structured as text output.

---

## Exchange 2: Clarifying AI transcript format

**Prompt:**
> for the AI usage transcript, do i need to copy and paste the entire conversation or just write summaries of my prompt and the answers?

**Response summary:**
Claude pointed to the rubric's requirement that "decisions visible in the transcript are traceable to the shipped code," and recommended keeping full/raw exports for decision-relevant exchanges (schema design, overdue-as-derived debate, archive-flag vs delete) rather than paraphrased summaries, since summaries can obscure the actual correction moment the rubric rewards. Suggested trimming only genuinely irrelevant back-and-forth, and organizing transcripts into a few session-based files rather than one dump.

---

## Exchange 3: Project setup (Next.js + SQLite + Vitest, Windows/VS Code)

**Prompt:**
> i created a gitbuh repository and i am working on a windows machine using VS code. i want to get started on the project setup using the suggested stack: Next.js and SQLITE, vitest, and regular CSS not tailwind. How do i set it up properly. I want the file structure, and what goes where in the files. from frontend, backend, api etc

**Constraints stated up front by author:** Windows machine, VS Code, Next.js + SQLite + Vitest, regular CSS (explicitly not Tailwind).

**Response summary:**
Claude provided the `create-next-app` scaffold command with explicit prompt choices (No to Tailwind, Yes to TypeScript/App Router), a Windows-specific note about `better-sqlite3` native compilation and build tools, a full file structure (`app/`, `lib/`, `components/`, `styles/`, `tests/`, `docs/`, `ai-transcripts/`, `data/`), and concrete file contents for `lib/db.ts` (connection singleton keyed off `process.env.DB_PATH` to support a throwaway test DB), `lib/tasks.ts` (pure business logic functions including `isOverdue`), a thin `app/api/tasks/route.ts` wrapper, a CSS Modules example, `vitest.config.ts` and `tests/setup.ts`, `package.json` scripts, and `.gitignore` entries to keep the local SQLite file out of version control.

---

## Exchange 4: Adjusting for `src/` directory

**Prompt:**
> im using src/ directory, does that change my file structure?

**Response summary:**
Claude clarified which folders move inside `src/` (`app/`, `lib/`, `components/`, `styles/`) versus which stay at the project root (`public/`, config files, `tests/`, `docs/`, `ai-transcripts/`), and flagged the two config changes actually required: the `@/*` path alias in `tsconfig.json` and the matching alias in `vitest.config.ts` needing to point at `./src`. Noted that `process.cwd()`-based paths (e.g. the SQLite data file location) are unaffected by the `src/` move since they resolve from the project root regardless.

---

## Notes on AI usage for this project

- All architectural decisions (schema shape, archive-as-flag, overdue-as-derived-value, thin API layer over isolated business logic) were proposed by the AI based on constraints I stated from the rubric, and I've kept them because they matched the rubric's requirements — this traceability is intentional and should be cross-checked against the shipped code before submission.
- This file will be supplemented with further transcripts as implementation, debugging, and testing sessions happen (e.g. `02-schema-implementation.md`, `03-debugging-....md`), each covering one coherent work session per the commit/session plan discussed above.