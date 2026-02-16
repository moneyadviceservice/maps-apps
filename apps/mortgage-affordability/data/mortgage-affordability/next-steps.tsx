import { ReactNode } from 'react';

import ManHoldingMobilePhoneLaughing from 'public/images/teaser-card-images/man-holding-mobile-laughing.jpg';
import TwoChildrenWithBubbles from 'public/images/teaser-card-images/two-children-with-bubbles.jpg';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCardProps } from '@maps-react/common/components/TeaserCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface HeadingOption {
  heading: string;
  text: string | ReactNode;
}

interface AffordingYour {
  heading: string;
  thinkAboutText: string;
  spendMoreThanText: string;
  readMoreLink: ReactNode;
}

interface FindOutMore {
  heading: string;
  costsOfBuying: ReactNode;
  budgetPlanner: ReactNode;
  improveCredit: ReactNode;
  affordableSchemes: ReactNode;
  savingDeposit: ReactNode;
  mortgageComparison: ReactNode;
}

interface OtherTools {
  heading: string;
  teaserCard: {
    mortgageRepayment: TeaserCardProps;
    stampDuty: TeaserCardProps;
  };
  target: '_blank';
}

export interface NextStepsData {
  heading: {
    success: string;
    warning: string;
    error: string;
  };
  headingOptions: {
    exploreDifferentSchemes: HeadingOption;
    takeControl: HeadingOption;
    understandAllCosts: HeadingOption;
    thinkAboutBorrowLess: HeadingOption;
    makeSureBestMortgage: HeadingOption;
    dontMakeTheseMistakes: HeadingOption;
    getStarted: HeadingOption;
  };
  affordingYourMortgage: AffordingYour;
  findOutMore: FindOutMore;
  otherToolsToTry: OtherTools;
}

export const nextStepsContent = (
  z: ReturnType<typeof useTranslation>['z'],
): NextStepsData => {
  return {
    heading: {
      success: z({
        en: 'Three steps to finding an affordable mortgage',
        cy: 'Tri cham i ganfod morgais fforddiadwy',
      }),
      warning: z({
        en: 'What you should do next',
        cy: 'Beth ddylech chi ei wneud nesaf',
      }),
      error: z({
        en: 'Three steps to making your mortgage more affordable',
        cy: 'Tri cham i wneud eich morgais yn fwy fforddiadwy',
      }),
    },
    headingOptions: {
      exploreDifferentSchemes: {
        heading: z({
          en: 'Explore different schemes to help you buy a home',
          cy: "Edrychwch ar wahanol gynlluniau i'ch helpu i brynu cartref",
        }),
        text: z({
          en: (
            <Link
              href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/government-schemes-for-first-time-home-buyers-and-existing-homeowners"
              target="_blank"
              asInlineText
            >
              Government schemes for first-time home buyers and existing
              homeowners
            </Link>
          ),
          cy: (
            <Link
              href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/government-schemes-for-first-time-home-buyers-and-existing-homeowners"
              target="_blank"
              asInlineText
            >
              Cynlluniau llywodraeth ar gyfer prynwyr am y tro cyntaf a
              pherchnogion tai cyfredol
            </Link>
          ),
        }),
      },
      takeControl: {
        heading: z({
          en: 'Take control of your money',
          cy: 'Rhowch drefn ar eich arian',
        }),
        text: z({
          en: (
            <Paragraph>
              Use our{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner"
                target="_blank"
                asInlineText
              >
                Budget Planner
              </Link>{' '}
              to get the full picture
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Defnyddiwch ein{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner"
                target="_blank"
                asInlineText
              >
                Cynllunydd Cyllideb
              </Link>{' '}
              i gael y darlun llawn
            </Paragraph>
          ),
        }),
      },
      understandAllCosts: {
        heading: z({
          en: 'Understand all the costs',
          cy: 'Deallwch yr holl gostau',
        }),
        text: z({
          en: (
            <Link
              href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs"
              target="_blank"
              asInlineText
            >
              Make sure you understand all the up front costs of buying a home
            </Link>
          ),
          cy: (
            <Link
              href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs"
              target="_blank"
              asInlineText
            >
              Gwnewch yn siŵr eich bod yn deall yr holl gostau cychwynnol o
              brynu cartref
            </Link>
          ),
        }),
      },
      thinkAboutBorrowLess: {
        heading: z({
          en: 'Think about borrowing less',
          cy: 'Ystyriwch fenthyca llai',
        }),
        text: z({
          en: (
            <Paragraph>
              Learn about{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/saving-money-for-a-mortgage-deposit"
                target="_blank"
                asInlineText
              >
                Saving for a deposit
              </Link>{' '}
              and{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/how-much-can-you-afford-to-borrow-for-a-mortgage"
                target="_blank"
                asInlineText
              >
                Loan to value ratios
              </Link>
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Dysgwch am
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/saving-money-for-a-mortgage-deposit"
                target="_blank"
                asInlineText
              >
                Gynilo i gael blaendal
              </Link>{' '}
              a{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/how-much-can-you-afford-to-borrow-for-a-mortgage"
                target="_blank"
                asInlineText
              >
                Chymarebau benthyciad i werth
              </Link>
            </Paragraph>
          ),
        }),
      },
      makeSureBestMortgage: {
        heading: z({
          en: 'Make sure you get the best mortgage for you',
          cy: 'Gwnewch yn siŵr eich bod yn cael y morgais gorau ar eich cyfer chi',
        }),
        text: z({
          en: (
            <Link
              href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-interest-rate-options"
              target="_blank"
              asInlineText
            >
              Understanding mortgages
            </Link>
          ),
          cy: (
            <Link
              href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-interest-rate-options"
              target="_blank"
              asInlineText
            >
              Deall morgeisi
            </Link>
          ),
        }),
      },
      dontMakeTheseMistakes: {
        heading: z({
          en: "Don't make these mistakes",
          cy: 'Peidiwch â gwneud y camgymeriadau hyn',
        }),
        text: z({
          en: (
            <Link
              href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/issues-with-the-property-when-buying-a-house"
              target="_blank"
              asInlineText
            >
              Buying a home: how to avoid the most common mistakes
            </Link>
          ),
          cy: (
            <Link
              href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/issues-with-the-property-when-buying-a-house"
              target="_blank"
              asInlineText
            >
              Prynu cartref: sut i osgoi&apos;r camgymeriadau mwyaf cyffredin
            </Link>
          ),
        }),
      },
      getStarted: {
        heading: z({
          en: 'Get started with your application',
          cy: "Dechreuwch arni gyda'ch cais",
        }),
        text: z({
          en: (
            <Paragraph>
              Home-buying process -{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/money-timeline-when-buying-property-england-wales-n-ireland"
                target="_blank"
                asInlineText
              >
                Steps to buying a new house or flat
              </Link>
            </Paragraph>
          ),
          cy: (
            <Paragraph>
              Y broses o brynu tŷ -{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/money-timeline-when-buying-property-england-wales-n-ireland"
                target="_blank"
                asInlineText
              >
                Camau i brynu tŷ neu fflat newydd
              </Link>
            </Paragraph>
          ),
        }),
      },
    },
    affordingYourMortgage: {
      heading: z({
        en: 'Affording your mortgage',
        cy: 'Fforddio eich morgais',
      }),
      thinkAboutText: z({
        en: 'Think about your household spend as well as your mortgage repayments.',
        cy: "Meddyliwch am wariant eich cartref yn ogystal â'ch taliadau morgais.",
      }),
      spendMoreThanText: z({
        en: 'Spending more than 50% of your take-home pay on committed costs and mortgage puts you at very high risk of overstretching your budget. Make sure you have enough money left over at the end of the month to help you cope, should interest rates rise or your circumstances change.',
        cy: "Mae gwario mwy na 50% o'ch cyflog clir ar gostau ymroddedig a morgais yn creu risg uchel iawn o orymestyn eich cyllideb. Gwnewch yn siŵr bod gennych ddigon o arian dros ben ar ddiwedd y mis i'ch helpu i ymdopi, pe byddai cyfraddau llog yn codi neu'ch amgylchiadau'n newid.",
      }),
      readMoreLink: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/how-much-can-you-afford-to-borrow-for-a-mortgage"
            target="_blank"
            asInlineText
          >
            Read More
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/how-much-can-you-afford-to-borrow-for-a-mortgage"
            target="_blank"
            asInlineText
          >
            Darllen mwy
          </Link>
        ),
      }),
    },
    findOutMore: {
      heading: z({
        en: 'Find out more:',
        cy: 'Cewch fwy o wybodaeth yn:',
      }),
      costsOfBuying: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs"
            target="_blank"
            asInlineText
          >
            Costs of buying
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs"
            target="_blank"
            asInlineText
          >
            Costau prynu
          </Link>
        ),
      }),
      budgetPlanner: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner"
            target="_blank"
            asInlineText
          >
            Budget Planner
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner"
            target="_blank"
            asInlineText
          >
            Cynllunydd Cyllideb
          </Link>
        ),
      }),
      improveCredit: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-improve-your-credit-score"
            target="_blank"
            asInlineText
          >
            Improve your credit rating
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/everyday-money/credit/how-to-improve-your-credit-score"
            target="_blank"
            asInlineText
          >
            Gwella eich statws credyd
          </Link>
        ),
      }),
      affordableSchemes: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/government-schemes-for-first-time-home-buyers-and-existing-homeowners"
            target="_blank"
            asInlineText
          >
            Affordable housing schemes
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/government-schemes-for-first-time-home-buyers-and-existing-homeowners"
            target="_blank"
            asInlineText
          >
            Cynlluniau tai fforddiadwy
          </Link>
        ),
      }),
      savingDeposit: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/saving-money-for-a-mortgage-deposit"
            target="_blank"
            asInlineText
          >
            Saving for a deposit
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/saving-money-for-a-mortgage-deposit"
            target="_blank"
            asInlineText
          >
            Cynilo ar gyfer blaendal
          </Link>
        ),
      }),
      mortgageComparison: z({
        en: (
          <Link
            href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/your-mortgage-comparison-checklist"
            target="_blank"
            asInlineText
          >
            Mortgage comparison table
          </Link>
        ),
        cy: (
          <Link
            href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/your-mortgage-comparison-checklist"
            target="_blank"
            asInlineText
          >
            Tabl cymharu morgeisi
          </Link>
        ),
      }),
    },
    otherToolsToTry: {
      heading: z({
        en: 'Other tools to try',
        cy: 'Teclynnau eraill i roi cynnig arnynt',
      }),
      teaserCard: {
        mortgageRepayment: {
          title: z({
            en: 'Mortgage repayment calculator',
            cy: 'Cyfrifiannell ad-daliad morgais',
          }),
          description: z({
            en: "This gives you a guide to how much you'd pay each month on a mortgage.",
            cy: 'Mae hyn yn rhoi canllaw i chi faint rydych yn ei dalu bob mis ar forgais.',
          }),
          image: ManHoldingMobilePhoneLaughing,
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-calculator',
          }),
        },
        stampDuty: {
          title: z({
            en: 'Stamp Duty Calculator',
            cy: 'Cyfrifiannell Treth Stamp',
          }),
          description: z({
            en: 'Calculate the Stamp Duty on your new property.',
            cy: 'Cyfrifwch y Dreth Stamp ar eich eiddo newydd.',
          }),
          image: TwoChildrenWithBubbles,
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator',
          }),
        },
      },
      target: '_blank',
    },
  };
};
