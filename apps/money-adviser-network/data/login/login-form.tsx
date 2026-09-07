import { useTranslation } from '@maps-react/hooks/useTranslation';

export type SignInFields = {
  name: string;
  label: string;
  info?: string;
  errors: {
    required: string;
    invalid?: string;
  };
};

export const loginFields = (
  t: ReturnType<typeof useTranslation>['z'],
): SignInFields[] => {
  return [
    {
      name: 'referrerId',
      label: t({
        en: 'Referral Partner ID',
        cy: 'ID Partner Atgyfeirio',
      }),
      info: t({
        en: 'Please enter your referral partner ID provided by MaPS',
        cy: 'Rhowch eich ID partner atgyfeirio a ddarparwyd gan MaPS',
      }),
      errors: {
        required: t({
          en: 'Referral Partner ID is required.',
          cy: 'Mae angen ID Partner Atgyfeirio.',
        }),
        invalid: t({
          en: 'Referral ID is not recognised.',
          cy: `Nid yw'r ID atgyfeirio yn cael ei gydnabod.`,
        }),
      },
    },
    {
      name: 'confirmOrganisation',
      label: t({
        en: 'I confirm I am referring from ',
        cy: "Rwy'n cadarnhau fy mod yn atgyfeirio o ",
      }),
      info: t({
        en: 'If not correct please go back and start again',
        cy: "Os nad yw'n gywir, ewch yn ôl a dechrau eto",
      }),
      errors: {
        required: t({
          en: 'Please confirm your referral partner is correct ',
          cy: 'Cadarnhewch fod eich partner atgyfeirio yn gywir.',
        }),
      },
    },
  ];
};
