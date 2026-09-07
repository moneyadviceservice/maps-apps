import { FormField, Summary } from '../../../types/forms';
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

  it('should populate acdlErrors using acdlLabel when present', () => {
    const fields: FormField[] = [
      {
        key: 'field1',
        label: 'Field 1 label',
        acdlLabel: 'Field 1 acdl',
        type: 'input-currency',
      },
    ];
    mockedProcessFieldValue.mockReturnValue(0);

    const result = generateFieldData(
      fields,
      {},
      'urlPath',
      undefined,
      '',
      false,
      { field1: ['Error message'] },
    );

    expect(result.acdlErrors).toEqual({
      field1: { error: { label: 'Field 1 acdl', message: 'Error message' } },
    });
  });

  it('should populate acdlErrors using label when acdlLabel is absent', () => {
    const fields: FormField[] = [
      { key: 'field1', label: 'Field 1 label', type: 'input-currency' },
    ];
    mockedProcessFieldValue.mockReturnValue(0);

    const result = generateFieldData(
      fields,
      {},
      'urlPath',
      undefined,
      '',
      false,
      { field1: ['Error message'] },
    );

    expect(result.acdlErrors).toEqual({
      field1: { error: { label: 'Field 1 label', message: 'Error message' } },
    });
  });

  it('should fall back to key in acdlErrors when both acdlLabel and label are absent', () => {
    const fields: FormField[] = [{ key: 'field1', type: 'input-currency' }];
    mockedProcessFieldValue.mockReturnValue(0);

    const result = generateFieldData(
      fields,
      {},
      'urlPath',
      undefined,
      '',
      false,
      { field1: ['Error message'] },
    );

    expect(result.acdlErrors).toEqual({
      field1: { error: { label: 'field1', message: 'Error message' } },
    });
  });

  it('should not populate acdlErrors when acdlErrors is null', () => {
    const fields: FormField[] = [
      { key: 'field1', label: 'Field 1', type: 'input-currency' },
    ];
    mockedProcessFieldValue.mockReturnValue(0);

    const result = generateFieldData(
      fields,
      {},
      'urlPath',
      undefined,
      '',
      false,
      null,
    );

    expect(result.acdlErrors).toEqual({});
  });

  it('should add fieldCondition fields to conditionalFields', () => {
    const fields: FormField[] = [
      {
        key: 'field1',
        label: 'Field 1',
        type: 'radio',
        fieldCondition: { field: 'conditional-field', value: 'yes', rule: '=' },
      },
    ];
    mockedProcessFieldValue.mockReturnValue(0);

    const result = generateFieldData(fields, {}, 'urlPath');

    expect(result.conditionalFields.has('conditional-field')).toBe(true);
  });

  it('should use key-i for input-currency-with-select when checking formData', () => {
    const fields: FormField[] = [
      {
        key: 'field1',
        label: 'Field 1',
        type: 'input-currency-with-select',
        defaultSelectValue: '',
      },
    ];
    mockedProcessFieldValue.mockReturnValue(0);

    const resultWithData = generateFieldData(
      fields,
      { 'field1-i': '100' },
      'urlPath',
    );
    const resultWithoutData = generateFieldData(fields, {}, 'urlPath');

    expect(resultWithData.summaryItem).toEqual({});
    expect(resultWithoutData.summaryItem).toEqual({});
  });

  it('should append embed query to grouped field url when isEmbed is true', () => {
    const fields: FormField[] = [
      { key: 'field1', label: 'Field 1', type: 'input-currency' },
    ];
    const summary: Summary = { label: 'Summary', unit: 'pounds', calc: 'sub' };
    mockedProcessFieldValue.mockReturnValue(10);

    const result = generateFieldData(
      fields,
      { field1: '10' },
      'urlPath',
      summary,
      'Link',
      true,
    );

    expect(result.groupedFieldSum[0].url).toContain('&');
  });

  it('should accumulate value for existing group key', () => {
    const fields: FormField[] = [
      {
        key: 'field1',
        label: 'Field 1',
        type: 'input-currency',
        group: { key: 'grp', label: 'Group' },
      },
      {
        key: 'field2',
        label: 'Field 2',
        type: 'input-currency',
        group: { key: 'grp', label: 'Group' },
      },
    ];
    const summary: Summary = { label: 'Summary', unit: 'pounds', calc: 'sub' };
    mockedProcessFieldValue.mockReturnValue(10);

    const result = generateFieldData(
      fields,
      { field1: '10', field2: '10' },
      'urlPath',
      summary,
      '',
    );

    expect(result.groupedFieldSum).toHaveLength(1);
    expect(result.groupedFieldSum[0].value).toBe(20);
  });

  it('should not add to groupedFieldSum when summary unit is not pounds', () => {
    const fields: FormField[] = [
      { key: 'field1', label: 'Field 1', type: 'input-currency' },
    ];
    const summary: Summary = {
      label: 'Summary',
      unit: 'months',
      calc: 'sub',
    };
    mockedProcessFieldValue.mockReturnValue(10);

    const result = generateFieldData(
      fields,
      { field1: '10' },
      'urlPath',
      summary,
    );

    expect(result.groupedFieldSum).toEqual([]);
  });

  it('should not add to groupedFieldSum when summary calc is not sub', () => {
    const fields: FormField[] = [
      { key: 'field1', label: 'Field 1', type: 'input-currency' },
    ];
    const summary: Summary = { label: 'Summary', unit: 'pounds', calc: 'add' };
    mockedProcessFieldValue.mockReturnValue(10);

    const result = generateFieldData(
      fields,
      { field1: '10' },
      'urlPath',
      summary,
    );

    expect(result.groupedFieldSum).toEqual([]);
  });

  it('should not update summaryItem when no summary is provided', () => {
    const fields: FormField[] = [
      { key: 'field1', label: 'Field 1', type: 'input-currency' },
    ];
    mockedProcessFieldValue.mockReturnValue(10);

    const result = generateFieldData(fields, { field1: '10' }, 'urlPath');

    expect(result.summaryItem).toEqual({});
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
