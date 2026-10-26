import { pensionPotsCopy } from 'data/pensions';
import type { Contribution as ContributionType } from 'types/pensions';
import { fireEvent, render, screen } from '@testing-library/react';

import { Contribution } from './Contribution';

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@maps-react/form/components/MoneyInput', () => ({
  MoneyInput: ({
    id,
    name,
    value,
    onChange,
  }: {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      id={id}
      name={name}
      data-testid="money-input"
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock('@maps-react/form/components/QuestionRadioButton', () => ({
  QuestionRadioButton: ({
    onChange,
  }: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div>
      <input
        type="radio"
        value="percentage"
        data-testid="radio-percentage"
        onChange={onChange}
      />
      <input
        type="radio"
        value="fixed"
        data-testid="radio-fixed"
        onChange={onChange}
      />
    </div>
  ),
}));

jest.mock('@maps-react/form/components/Select', () => ({
  Select: ({
    id,
    value,
    onChange,
  }: {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <select
      id={id}
      data-testid="frequency-select"
      value={value}
      onChange={onChange}
    >
      <option value="month">Monthly</option>
      <option value="annual">Annual</option>
    </select>
  ),
}));

jest.mock('utils/pensionFieldIds', () => ({
  contributionFieldId: (kind: string, field: string, index?: number) =>
    index !== undefined ? `${kind}-${field}-${index}` : `${kind}-${field}`,
}));

const mockCopy = {
  percentage: 'Percentage',
  fixed: 'Fixed amount',
  percentageHint: 'Percentage hint text',
  frequency: 'Frequency',
} as ReturnType<typeof pensionPotsCopy>;

const mockOptions = [
  { text: 'Monthly', value: 'month' },
  { text: 'Annual', value: 'annual' },
];

const createMockContribution = (
  mode: 'percentage' | 'fixed',
): ContributionType => ({
  mode,
  value: '10',
  frequency: 'month',
});

describe('Contribution Component', () => {
  const kinds: Array<'employee' | 'employer'> = ['employee', 'employer'];

  describe.each(kinds)('for kind: %s', (kind) => {
    const label = `${kind} Contribution`;

    test.each([['percentage'], ['fixed']])(
      'renders correctly in %s mode',
      (mode) => {
        const mockContribution = createMockContribution(
          mode as 'percentage' | 'fixed',
        );

        render(
          <Contribution
            kind={kind}
            label={label}
            contribution={mockContribution}
            copy={mockCopy}
            options={mockOptions}
            onChange={jest.fn()}
          />,
        );

        expect(screen.getByText(label)).toBeInTheDocument();

        if (mode === 'percentage') {
          expect(screen.getByText(mockCopy.percentageHint)).toBeInTheDocument();
        } else {
          expect(screen.getByTestId('frequency-select')).toBeInTheDocument();
        }
      },
    );

    test('calls onChange when mode radio changes', () => {
      const mockContribution = createMockContribution('percentage');
      const onChangeMock = jest.fn();

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          options={mockOptions}
          onChange={onChangeMock}
        />,
      );

      fireEvent.click(screen.getByTestId('radio-fixed'));

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith({
        ...mockContribution,
        mode: 'fixed',
      });
    });

    test('calls onChange when input value changes in percentage mode', () => {
      const mockContribution = createMockContribution('percentage');
      const onChangeMock = jest.fn();

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          options={mockOptions}
          onChange={onChangeMock}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '15' } });

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith({
        ...mockContribution,
        value: '15',
      });
    });

    test('calls onChange when money input and frequency select change in fixed mode', () => {
      const mockContribution = createMockContribution('fixed');
      const onChangeMock = jest.fn();

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          options={mockOptions}
          onChange={onChangeMock}
        />,
      );

      fireEvent.change(screen.getByTestId('money-input'), {
        target: { value: '250' },
      });

      expect(onChangeMock).toHaveBeenNthCalledWith(1, {
        ...mockContribution,
        value: '250',
      });

      fireEvent.change(screen.getByTestId('frequency-select'), {
        target: { value: 'annual' },
      });

      expect(onChangeMock).toHaveBeenNthCalledWith(2, {
        ...mockContribution,
        frequency: 'annual',
      });
    });

    test('renders error message when error prop is provided', () => {
      const mockContribution = createMockContribution('percentage');
      const errorMessage = 'Value is required';

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          error={errorMessage}
          copy={mockCopy}
          options={mockOptions}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('passes potIndex to contributionFieldId when potIndex is provided', () => {
      const mockContribution = createMockContribution('fixed');

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          potIndex={0}
          copy={mockCopy}
          options={mockOptions}
          onChange={jest.fn()}
        />,
      );

      const select = screen.getByTestId('frequency-select');
      expect(select).toHaveAttribute('id', `${kind}-frequency-0`);
    });
  });
});
