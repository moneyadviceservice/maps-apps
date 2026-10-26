import { pensionTypeQuestions } from 'data/form-content/questions';
import { DataPath } from 'types';

import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const getQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
  path: DataPath,
): Array<Question> => {
  if (path === DataPath.PensionType) {
    return pensionTypeQuestions(z);
  }
  return [];
};
