// tests/components/TaskRow.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskRow } from '../src/components/TaskRow';
import type { TaskWithOverdue } from '../src/lib/tasks';

function makeTask(overrides: Partial<TaskWithOverdue> = {}): TaskWithOverdue {
  return {
    id: 1,
    title: 'Sample task',
    description: 'Sample description',
    due_date: '2026-09-01',
    topic: 'Work',
    status: 'Todo',
    archived_at: null,
    created_at: '2026-08-01T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z',
    is_overdue: false,
    ...overrides,
  };
}

describe('TaskRow', () => {
  it('renders the task title, description, topic, and due date', () => {
    render(
      <TaskRow
        task={makeTask()}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
      />
    );

    expect(screen.getByText('Sample task')).toBeInTheDocument();
    expect(screen.getByText('Sample description')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText(/Due 2026-09-01/)).toBeInTheDocument();
  });

  it('shows the Overdue flag when is_overdue is true', () => {
    render(
      <TaskRow
        task={makeTask({ is_overdue: true })}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
      />
    );

    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('does not show the Overdue flag when is_overdue is false', () => {
    render(
      <TaskRow
        task={makeTask({ is_overdue: false })}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
      />
    );

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('calls onStatusChange with the task id and new status when the dropdown changes', () => {
    const onStatusChange = vi.fn();
    render(
      <TaskRow
        task={makeTask({ id: 42 })}
        onStatusChange={onStatusChange}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('Status for Sample task'), {
      target: { value: 'Complete' },
    });

    expect(onStatusChange).toHaveBeenCalledWith(42, 'Complete');
  });

  it('calls onEdit with the full task when Edit is clicked', () => {
    const onEdit = vi.fn();
    const task = makeTask();
    render(
      <TaskRow task={task} onStatusChange={vi.fn()} onEdit={onEdit} onArchive={vi.fn()} />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it('calls onArchive with the task id when Archive is clicked', () => {
    const onArchive = vi.fn();
    render(
      <TaskRow
        task={makeTask({ id: 7 })}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onArchive={onArchive}
      />
    );

    fireEvent.click(screen.getByText('Archive'));
    expect(onArchive).toHaveBeenCalledWith(7);
  });

  it('hides the Archive action when showArchiveAction is false', () => {
    render(
      <TaskRow
        task={makeTask()}
        onStatusChange={vi.fn()}
        onEdit={vi.fn()}
        onArchive={vi.fn()}
        showArchiveAction={false}
      />
    );

    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
  });
});