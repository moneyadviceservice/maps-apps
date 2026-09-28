import { useErrorSummary } from 'hooks/useErrorSummary';
import { render, screen } from '@testing-library/react';

import { RadioInput, RadioQuestion } from './RadioQuestion';

// --- Mocks ---

jest.mock('hooks/useErrorSummary');
const mockedUseErrorSummary = useErrorSummary as jest.MockedFunction<
  typeof useErrorSummary
>;

// Mock RadioButton to easily inspect props like hasError and checked status
jest.mock('@maps-react/form/components/RadioButton', () => ({
  RadioButton: ({
    id,
    defaultChecked,
    hasError,
    value,
    'data-testid': testId,
    'aria-label': ariaLabel,
    children,
  }: {
    id: string;
    defaultChecked: boolean;
    hasError: boolean;
    value: string;
    'data-testid': string;
    'aria-label': string;
    children: React.ReactNode;
  }) => (
    <div>
      <input
        type="radio"
        id={id}
        value={value}
        defaultChecked={defaultChecked}
        aria-label={ariaLabel}
        data-testid={testId}
        data-haserror={hasError}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  ),
}));

// --- Test Suite ---

describe('RadioQuestion', () => {
  const mockRadioInput: RadioInput = {
    key: 'testRadio',
    title: 'Choose an Option',
    layout: 'column',
    options: [
      { label: 'Yes', value: 'yes', hintText: 'This is a hint' },
      { label: 'No', value: 'no' },
    ],
  };

  const defaultErrorSummaryState = {
    setFormSummaryErrors: jest.fn(),
    setSubmittedEmail: jest.fn(),
    errorSummarySection: null,
    fieldErrors: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseErrorSummary.mockReturnValue(defaultErrorSummaryState);
  });

  describe('Rendering & Selection', () => {
    test.each`
      initialValue | expectedYesChecked | expectedNoChecked
      ${'yes'}     | ${true}            | ${false}
      ${'no'}      | ${false}           | ${true}
      ${''}        | ${false}           | ${false}
      ${undefined} | ${false}           | ${false}
    `(
      'checks yes=$expectedYesChecked and no=$expectedNoChecked when initialValue is "$initialValue"',
      ({ initialValue, expectedYesChecked, expectedNoChecked }) => {
        render(
          <RadioQuestion
            radioInput={mockRadioInput}
            initialValue={initialValue}
          />,
        );

        const yesInput = screen.getByLabelText('Yes') as HTMLInputElement;
        const noInput = screen.getByLabelText('No') as HTMLInputElement;

        expect(yesInput.checked).toBe(expectedYesChecked);
        expect(noInput.checked).toBe(expectedNoChecked);
      },
    );

    it('renders hint text strictly for options that provide it', () => {
      render(<RadioQuestion radioInput={mockRadioInput} />);

      expect(screen.getByText('This is a hint')).toBeInTheDocument();
      expect(screen.queryByTestId('hint-no')).not.toBeInTheDocument();
    });
  });

  describe('Fieldset & Accessibility Wrapping', () => {
    test.each`
      useFieldset | title              | expectedTag   | expectedRole    | expectedAriaLabel
      ${true}     | ${'Select Option'} | ${'FIELDSET'} | ${null}         | ${null}
      ${false}    | ${'Select Option'} | ${'DIV'}      | ${'radiogroup'} | ${'Select Option'}
      ${false}    | ${undefined}       | ${'DIV'}      | ${'radiogroup'} | ${'AM or PM selection'}
    `(
      'renders wrapper as $expectedTag with role=$expectedRole and label=$expectedAriaLabel',
      ({
        useFieldset,
        title,
        expectedTag,
        expectedRole,
        expectedAriaLabel,
      }) => {
        const inputConfig: RadioInput = { ...mockRadioInput, title };

        const { container } = render(
          <RadioQuestion radioInput={inputConfig} useFieldset={useFieldset} />,
        );

        const wrapper = container.firstElementChild as HTMLElement;

        expect(wrapper.tagName).toBe(expectedTag);

        if (expectedRole) {
          expect(wrapper).toHaveAttribute('role', expectedRole);
        } else {
          expect(wrapper).not.toHaveAttribute('role');
        }

        if (expectedAriaLabel) {
          expect(wrapper).toHaveAttribute('aria-label', expectedAriaLabel);
        } else {
          expect(wrapper).not.toHaveAttribute('aria-label');
        }
      },
    );

    test.each`
      useFieldset | title             | expectTitleRendered
      ${true}     | ${'Custom Title'} | ${true}
      ${true}     | ${undefined}      | ${false}
      ${false}    | ${'Custom Title'} | ${false}
      ${false}    | ${undefined}      | ${false}
    `(
      'legend rendering is $expectTitleRendered when useFieldset=$useFieldset and title=$title',
      ({ useFieldset, title, expectTitleRendered }) => {
        const inputConfig: RadioInput = { ...mockRadioInput, title };

        render(
          <RadioQuestion radioInput={inputConfig} useFieldset={useFieldset} />,
        );

        const titleElement = screen.queryByTestId('testRadio-title');

        if (expectTitleRendered) {
          expect(titleElement).toBeInTheDocument();
          expect(titleElement).toHaveTextContent(title);
        } else {
          expect(titleElement).not.toBeInTheDocument();
        }
      },
    );
  });

  describe('Error State Evaluation', () => {
    test.each`
      hasFieldError | displayErrorState | expectedHasError
      ${true}       | ${false}          | ${true}
      ${false}      | ${true}           | ${true}
      ${true}       | ${true}           | ${true}
      ${false}      | ${false}          | ${false}
      ${false}      | ${undefined}      | ${false}
    `(
      'passes hasError=$expectedHasError to inputs when hasFieldError=$hasFieldError and displayErrorState=$displayErrorState',
      ({ hasFieldError, displayErrorState, expectedHasError }) => {
        mockedUseErrorSummary.mockReturnValue({
          ...defaultErrorSummaryState,
          fieldErrors: hasFieldError
            ? { testRadio: ['Field is required'] }
            : null,
        });

        render(
          <RadioQuestion
            radioInput={mockRadioInput}
            displayErrorState={displayErrorState}
          />,
        );

        const radioInput = screen.getByTestId('radio-input-yes');
        expect(radioInput.getAttribute('data-haserror')).toBe(
          String(expectedHasError),
        );
      },
    );
  });

  describe('Layout & Spacing Classes', () => {
    test.each`
      layout      | gap          | expectedLayoutClass | expectedOption1Class
      ${'row'}    | ${'mr-8'}    | ${'flex-row'}       | ${'mr-8'}
      ${'row'}    | ${undefined} | ${'flex-row'}       | ${'mr-16'}
      ${'column'} | ${undefined} | ${'flex-col'}       | ${'mb-6'}
    `(
      'applies layout class $expectedLayoutClass and gap $expectedOption1Class when layout=$layout and gap=$gap',
      ({ layout, gap, expectedLayoutClass, expectedOption1Class }) => {
        const inputConfig: RadioInput = { ...mockRadioInput, layout };

        render(<RadioQuestion radioInput={inputConfig} gap={gap} />);

        const flexWrapper = screen.getByTestId('flex-wrapper');
        expect(flexWrapper).toHaveClass(expectedLayoutClass);

        const firstOptionWrapper = flexWrapper.children[0];
        expect(firstOptionWrapper).toHaveClass(expectedOption1Class);
      },
    );

    it('omits bottom margin on the last item in column layout', () => {
      render(<RadioQuestion radioInput={mockRadioInput} />);

      const flexWrapper = screen.getByTestId('flex-wrapper');
      const lastOptionWrapper = flexWrapper.children[1];

      expect(lastOptionWrapper).not.toHaveClass('mb-6');
    });
  });
});
