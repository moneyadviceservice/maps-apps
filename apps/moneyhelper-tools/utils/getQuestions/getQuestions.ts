import { useTranslation } from '@maps-digital/shared/hooks';
import {
  midLifeMotQuestions,
  creditRejectionQuestions,
  creditOptionsQuestions,
  pensionTypeQuestions,
} from 'data/form-content/questions';
import { Question, DataPath } from 'types';

export const getQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
  path: DataPath,
): Array<Question> => {
  switch (path) {
    case DataPath.MidLifeMot:
      return midLifeMotQuestions(z);
    case DataPath.CreditRejection:
      return creditRejectionQuestions(z);
    case DataPath.CreditOptions:
      return creditOptionsQuestions(z);
    case DataPath.PensionType:
      return pensionTypeQuestions(z);
    default:
      return [];
  }
};
