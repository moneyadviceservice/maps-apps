import { pensionTypeErrorMessages } from 'data/form-content/errors';
import { DataPath } from 'types';

import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const getErrors = (
  z: ReturnType<typeof useTranslation>['z'],
  path: DataPath,
): Array<ErrorType> => {
  if (path === DataPath.PensionType) {
    return pensionTypeErrorMessages(z);
  }

  return [];
};
