// tests/components/SortControls.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortControls } from '../src/components/SortControls';

describe('SortControls', () => {
  it('renders a button for each sort field', () => {
    render(<SortControls value="due_date" onChange={vi.fn()} />);

    expect(screen.getByText('Due date')).toBeInTheDocument();
    expect(screen.getByText('Topic')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('marks the currently active field as pressed', () => {
    render(<SortControls value="topic" onChange={vi.fn()} />);

    expect(screen.getByText('Topic')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Due date')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the clicked field', () => {
    const onChange = vi.fn();
    render(<SortControls value="due_date" onChange={onChange} />);

    fireEvent.click(screen.getByText('Status'));
    expect(onChange).toHaveBeenCalledWith('status');
  });
});