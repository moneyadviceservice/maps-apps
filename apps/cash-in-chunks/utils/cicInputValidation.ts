import { Question } from '@maps-react/form/types';
import { ErrorObject } from '@maps-react/pension-tools/types';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

export type CicInputs = {
  income?: string;
  pot?: string;
  chunk?: string;
  updateChunk?: string;
};
export const cashInChunksCalculatorErrors = (
  errors: ErrorObject,
  values: CicInputs,
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

export const isInputAllowed = (
  value: { floatValue: number | undefined },
  field: Question,
  queryData: DataFromQuery,
) => {
  const { floatValue } = value;
  const updateChunk = field.type === 'updateChunk';

  if (updateChunk) {
    return (floatValue ?? 0) <= Number(queryData.pot.replaceAll(',', ''));
  }

  return true;
};
