import { JSX } from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

interface Copy {
  title: string;
  rentOrMortgage: string;
  newMortgagePayment: string;
  less: {
    description: string | JSX.Element;
    footnote: string | JSX.Element;
  };
  more: {
    description: string | JSX.Element;
    footnote: string | JSX.Element;
  };
  same: {
    description: string | JSX.Element;
    footnote: string | JSX.Element;
  };
}

interface Inputs {
  fNewPaymentPerMonth: string;
  fDifference: string;
}

export const CompareHousingCostsCopy = (
  z: ReturnType<typeof useTranslation>['z'],
  i: Inputs,
): Copy => {
  return {
    title: z({ en: 'Compare housing costs', cy: 'Cymharu costau tai' }),
    rentOrMortgage: z({
      en: 'Rent or current mortgage',
      cy: 'Rhent neu forgeis cyfredol',
    }),
    newMortgagePayment: z({
      en: 'New mortgage payment',
      cy: 'Taliad morgais newydd',
    }),
    less: {
      description: z({
        en: (
          <>
            Your new mortgage would cost{' '}
            <span className="font-bold">{i.fNewPaymentPerMonth}</span> a month -
            that&rsquo;s <span className="font-bold">{i.fDifference}</span> less
            than you spend now.
          </>
        ),
        cy: (
          <>
            Byddai eich morgais newydd yn costio{' '}
            <span className="font-bold">{i.fNewPaymentPerMonth}</span> y mis -
            mae hynny&apos;n <span className="font-bold">{i.fDifference}</span>{' '}
            yn llai na&apos;r hyn rydych chi&apos;n ei wario ar hyn o bryd.
          </>
        ),
      }),
      footnote: z({
        en: (
          <>
            You will pay{' '}
            <span className="text-blue-700 font-bold">{i.fDifference}</span>{' '}
            less
          </>
        ),
        cy: (
          <>
            Byddwch yn talu{' '}
            <span className="text-blue-700 font-bold">{i.fDifference}</span> yn
            llai
          </>
        ),
      }),
    },
    more: {
      description: z({
        en: (
          <>
            Your new mortgage would cost{' '}
            <span className="font-bold">{i.fNewPaymentPerMonth}</span> a month -
            that&rsquo;s <span className="font-bold">{i.fDifference}</span> more
            than you spend now.
          </>
        ),
        cy: (
          <>
            Byddai eich morgais newydd yn costio{' '}
            <span className="font-bold">{i.fNewPaymentPerMonth}</span> y mis -
            mae hynny&apos;n <span className="font-bold">{i.fDifference}</span>{' '}
            yn fwy na&apos;r hyn rydych chi&apos;n ei wario ar hyn o bryd.
          </>
        ),
      }),
      footnote: z({
        en: (
          <>
            You will pay{' '}
            <span className="text-blue-700 font-bold">{i.fDifference}</span>{' '}
            more
          </>
        ),
        cy: (
          <>
            Byddwch yn talu{' '}
            <span className="text-blue-700 font-bold">{i.fDifference}</span> yn
            fwy
          </>
        ),
      }),
    },
    same: {
      description: z({
        en: (
          <>
            Your new mortgage costs{' '}
            <span className="font-bold">{i.fNewPaymentPerMonth}</span> a month -
            that&rsquo;s the same as you pay now.
          </>
        ),
        cy: (
          <>
            Mae eich morgais newydd yn costio{' '}
            <span className="font-bold">{i.fNewPaymentPerMonth}</span> y mis -
            mae hynny&apos;n union yr un fath â&apos;r hyn rydych chi&apos;n ei
            dalu nawr.
          </>
        ),
      }),
      footnote: z({
        en: (
          <>
            You will pay the same each month,{' '}
            <span className="text-blue-700 font-bold">
              {i.fNewPaymentPerMonth}
            </span>
          </>
        ),
        cy: (
          <>
            Byddwch yn talu&apos;r un swm bob mis, sef{' '}
            <span className="text-blue-700 font-bold">
              {i.fNewPaymentPerMonth}
            </span>
          </>
        ),
      }),
    },
  };
};
