import type { usePensionsForm } from 'hooks/usePensionsForm';
import { fireEvent, render, screen } from '@testing-library/react';

import { Contributions } from './Contributions';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: jest.fn() }),
}));

jest.mock('data/your-income', () => ({
  frequencyOptions: jest
    .fn()
    .mockReturnValue([{ text: 'Monthly', value: 'monthly' }]),
}));

jest.mock('utils/pensionFieldIds', () => ({
  contributionFieldId: (kind: string, field: string) => `${kind}-${field}`,
}));

jest.mock('../Contribution', () => ({
  Contribution: ({
    kind,
    label,
    error,
  }: {
    kind: string;
    label: string;
    error?: string;
  }) => (
    <div data-testid={`contribution-${kind}`}>
      <span>{label}</span>
      {error && <span data-testid={`error-${kind}`}>{error}</span>}
    </div>
  ),
}));

jest.mock('../MoneyField', () => ({
  MoneyField: ({
    id,
    label,
    value,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
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

type PensionsFormReturn = ReturnType<typeof usePensionsForm>;

const createMockProps = (
  errors: PensionsFormReturn['errors'] = {},
  setDataMock: PensionsFormReturn['setData'] = jest.fn(),
): PensionsFormReturn =>
  ({
    copy: {
      employeeContribution: 'Employee Contribution',
      employerContribution: 'Employer Contribution',
      annualManagementCharge: 'Annual Management Charge',
      feeGuidanceTitle: 'Fee Guidance Title',
      feeGuidance: 'Fee guidance explanation text',
    },
    data: {
      annualManagementCharge: '0.5',
    },
    errors,
    setData: setDataMock,
  } as unknown as PensionsFormReturn);

describe('Contributions Component', () => {
  const kinds: Array<'employee' | 'employer'> = ['employee', 'employer'];

  test.each(kinds)(
    'renders %s contribution component with label and correct error prop',
    (kind) => {
      const fieldId = `${kind}-value`;
      const errorMessage = `${kind} contribution error`;
      const props = createMockProps({
        [fieldId]: [errorMessage],
      });

      render(<Contributions {...props} />);

      const contributionElem = screen.getByTestId(`contribution-${kind}`);
      expect(contributionElem).toBeInTheDocument();
      expect(screen.getByTestId(`error-${kind}`)).toHaveTextContent(
        errorMessage,
      );
    },
  );

  test('renders annual management charge field with initial value', () => {
    const props = createMockProps();

    render(<Contributions {...props} />);

    const input = screen.getByTestId('annual-management-charge-input');
    expect(input).toHaveValue('0.5');
    expect(
      screen.getByLabelText(props.copy.annualManagementCharge),
    ).toBeInTheDocument();
  });

  test('calls setData when annual management charge changes', () => {
    let state = { annualManagementCharge: '0.5' };
    const setDataMock = jest.fn((updater: unknown) => {
      if (typeof updater === 'function') {
        state = (updater as (prev: typeof state) => typeof state)(state);
      }
    }) as unknown as PensionsFormReturn['setData'];

    const props = createMockProps({}, setDataMock);

    render(<Contributions {...props} />);

    const input = screen.getByTestId('annual-management-charge-input');
    fireEvent.change(input, { target: { value: '0.75' } });

    expect(setDataMock).toHaveBeenCalledTimes(1);
    expect(state.annualManagementCharge).toBe('0.75');
  });

  test('renders details component with guidance title and text', () => {
    const props = createMockProps();

    render(<Contributions {...props} />);

    expect(screen.getByText(props.copy.feeGuidanceTitle)).toBeInTheDocument();
    expect(screen.getByText(props.copy.feeGuidance)).toBeInTheDocument();
  });
});
