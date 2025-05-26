import {
  creditOptionsErrorMessages,
  midLifeMotErrorMessages,
  pensionTypeErrorMessages,
} from 'data/form-content/errors';
import { DataPath } from 'types';

import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const getErrors = (
  z: ReturnType<typeof useTranslation>['z'],
  path: DataPath,
): Array<ErrorType> => {
  switch (path) {
    case DataPath.MidLifeMot:
      return midLifeMotErrorMessages(z);
    case DataPath.CreditOptions:
      return creditOptionsErrorMessages(z);
    case DataPath.PensionType:
      return pensionTypeErrorMessages(z);
    default:
      return [];
  }
};
