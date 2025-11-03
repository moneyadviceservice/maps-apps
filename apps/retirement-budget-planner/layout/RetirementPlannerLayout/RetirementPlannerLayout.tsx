import { useState } from 'react';

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
import { validateFormInputNames } from 'lib/util/contentFilter';
import { saveIncomeExpensesApi } from 'lib/util/saveToRedisCalls';
import {
  findNextStepName,
  findPreviousStep,
  findTabIndex,
} from 'lib/util/tabs';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
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
  error,
  onContinueClick,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  RetirementBudgetPlannerContentProps & {
    onContinueClick?: (partners: Partner[]) => Promise<boolean>;
  }) => {
  const router = useRouter();
  const [errors, setErrors] = useState(Boolean(error));
  const [activeTabId, setActiveTabId] = useState<string>(
    initialActiveTabId || navTabsData[0]?.tabName || '',
  );

  const [enabledTabCount, setEnabledTabCount] = useState<number>(
    initialEnabledTabCount,
  );
  const { z, locale } = useTranslation();
  const previousTabName = findPreviousStep(navTabsData, tabName);
  const sessionIdFromContext = useSessionId();

  const saveDataToRedis = async (
    formEl: HTMLFormElement | null,
    pageName: string,
    sessionId: string,
    onContinueClick?: (details: Partner[]) => Promise<boolean>,
  ) => {
    let error = false;
    let partnerDetails: Partner[] = [];

    if (pageName === PAGES_NAMES.ABOUTYOU) {
      if (formEl) {
        partnerDetails = await savePartnersInfo(formEl, sessionId);
      }
      if (onContinueClick) {
        error = await onContinueClick(partnerDetails);
      }
    } else if (
      pageName === PAGES_NAMES.INCOME ||
      pageName === PAGES_NAMES.ESSENTIALS
    ) {
      if (!formEl) return true;
      const formData = new FormData(formEl);
      const formDataToObject = Object.fromEntries(formData.entries());
      const isValidForm = validateFormInputNames(formDataToObject);

      if (isValidForm) {
        try {
          await saveIncomeExpensesApi(formDataToObject);
        } catch (e) {
          console.error(String(e));
        }
      } else {
        error = true;
      }
    }

    return error;
  };

  const handleTabClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tabId: string,
    tabIndex: number,
  ) => {
    event.preventDefault();
    const formEl = event.currentTarget.form;
    await saveDataToRedis(
      formEl,
      getPageEnum(tabName),
      sessionIdFromContext,
      onContinueClick,
    );

    if (tabIndex < enabledTabCount) {
      setActiveTabId(tabId);
      setEnabledTabCount(Math.max(enabledTabCount, tabIndex + 1));

      router.push(
        `/${router.query?.language}/${tabId}?sessionId=${sessionId}&stepsEnabled=${enabledTabCount}`,
      );
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formEl = e.currentTarget.form;
    const error = await saveDataToRedis(
      formEl,
      getPageEnum(tabName),
      sessionIdFromContext,
      onContinueClick,
    );
    if (error) {
      if (tabName !== PAGES_NAMES.ABOUTYOU) setErrors(error);

      return;
    }
    const queries = router.query;
    delete queries['language'];

    const nextStep = findNextStepName(navTabsData, tabName);
    const currentTabIndex = findTabIndex(navTabsData, nextStep) + 1;

    const newStepsEnabled = Math.max(
      Number(initialEnabledTabCount),
      currentTabIndex,
    );

    router.push(
      `/${locale}/${nextStep}?sessionId=${sessionIdFromContext}&stepsEnabled=${newStepsEnabled}`,
    );
  };

  const handleSaveAndComeBack = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const formEl = e.currentTarget.form;
    const error = await saveDataToRedis(
      formEl,
      getPageEnum(tabName),
      sessionIdFromContext,
      onContinueClick,
    );
    if (error) {
      if (tabName !== PAGES_NAMES.ABOUTYOU) setErrors(error);
      return;
    }
    router.push({
      pathname: `/${locale}/save`,
      query: {
        isEmbedded: router.query.isEmbedded || false,
        sessionId: sessionIdFromContext,
        tabName: tabName || PAGES_NAMES.ABOUTYOU,
      },
    });
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
              name="stepsEnabled"
              value={initialEnabledTabCount}
            />
            <input
              type="hidden"
              name="sessionId"
              value={sessionId ?? sessionIdFromContext}
            />
            <TabContainer
              tabs={navTabsData}
              activeTabId={activeTabId}
              enabledTabCount={enabledTabCount}
              headerClassNames="max-w-[840px]"
              handleTabClick={handleTabClick}
            >
              <TabContent
                title={title || ''}
                tabName={getPageEnum(tabName)}
                description={description}
                summaryData={summaryData}
                hasError={errors}
              >
                {children}
              </TabContent>
            </TabContainer>
            <div className="flex flex-col justify-start gap-4 mt-4 md:flex-row">
              <Button
                variant="primary"
                onClick={handleClick}
                formAction="/api/submit"
                className="mt-5"
              >
                {z({ en: 'Continue', cy: '' })}
              </Button>
              <Button
                className="items-center mt-5"
                variant="link"
                formAction={`/api/submit?save=true`}
                onClick={handleSaveAndComeBack}
              >
                <Icon type={IconType.BOOKMARK} />{' '}
                {z({ en: ' Save and come back later', cy: '' })}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};
