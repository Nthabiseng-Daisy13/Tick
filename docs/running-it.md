# Running It

**Node version:** `v22.14.0`

**Minimum required Node version: 22.13.0.** This app uses Node's built-in
`node:sqlite` module for database access, which does not exist at all in
Node versions earlier than 22.13.0 (attempting to run with an older Node
version will fail immediately with `ERR_UNKNOWN_BUILTIN_MODULE`). If you use
[nvm-windows](https://github.com/coreybutler/nvm-windows) or
[nvm](https://github.com/nvm-sh/nvm), install and switch to a Node 22.13+ or
later version before continuing.

## Install

```bash
git clone https://github.com/Nthabiseng-Daisy13/Tick.git
cd tick
npm install
```

## Set up the database

```bash
npm run migrate
```

This command creates `data/todo.db` (if it does not already exist) and
applies the database schema. It is safe to run multiple times and will not
overwrite existing task data.

**Note:** you will see a warning printed during this step —
`ExperimentalWarning: SQLite is an experimental feature and might change at
any time`. This is expected and harmless; it comes from Node's built-in
`node:sqlite` module and does not indicate a problem.

## Run (development)

```bash
npm run dev
```

Once the development server has started, open **http://localhost:3000** in
your web browser.

## Build (production)

```bash
npm run build
npm start
```

## Test

```bash
npm test
```

The test suite runs against separate, temporary SQLite databases and does
not modify `data/todo.db`.

## Troubleshooting

- **`Error [ERR_UNKNOWN_BUILTIN_MODULE]: No such built-in module: node:sqlite`**
  — your Node version is older than 22.13.0. Install a newer version (see
  the Node version note above) and re-run.
- **`ExperimentalWarning: SQLite is an experimental feature...`** — expected,
  not an error; safe to ignore.

---

*This document was prepared with the assistance of Claude Web (Sonnet 5) and ChatGPT (GPT-5.5). The final content was reviewed and verified by the author.*