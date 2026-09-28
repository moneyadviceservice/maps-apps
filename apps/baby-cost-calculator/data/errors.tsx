import { useTranslation } from '@maps-react/hooks/useTranslation';

type ErrorMessageFunc = (z: ReturnType<typeof useTranslation>['z']) => {
  required?: {
    field?: string;
    page?: string;
    acdlMessage?: string;
  };
  condition?: {
    field?: string;
    page?: string;
    acdlMessage?: string;
  };
};

enum ErrorFields {
  BABY_DUE = 'baby-due',
}

type ErrorMessage = {
  [key in ErrorFields]?: ErrorMessageFunc;
};

export const errorMessages: ErrorMessage = {
  [ErrorFields.BABY_DUE]: (z: ReturnType<typeof useTranslation>['z']) => ({
    required: {
      field: z({
        en: 'Please enter your annual income or salary before tax. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make repayments.',
        cy: 'Rhowch eich incwm neu gyflog blynyddol cyn treth. Ni all y maes hwn fod yn wag gan y bydd benthycwyr ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau.',
      }),
      page: z({
        en: 'Please enter your annual income or salary before tax.',
        cy: 'Rhowch eich incwm neu gyflog blynyddol cyn treth.',
      }),
      acdlMessage: 'Please enter your annual income or salary before tax.',
    },
  }),
};
