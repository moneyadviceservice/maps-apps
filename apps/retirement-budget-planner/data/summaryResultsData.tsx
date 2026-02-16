import useTranslation from '@maps-react/hooks/useTranslation';

import { type TeaserCardProps } from '@maps-react/common/components/TeaserCard';

import benefitsCalculatorImage from 'assets/images/tool-thumb-benefits-calculator.svg?url';
import budgetPlannerImage from 'assets/images/tool-thumb-budget-planner.svg?url';
import pensionCalculatorImage from 'assets/images/tool-thumb-pension-calculator.svg?url';

/**
 * Retirement planning checklist section
 */

export const summaryResultsChecklistData = ({
  t,
  tList,
}: {
  t: ReturnType<typeof useTranslation>['t'];
  tList: ReturnType<typeof useTranslation>['tList'];
}) => ({
  title: t('summaryPage.checklist.title'),
  sections: [
    {
      id: 1,
      title: t('summaryPage.checklist.pension.title'),
      content: [
        {
          id: 1,
          type: 'markdown',
          content: t('summaryPage.checklist.pension.content'),
        },
      ],
    },
    {
      id: 2,
      title: t('summaryPage.checklist.income.title'),
      content: [
        {
          id: 1,
          type: 'list',
          content: tList('summaryPage.checklist.income.listItems').map(
            (listItem: string) => listItem,
          ),
        },
        {
          id: 2,
          type: 'markdown',
          content: t('summaryPage.checklist.income.content'),
        },
      ],
    },
    {
      id: 3,
      title: t('summaryPage.checklist.scams.title'),
      content: [
        {
          id: 1,
          type: 'markdown',
          content: t('summaryPage.checklist.scams.content'),
        },
      ],
    },
  ],
});

/**
 * Other tools section
 */

export const summaryResultsOtherToolsData = ({
  t,
}: {
  t: ReturnType<typeof useTranslation>['t'];
}) => ({
  title: t('summaryPage.tools.title'),
  toolCards: [
    {
      id: 1,
      href: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
      image: budgetPlannerImage,
      title: t('summaryPage.tools.budgetPlanner.title'),
      description: t('summaryPage.tools.budgetPlanner.content'),
    },
    {
      id: 2,
      href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
      image: pensionCalculatorImage,
      title: t('summaryPage.tools.pensionCalculator.title'),
      description: t('summaryPage.tools.pensionCalculator.content'),
    },
    {
      id: 3,
      href: 'https://www.moneyhelper.org.uk/en/benefits/benefits-calculator',
      image: benefitsCalculatorImage,
      title: t('summaryPage.tools.benefitsCalculator.title'),
      description: t('summaryPage.tools.benefitsCalculator.content'),
    },
  ] satisfies (TeaserCardProps & { id: number })[],
});
