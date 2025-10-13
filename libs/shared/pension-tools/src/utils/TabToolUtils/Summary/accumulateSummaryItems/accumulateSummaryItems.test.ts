import {
  DefaultValues,
  FormData,
  FormField,
  Summary,
} from '../../../../types/forms';
import { getSummaryValue } from '../getSummaryValue';
import { accumulateSummaryItems } from './accumulateSummaryItems';

jest.mock('../getSummaryValue', () => ({
  getSummaryValue: jest.fn(),
}));

describe('accumulateSummaryItems', () => {
  const defaultValues: DefaultValues = {};

  const createBasicField = (): FormField => ({
    key: 'name',
    type: 'input-currency',
    label: 'Field Name',
  });

  const createBasicSummary = (label = 'Summary'): Summary => ({
    label,
    unit: 'pounds',
    calc: 'add',
  });

  const setupTest = (formData: FormData = {}, displayEmptyStep = false) => {
    const fields: FormField[] = [createBasicField()];
    const summary = createBasicSummary();

    const result = accumulateSummaryItems(
      [],
      summary,
      fields,
      formData,
      defaultValues,
      displayEmptyStep,
    );

    return { fields, summary, result };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include summary item when form data matches fields', () => {
    const fields: FormField[] = [
      createBasicField(),
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

    const summary = createBasicSummary('Total Amount');

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
    (getSummaryValue as jest.Mock).mockReturnValue('N/A');

    const { fields, result } = setupTest({}, true);

    expect(getSummaryValue).toHaveBeenCalledWith(fields, {}, defaultValues);
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
    const { result } = setupTest({}, false);
    expect(result).toEqual([]);
  });

  it('should call getSummaryValue with correct parameters', () => {
    const formData: FormData = {
      name: 'John Doe',
    };

    (getSummaryValue as jest.Mock).mockReturnValue('Value');

    const { fields } = setupTest(formData, true);

    expect(getSummaryValue).toHaveBeenCalledWith(
      fields,
      formData,
      defaultValues,
    );
  });
});
