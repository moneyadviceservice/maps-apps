import useTranslation from '@maps-react/hooks/useTranslation';
import { questions } from '../questions/questions';

export const pageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  const man = 'Money dviser Network';

  return {
    1: questions(t)[0].title,
    2: questions(t)[1].title,
    error: t({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    }),
    landing: t({
      en: 'Landing page title',
      cy: 'Welsh landing page title',
    }),
  };
};
