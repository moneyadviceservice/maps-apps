import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';

import { getServerSideDefaultProps } from '.';

const AboutUsPage = ({
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
      This is about us page
    </RetirementPlannerLayout>
  );
};

export default AboutUsPage;

export const getServerSideProps = getServerSideDefaultProps;
