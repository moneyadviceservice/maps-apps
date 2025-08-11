import { useRouter } from 'next/router';

import { TabContainer } from 'components/Tabs';
import TabContent from 'components/Tabs/TabContent/TabContent';
import RetirementPlannerWrapper from 'layout/RetirementPlannerWrapper/RetirementPlannerWrapper';
import {
  NavigationDataProps,
  RetirementBudgetPlannerContentProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import { findNextStepName, findPreviousStep } from 'lib/util/tabs';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

export const RetirementPlannerLayout = ({
  children,
  title,
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  description,
  isEmbedded = false,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  RetirementBudgetPlannerContentProps) => {
  const router = useRouter();

  const { z, locale } = useTranslation();
  const previousTabName = findPreviousStep(navTabsData, tabName);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const nextStep = findNextStepName(navTabsData, tabName);

    router.push(`/${locale}/${nextStep}`);
  };

  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={pageTitle}
      title={'Retirement Budget Planner'}
    >
      <Container>
        <div className="space-y-8">
          <BackLink href={`/${locale}/${previousTabName}`}>
            {z({ en: 'Back', cy: '' })}
          </BackLink>
          <form method="POST">
            <input type="hidden" name="language" value={locale} />
            <input type="hidden" name="tabName" value={tabName} />

            <TabContainer
              tabs={navTabsData}
              tabName={tabName}
              iniitialEnabledTabCount={initialEnabledTabCount}
              initialActiveTabId={initialActiveTabId}
              headerClassNames="max-w-[840px]"
            >
              <TabContent
                title={title}
                tabName={tabName}
                description={description}
              >
                {children}
              </TabContent>
            </TabContainer>
            <Button
              variant="primary"
              onClick={handleClick}
              formAction="/api/submit"
            >
              {z({ en: 'Continue', cy: '' })}
            </Button>
          </form>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};
