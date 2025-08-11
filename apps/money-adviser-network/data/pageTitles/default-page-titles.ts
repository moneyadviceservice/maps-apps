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
      en: 'Sign In - Money Adviser Network',
      cy: 'Mewngofnodi - Rhwydwaith Cynghorwyr Arian',
    }),
    debtAdviceLocator: t({
      en: 'Refer the customer to the debt advice locator',
      cy: 'Atgyfeiro y cwsmer at y lleolwr cyngor ar ddyledion',
    }),
    businessDebtline: t({
      en: 'Refer the customer to Business Debtline',
      cy: 'Atgyfeirio y cwsmer at Business Debtline',
    }),
    moneyManagement: t({
      en: 'Refer the customer to the following links',
      cy: 'Atgyfeirio y cwsmer at y dolenni canlynol',
    }),
  };
};
