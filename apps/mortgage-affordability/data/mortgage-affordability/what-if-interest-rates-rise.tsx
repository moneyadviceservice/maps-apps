import { JSX } from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

interface Copy {
  title: string;
  description: string | JSX.Element;
  tableHeadings: {
    rate: string;
    newPayment: string;
    moneyLeft: string;
  };
}

interface Inputs {
  rateIncreaseValue: { data: string; className: string }[];
}

export const WhatIfInterestRatesRiseCopy = (
  z: ReturnType<typeof useTranslation>['z'],
  i: Inputs,
): Copy => {
  return {
    title: z({
      en: 'What if interest rates rise?',
      cy: 'Beth os bydd cyfraddau llog yn codi?',
    }),
    description: z({
      en: (
        <>
          If your rate rises to{' '}
          <span className="font-bold">{i.rateIncreaseValue[0].data}</span>, your
          monthly repayment would be{' '}
          <span className="font-bold">{i.rateIncreaseValue[1].data}</span> -
          leaving you around {i.rateIncreaseValue[2].data} a month.
        </>
      ),
      cy: (
        <>
          Os bydd eich cyfradd yn codi i{' '}
          <span className="font-bold">{i.rateIncreaseValue[0].data}</span>,
          byddai eich taliad misol yn{' '}
          <span className="font-bold">{i.rateIncreaseValue[1].data}</span> - gan
          eich gadael â thua {i.rateIncreaseValue[2].data} y mis.
        </>
      ),
    }),
    tableHeadings: {
      rate: z({ en: 'Rate', cy: 'Cyfradd' }),
      newPayment: z({ en: 'New payment', cy: 'Taliad newydd' }),
      moneyLeft: z({ en: 'Money left', cy: 'Arian yn weddill' }),
    },
  };
};
