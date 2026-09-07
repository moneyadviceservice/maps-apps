import { render, screen } from '@testing-library/react';

import { mockSteps, mockUseTranslation } from '@maps-react/mhf/mocks';
import { FormError } from '@maps-react/mhf/types';

import { DateOfBirth, dobInputHandlers } from './DateOfBirth';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockErrors: FormError = {
  dates: ['Please enter a valid date'],
};

describe('DateOfBirth Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders the component with no errors', () => {
    const { container } = render(<DateOfBirth step={mockSteps[0]} />);
    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByTestId('date-of-birth-hint')).toHaveAttribute(
      'id',
      'date-of-birth-hint',
    );
    expect(screen.getByTestId('input-day')).toHaveAttribute(
      'aria-describedby',
      'date-of-birth-hint',
    );
    expect(screen.getByTestId('input-day')).toHaveAttribute('type', 'number');
    expect(screen.getByTestId('input-day')).toHaveAttribute('min', '1');
    expect(screen.getByTestId('input-day')).toHaveAttribute('max', '31');
    expect(screen.getByTestId('input-day')).toHaveAttribute(
      'aria-label',
      'components.date-of-birth.form.day.label. components.date-of-birth.hint',
    );
    expect(screen.getByTestId('input-month')).toHaveAttribute(
      'aria-describedby',
      'date-of-birth-hint',
    );
    expect(screen.getByTestId('input-year')).toHaveAttribute(
      'aria-describedby',
      'date-of-birth-hint',
    );
  });

  it('renders the generic error for dates when there is an error', () => {
    const { container } = render(
      <DateOfBirth errors={mockErrors} step={mockSteps[0]} />,
    );

    // Check that the generic error for dates is rendered
    expect(
      screen.getByText('components.date-of-birth.form.generic.error'),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('blockNegativeAndE prevents "-" and "e" keys', () => {
    const preventDefault = jest.fn();

    dobInputHandlers.blockNegativeAndE({
      key: '-',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLInputElement>);
    expect(preventDefault).toHaveBeenCalled();

    preventDefault.mockClear();
    dobInputHandlers.blockNegativeAndE({
      key: 'e',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLInputElement>);
    expect(preventDefault).toHaveBeenCalled();

    preventDefault.mockClear();
    dobInputHandlers.blockNegativeAndE({
      key: '1',
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLInputElement>);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('sanitizeInput removes non-digit characters', () => {
    const element = { value: '-2abc' };
    dobInputHandlers.sanitizeInput({
      currentTarget: element,
    } as React.FormEvent<HTMLInputElement>);
    expect(element.value).toBe('2');
  });
});
