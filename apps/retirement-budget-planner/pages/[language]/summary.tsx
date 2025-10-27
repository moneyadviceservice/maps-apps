import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';

import { getServerSideDefaultProps } from '.';
const SummaryPage = ({
  title,
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
}: RetirementBudgetPlannerPageProps & NavigationDataProps) => {
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
      Summary page
    </RetirementPlannerLayout>
  );
};

export default SummaryPage;

export const getServerSideProps = getServerSideDefaultProps;
