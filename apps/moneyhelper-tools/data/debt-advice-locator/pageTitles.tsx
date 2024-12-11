import { debtAdviceLocator } from 'data/form-content/questions';

import useTranslation from '@maps-react/hooks/useTranslation';

export const getPageTitle = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: debtAdviceLocator(t)[0].title,
    2: debtAdviceLocator(t)[1].title,
    3: debtAdviceLocator(t)[2].title,
  };
};
