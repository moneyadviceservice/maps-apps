import { ReactNode } from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  MAC_MAX_INTEREST,
  MAC_MIN_INTEREST,
  MAC_REPAYMENT_TERM_MAX,
  MAC_REPAYMENT_TERM_MIN,
} from './CONSTANTS';

interface TeaserSection {
  heading: string | ReactNode;
  text: string | ReactNode;
}

interface TeaserInfo {
  warning: TeaserSection;
  success: TeaserSection;
}

export type ResultsPageData = {
  resultHeading: string;
  youMightBeOffered: string;
  changeYourResults: string;
  updateTheseFigures: string;
  fields: {
    amountToBorrow: string;
    basedOnTerm: string;
    interestRate: string;
  };
  fieldHints: {
    amount: string;
    term: string;
    interest: string;
  };
  updateMyResults: string;
  nextSteps: string;
  nextStepsLinks: { text: string; href: string }[];
  nextStepsRiskLink: {
    success: { text: string; href: string };
    warning: { text: string; href: string };
  };
};

interface ResultsCalloutData {
  teaserInfo: TeaserInfo;
}

export enum ResultFieldKeys {
  BORROW_AMOUNT = 'borrow-amount',
  TERM = 'term',
  INTEREST = 'interest',
  LIVING_COSTS = 'living-costs',
}

interface Inputs {
  percentage: string;
  leftOver: string;
  leftOverIncreased: string;
}

export const resultPrefix = 'r-';

export const resultsCalloutCopy = (
  z: ReturnType<typeof useTranslation>['z'],
  i: Inputs,
): ResultsCalloutData => {
  return {
    teaserInfo: {
      warning: {
        heading: z({
          en: (
            <>
              You&rsquo;re using {i.percentage}% of your take-home pay each
              month
            </>
          ),
          cy: (
            <>
              Rydych chi&apos;n defnyddio {i.percentage}% o&apos;ch cyflog
              cymryd adref bob mis.
            </>
          ),
        }),
        text: z({
          en: (
            <>
              This means you have {i.leftOver} left over. If interest rates rose
              by 3%, this goes down to {i.leftOverIncreased} a month - could you
              afford this?{' '}
            </>
          ),
          cy: (
            <>
              Mae hyn yn golygu bod gennych {i.leftOver} dros ben. Pe bai
              cyfraddau llog yn codi 3%, byddai hyn yn gostwng i{' '}
              {i.leftOverIncreased} y mis - a fyddech chi&apos;n gallu fforddio
              hyn?
            </>
          ),
        }),
      },
      success: {
        heading: z({
          en: (
            <>
              You&rsquo;re using {i.percentage}% of your take-home pay each
              month
            </>
          ),
          cy: (
            <>
              Rydych chi&apos;n defnyddio {i.percentage}% o&apos;ch cyflog
              cymryd adref bob mis.
            </>
          ),
        }),
        text: z({
          en: (
            <>
              This means you have {i.leftOver} left over. If interest rates rose
              by 3%, this goes down to {i.leftOverIncreased} a month - could you
              afford this?{' '}
            </>
          ),
          cy: (
            <>
              Mae hyn yn golygu bod gennych {i.leftOver} dros ben. Pe bai
              cyfraddau llog yn codi 3%, byddai hyn yn gostwng i{' '}
              {i.leftOverIncreased} y mis - a fyddech chi&apos;n gallu fforddio
              hyn?
            </>
          ),
        }),
      },
    },
  };
};

export const resultsContent = (
  z: ReturnType<typeof useTranslation>['z'],
): ResultsPageData => {
  return {
    resultHeading: z({
      en: 'Your results',
      cy: 'Eich canlyniadau',
    }),
    youMightBeOffered: z({
      en: 'You might be offered between',
      cy: 'Efallai y byddwch yn cael cynnig rhwng',
    }),
    changeYourResults: z({
      en: 'Change your results',
      cy: 'Newid eich canlyniadau',
    }),
    updateTheseFigures: z({
      en: 'Update these figures to see how they change your monthly budget.',
      cy: 'Diweddarwch y ffigyrau hyn i weld sut maent yn newid eich cyllideb fisol.',
    }),
    fields: {
      amountToBorrow: z({
        en: 'Mortgage amount',
        cy: 'Swm y morgais',
      }),
      basedOnTerm: z({
        en: 'Length of mortgage',
        cy: 'Hyd y morgais',
      }),
      interestRate: z({
        en: 'Interest rate',
        cy: 'Cyfradd llog',
      }),
    },
    fieldHints: {
      amount: z({
        en: 'Enter how much you want to borrow. It must be between {lowerBound} and {upperBound}.',
        cy: 'Rhowch faint rydych chi am ei fenthyg. Rhaid iddo fod rhwng {lowerBound} a {upperBound}.',
      }),
      term: z({
        en: "A longer term lowers your monthly costs, but you'll pay more interest overall.",
        cy: 'Mae cyfnod hirach yn lleihau eich costau misol, ond byddwch yn talu mwy o log yn gyffredinol.',
      }),
      interest: z({
        en: "A higher interest rate means you'll pay more each month.",
        cy: 'Mae cyfradd llog uwch yn golygu y byddwch yn talu mwy bob mis.',
      }),
    },
    updateMyResults: z({
      en: 'Update my result',
      cy: 'Diweddaru fy nghanlyniad',
    }),
    nextSteps: z({
      en: 'Ready for next steps?',
      cy: 'Yn barod ar gyfer y camau nesaf?',
    }),
    nextStepsLinks: [
      {
        text: z({
          en: 'Explore all homes and mortgage guides',
          cy: 'Archwiliwch ein canllawiau ar gartrefi a morgeisi',
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home',
          cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home',
        }),
      },
      {
        text: z({
          en: 'Understanding mortgages and interest rates',
          cy: 'Deall morgeisi a chyfraddau llog',
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-interest-rate-options',
          cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-interest-rate-options',
        }),
      },
    ],
    nextStepsRiskLink: {
      success: {
        text: z({
          en: 'How to apply for a mortgage',
          cy: 'Sut i wneud cais am forgais',
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/how-to-apply-for-a-mortgage',
          cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/how-to-apply-for-a-mortgage',
        }),
      },
      warning: {
        text: z({
          en: 'How to prepare for an interest rate change',
          cy: 'Sut i baratoi ar gyfer newid mewn cyfradd llog',
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/how-to-prepare-for-an-interest-rate-rise',
          cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/how-to-prepare-for-an-interest-rate-rise',
        }),
      },
    },
  };
};

export const resultErrors = {
  en: {
    [ResultFieldKeys.BORROW_AMOUNT]: `"Mortgage amount" - Enter a number between {lowerBound} and {upperBound}`,
    [ResultFieldKeys.TERM]: `"Length of mortgage" - Enter a number between ${MAC_REPAYMENT_TERM_MIN} and ${MAC_REPAYMENT_TERM_MAX}`,
    [ResultFieldKeys.INTEREST]: `"Interest rate" - Enter a number between ${MAC_MIN_INTEREST} and ${MAC_MAX_INTEREST}`,
    [ResultFieldKeys.LIVING_COSTS]: ``,
  },
  cy: {
    [ResultFieldKeys.BORROW_AMOUNT]: `"Swm y morgais" - Rhowch rif rhwng {lowerBound} a {upperBound}`,
    [ResultFieldKeys.TERM]: `"Hyd y morgais" - Rhowch rif rhwng ${MAC_REPAYMENT_TERM_MIN} a ${MAC_REPAYMENT_TERM_MAX}`,
    [ResultFieldKeys.INTEREST]: `"Cyfradd llog" - Rhowch rif rhwng ${MAC_MIN_INTEREST} a ${MAC_MAX_INTEREST}`,
    [ResultFieldKeys.LIVING_COSTS]: ``,
  },
};
