import { validateDueDate } from 'utils/validation/validateDueDate/validateDueDate';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { getDefaultValues } from '@maps-react/utils/getDefaultValues';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getDefaultDueDate } from '../../utils/getDefaultDueDate';
import { getErrors } from '../../utils/getErrors';

export function useDueDateValidation(queryData: DataFromQuery) {
  const { z } = useTranslation();

  const defaultDueDate = getDefaultDueDate();

  const dueDate = queryData.dueDate ?? defaultDueDate;

  const defaultValues = getDefaultValues(dueDate);

  const validation = validateDueDate(defaultValues);

  const { errors } = getErrors(
    validation.fieldErrors,
    z,
    validation.isInvalidDate,
    validation.isBeforeMinDate,
  );

  return {
    dueDate,
    defaultDueDate,
    validation,
    errors,
  };
}
