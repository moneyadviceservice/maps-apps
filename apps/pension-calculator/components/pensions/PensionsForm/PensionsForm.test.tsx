import { usePensionsForm } from 'hooks/usePensionsForm';
import type { PensionStep } from 'lib/handlePensionsAction';
import type { PotsOfMoneyData, PotsOfMoneyErrors } from 'types/pensions';
import { fireEvent, render, screen } from '@testing-library/react';

import { PensionsForm } from './PensionsForm';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('hooks/usePensionsForm', () => ({
  PENSIONS_API: '/api/pensions',
  usePensionsForm: jest.fn(),
}));

jest.mock('utils/pensionFieldIds', () => ({
  POT_COUNT_NAME: 'potCount',
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({
    children,
    onClick,
    type,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: () => <span data-testid="icon" />,
  IconType: { BOOKMARK: 'bookmark' },
}));

jest.mock('@maps-react/form/components/ErrorSummary', () => ({
  ErrorSummary: ({ title }: { title: string }) => (
    <div data-testid="error-summary">{title}</div>
  ),
}));

jest.mock('../Screening', () => ({
  Screening: () => <div data-testid="step-screening">Screening Component</div>,
}));

jest.mock('../PotDetails', () => ({
  PotDetails: () => <div data-testid="step-details">PotDetails Component</div>,
}));

jest.mock('../Contributions', () => ({
  Contributions: () => (
    <div data-testid="step-contributions">Contributions Component</div>
  ),
}));

type PensionsFormReturn = ReturnType<typeof usePensionsForm>;

const createMockForm = (
  overrides?: Partial<PensionsFormReturn>,
): PensionsFormReturn =>
  ({
    copy: { errorSummaryTitle: 'Error Summary Title' },
    shared: { continue: 'Continue', saveAndComeBack: 'Save and come back' },
    lang: 'en',
    data: { pots: [{ name: 'Pot 1' }, { name: 'Pot 2' }] },
    errors: {},
    hasErrors: false,
    pageTitle: 'Pensions Calculator',
    handleContinue: jest.fn((e: React.SubmitEvent<HTMLFormElement>) =>
      e.preventDefault(),
    ),
    handleSave: jest.fn(),
    errorSummaryRef: { current: null },
    ...overrides,
  } as unknown as PensionsFormReturn);

describe('PensionsForm Component', () => {
  const defaultProps = {
    step: 'screening' as PensionStep,
    sessionId: 'session-123',
    initialData: {} as PotsOfMoneyData,
    initialErrors: {} as PotsOfMoneyErrors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePensionsForm as jest.Mock).mockReturnValue(createMockForm());
  });

  const steps: Array<[PensionStep, string]> = [
    ['screening', 'step-screening'],
    ['details', 'step-details'],
    ['contributions', 'step-contributions'],
  ];

  test.each(steps)(
    'renders only the correct step component for step: %s',
    (step, expectedTestId) => {
      render(<PensionsForm {...defaultProps} step={step} />);

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();

      steps
        .filter(([s]) => s !== step)
        .forEach(([, testId]) => {
          expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
        });
    },
  );

  test('renders hidden input fields with correct values', () => {
    render(<PensionsForm {...defaultProps} />);

    expect(screen.getByTestId('language')).toHaveValue('en');
    expect(screen.getByTestId('sessionId')).toHaveValue('session-123');
    expect(screen.getByTestId('potCount')).toHaveValue('2');
  });

  test.each([
    [true, 'Error Summary Title'],
    [false, undefined],
  ])(
    'renders ErrorSummary correctly when hasErrors is %s',
    (hasErrors, expectedTitle) => {
      (usePensionsForm as jest.Mock).mockReturnValue(
        createMockForm({ hasErrors }),
      );

      render(<PensionsForm {...defaultProps} />);

      if (expectedTitle) {
        expect(screen.getByTestId('error-summary')).toHaveTextContent(
          expectedTitle,
        );
      } else {
        expect(screen.queryByTestId('error-summary')).not.toBeInTheDocument();
      }
    },
  );

  test('calls handleContinue on form submission and handleSave on save button click', () => {
    const handleContinueMock = jest.fn(
      (e: React.SubmitEvent<HTMLFormElement>) => e.preventDefault(),
    );
    const handleSaveMock = jest.fn();

    (usePensionsForm as jest.Mock).mockReturnValue(
      createMockForm({
        handleContinue:
          handleContinueMock as unknown as PensionsFormReturn['handleContinue'],
        handleSave: handleSaveMock,
      }),
    );

    render(<PensionsForm {...defaultProps} />);

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    expect(handleContinueMock).toHaveBeenCalledTimes(1);

    const saveButton = screen.getByRole('button', {
      name: 'Save and come back',
    });
    fireEvent.click(saveButton);

    expect(handleSaveMock).toHaveBeenCalledTimes(1);
  });
});
