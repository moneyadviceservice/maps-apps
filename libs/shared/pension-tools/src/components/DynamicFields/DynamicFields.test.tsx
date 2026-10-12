import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import { FormField, GroupType } from '../../types/forms';
import { DynamicFields } from './DynamicFields';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  useTranslation: jest.fn().mockReturnValue({ z: jest.fn() }),
}));

jest.mock('../../utils/addUnitToAriaLabel', () => ({
  addUnitToAriaLabel: jest.fn((label, unit) => `${label}, in ${unit}`),
}));

jest.mock('@maps-react/form/components/MoneyInput', () => ({
  MoneyInput: jest.fn(({ onChange, key }) => (
    <input
      data-testid={key}
      onChange={(e) => onChange({ target: { value: e.target.value } })}
    />
  )),
}));

jest.mock('@maps-react/form/components/Select', () => ({
  Select: jest.fn(({ onChange, options, name }) => (
    <select data-testid={name} onChange={onChange}>
      {options.map((option: { value: string | number; text: string }) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  )),
}));

jest.mock('@maps-react/form/components/RadioButton', () => ({
  RadioButton: jest.fn(({ onChange, value }) => (
    <input
      type="radio"
      data-testid={`radio-${value}`}
      onChange={(e) => onChange(e)}
    />
  )),
}));

describe('DynamicFields component', () => {
  const mockFormFields: FormField[] = [
    {
      key: 'currency-field',
      label: 'Currency',
      type: 'input-currency',
    },
    {
      key: 'select-field',
      label: 'Select Field',
      type: 'select',
      defaultSelectValue: 'option1',
      options: [
        { value: 'option1', text: 'Option 1' },
        { value: 'option2', text: 'Option 2' },
      ],
    },
    {
      key: 'radio-field',
      label: 'Radio Field',
      type: 'radio',
      options: [
        { value: 'radio1', text: 'Radio 1' },
        { value: 'radio2', text: 'Radio 2' },
      ],
    },
    {
      key: 'input-with-select',
      label: 'Radio Field',
      type: 'input-currency-with-select',
      defaultInputValue: '',
      defaultSelectValue: '',
      options: [
        { value: 'radio1', text: 'Radio 1' },
        { value: 'radio2', text: 'Radio 2' },
      ],
    },
  ];

  const mockFormErrors = {
    'currency-field': ['Invalid value'],
  };

  const mockSavedData = {
    'currency-field': '100.00',
  };

  let mockUpdateSavedValues = jest.fn();

  beforeEach(() => {
    mockUpdateSavedValues = jest.fn();
  });

  it('renders the correct field types', () => {
    render(
      <DynamicFields
        formFields={mockFormFields}
        formErrors={{}}
        savedData={{}}
        updateSavedValues={mockUpdateSavedValues}
      />,
    );

    const fieldGroup = screen.getByTestId('field-group-currency-field');
    const currencyInputElement = within(fieldGroup).getByRole('textbox');

    expect(currencyInputElement).toBeInTheDocument();
    expect(screen.getByTestId('q-select-field')).toBeInTheDocument();
    expect(screen.getByTestId('radio-radio1')).toBeInTheDocument();
    expect(screen.getByTestId('radio-radio2')).toBeInTheDocument();
    expect(
      screen.getByTestId('field-group-input-with-select'),
    ).toBeInTheDocument();

    const fieldGroupWithSelect = screen.getByTestId(
      'field-group-input-with-select',
    );
    const InputWithSelectElement =
      within(fieldGroupWithSelect).getByRole('textbox');
    expect(InputWithSelectElement).toBeInTheDocument();
  });

  it('displays form errors when present', () => {
    render(
      <DynamicFields
        formFields={mockFormFields}
        formErrors={mockFormErrors}
        savedData={{}}
        updateSavedValues={mockUpdateSavedValues}
      />,
    );

    expect(screen.getByText('Invalid value')).toBeInTheDocument();
  });

  it('calls updateSavedValues on money input change', () => {
    render(
      <DynamicFields
        formFields={mockFormFields}
        formErrors={{}}
        savedData={mockSavedData}
        updateSavedValues={mockUpdateSavedValues}
      />,
    );

    const fieldGroup = screen.getByTestId('field-group-currency-field');

    const inputElement = within(fieldGroup).getByRole('textbox');

    fireEvent.change(inputElement, {
      target: { value: '200.00' },
    });
    expect(mockUpdateSavedValues).toHaveBeenCalledWith(
      'currency-field',
      '200.00',
    );
  });

  it('calls updateSavedValues on select input change', () => {
    render(
      <DynamicFields
        formFields={mockFormFields}
        formErrors={{}}
        savedData={mockSavedData}
        updateSavedValues={mockUpdateSavedValues}
      />,
    );

    fireEvent.change(screen.getByTestId('q-select-field'), {
      target: { value: 'option2' },
    });
    expect(mockUpdateSavedValues).toHaveBeenCalledWith(
      'select-field',
      'option2',
    );
  });

  it('renders fields in groups', () => {
    const mockOptionalFormFields: FormField[] = [
      {
        key: 'select-field',
        label: 'Select Field',
        type: 'select',
        defaultSelectValue: '10',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
        ],
        group: {
          key: 'group-key',
          label: 'Group Label',
          type: GroupType.HEADING,
        },
      },
      {
        key: 'radio-field',
        label: 'Radio Field',
        type: 'radio',
        options: [
          { value: 'no', text: 'Radio 1' },
          { value: 'yes', text: 'Radio 2' },
        ],
        defaultRadioValue: 'no',
        topMargin: true,
        group: {
          key: 'group-key',
          label: 'Group Label',
          type: GroupType.HEADING,
        },
      },
      {
        key: 'currency-field-conditional',
        label: 'Currency with more fields',
        type: 'input-currency',
        description: 'test description',
        fieldCondition: {
          field: 'radio-field',
          value: 'no',
          rule: '=',
        },
        group: {
          key: 'group-key',
          label: 'Group Label',
          type: GroupType.HEADING,
        },
      },
      {
        key: 'select-field-group-two',
        label: 'Select Field Group 2',
        type: 'select',
        defaultSelectValue: '10',
        options: [
          { value: 'option1', text: 'Option 1' },
          { value: 'option2', text: 'Option 2' },
        ],
        group: {
          key: 'group-two-key',
          label: 'Group Two Label',
          type: GroupType.EXPANDABLE,
        },
      },
    ];

    render(
      <DynamicFields
        formFields={mockOptionalFormFields}
        formErrors={{}}
        savedData={{}}
        updateSavedValues={mockUpdateSavedValues}
      />,
    );

    expect(
      screen.queryByTestId('q-select-field-group-two'),
    ).toBeInTheDocument();
  });

  it('renders description with correct ID and sr-only class', () => {
    const fieldWithDescription: FormField[] = [
      {
        key: 'test-field',
        label: 'Test Field',
        type: 'input-currency',
        description: 'This is a test description',
      },
    ];

    render(
      <DynamicFields
        formFields={fieldWithDescription}
        formErrors={{}}
        savedData={{}}
      />,
    );

    const descriptionElements = screen.getAllByText(
      'This is a test description',
    );
    expect(descriptionElements.length).toBe(2);

    // Find the sr-only element
    const srOnlyElement = descriptionElements.find((el) =>
      el.classList.contains('sr-only'),
    );
    expect(srOnlyElement).toBeDefined();
    expect(srOnlyElement?.id).toBe('q-test-field-description');
  });

  it('sets aria-describedby attribute correctly on inputs with descriptions', () => {
    const fieldWithDescription: FormField[] = [
      {
        key: 'test-field',
        label: 'Test Field',
        type: 'input-currency',
        description: 'This is a test description',
      },
    ];

    render(
      <DynamicFields
        formFields={fieldWithDescription}
        formErrors={{}}
        savedData={{}}
      />,
    );

    expect(
      jest.requireMock('@maps-react/form/components/MoneyInput').MoneyInput,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        'aria-describedby': 'q-test-field-description',
      }),
      undefined,
    );
  });

  describe('aria-label with addUnitToAriaLabel', () => {
    const renderDynamicFieldsAndGetMoneyInput = (field: FormField) => {
      render(
        <DynamicFields formFields={[field]} formErrors={{}} savedData={{}} />,
      );

      return jest.requireMock('@maps-react/form/components/MoneyInput')
        .MoneyInput;
    };

    const testCases = [
      {
        name: 'generates aria-label without addon using addUnitToAriaLabel',
        field: {
          key: 'amount-field',
          label: 'Annual income',
          type: 'input-currency' as const,
        },
        expectedProps: {
          'aria-label': 'Annual income, in pounds',
        },
      },
      {
        name: 'generates aria-label with addon appended after addUnitToAriaLabel',
        field: {
          key: 'amount-field',
          label: 'Monthly payment',
          type: 'input-currency' as const,
          addon: 'per month',
        },
        expectedProps: {
          'aria-label': 'Monthly payment, in pounds per month',
        },
      },
      {
        name: 'passes addon prop to MoneyInput component',
        field: {
          key: 'amount-field',
          label: 'Salary',
          type: 'input-currency' as const,
          addon: 'per year',
        },
        expectedProps: {
          addon: 'per year',
        },
      },
      {
        name: 'uses addon as aria-label when label is undefined',
        field: {
          key: 'amount-field',
          type: 'input-currency' as const,
          addon: 'per year',
        } as FormField,
        expectedProps: {
          'aria-label': 'per year',
        },
      },
      {
        name: 'uses empty string as aria-label when both label and addon are undefined',
        field: {
          key: 'amount-field',
          type: 'input-currency' as const,
        } as FormField,
        expectedProps: {
          'aria-label': '',
        },
      },
    ];

    testCases.forEach(({ name, field, expectedProps }) => {
      it(name, () => {
        const moneyInputMock = renderDynamicFieldsAndGetMoneyInput(field);

        expect(moneyInputMock).toHaveBeenCalledWith(
          expect.objectContaining(expectedProps),
          undefined,
        );
      });
    });
  });

  it('renders an H1 heading by default when field has a heading property', () => {
    const fieldWithHeading: FormField[] = [
      {
        key: 'radio-field',
        label: 'Radio label',
        heading: 'Is there a second applicant?',
        type: 'radio',
        options: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ],
      },
    ];

    render(
      <DynamicFields
        formFields={fieldWithHeading}
        formErrors={{}}
        savedData={{}}
      />,
    );

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Is there a second applicant?');
    expect(h1).toHaveClass('text-blue-700');
  });

  it('renders the heading at the level set by headingLevel', () => {
    const fieldWithHeading: FormField[] = [
      {
        key: 'radio-field',
        label: 'Radio label',
        heading: 'Is there a second applicant?',
        headingLevel: 'h2',
        type: 'radio',
        options: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ],
      },
    ];

    render(
      <DynamicFields
        formFields={fieldWithHeading}
        formErrors={{}}
        savedData={{}}
      />,
    );

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toBeInTheDocument();
    expect(h2).toHaveTextContent('Is there a second applicant?');
    expect(h2).toHaveClass('text-blue-700');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('applies topMargin border class when topMargin is true', () => {
    const fieldWithTopMargin: FormField[] = [
      {
        key: 'radio-field',
        label: 'Radio Field',
        type: 'radio',
        topMargin: true,
        options: [{ value: 'yes', text: 'Yes' }],
      },
    ];

    const { container } = render(
      <DynamicFields
        formFields={fieldWithTopMargin}
        formErrors={{}}
        savedData={{}}
      />,
    );

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('border-t');
    expect(fieldset).toHaveClass('pt-4');
  });

  it('renders expandableContent on a field', () => {
    const fieldWithExpandable: FormField[] = [
      {
        key: 'currency-field',
        label: 'Income',
        type: 'input-currency',
        expandableContent: {
          title: 'Why do we need this?',
          text: 'We use this to calculate your budget.',
        },
      },
    ];

    render(
      <DynamicFields
        formFields={fieldWithExpandable}
        formErrors={{}}
        savedData={{}}
      />,
    );

    expect(screen.getByText('Why do we need this?')).toBeInTheDocument();
  });

  it('does not call updateSavedValues on radio change when field is not in conditionalFields', () => {
    const fields: FormField[] = [
      {
        key: 'radio-field',
        label: 'Radio Field',
        type: 'radio',
        options: [{ value: 'yes', text: 'Yes' }],
      },
    ];

    render(
      <DynamicFields
        formFields={fields}
        formErrors={{}}
        savedData={{}}
        updateSavedValues={mockUpdateSavedValues}
      />,
    );

    fireEvent.change(screen.getByTestId('radio-yes'), {
      target: { value: 'yes' },
    });

    expect(mockUpdateSavedValues).not.toHaveBeenCalled();
  });
});
