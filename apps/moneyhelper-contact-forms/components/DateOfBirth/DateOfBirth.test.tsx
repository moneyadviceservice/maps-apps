import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormError } from '../../lib/types';
import { DateOfBirth, dobInputHandlers } from './DateOfBirth';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('DateOfBirth Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('renders the component with no errors', () => {
    const { container } = render(<DateOfBirth />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the generic error for dates when there is an error', () => {
    const mockErrors: FormError[] = [
      { field: 'dates', message: 'Please enter a valid date' },
    ];

    const { container } = render(<DateOfBirth errors={mockErrors} />);

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
