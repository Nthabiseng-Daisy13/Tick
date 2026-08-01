# Tick

Tick is a local-first to-do application built with **Next.js**, **TypeScript**, and **SQLite** for the COMS3011A Software Design Lab 1.

The application allows a single user to:

- Create tasks
- Edit existing tasks
- Archive tasks (without deleting them)
- View archived tasks
- Sort tasks by:
  - Topic
  - Status
  - Due date
- Mark tasks as Todo, In-Progress, or Complete
- Highlight overdue tasks
- Persist all data in a local SQLite database

---

## Requirements

- Node.js **v24.13.1**
- npm

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Nthabiseng-Daisy13/Tick.git
cd tick
```

Install dependencies:

```bash
npm install
```

---

## Database Setup

Create the SQLite database and apply the schema:

```bash
npm run migrate
```

This creates:

```
data/todo.db
```

Running the migration again is safe and will not overwrite existing data.

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Running Tests

Run all tests with:

```bash
npm test
```

The tests use a separate temporary SQLite database and do not modify the application's data.

---

## Production Build

```bash
npm run build
npm start
```

---

## Documentation

Additional documentation is provided in the repository:

- `README.md` – project overview and setup instructions
- `Running It.md` – detailed installation and execution instructions
- `Database Design.md` – database schema and design decisions
- `Third-Party Code.md` – libraries used and why they were chosen
- `AI Transcript.md` – transcript of AI-assisted development

---

## Technologies Used

- Next.js
- React
- TypeScript
- SQLite
- better-sqlite3
- Vitest
- React Testing Library

---

## Author

COMS3011A Software Design – Lab 1

University of the Witwatersrand