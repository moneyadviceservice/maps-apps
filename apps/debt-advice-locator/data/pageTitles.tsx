import { debtAdviceLocatorQuestions } from 'data/form-content/questions';

import useTranslation from '@maps-react/hooks/useTranslation';

export const getPageTitle = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: debtAdviceLocatorQuestions(t)[0].title,
    2: debtAdviceLocatorQuestions(t)[1].title,
    3: debtAdviceLocatorQuestions(t)[2].title,
    4: debtAdviceLocatorQuestions(t)[3].title,
    business: t({
      en: 'Advice providers for small business owners or self-employed',
      cy: 'Darparwyr cyngor ar gyfer perchnogion busnesau bach neu hunangyflogedig',
    }),
    face: t({
      en: 'Where to get local debt advice',
      cy: 'Ble i gael cyngor lleol ar ddyledion',
    }),
    online: t({
      en: 'Where to get free debt advice online',
      cy: 'Ble i gael cyngor ar ddyledion am ddim ar-lein',
    }),
    telephone: t({
      en: 'Where to get free debt advice by telephone',
      cy: 'Ble i gael cyngor ar ddyledion am ddim dros y ffôn',
    }),
  };
};
