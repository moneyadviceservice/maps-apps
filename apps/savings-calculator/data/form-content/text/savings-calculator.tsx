import { ReactNode } from 'react';

import { SavingsCalculatorType } from 'types';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export type SavingsCalculator = {
  title: string;
  subTitle: string;
  calloutMessage?: ReactNode;
  calloutMessageResults?: ReactNode;
  errorTitle: string;
  submitButton: string;
  reSubmitButton: string;
};

const defaults = (
  t: ReturnType<typeof useTranslation>['z'],
): SavingsCalculator => {
  return {
    title: t({
      en: 'Savings calculator',
      cy: 'Cyfrifiannell Cynilo',
    }),
    subTitle: t({
      en: 'How much do I need to save each week/month to reach my goal?',
      cy: 'Faint sydd angen i mi gynilo bob wythnos/mis i gyrraedd fy nod?',
    }),
    errorTitle: t({
      en: 'There is a problem',
      cy: 'Mae yna broblem',
    }),
    submitButton: t({
      en: 'Calculate',
      cy: 'Cyfrifo',
    }),
    reSubmitButton: t({
      en: 'Recalculate',
      cy: 'Ailgyfrifo',
    }),
  };
};

const savingsCalculatorHowMuch = (
  t: ReturnType<typeof useTranslation>['z'],
): SavingsCalculator => {
  return {
    ...defaults(t),
  };
};

const savingsCalculatorHowLong = (
  t: ReturnType<typeof useTranslation>['z'],
): SavingsCalculator => {
  return {
    ...defaults(t),
    subTitle: t({
      en: 'How long will it take to reach my goal amount?',
      cy: 'Faint o amser y bydd yn ei gymryd i gyrraedd fy swm fy nod?',
    }),
  };
};

export const getText = (
  z: ReturnType<typeof useTranslation>['z'],
  path: SavingsCalculatorType,
): any => {
  switch (path) {
    case SavingsCalculatorType.HOW_LONG:
      return savingsCalculatorHowLong(z);
    case SavingsCalculatorType.HOW_MUCH:
      return savingsCalculatorHowMuch(z);
    default:
      return {} as any;
  }
};
