import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import { FormField, GroupType } from '../../types/forms';
import { DynamicFields } from './DynamicFields';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  useTranslation: jest.fn().mockReturnValue({ z: jest.fn() }),
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

  it('renders description with correct ID', () => {
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

    const descriptionElement = screen.getByText('This is a test description');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement.id).toBe('q-test-field-description');
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
      expect.anything(),
    );
  });
});
