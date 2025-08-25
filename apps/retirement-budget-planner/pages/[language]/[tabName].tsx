import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';

import { getServerSideDefaultProps } from '.';

const TabPage = ({
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
      This is {tabName} page
    </RetirementPlannerLayout>
  );
};

export default TabPage;

export const getServerSideProps = getServerSideDefaultProps;
