import { useTranslation } from '@maps-digital/shared/hooks';
import {
  midLifeMotQuestions,
  creditRejectionQuestions,
  creditOptionsQuestions,
  pensionTypeQuestions,
  cashInChunksQuestions,
  takeWholePotQuestions,
  guaranteedIncomeEstimator,
  leavePotUntouched,
  ajustableIncomeEstimator,
} from 'data/form-content/questions';
import { DataPath } from 'types';
import { Question } from '@maps-react/form/types';

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
    case DataPath.CashInChunksCalculator:
      return cashInChunksQuestions(z);
    case DataPath.TakeWholePot:
      return takeWholePotQuestions(z);
    case DataPath.GuaranteedIncomeEstimator:
      return guaranteedIncomeEstimator(z);
    case DataPath.LeavePotUntouched:
      return leavePotUntouched(z);
    case DataPath.AjustableIncomeEstimator:
      return ajustableIncomeEstimator(z);
    default:
      return [];
  }
};
