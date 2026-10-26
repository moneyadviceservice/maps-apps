import { useErrorSummary } from 'hooks/useErrorSummary';
import { InputField } from 'types/register';
import { render, screen } from '@testing-library/react';

import { TimeInput } from './TimeInput';

// --- Mocks ---

jest.mock('hooks/useErrorSummary');

jest.mock('data/pages/account/firm-details/opening-hours', () => ({
  amPmRadioField: { key: 'ampm' },
}));

jest.mock('@maps-react/form/components/Select', () => ({
  Select: ({
    id,
    hasError,
    defaultValue,
    'data-testid': testId,
  }: {
    id: string;
    hasError: boolean;
    defaultValue?: string;
    'data-testid': string;
  }) => (
    <div
      data-testid={testId}
      data-haserror={hasError}
      data-default={defaultValue}
    />
  ),
}));

jest.mock('../RadioQuestion', () => ({
  RadioQuestion: ({
    displayErrorState,
    radioInput,
    initialValue,
  }: {
    displayErrorState: boolean;
    radioInput: { key: string };
    initialValue?: string;
  }) => (
    <div
      data-testid={`radio-${radioInput.key}`}
      data-haserror={displayErrorState}
      data-initial={initialValue}
    />
  ),
}));

jest.mock('../FieldError', () => ({
  FieldError: ({
    fieldKey,
    children,
  }: {
    fieldKey: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="field-error" data-fieldkey={fieldKey}>
      {children}
    </div>
  ),
}));

// --- Tests ---

describe('TimeInput', () => {
  const defaultInputField: InputField = {
    key: 'time',
    title: 'Opening Time',
    type: 'hour_min',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Time Parsing and Initial Values', () => {
    test.each`
      initialValue | expectedHour | expectedMin | expectedPeriod
      ${'14:30'}   | ${'2'}       | ${'30'}     | ${'pm'}
      ${'09:15'}   | ${'9'}       | ${'15'}     | ${'am'}
      ${'12:00'}   | ${'12'}      | ${'00'}     | ${'pm'}
      ${'00:45'}   | ${'12'}      | ${'45'}     | ${'am'}
      ${null}      | ${null}      | ${null}     | ${null}
    `(
      'returns hour: $expectedHour, min: $expectedMin, period: $expectedPeriod when initialValue is $initialValue',
      ({ initialValue, expectedHour, expectedMin, expectedPeriod }) => {
        (useErrorSummary as jest.Mock).mockReturnValue({ fieldErrors: {} });

        render(
          <TimeInput
            inputField={defaultInputField}
            initialValue={initialValue}
          />,
        );

        const hourSelect = screen.getByTestId('time_hours');
        const minSelect = screen.getByTestId('time_minutes');
        const radioGroup = screen.getByTestId('radio-time_ampm');

        expect(hourSelect.getAttribute('data-default')).toBe(expectedHour);
        expect(minSelect.getAttribute('data-default')).toBe(expectedMin);
        expect(radioGroup.getAttribute('data-initial')).toBe(expectedPeriod);
      },
    );
  });

  describe('Uncontrolled DOM and Error States', () => {
    let getElementByIdSpy: jest.SpyInstance;

    beforeEach(() => {
      getElementByIdSpy = jest.spyOn(document, 'getElementById');
    });

    afterEach(() => {
      getElementByIdSpy.mockRestore();
    });

    test.each`
      selErr   | amPmErr  | domHour | domMin  | expectHourErr | expectMinErr | expectRadioErr | expectKey
      ${true}  | ${false} | ${'2'}  | ${'30'} | ${true}       | ${true}      | ${true}        | ${'time'}
      ${true}  | ${false} | ${'2'}  | ${''}   | ${false}      | ${true}      | ${false}       | ${'time'}
      ${true}  | ${false} | ${''}   | ${'30'} | ${true}       | ${false}     | ${false}       | ${'time'}
      ${true}  | ${false} | ${''}   | ${''}   | ${true}       | ${true}      | ${false}       | ${'time'}
      ${false} | ${true}  | ${'2'}  | ${'30'} | ${false}      | ${false}     | ${false}       | ${'time_ampm'}
      ${true}  | ${true}  | ${''}   | ${''}   | ${true}       | ${true}      | ${false}       | ${'time'}
    `(
      'sets appropriate error states when selectErr=$selErr, amPmErr=$amPmErr, domHour=$domHour, domMin=$domMin',
      ({
        selErr,
        amPmErr,
        domHour,
        domMin,
        expectHourErr,
        expectMinErr,
        expectRadioErr,
        expectKey,
      }) => {
        // Setup mock errors mapping
        const mockFieldErrors: Record<string, string[]> = {};
        if (selErr) mockFieldErrors['time'] = ['Required'];
        if (amPmErr) mockFieldErrors['time_ampm'] = ['Required'];

        (useErrorSummary as jest.Mock).mockReturnValue({
          fieldErrors: mockFieldErrors,
        });

        // Setup DOM spy to simulate uncontrolled user input
        getElementByIdSpy.mockImplementation((id: string) => {
          if (id === 'time_hours')
            return { value: domHour } as unknown as HTMLElement;
          if (id === 'time_minutes')
            return { value: domMin } as unknown as HTMLElement;
          return null;
        });

        render(<TimeInput inputField={defaultInputField} />);

        const hourSelect = screen.getByTestId('time_hours');
        const minSelect = screen.getByTestId('time_minutes');
        const radioGroup = screen.getByTestId('radio-time_ampm');
        const fieldError = screen.getByTestId('field-error');

        // Check individual field error borders
        expect(hourSelect.getAttribute('data-haserror')).toBe(
          String(expectHourErr),
        );
        expect(minSelect.getAttribute('data-haserror')).toBe(
          String(expectMinErr),
        );

        // Check fieldset error highlight (when one error blankets all fields)
        expect(radioGroup.getAttribute('data-haserror')).toBe(
          String(expectRadioErr),
        );

        // Check which anchor ID the summary jumps to
        expect(fieldError.getAttribute('data-fieldkey')).toBe(expectKey);
      },
    );
  });
});
