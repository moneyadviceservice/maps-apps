import type { PensionPotsCopy } from 'data/pensions';
import type { DefinedContributionPot } from 'types/pensions/pensions';
import { fireEvent, render, screen } from '@testing-library/react';

import { PotContributions } from './PotContributions';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

jest.mock('data/your-income', () => ({
  frequencyOptions: jest
    .fn()
    .mockReturnValue([{ text: 'Monthly', value: 'month' }]),
}));

jest.mock('utils/pensionFieldIds', () => ({
  contributionFieldId: (kind: string, field: string, index: number) =>
    `${kind}-${field}-${index}`,
  annualManagementChargeId: (index: number) =>
    `annualManagementCharge-${index}`,
}));

jest.mock('../Contribution', () => ({
  Contribution: ({
    kind,
    label,
    error,
    onChange,
  }: {
    kind: string;
    label: string;
    error?: string;
    onChange: (val: unknown) => void;
  }) => (
    <div data-testid={`contribution-${kind}`}>
      <span>{label}</span>
      {error && <span data-testid={`error-${kind}`}>{error}</span>}
      <button
        data-testid={`change-${kind}`}
        onClick={() =>
          onChange({ mode: 'fixed', value: '100', frequency: 'month' })
        }
      >
        Change {kind}
      </button>
    </div>
  ),
}));

jest.mock('../MoneyField', () => ({
  MoneyField: ({
    id,
    label,
    value,
    error,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid="annual-management-charge-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span data-testid="amc-error">{error}</span>}
    </div>
  ),
}));

jest.mock('@maps-react/common/components/Details', () => ({
  Details: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

const mockCopy = {
  employeeContribution: 'Employee Contribution',
  employerContribution: 'Employer Contribution',
  annualManagementCharge: 'Annual Management Charge',
  feeGuidanceTitle: 'Fee Guidance Title',
  feeGuidance: 'Fee guidance explanation text',
} as PensionPotsCopy;

const mockPot: DefinedContributionPot = {
  name: 'Pot 1',
  currentValue: '1000',
  taxFreeCash: '0',
  employeeContribution: { mode: 'percentage', value: '5', frequency: 'month' },
  employerContribution: { mode: 'percentage', value: '3', frequency: 'month' },
  annualManagementCharge: '0.5',
};

describe('PotContributions Component', () => {
  const kinds: Array<'employee' | 'employer'> = ['employee', 'employer'];

  test.each(kinds)(
    'renders %s contribution component with label and correct error prop',
    (kind) => {
      const fieldId = `${kind}-value-0`;
      const errorMessage = `${kind} contribution error`;
      const errors = { [fieldId]: [errorMessage] };

      render(
        <PotContributions
          index={0}
          pot={mockPot}
          errors={errors}
          updatePot={jest.fn()}
          copy={mockCopy}
        />,
      );

      const contributionElem = screen.getByTestId(`contribution-${kind}`);
      expect(contributionElem).toBeInTheDocument();
      expect(screen.getByTestId(`error-${kind}`)).toHaveTextContent(
        errorMessage,
      );
    },
  );

  test('calls updatePot when employee or employer contribution is updated', () => {
    const updatePotMock = jest.fn();

    render(
      <PotContributions
        index={0}
        pot={mockPot}
        errors={{}}
        updatePot={updatePotMock}
        copy={mockCopy}
      />,
    );

    fireEvent.click(screen.getByTestId('change-employee'));
    expect(updatePotMock).toHaveBeenCalledTimes(1);
    expect(updatePotMock).toHaveBeenCalledWith(0, 'employeeContribution', {
      mode: 'fixed',
      value: '100',
      frequency: 'month',
    });

    fireEvent.click(screen.getByTestId('change-employer'));
    expect(updatePotMock).toHaveBeenCalledTimes(2);
    expect(updatePotMock).toHaveBeenCalledWith(0, 'employerContribution', {
      mode: 'fixed',
      value: '100',
      frequency: 'month',
    });
  });

  test('renders annual management charge field with initial value', () => {
    render(
      <PotContributions
        index={0}
        pot={mockPot}
        errors={{}}
        updatePot={jest.fn()}
        copy={mockCopy}
      />,
    );

    const input = screen.getByTestId('annual-management-charge-input');
    expect(input).toHaveValue('0.5');
    expect(
      screen.getByLabelText(mockCopy.annualManagementCharge),
    ).toBeInTheDocument();
  });

  test('calls updatePot when annual management charge changes', () => {
    const updatePotMock = jest.fn();

    render(
      <PotContributions
        index={0}
        pot={mockPot}
        errors={{}}
        updatePot={updatePotMock}
        copy={mockCopy}
      />,
    );

    const input = screen.getByTestId('annual-management-charge-input');
    fireEvent.change(input, { target: { value: '0.75' } });

    expect(updatePotMock).toHaveBeenCalledTimes(1);
    expect(updatePotMock).toHaveBeenCalledWith(
      0,
      'annualManagementCharge',
      '0.75',
    );
  });

  test('renders details component with guidance title and text', () => {
    render(
      <PotContributions
        index={0}
        pot={mockPot}
        errors={{}}
        updatePot={jest.fn()}
        copy={mockCopy}
      />,
    );

    expect(screen.getByText(mockCopy.feeGuidanceTitle)).toBeInTheDocument();
    expect(screen.getByText(mockCopy.feeGuidance)).toBeInTheDocument();
  });
});
