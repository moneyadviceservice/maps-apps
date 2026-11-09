import BenefitsCalculator from 'public/images/teaser-card-images/benefits-calculator.png';
import BudgetPlanner from 'public/images/teaser-card-images/budget-planner.png';

import { TeaserCardParentProps } from '@maps-react/pension-tools/components/TeaserCardParent';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface SalaryCalculatorAdditionalData {
  otherTools: TeaserCardParentProps;
  shareToolContent: {
    title: string;
  };
}

export const salaryCalculatorAdditionalData = (
  z: ReturnType<typeof useTranslation>['z'],
  isEmbed: boolean,
): SalaryCalculatorAdditionalData => ({
  otherTools: {
    heading: z({
      en: 'Other tools to try',
      cy: 'Teclynnau eraill i roi cynnig arnynt',
    }),
    items: [
      {
        title: z({
          en: 'Budget planner',
          cy: 'Cynllunydd cyllideb',
        }),
        description: z({
          en: "Get in control of your household spending to help you see where your money's going.",
          cy: "Cymerwch reolaeth dros wariant eich cartref i'ch helpu i weld i ble mae'ch arian yn mynd.",
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
          cy: 'https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
        }),
        headingLevel: 'h2',
        image: BudgetPlanner,
        imageClassName:
          'h-[200px] bg-gray-100 flex items-center justify-center p-2 sm:p-4',
      },
      {
        title: z({
          en: 'Benefits calculator',
          cy: 'Cyfrifiannell budd-daliadau',
        }),
        description: z({
          en: 'Use our Benefits calculator to quickly find out what you could be entitled to.',
          cy: 'Defnyddiwch ein Cyfrifiannell Budd-daliadau i ddarganfod yn gyflym beth y gallech fod â hawl iddo.',
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
          cy: 'https://www.moneyhelper.org.uk/cy/benefits/benefits-calculator',
        }),
        headingLevel: 'h2',
        image: BenefitsCalculator,
        imageClassName:
          'h-[200px] bg-yellow-50 flex items-center justify-center p-2 sm:p-4',
      },
    ],

    target: isEmbed ? '_blank' : '_self',
  },
  shareToolContent: {
    title: z({
      en: 'Share this tool',
      cy: 'Rhannwch yr offeryn hwn',
    }),
  },
});
