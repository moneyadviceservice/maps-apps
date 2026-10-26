import useTranslation from '@maps-react/hooks/useTranslation';

import { onlineQuestions } from '../questions';

export const onlinePageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: onlineQuestions(t)[0].title,
    2: onlineQuestions(t)[1].title,
    3: onlineQuestions(t)[2].title,
  };
};
