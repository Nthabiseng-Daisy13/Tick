# Database Design

*Draft — schema not yet implemented. To be completed once `lib/schema.sql` exists.*

## Planned approach

- Single `tasks` table (no separate topics/status tables — status is
  constrained via a `CHECK` constraint to the three fixed values).
- Archiving implemented as a nullable `archived_at` timestamp column on the
  task row itself — never a delete, never a copy to a separate table.
- "Overdue" is not stored anywhere. It's computed at read time from
  `due_date` and `status`, so it can never drift out of sync with the data
  it depends on.