import useTranslation from '@maps-react/hooks/useTranslation';

import { startQuestions } from '../questions';

export const startPageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: startQuestions(t)[0].title,
    2: startQuestions(t)[1].title,
    3: startQuestions(t)[2].title,
    4: startQuestions(t)[3].title,
  };
};
