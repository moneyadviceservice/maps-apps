import useTranslation from '@maps-react/hooks/useTranslation';

import { telephoneQuestions } from '../questions';

export const telephonePageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: telephoneQuestions(t)[0].title,
    2: telephoneQuestions(t)[1].title,
    3: telephoneQuestions(t)[2].title,
    4: telephoneQuestions(t)[3].title,
    5: telephoneQuestions(t)[4].title,
    6: telephoneQuestions(t)[5].title,
    7: telephoneQuestions(t)[6].title,
    8: telephoneQuestions(t)[7].title,
    9: telephoneQuestions(t)[8].title,
  };
};
