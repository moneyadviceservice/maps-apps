import { accumulateSummaryItems } from './accumulateSummaryItems';
import { getSummaryValue } from '../getSummaryValue';
import { FormData, FormField, DefaultValues, Summary } from 'data/types';

jest.mock('../getSummaryValue', () => ({
  getSummaryValue: jest.fn(),
}));

describe('accumulateSummaryItems', () => {
  const defaultValues: DefaultValues = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include summary item when form data matches fields', () => {
    const fields: FormField[] = [
      { key: 'name', type: 'input-currency', label: 'Field Name' },
      {
        key: 'amount',
        type: 'input-currency-with-select',
        label: 'Field Name',
        defaultSelectValue: '1',
      },
    ];

    const formData: FormData = {
      name: 'John Doe',
      'amount-i': '100',
      'amount-s': 'months',
    };

    const summary: Summary = {
      label: 'Total Amount',
      unit: 'pounds',
      calc: 'add',
    };

    (getSummaryValue as jest.Mock).mockReturnValue('100 USD');

    const result = accumulateSummaryItems(
      [],
      summary,
      fields,
      formData,
      defaultValues,
    );

    expect(getSummaryValue).toHaveBeenCalledWith(
      fields,
      formData,
      defaultValues,
    );
    expect(result).toEqual([
      {
        label: 'Total Amount',
        value: '100 USD',
        unit: 'pounds',
        calc: 'add',
        hasUserData: true,
      },
    ]);
  });

  it('should include summary item when no form data but displayEmptyStep is true', () => {
    const fields: FormField[] = [
      { key: 'name', type: 'input-currency', label: 'Field Name' },
    ];

    const formData: FormData = {};

    const summary: Summary = {
      label: 'Summary',
      unit: 'pounds',
      calc: 'add',
    };

    (getSummaryValue as jest.Mock).mockReturnValue('N/A');

    const result = accumulateSummaryItems(
      [],
      summary,
      fields,
      formData,
      defaultValues,
      true,
    );

    expect(getSummaryValue).toHaveBeenCalledWith(
      fields,
      formData,
      defaultValues,
    );
    expect(result).toEqual([
      {
        label: 'Summary',
        value: 'N/A',
        unit: 'pounds',
        calc: 'add',
        hasUserData: true,
      },
    ]);
  });

  it('should not include summary item when no form data and displayEmptyStep is false', () => {
    const fields: FormField[] = [
      { key: 'name', type: 'input-currency', label: 'Field Name' },
    ];

    const formData: FormData = {};

    const summary: Summary = {
      label: 'Summary',
      unit: 'pounds',
      calc: 'add',
    };

    const result = accumulateSummaryItems(
      [],
      summary,
      fields,
      formData,
      defaultValues,
      false,
    );

    expect(result).toEqual([]);
  });

  it('should call getSummaryValue with correct parameters', () => {
    const fields: FormField[] = [
      { key: 'name', type: 'input-currency', label: 'Field Name' },
    ];

    const formData: FormData = {
      name: 'John Doe',
    };

    const summary: Summary = {
      label: 'Summary',
      unit: 'pounds',
      calc: 'add',
    };

    (getSummaryValue as jest.Mock).mockReturnValue('Value');

    accumulateSummaryItems([], summary, fields, formData, defaultValues, true);

    expect(getSummaryValue).toHaveBeenCalledWith(
      fields,
      formData,
      defaultValues,
    );
  });
});
