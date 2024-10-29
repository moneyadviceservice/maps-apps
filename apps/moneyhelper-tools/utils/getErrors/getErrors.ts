import { useTranslation } from '@maps-digital/shared/hooks';
import {
  midLifeMotErrorMessages,
  creditRejectionErrorMessages,
  creditOptionsErrorMessages,
  pensionTypeErrorMessages,
} from 'data/form-content/errors';
import { DataPath } from 'types';
import { ErrorType } from '@maps-react/form/types';

export const getErrors = (
  z: ReturnType<typeof useTranslation>['z'],
  path: DataPath,
): Array<ErrorType> => {
  switch (path) {
    case DataPath.MidLifeMot:
      return midLifeMotErrorMessages(z);
    case DataPath.CreditRejection:
      return creditRejectionErrorMessages(z);
    case DataPath.CreditOptions:
      return creditOptionsErrorMessages(z);
    case DataPath.PensionType:
      return pensionTypeErrorMessages(z);
    default:
      return [];
  }
};
