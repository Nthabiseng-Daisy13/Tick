# AI Usage Transcript

## Session: Improving the Task Management Features

### Prompt 1

> I want to build the due time feature and implement it in creation of
> tasks, where user can set due time for task, its optional, and if not
> set should default to 13h00. I also want to improve the calendar
> design when choosing due date, because now it's just a bland default
> calendar.

### AI Response

Suggested: - Keep the existing database schema. - Store the due time
together with the existing `due_date` column as an ISO datetime
string. - Default the time to **13:00** if the user does not specify
one. - Replace the browser's native date picker with
**react-datepicker** for a more polished calendar.

### My Decision

Accepted the recommendation to: - keep a single `due_date` field, -
store date and time together, - improve the date picker using
`react-datepicker`.

------------------------------------------------------------------------

## Session: Rearranging Task Layout

### Prompt

> I want the layout to be: Title on the first line, description on the
> second line, topic on the third line and due date and time together on
> the last line.

### AI Response

Suggested changes to: - `TaskRow.tsx` - format the due date and time -
rearrange the metadata display.

### My Decision

Accepted the layout changes and implemented them.

------------------------------------------------------------------------

## Session: Completing Tasks Using a Checkbox

### Prompt

> I want to change the current way of marking a task as complete. I want
> to add the common circular checkbox on the left of each task.

### AI Response

Initially suggested replacing the status selector entirely.

### My Feedback

I rejected that suggestion because it did **not** satisfy my
requirements.

I clarified:

> The checkbox must be on the left-hand side in the middle of the card.
> I should still be able to transition to other statuses as well.

### AI Response

Revised the solution by: - keeping the status dropdown, - adding a
circular checkbox on the left, - allowing the checkbox to toggle
Complete, - keeping Todo and In-Progress selectable from the dropdown, -
suggesting a light green completed card with crossed-out text.

### My Decision

Accepted the revised implementation.

------------------------------------------------------------------------

## Session: CSS Improvements

### Prompt

I supplied my `TaskRow.module.css` file and asked for a corrected
version after my implementation attempts.

### AI Response

Produced a cleaned-up stylesheet that: - positioned the checkbox
correctly, - improved spacing, - styled completed cards, - preserved
responsiveness, - maintained the existing design language.

### My Decision

Accepted the revised CSS.

------------------------------------------------------------------------

## Session: Calendar Improvements

### Prompt

> The calendar improvement was not implemented.

### AI Response

Recommended replacing the browser calendar with `react-datepicker`.

Provided: - installation instructions, - component code, - styling
suggestions.

### My Decision

Accepted the recommendation.

------------------------------------------------------------------------

## Session: Date Picker Configuration

### Prompt

I showed my updated `TaskForm.tsx` and asked whether it was correct.

### AI Response

Reviewed the implementation and identified several improvements,
including: - handling editing correctly, - avoiding timezone issues, -
preserving the default time, - improving the date picker configuration.

### My Decision

Accepted the suggested corrections.

------------------------------------------------------------------------

## Session: Time Picker Improvements

### Prompt

> The time picker also needs some work.

### AI Response

Suggested: - replacing the browser time input with a styled time
selector, - improving alignment with the new calendar, - making the
controls visually consistent.

### My Decision

Accepted the styling improvements while keeping the native HTML time
input.

------------------------------------------------------------------------

## Session: Improving TaskForm CSS

### Prompt

I provided my `TaskForm.module.css` and requested a complete corrected
version.

### AI Response

Produced a reorganized stylesheet that: - improved spacing, - styled the
calendar, - improved responsiveness, - kept a consistent appearance
across inputs.

### My Decision

Accepted the revised stylesheet.

------------------------------------------------------------------------

## Session: Project Planning

### Prompt

> Give me ideas on what to focus on next.

### AI Response

Initially suggested several feature improvements beyond the project
requirements.

### My Feedback

I redirected the AI by stating:

> These are the requirements, so based on the requirements rewrite your
> previous suggestions.

### AI Response

Produced a revised checklist focused strictly on: - testing, -
documentation, - database correctness, - commit history, - AI
transcript, - project polishing.

### My Decision

Accepted the revised recommendations because they matched the assignment
rubric.

------------------------------------------------------------------------

## Session: Updating Tests

### Prompt

After introducing due times, several tests failed because the expected
date format had changed.

I provided the failing test output.

### AI Response

Explained that: - the application now stores full ISO datetime values, -
the tests were still expecting date-only strings.

Suggested updating: - `tasks.test.ts` - `TaskForm.test.tsx` -
`TaskRow.test.tsx`

to reflect the new behaviour.

The AI also identified a potential timezone issue caused by creating
JavaScript `Date` objects from ISO date strings.

### My Decision

Accepted the recommendation to update the tests to match the new feature
and investigate the timezone handling separately.

------------------------------------------------------------------------

# Summary

Throughout development, the AI was used for: - planning
implementation, - generating code, - reviewing existing code, -
debugging failing tests, - improving UI design, - suggesting CSS
improvements, - identifying implementation issues.

The final implementation was guided by my own project requirements. In
several cases, I rejected or redirected AI-generated suggestions (for
example, the initial task completion implementation and the feature
suggestions beyond the assignment scope), and the final solution
reflects those corrections rather than the AI's initial responses.
