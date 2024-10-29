import { DataPath } from 'types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

export type ErrorField = {
  field: string;
  type: string;
};

export type ErrorObject = {
  [key: string]: ErrorField;
};

export type PensionPotInputs = {
  income?: string;
  pot?: string;
  chunk?: string;
  updateChunk?: string;
  age?: string;
  month?: string;
};

export type PensionPotValidation = {
  inputs: PensionPotInputs;
  dataPath: DataPath;
};

export const formatQuery = (value: string) => {
  return Number(value?.replaceAll(',', ''));
};

export const pensionPotValidateInputs = (data: PensionPotValidation) => {
  const { income, pot, chunk, updateChunk, age, month } = data.inputs;
  const dataPath = data.dataPath;

  const values = {
    income,
    pot,
    chunk,
    updateChunk,
    age,
    month,
  };

  let errors = getErrorRequiredOrInvalid(values);

  if (dataPath === DataPath.CashInChunksCalculator) {
    errors = cashInChunksCalculatorErrors(errors, values);
  }

  if (dataPath === DataPath.LeavePotUntouched) {
    if (errors?.month?.type === 'required') {
      delete errors['month'];
    }
  }

  if (dataPath === DataPath.GuaranteedIncomeEstimator) {
    errors = guaranteedIncomeEstimatorErrors(errors, values);
  }

  if (dataPath === DataPath.AjustableIncomeEstimator) {
    errors = ajustableIncomeEstimatorErrors(errors, values);
  }

  return errors;
};

const cashInChunksCalculatorErrors = (
  errors: ErrorObject,
  values: PensionPotInputs,
) => {
  const { income, pot, chunk, updateChunk } = values;

  const formatNumber = (value: string | undefined) => {
    return Number(value?.replaceAll(',', ''));
  };

  if (
    (income && pot && formatNumber(pot) < formatNumber(chunk)) ||
    (updateChunk && pot && formatNumber(pot) < formatNumber(updateChunk))
  ) {
    errors.chunk = {
      field: 'chunk',
      type: 'max',
    };
  } else if (
    chunk &&
    Number(chunk) === 0 &&
    updateChunk &&
    Number(updateChunk) === 0
  ) {
    delete errors['chunk'];
    delete errors['updateChunk'];
  }

  return errors;
};

const guaranteedIncomeEstimatorErrors = (
  errors: ErrorObject,
  values: PensionPotInputs,
) => {
  const { age } = values;
  if ((age && Number(age) < 55) || Number(age) > 75) {
    errors.age = {
      field: 'age',
      type: 'max',
    };
  }

  return errors;
};

const ajustableIncomeEstimatorErrors = (
  errors: ErrorObject,
  values: PensionPotInputs,
) => {
  const { pot, age } = values;

  if (errors?.age?.type === 'required') {
    delete errors['age'];
  }

  if (pot && Number(pot.replaceAll(',', '')) > 5000000) {
    errors.pot = {
      field: 'pot',
      type: 'max',
    };
  }

  if (age && Number(age) < 55) {
    errors.age = {
      field: 'age',
      type: 'min',
    };
  }

  return errors;
};

const getErrorRequiredOrInvalid = (values: PensionPotInputs) => {
  return Object.keys(values)
    .filter((v) => {
      return values[v as keyof PensionPotInputs] !== undefined;
    })
    .reduce((acc, key) => {
      const value = values[key as keyof PensionPotInputs];
      if (value?.length === 0) {
        acc[key] = {
          field: key,
          type: 'required',
        };
      }

      const hasValue = value && value?.length > 0;
      const isInvalid = hasValue && isNaN(Number(value.replaceAll(',', '')));

      if (isInvalid) {
        acc[key] = {
          field: key,
          type: 'invalid',
        };
      }

      if (!isInvalid && hasValue && Number(value.replaceAll(',', '')) < 1) {
        acc[key] = {
          field: key,
          type: 'min',
        };
      }

      return acc;
    }, {} as ErrorObject);
};

export const getQueryData = (
  queryData: DataFromQuery,
  keyName: string,
  fallback: string | null = null,
) => {
  const checkValue = (value: string) => (value === '0' ? '' : value);

  return {
    ...queryData,
    [`update${keyName}`]: queryData[`update${keyName}`]
      ? checkValue(queryData[`update${keyName}`])
      : fallback ?? queryData[keyName.toLocaleLowerCase()],
  };
};
