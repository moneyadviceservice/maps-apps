import { FormField, Summary } from 'data/types';

import { processFieldValue } from '../Summary/getSummaryValue';
import { generateFieldData } from './generateFieldData';

jest.mock('../Summary/getSummaryValue');
jest.mock('../Summary/getSummaryValue', () => ({
  processFieldValue: jest.fn(),
}));

describe('generateFieldData', () => {
  const mockedProcessFieldValue = processFieldValue as jest.MockedFunction<
    typeof processFieldValue
  >;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should accumulate field data correctly', () => {
    const fields: FormField[] = [
      {
        key: 'field1',
        label: 'Field 1',
        type: 'select',
        validation: {
          required: true,
          requiredInputMessage: 'Required input field.',
        },
        defaultSelectValue: '1',
      },
      {
        key: 'field2',
        label: 'Field 2',
        type: 'select',
        validation: { required: false },
        defaultSelectValue: '2',
        group: { key: 'group1', label: 'Group 1' },
      },
    ];
    const summary: Summary = {
      label: 'Summary Label',
      unit: 'pounds',
      calc: 'sub',
    };
    const formData = { field1: 'value1', field2: 'value2' };
    const linkText = 'Link Text';
    const errors = {
      field1: ['Please select a date to continue.'],
    };

    mockedProcessFieldValue.mockImplementation((field) => {
      if (field.key === 'field1') return 10;
      if (field.key === 'field2') return 20;
      return 0;
    });

    const result = generateFieldData(
      fields,
      formData,
      'urlPath',
      summary,
      linkText,
      false,
      errors,
    );

    expect(result.validation).toEqual({
      field1: { required: true, requiredInputMessage: 'Required input field.' },
      field2: { required: false },
    });

    expect(result.defaultValues).toEqual({
      field1: '1',
      field2: '2',
    });

    expect(result.summaryItem).toEqual({
      label: 'Summary Label',
      value: 30, // 10 + 20
      unit: 'pounds',
      calc: 'sub',
      hasUserData: true,
    });

    expect(result.groupedFieldSum).toEqual([
      {
        name: 'Link Text',
        value: 10,
        url: 'urlPath#Link-Text',
      },
      {
        name: 'Group 1',
        value: 20,
        url: 'urlPath#group1',
      },
    ]);
  });

  it('should handle empty fields array', () => {
    const fields: FormField[] = [];
    const summary: Summary = {
      label: 'Summary Label',
      unit: 'pounds',
      calc: 'sub',
    };
    const formData = {};
    const linkText = 'Link Text';

    const result = generateFieldData(
      fields,
      formData,
      'urlPath',
      summary,
      linkText,
    );

    expect(result.validation).toEqual({});
    expect(result.defaultValues).toEqual({});
    expect(result.summaryItem).toEqual({});
    expect(result.groupedFieldSum).toEqual([]);
  });

  it('should handle fields with no validation and default values', () => {
    const fields: FormField[] = [
      {
        key: 'field1',
        label: 'Field 1',
        type: 'select',
        defaultSelectValue: '',
      },
      {
        key: 'field2',
        label: 'Field 2',
        type: 'select',
        defaultSelectValue: '',
      },
    ];
    const summary: Summary = {
      label: 'Summary Label',
      unit: 'pounds',
      calc: 'sub',
    };
    const formData = { field1: 'value1', field2: 'value2' };
    const linkText = 'Link Text';

    mockedProcessFieldValue.mockImplementation((field) => {
      if (field.key === 'field1') return 15;
      if (field.key === 'field2') return 25;
      return 0;
    });

    const result = generateFieldData(
      fields,
      formData,
      'urlPath',
      summary,
      linkText,
    );

    expect(result.validation).toEqual({});
    expect(result.defaultValues).toEqual({ field1: '', field2: '' });
    expect(result.summaryItem).toEqual({
      label: 'Summary Label',
      value: 40, // 15 + 25
      unit: 'pounds',
      calc: 'sub',
      hasUserData: true,
    });

    expect(result.groupedFieldSum).toEqual([
      { name: 'Link Text', url: 'urlPath#Link-Text', value: 40 },
    ]);
  });
});
