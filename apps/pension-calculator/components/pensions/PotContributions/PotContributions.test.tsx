import type { PensionPotsCopy } from 'data/pensions';
import type { Contribution as ContributionType } from 'types/pensions';
import type { DefinedContributionPot } from 'types/pensions/pensions';
import { contributionFieldId } from 'utils/pensionFieldIds';
import { fireEvent, render, screen } from '@testing-library/react';

import { PotContributions } from './PotContributions';

const EMPLOYEE = 'employee' as const;
const EMPLOYER = 'employer' as const;
const EMPLOYEE_CONTRIBUTION = 'employeeContribution' as const;
const EMPLOYER_CONTRIBUTION = 'employerContribution' as const;
const VALUE_FIELD = 'value' as const;
const BORDER_CLASS = 'border-b border-gray-300 pb-6';
const POT_INDEX_ATTR = 'data-pot-index';

const ERROR_EMPLOYEE = 'Employee contribution error';
const ERROR_EMPLOYER = 'Employer contribution error';

const mockGetContributionTestId = (kind: string): string =>
  `contribution-${kind}`;
const mockGetHintTestId = (kind: string): string => `hint-${kind}`;
const mockGetErrorTestId = (kind: string): string => `error-${kind}`;
const mockGetChangeTestId = (kind: string): string => `change-${kind}`;

const mockUpdatedContribution: ContributionType = {
  mode: 'fixed',
  value: '100',
  frequency: 'month',
};

interface ContributionMockProps {
  kind: 'employee' | 'employer';
  label: string;
  hint?: string;
  contribution: ContributionType;
  potIndex?: number;
  error?: string;
  copy: PensionPotsCopy;
  onChange: (updatedContribution: ContributionType) => void;
  className?: string;
}

jest.mock('utils/pensionFieldIds', () => ({
  contributionFieldId: (kind: string, field: string, index: number): string =>
    `${kind}-${field}-${index}`,
}));

jest.mock('../Contribution', () => ({
  Contribution: ({
    kind,
    label,
    hint,
    potIndex,
    error,
    className,
    onChange,
  }: ContributionMockProps) => (
    <div
      data-testid={mockGetContributionTestId(kind)}
      data-pot-index={potIndex}
      className={className}
    >
      <span>{label}</span>
      {hint && <span data-testid={mockGetHintTestId(kind)}>{hint}</span>}
      {error && <span data-testid={mockGetErrorTestId(kind)}>{error}</span>}
      <button
        data-testid={mockGetChangeTestId(kind)}
        onClick={() => onChange(mockUpdatedContribution)}
      >
        Change {kind}
      </button>
    </div>
  ),
}));

const mockCopy = {
  employeeContribution: 'Employee Contribution',
  employeeContributionHint: 'Employee contribution hint text',
  employerContribution: 'Employer Contribution',
} as unknown as PensionPotsCopy;

const mockPot: DefinedContributionPot = {
  name: 'Pot 1',
  currentValue: '1000',
  taxFreeCash: '0',
  employeeContribution: { mode: 'percentage', value: '5', frequency: 'month' },
  employerContribution: { mode: 'percentage', value: '3', frequency: 'month' },
  annualManagementCharge: '0.5',
};

describe('PotContributions Component', () => {
  const defaultIndex = 0;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders employee and employer contribution components with correct labels, hints, and classes', () => {
    render(
      <PotContributions
        index={defaultIndex}
        pot={mockPot}
        errors={{}}
        updatePot={jest.fn()}
        copy={mockCopy}
      />,
    );

    const employeeElem = screen.getByTestId(
      mockGetContributionTestId(EMPLOYEE),
    );
    expect(employeeElem).toBeInTheDocument();
    expect(employeeElem).toHaveAttribute(
      POT_INDEX_ATTR,
      defaultIndex.toString(),
    );
    expect(employeeElem).toHaveClass(BORDER_CLASS);
    expect(screen.getByText(mockCopy.employeeContribution)).toBeInTheDocument();
    expect(screen.getByTestId(mockGetHintTestId(EMPLOYEE))).toHaveTextContent(
      mockCopy.employeeContributionHint,
    );

    const employerElem = screen.getByTestId(
      mockGetContributionTestId(EMPLOYER),
    );
    expect(employerElem).toBeInTheDocument();
    expect(employerElem).toHaveAttribute(
      POT_INDEX_ATTR,
      defaultIndex.toString(),
    );
    expect(employerElem).not.toHaveClass(BORDER_CLASS);
    expect(screen.getByText(mockCopy.employerContribution)).toBeInTheDocument();
    expect(
      screen.queryByTestId(mockGetHintTestId(EMPLOYER)),
    ).not.toBeInTheDocument();
  });

  test('forwards potIndex to contribution components when index is greater than 0', () => {
    const customIndex = 2;

    render(
      <PotContributions
        index={customIndex}
        pot={mockPot}
        errors={{}}
        updatePot={jest.fn()}
        copy={mockCopy}
      />,
    );

    expect(
      screen.getByTestId(mockGetContributionTestId(EMPLOYEE)),
    ).toHaveAttribute(POT_INDEX_ATTR, customIndex.toString());
    expect(
      screen.getByTestId(mockGetContributionTestId(EMPLOYER)),
    ).toHaveAttribute(POT_INDEX_ATTR, customIndex.toString());
  });

  test.each([
    [EMPLOYEE_CONTRIBUTION, mockGetChangeTestId(EMPLOYEE)],
    [EMPLOYER_CONTRIBUTION, mockGetChangeTestId(EMPLOYER)],
  ])(
    'calls updatePot with updated contribution when %s changes',
    (potField, buttonTestId) => {
      const updatePotMock = jest.fn();

      render(
        <PotContributions
          index={defaultIndex}
          pot={mockPot}
          errors={{}}
          updatePot={updatePotMock}
          copy={mockCopy}
        />,
      );

      fireEvent.click(screen.getByTestId(buttonTestId));

      expect(updatePotMock).toHaveBeenCalledTimes(1);
      expect(updatePotMock).toHaveBeenCalledWith(
        defaultIndex,
        potField,
        mockUpdatedContribution,
      );
    },
  );

  test('passes errors to corresponding contribution components using contributionFieldId', () => {
    const employeeFieldId = contributionFieldId(
      EMPLOYEE,
      VALUE_FIELD,
      defaultIndex,
    );
    const employerFieldId = contributionFieldId(
      EMPLOYER,
      VALUE_FIELD,
      defaultIndex,
    );

    const errors = {
      [employeeFieldId]: [ERROR_EMPLOYEE],
      [employerFieldId]: [ERROR_EMPLOYER],
    };

    render(
      <PotContributions
        index={defaultIndex}
        pot={mockPot}
        errors={errors}
        updatePot={jest.fn()}
        copy={mockCopy}
      />,
    );

    expect(screen.getByTestId(mockGetErrorTestId(EMPLOYEE))).toHaveTextContent(
      ERROR_EMPLOYEE,
    );
    expect(screen.getByTestId(mockGetErrorTestId(EMPLOYER))).toHaveTextContent(
      ERROR_EMPLOYER,
    );
  });

  test('does not render error elements when no errors exist', () => {
    render(
      <PotContributions
        index={defaultIndex}
        pot={mockPot}
        errors={{}}
        updatePot={jest.fn()}
        copy={mockCopy}
      />,
    );

    expect(
      screen.queryByTestId(mockGetErrorTestId(EMPLOYEE)),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(mockGetErrorTestId(EMPLOYER)),
    ).not.toBeInTheDocument();
  });
});
