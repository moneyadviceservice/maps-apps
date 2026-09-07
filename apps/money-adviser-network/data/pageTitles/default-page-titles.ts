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
    cookiePolicy: t({
      en: 'Cookie Policy',
      cy: 'Polisi Cwcis',
    }),
    confirmDetails: t({
      en: 'Confirm Details',
      cy: 'Cadarnhau manylion',
    }),
    moneyManagementRefer: t({
      en: 'Refer the customer to the following links',
      cy: 'Atgyfeirio y cwsmer at y dolenni canlynol',
    }),
    detailsSent: t({
      en: 'Details have been sent',
      cy: "Mae manylion wedi'u hanfon",
    }),
    callConfirmation: t({
      en: 'Customer will receive a call now from 0800 138 8293',
      cy: 'Bydd cwsmeriaid yn derbyn galwad nawr gan 0800 138 8293',
    }),
    callScheduled: t({
      en: 'Call scheduled',
      cy: `Galwad wedi'i drefnu`,
    }),
    callCouldNotBeScheduled: t({
      en: 'Call could not be scheduled',
      cy: 'Nid oedd modd trefnu galwad',
    }),
    consentRejected: t({
      en: "You need the customer's consent to make a referral",
      cy: 'Mae angen caniatâd y cwsmer arnoch i wneud atgyfeiriad',
    }),
  };
};
