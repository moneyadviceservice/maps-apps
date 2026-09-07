import { DataPath } from 'types';

import {
  getQueryData,
  pensionPotValidateInputs,
} from './pensionPotValidationInputs';

describe('pensionPotValidateInputs', () => {
  it('should not throw errors when values are undefined', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        income: undefined,
        pot: undefined,
        chunk: undefined,
      },
      dataPath: DataPath.CashInChunksCalculator,
    });

    expect(result).toEqual({});
  });

  it('should not throw errors when no values are passed in', () => {
    const result = pensionPotValidateInputs({
      inputs: {},
      dataPath: DataPath.CashInChunksCalculator,
    });

    expect(result).toEqual({});
  });

  it('should throw error if empty string is provided', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        income: '',
        pot: '',
        chunk: '',
      },
      dataPath: DataPath.CashInChunksCalculator,
    });

    expect(result).toEqual({
      income: {
        field: 'income',
        type: 'required',
      },
      pot: {
        field: 'pot',
        type: 'required',
      },
      chunk: {
        field: 'chunk',
        type: 'required',
      },
    });
  });

  it('should throw error on type', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        income: 'not a number',
        pot: 'not a number',
      },
      dataPath: DataPath.CashInChunksCalculator,
    });

    expect(result).toEqual({
      income: {
        field: 'income',
        type: 'invalid',
      },
      pot: {
        field: 'pot',
        type: 'invalid',
      },
    });
  });

  it('should throw error when chunk is greater than pot amount', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        income: '1000',
        pot: '20000',
        chunk: '50000',
      },
      dataPath: DataPath.CashInChunksCalculator,
    });

    expect(result).toEqual({
      chunk: {
        field: 'chunk',
        type: 'max',
      },
    });
  });

  it('should throw error when chunk and updateChunk is 0', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        income: '1000',
        pot: '20000',
        chunk: '0',
        updateChunk: '0',
      },
      dataPath: DataPath.CashInChunksCalculator,
    });

    expect(result).toEqual({});
  });

  it('should throw error when age is outside range 55-75', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        income: '20000',
        pot: '1000',
        age: '22',
      },
      dataPath: DataPath.GuaranteedIncomeEstimator,
    });

    expect(result).toEqual({
      age: {
        field: 'age',
        type: 'max',
      },
    });
  });

  it('should not throw error if month is not provided', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        pot: '',
        month: '',
      },
      dataPath: DataPath.LeavePotUntouched,
    });

    expect(result).toEqual({
      pot: {
        field: 'pot',
        type: 'required',
      },
    });
  });

  it('should not throw error if month is not provided', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        pot: '50000000',
        age: '',
      },
      dataPath: DataPath.AjustableIncomeEstimator,
    });

    expect(result).toEqual({
      pot: {
        field: 'pot',
        type: 'max',
      },
    });
  });

  it('should not throw error if month is not provided', () => {
    const result = pensionPotValidateInputs({
      inputs: {
        pot: '50000',
        age: '54',
      },
      dataPath: DataPath.AjustableIncomeEstimator,
    });

    expect(result).toEqual({
      age: {
        field: 'age',
        type: 'min',
      },
    });
  });
});

describe('getQueryData', () => {
  it('should return an object with the correct value for updateChunk', () => {
    const query = {
      income: '1000',
      pot: '20000',
      chunk: '5000',
    };
    const result = getQueryData(query, 'Chunk');
    expect(result).toEqual({
      ...query,
      updateChunk: '5000',
    });
  });

  it('should return an object with the correct value for updateMonth with fallback value', () => {
    const query = {
      pot: '20000',
    };
    const fallbackResult = getQueryData(query, 'Month', '500');
    expect(fallbackResult).toEqual({
      ...query,
      updateMonth: '500',
    });
  });
});

describe('getQueryData', () => {
  it('should return an object with the correct values', () => {
    const query = {
      pot: '20000',
    };
    const restult = getQueryData(query, 'Month', '500');
    expect(restult).toEqual({
      ...query,
      updateMonth: '500',
    });
  });
});
