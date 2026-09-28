import { pensionsCopy } from 'data/pensions';
import type { PotsOfMoneyData } from 'types/pensions';
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
      <option value="monthly">Monthly</option>
      <option value="annual">Annual</option>
    </select>
  ),
}));

jest.mock('utils/pensionFieldIds', () => ({
  contributionFieldId: (kind: string, field: string) => `${kind}-${field}`,
}));

const mockCopy = {
  percentage: 'Percentage',
  fixed: 'Fixed amount',
  percentageHint: 'Percentage hint text',
  frequency: 'Frequency',
} as ReturnType<typeof pensionsCopy>;

const mockOptions = [
  { text: 'Monthly', value: 'monthly' },
  { text: 'Annual', value: 'annual' },
];

const createMockData = (
  kind: 'employee' | 'employer',
  mode: 'percentage' | 'fixed',
): PotsOfMoneyData =>
  ({
    [`${kind}Contribution`]: {
      mode,
      value: '10',
      frequency: 'monthly',
    },
  } as unknown as PotsOfMoneyData);

const createSetDataMock = (initialData: PotsOfMoneyData) => {
  let state = initialData;
  const mock = jest.fn((updater: unknown) => {
    if (typeof updater === 'function') {
      state = (updater as (prev: PotsOfMoneyData) => PotsOfMoneyData)(state);
    }
  });
  return { mock, getState: () => state };
};

describe('Contribution Component', () => {
  const kinds: Array<'employee' | 'employer'> = ['employee', 'employer'];

  describe.each(kinds)('for kind: %s', (kind) => {
    const label = `${kind} Contribution`;

    test.each([['percentage'], ['fixed']])(
      'renders correctly in %s mode',
      (mode) => {
        const mockData = createMockData(kind, mode as 'percentage' | 'fixed');

        render(
          <Contribution
            kind={kind}
            label={label}
            data={mockData}
            copy={mockCopy}
            options={mockOptions}
            setData={jest.fn()}
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

    test('calls setData when mode radio changes', () => {
      const mockData = createMockData(kind, 'percentage');
      const { mock: setDataMock, getState } = createSetDataMock(mockData);

      render(
        <Contribution
          kind={kind}
          label={label}
          data={mockData}
          copy={mockCopy}
          options={mockOptions}
          setData={setDataMock}
        />,
      );

      fireEvent.click(screen.getByTestId('radio-fixed'));

      expect(setDataMock).toHaveBeenCalledTimes(1);
      expect(getState()[`${kind}Contribution`].mode).toBe('fixed');
    });

    test('calls setData when input value changes in percentage mode', () => {
      const mockData = createMockData(kind, 'percentage');
      const { mock: setDataMock, getState } = createSetDataMock(mockData);

      render(
        <Contribution
          kind={kind}
          label={label}
          data={mockData}
          copy={mockCopy}
          options={mockOptions}
          setData={setDataMock}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '15' } });

      expect(setDataMock).toHaveBeenCalledTimes(1);
      expect(getState()[`${kind}Contribution`].value).toBe('15');
    });

    test('calls setData when money input and frequency select change in fixed mode', () => {
      const mockData = createMockData(kind, 'fixed');
      const { mock: setDataMock, getState } = createSetDataMock(mockData);

      render(
        <Contribution
          kind={kind}
          label={label}
          data={mockData}
          copy={mockCopy}
          options={mockOptions}
          setData={setDataMock}
        />,
      );

      fireEvent.change(screen.getByTestId('money-input'), {
        target: { value: '250' },
      });
      fireEvent.change(screen.getByTestId('frequency-select'), {
        target: { value: 'annual' },
      });

      expect(setDataMock).toHaveBeenCalledTimes(2);
      expect(getState()[`${kind}Contribution`].value).toBe('250');
      expect(getState()[`${kind}Contribution`].frequency).toBe('annual');
    });

    test('renders error message when error prop is provided', () => {
      const mockData = createMockData(kind, 'percentage');
      const errorMessage = 'Value is required';

      render(
        <Contribution
          kind={kind}
          label={label}
          data={mockData}
          error={errorMessage}
          copy={mockCopy}
          options={mockOptions}
          setData={jest.fn()}
        />,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
