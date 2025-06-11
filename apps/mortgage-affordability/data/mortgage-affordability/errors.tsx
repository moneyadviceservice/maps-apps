import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  MAC_MAX_INTEREST,
  MAC_MIN_INTEREST,
  MAC_REPAYMENT_TERM_MAX,
  MAC_REPAYMENT_TERM_MIN,
} from './CONSTANTS';
import { ResultFieldKeys } from './results';
import { IncomeFieldKeys } from './step';

type ErrorMessageObj = {
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

export type ErrorMessageFunc = (
  z: ReturnType<typeof useTranslation>['z'],
) => ErrorMessageObj;

type ErrorMessage = {
  [key in IncomeFieldKeys | ResultFieldKeys]?: ErrorMessageFunc;
};

export const errorMessages: ErrorMessage = {
  // Income page
  [IncomeFieldKeys.ANNUAL_INCOME]: (
    z: ReturnType<typeof useTranslation>['z'],
  ): ErrorMessageObj => ({
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
  [IncomeFieldKeys.TAKE_HOME]: (z: ReturnType<typeof useTranslation>['z']) => ({
    required: {
      field: z({
        en: 'Please enter your monthly take-home pay. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make monthly loan repayments.',
        cy: 'Rhowch eich cyflog cartref misol. Ni all y maes hwn fod yn wag gan y bydd benthycwyr ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau benthyciad misol.',
      }),
      page: z({
        en: 'Please enter your monthly take-home pay.',
        cy: 'Rhowch eich cyflog cartref misol.',
      }),
      acdlMessage: 'Please enter your monthly take-home pay.',
    },
    condition: {
      page: z({
        en: 'Your monthly take-home pay is higher than your annual income.',
        cy: "Mae eich cyflog clir misol yn uwch na'ch incwm blynyddol.",
      }),
      acdlMessage:
        'Your monthly take-home pay is higher than your annual income.',
    },
  }),
  [IncomeFieldKeys.SEC_ANNUAL_INCOME]: (
    z: ReturnType<typeof useTranslation>['z'],
  ) => ({
    required: {
      field: z({
        en: "Please enter the second applicant's annual income or salary before tax. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make monthly loan repayments.",
        cy: 'Rhowch incwm neu gyflog blynyddol yr ail ymgeisydd cyn treth. Ni all y maes hwn fod yn wag gan y bydd benthycwyr ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau benthyciad misol.',
      }),
      page: z({
        en: "Please enter the second applicant's annual income or salary before tax.",
        cy: 'Rhowch incwm neu gyflog blynyddol yr ail ymgeisydd cyn treth.',
      }),
      acdlMessage:
        "Please enter the second applicant's annual income or salary before tax.",
    },
  }),
  [IncomeFieldKeys.SEC_TAKE_HOME]: (
    z: ReturnType<typeof useTranslation>['z'],
  ) => ({
    required: {
      field: z({
        en: "Please enter the second applicant's monthly take-home pay. This field cannot be blank as lenders will only approve loans to borrowers who can afford to make monthly loan repayments.",
        cy: 'Rhowch gyflog cymryd adref misol yr ail ymgeisydd. Ni all y maes hwn fod yn wag gan fydd darparwyr benthyciadau ond yn cymeradwyo benthyciadau i fenthycwyr a all fforddio gwneud ad-daliadau benthyciad misol.',
      }),
      page: z({
        en: "Please enter the secondary applicant's monthly take-home pay.",
        cy: 'Rhowch gyflog cymryd adref misol yr ail ymgeisydd.',
      }),
      acdlMessage:
        "Please enter the secondary applicant's monthly take-home pay.",
    },
    condition: {
      page: z({
        en: "The second applicant's monthly take-home pay is higher than their annual income.",
        cy: "Mae eich cyflog clir misol yn uwch na'ch incwm blynyddol.",
      }),
      acdlMessage:
        "The second applicant's monthly take-home pay is higher than their annual income.",
    },
  }),

  // Results page
  [ResultFieldKeys.BORROW_AMOUNT]: (
    z: ReturnType<typeof useTranslation>['z'],
  ) => ({
    condition: {
      page: z({
        en: `"Amount to borrow" - Enter a number between {lowerBound} and {upperBound}`,
        cy: `"Swm i'w fenthyg:" - Rhowch rif rhwng {lowerBound} a {upperBound}`,
      }),
      acdlMessage: `"Amount to borrow" - Enter a number between {lowerBound} and {upperBound}`,
    },
  }),
  [ResultFieldKeys.TERM]: (z: ReturnType<typeof useTranslation>['z']) => ({
    condition: {
      page: z({
        en: `"Based on a repayment mortgage term of:" - Enter a number between ${MAC_REPAYMENT_TERM_MIN} and ${MAC_REPAYMENT_TERM_MAX}`,
        cy: `"Yn seiliedig ar forgais ad-dalu dros gyfnod o" - Rhowch rif rhwng ${MAC_REPAYMENT_TERM_MIN} a ${MAC_REPAYMENT_TERM_MAX}`,
      }),
      acdlMessage: `"Based on a repayment mortgage term of:" - Enter a number between ${MAC_REPAYMENT_TERM_MIN} and ${MAC_REPAYMENT_TERM_MAX}`,
    },
  }),
  [ResultFieldKeys.INTEREST]: (z: ReturnType<typeof useTranslation>['z']) => ({
    condition: {
      page: z({
        en: `"With an interest rate at:" - Enter a number between ${MAC_MIN_INTEREST} and ${MAC_MAX_INTEREST}`,
        cy: `"Gyda chyfradd llog ar" - Rhowch rif rhwng ${MAC_MIN_INTEREST} a ${MAC_MAX_INTEREST}`,
      }),
      acdlMessage: `"With an interest rate at:" - Enter a number between ${MAC_MIN_INTEREST} and ${MAC_MAX_INTEREST}`,
    },
  }),
};
