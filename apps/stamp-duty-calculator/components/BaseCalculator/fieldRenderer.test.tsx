import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  getFieldLabel,
  getFieldHintText,
  getFieldOptions,
  getDateFieldErrors,
  renderField,
} from './fieldRenderer';
import { CalculatorField, CalculatorConfig } from './types';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: { language: 'en' },
    pathname: '/en',
    locale: 'en',
  })),
}));

type TranslationFunction = ReturnType<typeof useTranslation>['z'];

const mockZ: TranslationFunction = ((translations: any) => {
  if (typeof translations === 'object' && 'en' in translations) {
    return translations.en;
  }
  return translations;
}) as TranslationFunction;

// Test helper functions and constants
const createTestConfig = (
  overrides?: Partial<CalculatorConfig>,
): CalculatorConfig => ({
  name: 'Test Calculator',
  title: 'Test',
  introduction: 'Test intro',
  fields: [],
  calculate: () => null,
  formatResult: () => null,
  analyticsToolName: 'test',
  ...overrides,
});

const createDefaultValues = () => ({
  buyerType: 'firstTimeBuyer' as const,
  price: '100000',
  purchaseDate: '1-1-2025',
});

const renderFieldHelper = (
  field: CalculatorField,
  config: CalculatorConfig,
  mockFireToolStartEvent: jest.Mock,
  mockHandleToolInteractionEvent: jest.Mock,
  errors = {},
  values = createDefaultValues(),
  fieldSpecificErrors?: any,
) => {
  return render(
    <div>
      {renderField({
        field,
        errors,
        values,
        config,
        z: mockZ,
        fireToolStartEvent: mockFireToolStartEvent,
        handleToolInteractionEvent: mockHandleToolInteractionEvent,
        fieldSpecificErrors,
      })}
    </div>,
  );
};

describe('fieldRenderer utilities', () => {
  describe('getFieldLabel', () => {
    it('should return static label string', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'money',
      };

      const result = getFieldLabel(field, mockZ);
      expect(result).toBe('Test Label');
    });

    it('should return label from function', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: (z) => z({ en: 'Dynamic Label', cy: 'Label Dynamig' }),
        type: 'money',
      };

      const result = getFieldLabel(field, mockZ);
      expect(result).toBe('Dynamic Label');
    });
  });

  describe('getFieldHintText', () => {
    it('should return undefined when no hint is provided', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'money',
      };

      const result = getFieldHintText(field, mockZ);
      expect(result).toBeUndefined();
    });

    it('should return static hint string', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'money',
        hint: 'Test hint',
      };

      const result = getFieldHintText(field, mockZ);
      expect(result).toBe('Test hint');
    });

    it('should return hint from function', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'money',
        hint: (z) => z({ en: 'Dynamic Hint', cy: 'Awgrym Dynamig' }),
      };

      const result = getFieldHintText(field, mockZ);
      expect(result).toBe('Dynamic Hint');
    });
  });

  describe('getFieldOptions', () => {
    it('should return field options when no custom options are provided', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'select',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      };

      const config = createTestConfig({ fields: [field] });

      const result = getFieldOptions(field, config, mockZ);
      expect(result).toEqual([
        { value: '1', text: 'Option 1' },
        { value: '2', text: 'Option 2' },
      ]);
    });

    it('should return custom field options from config', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'select',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      };

      const config = createTestConfig({
        fields: [field],
        fieldOptions: {
          testField: (z) => [
            { value: 'a', text: z({ en: 'Custom A', cy: 'Arfer A' }) },
            { value: 'b', text: z({ en: 'Custom B', cy: 'Arfer B' }) },
          ],
        },
      });

      const result = getFieldOptions(field, config, mockZ);
      expect(result).toEqual([
        { value: 'a', text: 'Custom A' },
        { value: 'b', text: 'Custom B' },
      ]);
    });

    it('should return undefined for non-select fields', () => {
      const field: CalculatorField = {
        name: 'testField',
        label: 'Test Label',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      const result = getFieldOptions(field, config, mockZ);
      expect(result).toBeUndefined();
    });
  });

  describe('getDateFieldErrors', () => {
    it('should return undefined when there are no errors', () => {
      const field: CalculatorField = {
        name: 'testDate',
        label: 'Test Date',
        type: 'date',
      };

      const result = getDateFieldErrors(field, false);
      expect(result).toBeUndefined();
    });

    it('should return all date fields as errors when no specific errors provided', () => {
      const field: CalculatorField = {
        name: 'testDate',
        label: 'Test Date',
        type: 'date',
      };

      const result = getDateFieldErrors(field, true);
      expect(result).toEqual({
        day: true,
        month: true,
        year: true,
      });
    });

    it('should return specific date field errors when provided', () => {
      const field: CalculatorField = {
        name: 'testDate',
        label: 'Test Date',
        type: 'date',
      };

      const fieldSpecificErrors = {
        testDate: {
          day: false,
          month: true,
          year: false,
        },
      };

      const result = getDateFieldErrors(field, true, fieldSpecificErrors);
      expect(result).toEqual({
        day: false,
        month: true,
        year: false,
      });
    });
  });

  describe('renderField', () => {
    const mockFireToolStartEvent = jest.fn();
    const mockHandleToolInteractionEvent = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render a select field with field.options when fieldOptions is undefined', () => {
      const field: CalculatorField = {
        name: 'propertyType',
        label: 'Property Type',
        type: 'select',
        options: [
          { value: 'house', text: 'House' },
          { value: 'flat', text: 'Flat' },
        ],
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
      );

      expect(screen.getByLabelText('Property Type')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render a money input field', () => {
      const field: CalculatorField = {
        name: 'price',
        label: 'Purchase Price',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), price: '250000' },
      );

      expect(screen.getByLabelText('Purchase Price')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render field errors', () => {
      const field: CalculatorField = {
        name: 'price',
        label: 'Purchase Price',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        { price: ['This field is required', 'Must be a number'] },
        { ...createDefaultValues(), price: '' },
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('Must be a number')).toBeInTheDocument();
    });

    it('should call event handlers on select change', async () => {
      const user = userEvent.setup();
      const field: CalculatorField = {
        name: 'propertyType',
        label: 'Property Type',
        type: 'select',
        options: [
          { value: 'house', text: 'House' },
          { value: 'flat', text: 'Flat' },
        ],
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
      );

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'flat');

      expect(mockFireToolStartEvent).toHaveBeenCalled();
      expect(mockHandleToolInteractionEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'Select',
        'propertyType',
      );
    });

    it('should render a date field with all date inputs', () => {
      const field: CalculatorField = {
        name: 'purchaseDate',
        label: 'Purchase Date',
        type: 'date',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), purchaseDate: '15-6-2024' },
      );

      expect(screen.getByLabelText('Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Month')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
    });

    it('should render a date field with hint text', () => {
      const field: CalculatorField = {
        name: 'purchaseDate',
        label: 'Purchase Date',
        type: 'date',
        hint: 'Enter the date you completed the purchase',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), purchaseDate: '15-6-2024' },
      );

      expect(
        screen.getByText('Enter the date you completed the purchase'),
      ).toBeInTheDocument();
    });

    it('should render a date field with empty default value', () => {
      const field: CalculatorField = {
        name: 'purchaseDate',
        label: 'Purchase Date',
        type: 'date',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), purchaseDate: '' },
      );

      const dayInput = screen.getByLabelText('Day');
      const monthInput = screen.getByLabelText('Month');
      const yearInput = screen.getByLabelText('Year');

      expect(dayInput).toBeInTheDocument();
      expect(monthInput).toBeInTheDocument();
      expect(yearInput).toBeInTheDocument();
    });

    it('should render money input with empty default value', () => {
      const field: CalculatorField = {
        name: 'price',
        label: 'Purchase Price',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), price: '' },
      );

      expect(screen.getByLabelText('Purchase Price')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('should call event handlers on money input change', async () => {
      const user = userEvent.setup();
      const field: CalculatorField = {
        name: 'price',
        label: 'Purchase Price',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
      );

      const input = screen.getByRole('textbox');
      await user.type(input, '5');

      expect(mockFireToolStartEvent).toHaveBeenCalled();
      expect(mockHandleToolInteractionEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'MoneyInput',
        'price',
      );
    });

    it('should call event handlers on money input keydown', async () => {
      const user = userEvent.setup();
      const field: CalculatorField = {
        name: 'price',
        label: 'Purchase Price',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockHandleToolInteractionEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'MoneyInput',
        'price',
      );
    });

    it('should not render select field when options are missing', () => {
      const field: CalculatorField = {
        name: 'propertyType',
        label: 'Property Type',
        type: 'select',
        // No options provided
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
      );

      expect(screen.getByText('Property Type')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('should render money input with undefined value using empty string fallback', () => {
      const field: CalculatorField = {
        name: 'price',
        label: 'Purchase Price',
        type: 'money',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), price: undefined as any },
      );

      expect(screen.getByLabelText('Purchase Price')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('should render date field with undefined value using empty string fallback', () => {
      const field: CalculatorField = {
        name: 'purchaseDate',
        label: 'Purchase Date',
        type: 'date',
      };

      const config = createTestConfig({ fields: [field] });

      renderFieldHelper(
        field,
        config,
        mockFireToolStartEvent,
        mockHandleToolInteractionEvent,
        {},
        { ...createDefaultValues(), purchaseDate: undefined as any },
      );

      const dayInput = screen.getByLabelText('Day');
      const monthInput = screen.getByLabelText('Month');
      const yearInput = screen.getByLabelText('Year');

      expect(dayInput).toBeInTheDocument();
      expect(monthInput).toBeInTheDocument();
      expect(yearInput).toBeInTheDocument();
    });
  });
});
