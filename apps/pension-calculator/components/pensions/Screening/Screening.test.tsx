import type { usePensionsForm } from 'hooks/usePensionsForm';
import { fireEvent, render, screen } from '@testing-library/react';

import { Screening } from './Screening';

jest.mock('utils/pensionFieldIds', () => ({
  POT_SCREENING_ID: 'pot-screening-id',
  POT_SCREENING_NAME: 'pot-screening-name',
}));

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/form/components/QuestionRadioButton', () => ({
  QuestionRadioButton: ({
    children,
    options,
    onChange,
    error,
  }: {
    children: React.ReactNode;
    options: Array<{ text: string; value: string }>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }) => (
    <div>
      <legend>{children}</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="screening-radio"
            value={option.value}
            data-testid={`radio-${option.value}`}
            onChange={onChange}
          />
          {option.text}
        </label>
      ))}
      {error && <span data-testid="screening-error">{error}</span>}
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
      yes: 'Yes',
      no: 'No',
      screeningQuestion: 'Do you have a pot of money pension?',
      screeningGuidanceTitle: 'Guidance Title',
      screeningGuidance: 'Guidance details paragraph.',
      screeningSignpost: 'Signpost information text.',
    },
    data: {
      hasPotOfMoneyPension: undefined,
    },
    errors,
    setData: setDataMock,
  } as unknown as PensionsFormReturn);

const createSetDataMock = (initialData: PensionsFormReturn['data']) => {
  let state = initialData;
  const mock = jest.fn((updater: unknown) => {
    if (typeof updater === 'function') {
      state = (updater as (prev: typeof state) => typeof state)(state);
    }
  });
  return {
    mock: mock as unknown as PensionsFormReturn['setData'],
    getState: () => state,
  };
};

describe('Screening Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders question, radio options, guidance details, and signpost text', () => {
    const props = createMockProps();
    render(<Screening {...props} />);

    expect(screen.getByText(props.copy.screeningQuestion)).toBeInTheDocument();
    expect(screen.getByText(props.copy.yes)).toBeInTheDocument();
    expect(screen.getByText(props.copy.no)).toBeInTheDocument();
    expect(
      screen.getByText(props.copy.screeningGuidanceTitle),
    ).toBeInTheDocument();
    expect(screen.getByText(props.copy.screeningGuidance)).toBeInTheDocument();
    expect(screen.getByText(props.copy.screeningSignpost)).toBeInTheDocument();
  });

  test.each([
    ['yes', 'yes'],
    ['no', 'no'],
  ])(
    'calls setData and updates state when %s option is selected',
    (optionValue, expectedValue) => {
      const initialData = {
        hasPotOfMoneyPension: undefined,
      } as unknown as PensionsFormReturn['data'];
      const { mock: setDataMock, getState } = createSetDataMock(initialData);
      const props = createMockProps({}, setDataMock);

      render(<Screening {...props} />);

      const radioInput = screen.getByTestId(`radio-${optionValue}`);
      fireEvent.click(radioInput);

      expect(setDataMock).toHaveBeenCalledTimes(1);
      expect(getState().hasPotOfMoneyPension).toBe(expectedValue);
    },
  );

  test('renders error message when error exists for screening question', () => {
    const errorMessage = 'Select an option to proceed';
    const props = createMockProps({
      'pot-screening-id': [errorMessage],
    });

    render(<Screening {...props} />);

    expect(screen.getByTestId('screening-error')).toHaveTextContent(
      errorMessage,
    );
  });
});
