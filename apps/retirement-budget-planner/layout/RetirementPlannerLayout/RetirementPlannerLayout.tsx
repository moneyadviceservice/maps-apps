import { useRouter } from 'next/router';

import { TabContainer } from 'components/Tabs';
import TabContent from 'components/Tabs/TabContent/TabContent';
import { useSessionId } from 'context/SessionContextProvider';
import RetirementPlannerWrapper from 'layout/RetirementPlannerWrapper/RetirementPlannerWrapper';
import { getPageEnum, PAGES_NAMES } from 'lib/constants/pageConstants';
import { Partner } from 'lib/types/aboutYou';
import {
  NavigationDataProps,
  RetirementBudgetPlannerContentProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import { savePartnersInfo } from 'lib/util/about-you';
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
  sessionId,
  summaryData,
  onContinueClick,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  RetirementBudgetPlannerContentProps) => {
  const router = useRouter();

  const { z, locale } = useTranslation();
  const previousTabName = findPreviousStep(navTabsData, tabName);
  const sessionIdFromContext = useSessionId(); // to use in child components
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const pageName = getPageEnum(tabName);
    let error = false;
    let partnerDetails: Partner[] = [];
    if (pageName === PAGES_NAMES.ABOUTYOU) {
      const formEl = e.currentTarget.form;
      if (formEl) {
        partnerDetails = await savePartnersInfo(formEl, sessionIdFromContext);
      }
      if (onContinueClick) {
        error = await onContinueClick(partnerDetails);
      }
    }

    if (error) {
      return;
    }
    const nextStep = findNextStepName(navTabsData, tabName);

    router.push(`/${locale}/${nextStep}?sessionId=${sessionIdFromContext}`);
  };

  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={pageTitle}
      title={'Retirement Budget Planner'}
    >
      <Container>
        <div className="space-y-8">
          <BackLink
            href={`/${locale}/${previousTabName}?sessionId=${
              sessionId ?? sessionIdFromContext
            }`}
          >
            {z({ en: 'Back', cy: '' })}
          </BackLink>
          <form method="POST">
            <input type="hidden" name="language" value={locale} />
            <input type="hidden" name="tabName" value={tabName} />
            <input
              type="hidden"
              name="sessionId"
              value={sessionId ?? sessionIdFromContext}
            />
            <TabContainer
              tabs={navTabsData}
              tabName={getPageEnum(tabName)}
              iniitialEnabledTabCount={initialEnabledTabCount}
              initialActiveTabId={initialActiveTabId}
              headerClassNames="max-w-[840px]"
            >
              <TabContent
                title={title || ''}
                tabName={getPageEnum(tabName)}
                description={description}
                summaryData={summaryData}
              >
                {children}
              </TabContent>
            </TabContainer>
            <Button
              variant="primary"
              onClick={handleClick}
              formAction="/api/submit"
              className="mt-5"
            >
              {z({ en: 'Continue', cy: '' })}
            </Button>
          </form>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};
