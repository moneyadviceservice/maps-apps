import type { ReactNode } from 'react';

import { useErrorSummary } from 'hooks/useErrorSummary';
import { render, screen } from '@testing-library/react';

import { FieldError } from './FieldError';

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    testId?: string;
  }) => <div data-testid={props.testId}>{children}</div>,
}));

describe('FieldError', () => {
  const mockUseErrorSummary = useErrorSummary as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    mockUseErrorSummary.mockReturnValue({
      fieldErrors: {},
    });

    render(
      <FieldError fieldKey="testField">
        <p>Child content</p>
      </FieldError>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('does not show error when none exists', () => {
    mockUseErrorSummary.mockReturnValue({
      fieldErrors: {},
    });

    render(
      <FieldError fieldKey="testField">
        <p>Child content</p>
      </FieldError>,
    );

    expect(screen.queryByTestId('testField-error')).not.toBeInTheDocument();
  });

  it('shows error when present', () => {
    mockUseErrorSummary.mockReturnValue({
      fieldErrors: {
        testField: ['This field is required'],
      },
    });

    render(
      <FieldError fieldKey="testField">
        <p>Child content</p>
      </FieldError>,
    );

    expect(screen.getByTestId('testField-error')).toBeInTheDocument();

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('passes error to Errors wrapper', () => {
    mockUseErrorSummary.mockReturnValue({
      fieldErrors: {
        testField: ['Something went wrong'],
      },
    });

    render(
      <FieldError fieldKey="testField">
        <p>Child content</p>
      </FieldError>,
    );

    expect(screen.getByTestId('error-testField')).toBeInTheDocument();
  });
});
