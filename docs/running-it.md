# Running It

**Node version:** `v24.13.1`

## Install

```bash
git clone <PASTE YOUR REPO URL HERE>
cd tick
npm install
```

## Set up the database

```bash
npm run migrate
```

This creates `data/todo.db` and applies the schema. Safe to run again later —
it will not overwrite existing data.

## Run (development)

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Build (production)

```bash
npm run build
npm start
```

## Test

```bash
npm test
```

Tests run against a separate, throwaway SQLite file and do not touch
`data/todo.db`.



[This document was written with the assistance of Claude Web Sonnet 5 ]