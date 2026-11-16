import { JOURNEY_PAGES } from 'data/journey';
import { usePensionsForm } from 'hooks/usePensionsForm';
import type {
  PensionStep,
  PotsOfMoneyData,
  PotsOfMoneyErrors,
} from 'types/pensions';
import { PensionsFlow } from 'types/pensions/pensions';
import { journeyPath } from 'utils/journeyPath/journeyPath';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { PensionsForm } from './PensionsForm';

const MOCK_SESSION_ID = 'session-123';
const MOCK_FLOW: PensionsFlow = 'pots-of-money';
const ERROR_SUMMARY_TITLE = 'Error Summary Title';
const ERROR_SUMMARY_TEST_ID = 'error-summary';
const STEP_SCREENING_TEST_ID = 'step-screening';
const STEP_DETAILS_TEST_ID = 'step-details';
const STEP_SUMMARY_TEST_ID = 'step-summary';
const ADD_PENSION_TEXT = 'Add pension';
const CONTINUE_TEXT = 'Continue';
const SAVE_AND_COME_BACK_TEXT = 'Save and come back';

const mockPush = jest.fn<void, [url: string]>();

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('hooks/usePensionsForm', () => ({
  PENSIONS_API: '/api/pensions',
  usePensionsForm: jest.fn(),
}));

jest.mock('data/journey', () => ({
  JOURNEY_PAGES: {
    POT_DETAILS: 'pot-details',
  },
}));

jest.mock('utils/journeyPath/journeyPath', () => ({
  journeyPath: jest.fn(
    (
      lang: string,
      page: string,
      sessionId: string,
      _param?: string,
      hash?: string,
    ) => `/journey/${lang}/${page}/${sessionId}${hash ? `#${hash}` : ''}`,
  ),
}));

jest.mock('utils/pensionFieldIds', () => ({
  ADD_PENSION_ID: 'add-pension-button',
  POT_COUNT_NAME: 'potCount',
  potNameId: (count: number) => `pot-${count}`,
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({
    children,
    onClick,
    type = 'button',
    id,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
  }) => (
    <button id={id} type={type} onClick={onClick}>
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
    <div data-testid={ERROR_SUMMARY_TEST_ID}>{title}</div>
  ),
}));

jest.mock('../Screening', () => ({
  Screening: () => (
    <div data-testid={STEP_SCREENING_TEST_ID}>Screening Component</div>
  ),
}));

jest.mock('../PotDetails', () => ({
  PotDetails: () => (
    <div data-testid={STEP_DETAILS_TEST_ID}>PotDetails Component</div>
  ),
}));

jest.mock('../Summary', () => ({
  Summary: ({
    handleRemove,
  }: {
    data: unknown;
    sessionId: string;
    handleRemove: (index: number) => void;
  }) => (
    <div data-testid={STEP_SUMMARY_TEST_ID}>
      <span>Summary Component</span>
      <button
        type="button"
        data-testid="remove-pot-button"
        onClick={() => handleRemove(0)}
      >
        Remove
      </button>
    </div>
  ),
}));

type PensionsFormReturn = ReturnType<typeof usePensionsForm>;

const mockUsePensionsForm = usePensionsForm as jest.MockedFunction<
  typeof usePensionsForm
>;
const mockJourneyPath = journeyPath as jest.MockedFunction<typeof journeyPath>;

const createMockForm = (
  overrides?: Partial<PensionsFormReturn>,
): PensionsFormReturn =>
  ({
    copy: {
      errorSummaryTitle: ERROR_SUMMARY_TITLE,
      addPension: ADD_PENSION_TEXT,
    },
    shared: {
      continue: CONTINUE_TEXT,
      saveAndComeBack: SAVE_AND_COME_BACK_TEXT,
    },
    lang: 'en',
    data: { pots: [{ name: 'Pot 1' }, { name: 'Pot 2' }] },
    errors: {},
    hasErrors: false,
    pageTitle: 'Pensions Calculator',
    handleContinue: jest.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    }),
    handleSave: jest.fn(),
    handleAdd: jest.fn().mockResolvedValue(undefined),
    handleRemove: jest.fn(),
    errorSummaryRef: { current: null },
    ...overrides,
  } as unknown as PensionsFormReturn);

describe('PensionsForm Component', () => {
  const defaultProps = {
    step: 'screening' as PensionStep,
    sessionId: MOCK_SESSION_ID,
    initialData: {} as PotsOfMoneyData,
    initialErrors: {} as PotsOfMoneyErrors,
    flow: MOCK_FLOW,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePensionsForm.mockReturnValue(createMockForm());
  });

  const stepFixtures: Array<[PensionStep, string]> = [
    ['screening', STEP_SCREENING_TEST_ID],
    ['details', STEP_DETAILS_TEST_ID],
    ['summary', STEP_SUMMARY_TEST_ID],
  ];

  test.each(stepFixtures)(
    'renders only the correct step component for step: %s',
    (step, expectedTestId) => {
      render(<PensionsForm {...defaultProps} step={step} />);

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();

      stepFixtures
        .filter(([currentStep]) => currentStep !== step)
        .forEach(([, unexpectedTestId]) => {
          expect(
            screen.queryByTestId(unexpectedTestId),
          ).not.toBeInTheDocument();
        });
    },
  );

  test('renders hidden input fields with correct values', () => {
    render(<PensionsForm {...defaultProps} />);

    expect(screen.getByTestId('language')).toHaveValue('en');
    expect(screen.getByTestId('sessionId')).toHaveValue(MOCK_SESSION_ID);
    expect(screen.getByTestId('potCount')).toHaveValue('2');
    expect(screen.getByTestId('flow')).toHaveValue(MOCK_FLOW);
  });

  test.each([
    [true, ERROR_SUMMARY_TITLE],
    [false, undefined],
  ])(
    'renders ErrorSummary correctly when hasErrors is %s',
    (hasErrors, expectedTitle) => {
      mockUsePensionsForm.mockReturnValue(createMockForm({ hasErrors }));

      render(<PensionsForm {...defaultProps} />);

      if (expectedTitle) {
        expect(screen.getByTestId(ERROR_SUMMARY_TEST_ID)).toHaveTextContent(
          expectedTitle,
        );
      } else {
        expect(
          screen.queryByTestId(ERROR_SUMMARY_TEST_ID),
        ).not.toBeInTheDocument();
      }
    },
  );

  test('does not render ErrorSummary when hasErrors is true but displayPageErrors is false', () => {
    mockUsePensionsForm.mockReturnValue(createMockForm({ hasErrors: true }));

    render(<PensionsForm {...defaultProps} displayPageErrors={false} />);

    expect(screen.queryByTestId(ERROR_SUMMARY_TEST_ID)).not.toBeInTheDocument();
  });

  test('calls handleContinue on form submission and handleSave on save button click', () => {
    const handleContinueMock = jest.fn(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      },
    );
    const handleSaveMock = jest.fn();

    mockUsePensionsForm.mockReturnValue(
      createMockForm({
        handleContinue:
          handleContinueMock as unknown as PensionsFormReturn['handleContinue'],
        handleSave: handleSaveMock,
      }),
    );

    render(<PensionsForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: CONTINUE_TEXT }));
    expect(handleContinueMock).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByRole('button', { name: SAVE_AND_COME_BACK_TEXT }),
    );
    expect(handleSaveMock).toHaveBeenCalledTimes(1);
  });

  test('renders custom submit button copy when submitButtonCopy prop is provided', () => {
    const customCopy = 'Proceed to next section';
    render(<PensionsForm {...defaultProps} submitButtonCopy={customCopy} />);

    expect(
      screen.getByRole('button', { name: customCopy }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: CONTINUE_TEXT }),
    ).not.toBeInTheDocument();
  });

  test('applies custom formSpacing class when passed', () => {
    const customSpacing = 'space-y-12';
    const { container } = render(
      <PensionsForm {...defaultProps} formSpacing={customSpacing} />,
    );

    const formElement = container.querySelector('form');
    expect(formElement).toHaveClass(customSpacing);
  });

  test.each<PensionStep>(['screening', 'details'])(
    'does not render the add pension button on step: %s',
    (step) => {
      render(<PensionsForm {...defaultProps} step={step} />);

      expect(
        screen.queryByRole('button', { name: ADD_PENSION_TEXT }),
      ).not.toBeInTheDocument();
    },
  );

  test('executes handleAdd and pushes next journey route when add pension button is clicked on summary step', async () => {
    const handleAddMock = jest.fn().mockResolvedValue(undefined);

    mockUsePensionsForm.mockReturnValue(
      createMockForm({
        handleAdd: handleAddMock,
      }),
    );

    render(<PensionsForm {...defaultProps} step="summary" />);

    const addButton = screen.getByRole('button', { name: ADD_PENSION_TEXT });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(handleAddMock).toHaveBeenCalledTimes(1);
    });

    expect(mockJourneyPath).toHaveBeenCalledWith(
      'en',
      JOURNEY_PAGES.POT_DETAILS,
      MOCK_SESSION_ID,
      undefined,
      'pot-2',
    );
    expect(mockPush).toHaveBeenCalledWith(
      `/journey/en/${JOURNEY_PAGES.POT_DETAILS}/${MOCK_SESSION_ID}#pot-2`,
    );
  });

  test('delegates handleRemove to the Summary component', () => {
    const handleRemoveMock = jest.fn();

    mockUsePensionsForm.mockReturnValue(
      createMockForm({
        handleRemove: handleRemoveMock,
      }),
    );

    render(<PensionsForm {...defaultProps} step="summary" />);

    fireEvent.click(screen.getByTestId('remove-pot-button'));

    expect(handleRemoveMock).toHaveBeenCalledTimes(1);
    expect(handleRemoveMock).toHaveBeenCalledWith(0);
  });
});
