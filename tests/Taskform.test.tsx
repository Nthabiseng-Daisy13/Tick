// tests/components/TaskForm.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from '../src/components/TaskForm';
import type { TaskWithOverdue } from '../src/lib/tasks';

describe('TaskForm — create mode', () => {
  it('renders as a "New task" form with no status field', () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText('New task')).toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('submits trimmed values when all required fields are filled', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('What needs doing?'), {
      target: { value: '  Buy milk  ' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. Work, Errands'), {
      target: { value: '  Errands  ' },
    });

    const dueDateInput = screen.getByLabelText('Due date') as HTMLInputElement;
    fireEvent.change(dueDateInput, { target: { value: '2026-09-15' } });

    fireEvent.click(screen.getByText('Add task'));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Buy milk',
      description: '',
      due_date: '2026-09-15T13:00:00',
      topic: 'Errands',
      status: 'Todo',
    });
  });

  it('shows a validation error and does not submit when required fields are missing', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByText('Add task'));

    expect(
      screen.getByText('Title, due date, and topic are required.')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});

describe('TaskForm — edit mode', () => {
  const existingTask: TaskWithOverdue = {
    id: 5,
    title: 'Existing task',
    description: 'Existing description',
    due_date: '2026-09-10',
    topic: 'Work',
    status: 'In-Progress',
    archived_at: null,
    created_at: '2026-08-01T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z',
    is_overdue: false,
  };

  it('renders as "Edit task", pre-filled, with a status field visible', () => {
    render(<TaskForm initialTask={existingTask} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText('Edit task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('submits the updated status alongside unchanged fields', () => {
    const onSubmit = vi.fn();
    render(<TaskForm initialTask={existingTask} onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByDisplayValue('In-Progress'), {
      target: { value: 'Complete' },
    });
    fireEvent.click(screen.getByText('Save changes'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Existing task', status: 'Complete' })
    );
  });
});