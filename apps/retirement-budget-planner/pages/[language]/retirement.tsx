import RetirementIncomeDetails from 'components/RetirementIncomeDetails';
import { retirementIncomeContent } from 'data/retirementIncomeData';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  CachedDataProps,
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';

const RetirementPage = ({
  title,
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  pageData,
  partners,
  fieldGroupNames,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  CachedDataProps) => {
  const { t } = useTranslation();

  return (
    <RetirementPlannerLayout
      title={title}
      pageTitle={pageTitle}
      tabName={tabName}
      initialActiveTabId={initialActiveTabId}
      initialEnabledTabCount={initialEnabledTabCount}
      navTabsData={navTabsData}
      isEmbedded={isEmbedded}
    >
      <RetirementIncomeDetails
        content={retirementIncomeContent(t, partners)}
        pageData={pageData}
        fieldNames={fieldGroupNames}
      />
    </RetirementPlannerLayout>
  );
};

export default RetirementPage;

export const getServerSideProps = getServerSideDefaultProps;
