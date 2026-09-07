import { ReactNode } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Link } from '@maps-react/common/components/Link';
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
  heading: string;
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
  changingTheTerm: string;
  canYouAfford: string;
  youHaventEntered: string | ReactNode;
  yourEstimatedSpend: string;
  yourTotalTakeHome: string;
  whatsLeft: string;
  youHeaventEnteredLiving: ReactNode;
  yourEstimated: string;
  theAmountYou: string;
  whatsLeftWarningText: string | ReactNode;
  whatsLeftErrorText: string | ReactNode;
  whatsLeftSuccessText: string | ReactNode;
  whatIf: string;
  ifInterestRatesRise: string;
  yourRemainingBudgetWillBe: string;
  thisIsAnEstimate: string;
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
  searchQuery?: string,
): ResultsPageData => {
  return {
    heading: z({
      en: 'Mortgage affordability calculator',
      cy: 'Cyfrifiannell fforddiadwyedd morgais',
    }),
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
    changingTheTerm: z({
      en: 'Changing the term of the mortgage can affect the total amount of money you are able to borrow as well as the cost of your monthly repayments. For example, a shorter term will probably result in higher monthly payments, whereas a longer term means lower payments, spread out over a longer period of time.',
      cy: 'Gall newid cyfnod y morgais effeithio ar y swm o arian y cewch ei fenthyca yn ogystal â chost eich ad-daliadau misol. Er enghraifft, bydd cyfnod byrrach yn debygol o olygu taliadau misol uwch, tra bydd cyfnod hirach yn golygu taliadau is, wedi eu rhannu dros gyfnod hirach o amser.',
    }),
    canYouAfford: z({
      en: 'Can you afford these monthly payments?',
      cy: "Allwch chi fforddio'r taliadau misol?",
    }),
    youHaventEntered: z({
      en: (
        <span>
          You haven&apos;t entered any amounts for fixed and committed costs on
          the previous page. Are you sure this is right? If not, the results on
          this page may be incorrect.{' '}
          <Link href={`/en/household-costs?${searchQuery}#e-costs`}>
            Go back and fix this now
          </Link>
          .
        </span>
      ),
      cy: (
        <span>
          Nid ydych wedi rhoi unrhyw symiau ar gyfer costau sefydlog ac
          ymroddedig ar y dudalen flaenorol. Ydych chi&apos;n siŵr bod hyn yn
          gywir? Os nad, efallai y bydd y canlyniadau ar y dudalen hon yn
          anghywir.{' '}
          <Link href={`/cy/household-costs?${searchQuery}#e-costs`}>
            Mynd yn ôl ac unioni hyn nawr
          </Link>
          .
        </span>
      ),
    }),
    yourEstimatedSpend: z({
      en: 'Your estimated fixed and committed spend per month is:',
      cy: 'Eich gwariant misol sefydlog ac ymroddedig amcangyfrifol yw:',
    }),
    yourTotalTakeHome: z({
      en: 'Your total take-home pay per month is:',
      cy: 'Eich cyfanswm cyflog clir misol yw:',
    }),
    whatsLeft: z({
      en: "What's left over?",
      cy: "Beth sy'n weddill?",
    }),
    youHeaventEnteredLiving: z({
      en: (
        <span>
          You haven&apos;t entered any amounts for living costs on the previous
          page. Are you sure this is right? If not, the results on this page may
          be incorrect.{' '}
          <Link href={`/en/household-costs?${searchQuery}#t-costs`}>
            Go back and fix this now.
          </Link>
        </span>
      ),
      cy: (
        <span>
          Nid ydych wedi rhoi unrhyw symiau ar gyfer costau byw ar y dudalen
          flaenorol. Ydych chi&apos;n siŵr bod hyn yn gywir? Os nad, efallai y
          bydd y canlyniadau ar y dudalen hon yn anghywir.{' '}
          <Link href={`/cy/household-costs?${searchQuery}#t-costs`}>
            Mynd yn ôl ac unioni hyn nawr.
          </Link>
        </span>
      ),
    }),
    yourEstimated: z({
      en: 'You estimated your monthly living costs to be:',
      cy: 'Fe amcangyfrifoch fod eich costau byw misol yn:',
    }),
    theAmountYou: z({
      en: 'The amount you have left over after living costs per month is:',
      cy: 'Y swm sydd gennych dros ben ar ôl costau byw bob mis yw:',
    }),
    whatsLeftWarningText: z({
      en: (
        <span>
          You are spending more than your take-home pay, which means that you
          are overstretching your budget and are at risk of getting into debt.
          You won&apos;t be able to afford your mortgage payments, particularly
          if circumstances change.{' '}
          <Button
            className={'inline'}
            variant="link"
            id={'whats-left-next-steps'}
            type="submit"
            form="mortgage-affordability-calculator"
          >
            Here&apos;s what you can do now
          </Button>
          .
        </span>
      ),
      cy: (
        <span>
          Rydych yn gwario mwy na&apos;ch cyflog clir, sy&apos;n golygu eich bod
          yn gorymestyn eich cyllideb ac mewn perygl o fynd i ddyled. Ni fyddwch
          yn gallu fforddio eich taliadau morgais, yn arbennig os fydd
          amgylchiadau&apos;n newid.{' '}
          <Button
            className={'inline'}
            variant="link"
            id={'whats-left-next-steps'}
            type="submit"
            form="mortgage-affordability-calculator"
          >
            Dyma beth allech chi wneud nawr
          </Button>
          .
        </span>
      ),
    }),
    whatsLeftErrorText: z({
      en: (
        <span>
          You are spending more than your take-home pay, which means that you
          are overstretching your budget and are at risk of getting into debt.
          You won&apos;t be able to afford your mortgage payments, particularly
          if circumstances change.{' '}
          <Button
            className={'inline'}
            variant="link"
            id={'whats-left-next-steps'}
            type="submit"
            form="mortgage-affordability-calculator"
          >
            Here&apos;s what you can do now
          </Button>
          .
        </span>
      ),
      cy: (
        <span>
          Rydych yn gwario mwy na&apos;ch cyflog clir, sy&apos;n golygu eich bod
          yn gorymestyn eich cyllideb ac mewn perygl o fynd i ddyled. Ni fyddwch
          yn gallu fforddio eich taliadau morgais, yn arbennig os fydd
          amgylchiadau&apos;n newid.{' '}
          <Button
            className={'inline'}
            variant="link"
            id={'whats-left-next-steps'}
            type="submit"
            form="mortgage-affordability-calculator"
          >
            Dyma beth allech chi wneud nawr
          </Button>
          .
        </span>
      ),
    }),
    whatsLeftSuccessText: z({
      en: (
        <span>
          You have money left over each month right now, but if interest rates
          rise how would that affect your budget? Would you be overstretching
          yourself?{' '}
          <Button
            className={'inline'}
            variant="link"
            id={'whats-left-next-steps'}
            type="submit"
            form="mortgage-affordability-calculator"
          >
            Here&apos;s what you can do now
          </Button>
          .
        </span>
      ),
      cy: (
        <span>
          Mae gennych arian yn weddill pob mis ar hyn o bryd, ond os yw&apos;r
          cyfraddau llog yn codi sut fyddai hynny&apos;n effeithio ar eich
          cyllideb? A fyddech mewn perygl o fod yn brin o arian?{' '}
          <Button
            className={'inline'}
            variant="link"
            id={'whats-left-next-steps'}
            type="submit"
            form="mortgage-affordability-calculator"
          >
            Dyma beth allech chi wneud nawr
          </Button>
          .
        </span>
      ),
    }),
    whatIf: z({
      en: 'What if interest rates rise?',
      cy: 'Beth os bydd cyfraddau llog yn codi?',
    }),
    ifInterestRatesRise: z({
      en: 'If interest rates rise by 3 percentage points, your monthly repayment will rise to:',
      cy: 'Os yw cyfraddau llog yn codi o 3 pwynt canran, bydd eich ad-daliad misol yn codi i',
    }),
    yourRemainingBudgetWillBe: z({
      en: 'Your remaining budget per month will be:',
      cy: "Eich cyllideb sy'n weddill bob mis bydd:",
    }),
    thisIsAnEstimate: z({
      en: 'This is an estimate, designed to help you understand what a lender might offer you. Actual loan amounts and affordability criteria will differ across lenders.',
      cy: "Amcangyfrif yw hyn, wedi ei gynllunio i'ch helpu i ddeall beth allai benthyciwr gynnig i chi. Bydd gwir symiau'r benthyciad a meini prawf fforddiadwyedd yn amrywio yn ôl y benthyciwr.",
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
