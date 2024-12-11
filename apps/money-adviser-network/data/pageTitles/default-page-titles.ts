import useTranslation from '@maps-react/hooks/useTranslation';

export const defaultPageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    error: t({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    }),
    landing: t({
      en: 'Landing page title',
      cy: 'Welsh landing page title',
    }),
    refer: t({
      en: 'Debt Advice Referral',
      cy: 'Atgyfeiriad am gyngor ar ddyledion',
    }),
  };
};
