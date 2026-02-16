import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { TabContainer } from 'components/Tabs';
import TabContent from 'components/Tabs/TabContent/TabContent';
import { VisibleSection } from 'components/VisibleSection';
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
  errorDetails,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  RetirementBudgetPlannerContentProps & {
    onContinueClick?: (partners: Partner) => Promise<boolean>;
  }) => {
  const router = useRouter();
  const [errors, setErrors] = useState(Boolean(error) || !!errorDetails);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [activeTabId, setActiveTabId] = useState<string>(
    initialActiveTabId || navTabsData[0]?.tabName || '',
  );

  const [enabledTabCount, setEnabledTabCount] = useState<number>(
    initialEnabledTabCount,
  );
  const { locale, t } = useTranslation();
  const previousTabName = findPreviousStep(navTabsData, tabName);
  const sessionIdFromContext = useSessionId();

  useEffect(() => {
    if (tabName === PAGES_NAMES.ABOUTYOU) {
      setErrors(!!errorDetails);
    }
  }, [errorDetails, tabName]);

  const handlePartnerInfo = async (
    formEl: HTMLFormElement | null,
    sessionId: string,
    onContinueClick?: (details: Partner) => Promise<boolean>,
  ): Promise<boolean> => {
    let error = false;
    let partnerDetails: Partner = {} as Partner;

    if (formEl) {
      partnerDetails = await savePartnersInfo(formEl, sessionId);
    }

    if (onContinueClick) {
      error = await onContinueClick(partnerDetails);
    }

    return error;
  };

  const handleIncomeOrEssentials = async (
    formEl: HTMLFormElement | null,
  ): Promise<boolean> => {
    if (!formEl) return true;

    const formData = new FormData(formEl);
    const formDataToObject = Object.fromEntries(formData.entries());
    const isValidForm = validateFormInputNames(formDataToObject);

    if (isValidForm) {
      try {
        await saveIncomeExpensesApi(formDataToObject);

        return false;
      } catch (e) {
        console.error(String(e));
        return true;
      }
    }

    return true;
  };
  const saveDataToRedis = async (
    formEl: HTMLFormElement | null,
    pageName: string,
    sessionId: string,
    onContinueClick?: (details: Partner) => Promise<boolean>,
  ): Promise<boolean> => {
    switch (pageName) {
      case PAGES_NAMES.ABOUTYOU:
        return await handlePartnerInfo(formEl, sessionId, onContinueClick);

      case PAGES_NAMES.INCOME:
      case PAGES_NAMES.ESSENTIALS:
        return await handleIncomeOrEssentials(formEl);

      default:
        return false;
    }
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
      if (tabName !== PAGES_NAMES.ABOUTYOU) {
        setErrors(error);
      }
      globalThis.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      errorSummaryRef.current?.focus();
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
    const error = await handleIncomeOrEssentials(formEl);
    if (error) {
      if (tabName !== PAGES_NAMES.ABOUTYOU) setErrors(error);
      return;
    }

    router.push({
      pathname: `/${locale}/save`,
      query: {
        isEmbedded,
        sessionId: sessionIdFromContext,
        tabName: tabName,
        stepsEnabled: router.query.stepsEnabled,
      },
    });
  };

  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={pageTitle}
      title={t('pageTitle')}
    >
      <Container>
        <div className="space-y-8">
          <BackLink
            href={`/${locale}/${previousTabName}?sessionId=${
              sessionId ?? sessionIdFromContext
            }&stepsEnabled=${enabledTabCount}`}
          >
            {t('backButton')}
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
                errorSummaryRef={errorSummaryRef}
                errorDetails={errorDetails}
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
                {t('continueButton')}
              </Button>
              <VisibleSection visible={tabName !== PAGES_NAMES.ABOUTYOU}>
                <Button
                  className="items-center mt-5"
                  variant="link"
                  formAction={`/api/submit?save=true`}
                  onClick={handleSaveAndComeBack}
                >
                  <Icon type={IconType.BOOKMARK} /> {t('saveAndComeBackButton')}
                </Button>
              </VisibleSection>
            </div>
          </form>
        </div>
      </Container>
    </RetirementPlannerWrapper>
  );
};
