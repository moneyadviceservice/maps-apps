import useTranslation from '@maps-react/hooks/useTranslation';

import { type TeaserCardProps } from '@maps-react/common/components/TeaserCard';

import benefitsCalculatorImage from 'assets/images/tool-thumb-benefits-calculator.svg?url';
import budgetPlannerImage from 'assets/images/tool-thumb-budget-planner.svg?url';
import pensionCalculatorImage from 'assets/images/tool-thumb-pension-calculator.svg?url';
import { CHART_COLOURS } from 'lib/constants/constants';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';

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

export const summaryTotalOptions = (
  t: ReturnType<typeof useTranslation>['t'],
) => [
  {
    text: t('summaryTotal.monthlyTotal'),
    value: FREQUNCY_KEYS.MONTH,
  },
  {
    text: t('summaryTotal.yearlyTotal'),
    value: FREQUNCY_KEYS.YEAR,
  },
];

/**
 * Retirement costs chart section
 */

// Get a colour for the costs chart for a specific item index. Loop through the
// colours if there are more items than colours, and fall back to the first
// colour if the supplied index is invalid.
export const getSummaryResultsCostsChartColourFromIndex = (index: number) => {
  if (
    typeof index !== 'number' ||
    Number.isNaN(index) ||
    !Number.isFinite(index)
  ) {
    return CHART_COLOURS[0];
  }

  return CHART_COLOURS[Math.abs(Math.round(index)) % CHART_COLOURS.length];
};

// Main data for the summary results costs chart
export const summaryResultsCostsChartData = ({
  t,
}: {
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  return {
    title: t('summaryPage.chart.title'),
    description: t('summaryPage.chart.description'),
    label: t('summaryPage.chart.label'),
    costCategories: {
      housingCost: t('summaryPage.chart.costCategories.housingCost'),
      utilities: t('summaryPage.chart.costCategories.utilities'),
      travelCosts: t('summaryPage.chart.costCategories.travelCosts'),
      lending: t('summaryPage.chart.costCategories.lending'),
      insurance: t('summaryPage.chart.costCategories.insurance'),
      householdExpenses: t(
        'summaryPage.chart.costCategories.householdExpenses',
      ),
      essentialsAdditionalItems: t(
        'summaryPage.chart.costCategories.essentialsAdditionalItems',
      ),
    },
  };
};

// Type guard to check if a given string is a valid cost category
export const isStringSummaryResultsCostCategory = (
  category: string,
  t: ReturnType<typeof useTranslation>['t'],
): category is keyof ReturnType<
  typeof summaryResultsCostsChartData
>['costCategories'] => {
  const data = summaryResultsCostsChartData({ t });

  return category in data.costCategories;
};

// Get the display name for a cost category. Return the original string if it's
// not a valid category.
export const getCostCategoryName = ({
  category,
  t,
}: {
  category: string;
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  const data = summaryResultsCostsChartData({ t });

  return isStringSummaryResultsCostCategory(category, t)
    ? data.costCategories[category]
    : category;
};
