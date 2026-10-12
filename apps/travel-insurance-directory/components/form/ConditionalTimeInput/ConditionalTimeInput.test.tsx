import { InputField } from 'types/register';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { fireEvent, render, screen } from '@testing-library/react';

import { RadioInput } from '../RadioQuestion';
import { ConditionalTimeInput } from './ConditionalTimeInput';

jest.mock('../FieldError', () => ({
  FieldError: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-field-error">{children}</div>
  ),
}));

jest.mock('../RadioQuestion', () => ({
  RadioQuestion: ({ initialValue }: { initialValue?: 'yes' | 'no' }) => (
    <div data-testid="mock-radio-question">
      <input
        type="radio"
        value="yes"
        name="mock-radio"
        data-testid="radio-yes"
        defaultChecked={initialValue === 'yes'}
      />
      <input
        type="radio"
        value="no"
        name="mock-radio"
        data-testid="radio-no"
        defaultChecked={initialValue === 'no'}
      />
      <input type="text" data-testid="mock-text-input" />
    </div>
  ),
}));

jest.mock('../TimeInput', () => ({
  TimeInput: ({ inputField }: { inputField: { key: string } }) => (
    <div data-testid={`mock-time-input-${inputField.key}`} />
  ),
}));

const conditionalInputOpeningField = {
  key: 'weekendOpenTime',
  type: 'text',
  dataPath: 'office/address',
} as InputField;
const conditionalInputClosingField = {
  key: 'weekendCloseTime',
  type: 'text',
  dataPath: 'office/address',
} as InputField;

const mockProps = {
  radioField: {
    key: 'isOpenWeekend',
    text: 'Open on weekend?',
    type: 'radio',
    dataPath: 'office/address',
  } as unknown as InputField & RadioInput,
  openClosingInputs: [
    conditionalInputOpeningField,
    conditionalInputClosingField,
  ],
  firmData: null,
};

describe('ConditionalTimeInput Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders elements and hides them visually by default using Tailwind classes', () => {
    render(<ConditionalTimeInput {...mockProps} />);

    expect(screen.getByTestId('mock-field-error')).toBeInTheDocument();
    expect(screen.getByTestId('mock-radio-question')).toBeInTheDocument();

    // 1. Assert that the inputs are rendered (essential for No-JS compatibility!)
    expect(
      screen.getByTestId('mock-time-input-weekendOpenTime'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-time-input-weekendCloseTime'),
    ).toBeInTheDocument();

    // 2. Assert that the wrapper contains the correct structural classes for the CSS toggle
    const wrapper = screen.getByTestId('time-inputs-wrapper');
    expect(wrapper).toHaveClass('hidden');
    expect(wrapper).toHaveClass(
      "group-has-[input[value='yes']:checked]/conditional:block",
    );

    // 3. Confirm radios default to unchecked
    const radioYes = screen.getByTestId('radio-yes') as HTMLInputElement;
    const radioNo = screen.getByTestId('radio-no') as HTMLInputElement;
    expect(radioYes.checked).toBe(false);
    expect(radioNo.checked).toBe(false);
  });

  it('checks the "yes" radio initially if initialValues indicate "yes"', () => {
    const propsWithInitialYes = {
      ...mockProps,
      firmData: {
        office: {
          address: { weekendOpenTime: '10:00', weekendCloseTime: '17:00' },
        },
      } as unknown as TravelInsuranceFirmDocument,
    };

    render(<ConditionalTimeInput {...propsWithInitialYes} />);

    const radioYes = screen.getByTestId('radio-yes') as HTMLInputElement;
    const radioNo = screen.getByTestId('radio-no') as HTMLInputElement;

    // The logic inside getInitialValueOnLoad correctly checks the "Yes" radio
    expect(radioYes.checked).toBe(true);
    expect(radioNo.checked).toBe(false);
  });

  it('toggles the checked state of the HTML radio inputs on click', () => {
    render(<ConditionalTimeInput {...mockProps} />);

    const radioYes = screen.getByTestId('radio-yes') as HTMLInputElement;
    const radioNo = screen.getByTestId('radio-no') as HTMLInputElement;

    expect(radioYes.checked).toBe(false);
    expect(radioNo.checked).toBe(false);

    // Click 'Yes' (which prompts the CSS engine to display the conditional inputs)
    fireEvent.click(radioYes);
    expect(radioYes.checked).toBe(true);
    expect(radioNo.checked).toBe(false);

    // Click 'No' (which prompts CSS to hide them again)
    fireEvent.click(radioNo);
    expect(radioYes.checked).toBe(false);
    expect(radioNo.checked).toBe(true);
  });
});
