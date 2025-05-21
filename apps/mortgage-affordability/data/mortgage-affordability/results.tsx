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
  heading: string;
  text: string | ReactNode;
  textNext: string | ReactNode;
  costsCopy: string;
  leftoverCopy: string;
}

interface TeaserInfo {
  warning: TeaserSection;
  error: TeaserSection;
  success: TeaserSection;
  seeSummary: string;
  estimatedPayments: string;
  comparedWithRent: string;
}

export type ResultsPageData = {
  heading: string;
  resultHeading: string;
  youMightBeOffered: string;
  fields: {
    amountToBorrow: string;
    basedOnTerm: string;
    interestRate: string;
  };
  changingTheTerm: string;
  teaserInfo: TeaserInfo;
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
};

export enum ResultFieldKeys {
  BORROW_AMOUNT = 'borrow-amount',
  TERM = 'term',
  INTEREST = 'interest',
  LIVING_COSTS = 'living-costs',
}

export const resultPrefix = 'r-';

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
    fields: {
      amountToBorrow: z({
        en: 'Amount to borrow:',
        cy: "Swm i'w fenthyg:",
      }),
      basedOnTerm: z({
        en: 'Based on a repayment mortgage term of:',
        cy: 'Yn seiliedig ar forgais ad-dalu dros gyfnod o:',
      }),
      interestRate: z({
        en: 'With an interest rate at:',
        cy: 'Gyda chyfradd llog ar:',
      }),
    },
    changingTheTerm: z({
      en: 'Changing the term of the mortgage can affect the total amount of money you are able to borrow as well as the cost of your monthly repayments. For example, a shorter term will probably result in higher monthly payments, whereas a longer term means lower payments, spread out over a longer period of time.',
      cy: 'Gall newid cyfnod y morgais effeithio ar y swm o arian y cewch ei fenthyca yn ogystal â chost eich ad-daliadau misol. Er enghraifft, bydd cyfnod byrrach yn debygol o olygu taliadau misol uwch, tra bydd cyfnod hirach yn golygu taliadau is, wedi eu rhannu dros gyfnod hirach o amser.',
    }),
    teaserInfo: {
      warning: {
        heading: z({
          en: 'You are at risk of overstretching your budget.',
          cy: "Rydych yn cyflwyno risg o fynd heibio'ch cyllideb.",
        }),
        text: z({
          en: 'Your mortgage repayments + your monthly essential costs are between 40% - 60% of your total take-home pay.',
          cy: "Mae'ch ad-daliadau morgais + costau allweddol misol yn rhwng 40% - 60% o gyfanswm eich cyflog clir.",
        }),
        textNext: z({
          en: (
            <span>
              You are at risk of overstretching your budget to meet these
              repayments, particularly if your circumstances change or interest
              rates rise.{' '}
              <Button
                className={''}
                variant="link"
                id={'at-risk-steps'}
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
              Rydych yn cyflwyno risg o fynd heibio&apos;ch cyllideb i
              fodloni&apos;r ad-daliadau hyn, yn arbennig os yw&apos;ch
              amgylchiadau&apos;n newid neu gyfraddau llog yn codi.{' '}
              <Button
                className={''}
                variant="link"
                id={'at-risk-steps'}
                type="submit"
                form="mortgage-affordability-calculator"
              >
                Dyma beth allech chi wneud nawr
              </Button>
              .
            </span>
          ),
        }),
        costsCopy: z({
          en: 'Mortgage repayments and essential costs per month amount to roughly {percentage}% of your total take-home pay: {amount}',
          cy: 'Mae ad-daliadau morgais a chostau allweddol y mis yn dod i gyfanswm o tua {percentage}% o gyfanswm eich cyflog clir: {amount}',
        }),
        leftoverCopy: z({
          en: 'What you have left over is roughly {percentage}% of your monthly take-home: {amount}',
          cy: "Mae beth sydd gennych yn weddill yn tua {percentage}% o'ch cyflog clir misol: {amount}",
        }),
      },
      error: {
        heading: z({
          en: 'You run a very high risk of overstretching your budget.',
          cy: "Rydych mewn perygl mawr iawn o wario mwy na'ch cyllideb.",
        }),
        text: z({
          en: 'Your mortgage repayments + your monthly essential costs are more than 60% of your total take-home pay.',
          cy: "Mae'ch ad-daliadau morgais + costau allweddol misol yn fwy na 60% o gyfanswm eich cyflog clir.",
        }),
        textNext: z({
          en: (
            <span>
              You run a very high risk of overstretching your budget to meet
              these repayments. Think about a smaller, more affordable mortgage.{' '}
              <Button
                className={''}
                variant="link"
                id={'at-risk-steps'}
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
              Rydych yn cyflwyno risg uchel iawn o fynd heibio&apos;ch cyllideb
              i fodloni&apos;r ad-daliadau hyn.{' '}
              <Button
                className={''}
                variant="link"
                id={'at-risk-steps'}
                type="submit"
                form="mortgage-affordability-calculator"
              >
                Dyma beth allech chi wneud nawr
              </Button>
              .
            </span>
          ),
        }),
        costsCopy: z({
          en: 'Mortgage repayments and essential costs per month amount to roughly {percentage}% of your total take-home pay: {amount}',
          cy: 'Mae ad-daliadau morgais a chostau allweddol y mis yn dod i gyfanswm o tua {percentage}% o gyfanswm eich cyflog clir: {amount}',
        }),
        leftoverCopy: z({
          en: 'What you have left over is roughly {percentage}% of your monthly take-home: {amount}',
          cy: "Mae beth sydd gennych yn weddill yn tua {percentage}% o'ch cyflog clir misol: {amount}",
        }),
      },
      success: {
        heading: z({
          en: 'Your budget is not overstretched.',
          cy: 'Nid yw eich cyllideb yn cael ei gorymestyn.',
        }),
        text: z({
          en: 'Your mortgage repayments + your monthly essential costs are less than 40% of your total take-home pay.',
          cy: "Mae'ch ad-daliadau morgais + costau allweddol misol yn llai na 40% o gyfanswm eich cyflog clir.",
        }),
        textNext: z({
          en: 'Your budget is not overstretched and you can meet these repayments. But think ahead - if interest rates rise, could you afford this mortgage?',
          cy: "Nid yw'ch cyllideb wedi ei hestyn yn ormodol a gallwch wneud yr ad-daliadau hyn. Ond cynlluniwch ymlaen - os yw cyfraddau llog yn codi, a allech chi fforddio'r morgais hwn?",
        }),
        costsCopy: z({
          en: 'Mortgage repayments and essential costs per month amount to roughly {percentage}% of your total take-home pay: {amount}',
          cy: 'Mae ad-daliadau morgais a chostau allweddol y mis yn dod i gyfanswm o tua {percentage}% o gyfanswm eich cyflog clir: {amount}',
        }),
        leftoverCopy: z({
          en: 'What you have left over is roughly {percentage}% of your monthly take-home: {amount}',
          cy: "Mae beth sydd gennych yn weddill yn tua {percentage}% o'ch cyflog clir misol: {amount}",
        }),
      },
      seeSummary: z({
        en: 'See summary',
        cy: 'Gweler crynodeb',
      }),
      estimatedPayments: z({
        en: 'Your estimated mortgage repayments per month will be approximately:',
        cy: 'Bydd eich ad-daliadau morgais amcangyfrifol y mis tua:',
      }),
      comparedWithRent: z({
        en: 'Compared with your current rent or mortgage payment of:',
        cy: "O'i chymharu â'ch rhent neu daliad morgais presennol o:",
      }),
    },
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
          <Link href={`/en/household-costs?${searchQuery}#c-costs`}>
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
          <Link href={`/cy/household-costs?${searchQuery}#c-costs`}>
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
          <Link href={`/en/household-costs?${searchQuery}#l-costs`}>
            Go back
          </Link>{' '}
          and fix this now.
        </span>
      ),
      cy: (
        <span>
          Nid ydych wedi rhoi unrhyw symiau ar gyfer costau byw ar y dudalen
          flaenorol. Ydych chi&apos;n siŵr bod hyn yn gywir? Os nad, efallai y
          bydd y canlyniadau ar y dudalen hon yn anghywir.{' '}
          <Link href={`/cy/household-costs?${searchQuery}#l-costs`}>
            Mynd yn ôl
          </Link>{' '}
          ac unioni hyn nawr.
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
      en: 'Next Steps',
      cy: 'Camau nesaf',
    }),
  };
};

export const resultErrors = {
  en: {
    [ResultFieldKeys.BORROW_AMOUNT]: `"Amount to borrow" - Enter a number between {lowerBound} and {upperBound}`,
    [ResultFieldKeys.TERM]: `"Based on a repayment mortgage term of:" - Enter a number between ${MAC_REPAYMENT_TERM_MIN} and ${MAC_REPAYMENT_TERM_MAX}`,
    [ResultFieldKeys.INTEREST]: `"With an interest rate at:" - Enter a number between ${MAC_MIN_INTEREST} and ${MAC_MAX_INTEREST}`,
    [ResultFieldKeys.LIVING_COSTS]: ``,
  },
  cy: {
    [ResultFieldKeys.BORROW_AMOUNT]: `"Swm i'w fenthyg:" - Rhowch rif rhwng {lowerBound} a {upperBound}`,
    [ResultFieldKeys.TERM]: `"Yn seiliedig ar forgais ad-dalu dros gyfnod o" - Rhowch rif rhwng ${MAC_REPAYMENT_TERM_MIN} a ${MAC_REPAYMENT_TERM_MAX}`,
    [ResultFieldKeys.INTEREST]: `"Gyda chyfradd llog ar" - Rhowch rif rhwng ${MAC_MIN_INTEREST} a ${MAC_MAX_INTEREST}`,
    [ResultFieldKeys.LIVING_COSTS]: ``,
  },
};
