import { JSX } from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

interface Copy {
  title: string;
  takeHomePay: string;
  newMortgagePayment: string;
  otherHouseholdCosts: string;
  leftOver: string;
  description: string | JSX.Element;
}

interface Inputs {
  fLeftOver: string;
}

export const CanYouAffordThisCopy = (
  z: ReturnType<typeof useTranslation>['z'],
  i: Inputs,
): Copy => {
  return {
    title: z({ en: 'Can you afford this?', cy: 'A allwch chi fforddio hyn?' }),
    takeHomePay: z({ en: 'Take-home pay', cy: 'Cyflog cymryd adref' }),
    newMortgagePayment: z({
      en: 'New mortgage payment',
      cy: 'Taliad morgais newydd',
    }),
    otherHouseholdCosts: z({
      en: 'Other household costs',
      cy: 'Costau cartref eraill',
    }),
    leftOver: z({ en: 'Left over', cy: 'Ar ôl talu' }),
    description: z({
      en: (
        <>
          After paying your household costs, you have around{' '}
          <span className="font-bold">{i.fLeftOver} left</span> – aim to keep
          20% of your take-home pay for savings or emergency costs.
        </>
      ),
      cy: (
        <>
          Ar ôl talu costau eich cartref, mae gennych tua{' '}
          <span className="font-bold">{i.fLeftOver} ar ôl</span> – ceisiwch gadw
          20% o&apos;ch cyflog net ar gyfer cynilion neu gostau brys.
        </>
      ),
    }),
  };
};
