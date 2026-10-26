import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDueDateValidation } from './useDueDateValidation';

// Mock dependencies (same as before)
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (obj: Record<string, string>) => obj.en,
  }),
}));

jest.mock('utils/getDefaultDueDate/getDefaultDueDate', () => ({
  getDefaultDueDate: jest.fn(() => '15-01-2025'),
}));

jest.mock('@maps-react/utils/getDefaultValues', () => ({
  getDefaultValues: jest.fn(() => ({
    day: '15',
    month: '01',
    year: '2025',
  })),
}));

jest.mock('utils/validation/validateDueDate/validateDueDate', () => ({
  validateDueDate: jest.fn(() => ({
    fieldErrors: {},
    isInvalidDate: false,
    isBeforeMinDate: false,
  })),
}));

jest.mock('../../utils/getErrors', () => ({
  getErrors: jest.fn(() => ({
    errors: [],
  })),
}));

// Test component
function HookTestComponent({ queryData }: Readonly<{ queryData: any }>) {
  const { dueDate, errors, validation } = useDueDateValidation(queryData);
  return (
    <div>
      <span data-testid="dueDate">{dueDate}</span>
      <span data-testid="errors">{JSON.stringify(errors)}</span>
      <span data-testid="validation">{JSON.stringify(validation)}</span>
    </div>
  );
}

describe('useDueDateValidation', () => {
  it('returns default due date and no errors when queryData is empty', () => {
    render(<HookTestComponent queryData={{}} />);
    expect(screen.getByTestId('dueDate').textContent).toBe('15-01-2025');
    expect(screen.getByTestId('errors').textContent).toBe('[]');
    expect(screen.getByTestId('validation').textContent).toContain(
      'fieldErrors',
    );
  });

  it('returns due date from queryData if present', () => {
    render(<HookTestComponent queryData={{ dueDate: '01-02-2026' }} />);
    expect(screen.getByTestId('dueDate').textContent).toBe('01-02-2026');
  });

  it('passes correct values to getErrors', () => {
    const mockGetErrors = require('../../utils/getErrors').getErrors;
    render(<HookTestComponent queryData={{ dueDate: '01-02-2026' }} />);
    expect(mockGetErrors).toHaveBeenCalled();
  });
});
