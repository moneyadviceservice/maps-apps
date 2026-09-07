import useTranslation from '@maps-react/hooks/useTranslation';
import { type TeaserCardProps } from '@maps-react/common/components/TeaserCard';
import budgetPlannerImage from 'assets/images/retirement-budget-calculator.svg?url';
import pensionCalculatorImage from 'assets/images/pension-calculator.svg?url';
import workplacePensionCalculatorImage from 'assets/images/workplace-pension-calculator.svg?url';
export const resultsOtherToolsData = ({
  t,
  locale,
}: {
  t: ReturnType<typeof useTranslation>['t'];
  locale: string;
}) => ({
  title: t('results.otherTools.heading'),
  toolCards: [
    {
      id: 1,
      href: `https://www.moneyhelper.org.uk/${locale}/pensions-and-retirement/building-your-retirement-pot/workplace-pension-calculator`,
      image: workplacePensionCalculatorImage,
      title: t('results.otherTools.tool1.name'),
      description: t('results.otherTools.tool1.description'),
    },
    {
      id: 2,
      href: `https://www.moneyhelper.org.uk/${locale}/pensions-and-retirement/taking-your-pension/retirement-budget-planner`,
      image: budgetPlannerImage,
      title: t('results.otherTools.tool2.name'),
      description: t('results.otherTools.tool2.description'),
    },
    {
      id: 3,
      href: `https://www.moneyhelper.org.uk/${locale}/pensions-and-retirement/pensions-basics/pension-calculator`,
      image: pensionCalculatorImage,
      title: t('results.otherTools.tool3.name'),
      description: t('results.otherTools.tool3.description'),
    },
  ] satisfies (TeaserCardProps & { id: number })[],
});
