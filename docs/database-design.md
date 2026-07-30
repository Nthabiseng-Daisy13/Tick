# Database Design

## Overview

The application uses a single SQLite table, `tasks`. A single-user, local-only
to-do list with no user-customizable categories does not need a multi-table
relational design — the fixed status set and free-text topic are both modelled
as columns on the same row, with no foreign-key relationships required.

## Schema

```sql
CREATE TABLE tasks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      TEXT NOT NULL,
  topic         TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Todo'
                  CHECK (status IN ('Todo', 'In-Progress', 'Complete')),
  archived_at   TEXT DEFAULT NULL,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX idx_tasks_topic     ON tasks(topic);
CREATE INDEX idx_tasks_status    ON tasks(status);
CREATE INDEX idx_tasks_due_date  ON tasks(due_date);
CREATE INDEX idx_tasks_archived  ON tasks(archived_at);
```

## Column Reference

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-incrementing |
| `title` | TEXT | Required |
| `description` | TEXT | Optional |
| `due_date` | TEXT | Required. ISO 8601 date string |
| `topic` | TEXT | Required. Free text — see rationale below |
| `status` | TEXT | Required. Constrained to `'Todo'`, `'In-Progress'`, `'Complete'` |
| `archived_at` | TEXT | Nullable. `NULL` = active, timestamp = archived |
| `created_at` | TEXT | Set automatically on insert |
| `updated_at` | TEXT | Updated automatically on every edit or archive |

## Design Decisions

### Single table, no separate `topics` or `statuses` tables

Status is a **fixed, non-user-customizable** set of exactly three values, so it
doesn't need to exist as editable rows in its own table — it's enforced
directly with a `CHECK` constraint at the database level, which is stronger
than validating it only in application code.

Topic has no requirement for management (renaming, merging, deleting topics),
so it is modelled as a free-text column rather than a normalized relationship.
This keeps the schema simple and avoids introducing a relationship the
specification doesn't call for.

### Archiving is a nullable timestamp, not a delete or a copy

The specification requires that a task **cannot be deleted, only archived,
and must remain viewable**. `archived_at` satisfies this directly: archiving a
task sets this timestamp on the same row; the row is never deleted and never
copied to a separate table. An active task has `archived_at = NULL`; an
archived task has a real timestamp. Filtering active vs. archived tasks is a
simple `WHERE archived_at IS NULL` / `WHERE archived_at IS NOT NULL` clause
against the same table.

**Archiving is independent of status.** A task can be archived while in any
of the three statuses (Todo, In-Progress, or Complete) — archiving only
changes visibility, not workflow state. This preserves real information (e.g.
distinguishing a task archived because it was finished from one archived
because it was abandoned) rather than collapsing that distinction by forcing
a status change on archive.

### "Overdue" is not stored anywhere

Overdue is not a column and not a fourth status. It is computed at read time
from two existing columns:

```
is_overdue = due_date < now() AND status != 'Complete'
```

This is deliberate: storing overdue as a column would risk it going stale —
for example, if a task's due date is edited to a future date, a stored
overdue flag would need a separate update to stay correct, whereas a derived
value can never drift out of sync with the data it depends on. This also
means overdue status correctly disappears the moment a task is marked
Complete, with no extra logic required.

### Timestamps as ISO 8601 text

SQLite has no native datetime type. ISO 8601 strings (e.g.
`2026-08-15T10:30:00.000Z`) sort and compare correctly as plain text, and
parse directly with JavaScript's `new Date(...)`, so no conversion layer is
needed between the database and the application code.

### Indexes

Indexes on `topic`, `status`, `due_date`, and `archived_at` support the two
most frequent query patterns in the application: sorting the task list by any
of the three required columns, and filtering active vs. archived tasks on
every list request.

## Relationships

There are no foreign-key relationships in this schema — all task data lives
on a single row in the `tasks` table, which is sufficient for the application's
requirements as specified.


[This document was written with the assistance of Claude Web Sonnet 5 ]