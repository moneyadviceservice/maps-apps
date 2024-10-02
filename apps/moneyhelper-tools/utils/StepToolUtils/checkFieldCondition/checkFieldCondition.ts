import { FieldCondition, FormData } from 'data/types';

export const checkFieldCondition = (
  fieldCondition: FieldCondition,
  savedData?: FormData,
) => {
  const { rule, field, value } = fieldCondition;
  const savedValue = savedData?.[field];

  if (field && savedValue !== undefined) {
    switch (rule) {
      case '=':
        return savedValue === value;
      case '<':
        return savedValue < value;
      case '>':
        return savedValue > value;
      default:
        return true;
    }
  }

  return false;
};
