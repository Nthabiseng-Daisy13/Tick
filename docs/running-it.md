# Running It

**Node version:** `v24.13.1`

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

This command creates `data/todo.db` (if it does not already exist) and applies the database schema. It is safe to run multiple times and will not overwrite existing task data.

## Run (development)

```bash
npm run dev
```

Once the development server has started, open **http://localhost:3000** in your web browser.

## Build (production)

```bash
npm run build
npm start
```

## Test

```bash
npm test
```

The test suite runs against a separate temporary SQLite database and does not modify `data/todo.db`.

---

*This document was prepared with the assistance of Claude Web (Sonnet 5) and ChatGPT (GPT-5.5). The final content was reviewed and verified by the author.*