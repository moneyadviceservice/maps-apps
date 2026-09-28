import { type FormEvent, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { TabContainer } from 'components/Tabs';
import TabContent from 'components/Tabs/TabContent/TabContent';
import { VisibleSection } from 'components/VisibleSection';
import { FormContextProvider } from 'context/FormContextProvider';
import { useSessionId } from 'context/SessionContextProvider';
import { getFullPageTitle } from 'data/navigationData';
import RetirementPlannerWrapper from 'layout/RetirementPlannerWrapper/RetirementPlannerWrapper';
import {
  getPageEnum,
  NAV_TYPES,
  PAGES_NAMES,
  TAB_KEYS,
} from 'lib/constants/pageConstants';
import { Partner } from 'lib/types/aboutYou';
import {
  NavigationDataProps,
  RetirementBudgetPlannerContentProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import { savePartnersInfo } from 'lib/util/about-you';
import { validateFormInputNames } from 'lib/util/contentFilter';
import { getCanonicalUrl } from 'lib/util/getCanonicalUrl/getCanonicalUrl';
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
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

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
  useInformizely = false,
  analyticsErrors,
}: RetirementBudgetPlannerPageProps &
  NavigationDataProps &
  RetirementBudgetPlannerContentProps & {
    onContinueClick?: (partners: Partner) => Promise<boolean>;
  }) => {
  const router = useRouter();
  const { locale, t } = useTranslation();
  const sessionIdFromContext = useSessionId();

  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Read navType from URL for non-JS focus management (autoFocus fallback)
  const navTypeFromQuery = router.query.navType as string | undefined;

  const [errors, setErrors] = useState(Boolean(error) || !!errorDetails);
  const [activeTabId, setActiveTabId] = useState<string>(
    initialActiveTabId || navTabsData[0]?.tabName || '',
  );
  const [enabledTabCount, setEnabledTabCount] = useState<number>(
    initialEnabledTabCount,
  );

  const previousTabName = findPreviousStep(navTabsData, tabName);

  const pageTitleFull = getFullPageTitle({ pageTitle, tabName, t });

  // Helper function to safely set sessionStorage key with navigation type key along with error handling
  const setNavigationType = (navType: string) => {
    try {
      sessionStorage.setItem(TAB_KEYS.NAV_TYPE_KEY, navType);
    } catch (error) {
      console.error('SessionStorage not available:', error);
    }
  };

  useEffect(() => {
    if (tabName === PAGES_NAMES.ABOUTYOU) {
      setErrors(!!errorDetails);
    }
  }, [errorDetails, tabName]);

  useEffect(() => {
    const focusById = (elementId: string) => {
      requestAnimationFrame(() => {
        const element = document.getElementById(elementId);
        if (element instanceof HTMLElement) {
          element.focus({ preventScroll: true });
        }
      });
    };

    try {
      const navType = sessionStorage.getItem(TAB_KEYS.NAV_TYPE_KEY);

      if (navType === NAV_TYPES.TAB_CLICK) {
        // Tab click navigation: focus the tab button
        focusById(`tab-${tabName}`);
      } else if (navType === NAV_TYPES.CONTINUE || navType === NAV_TYPES.BACK) {
        // Continue/Back button navigation: focus the start of the content section
        focusById('tab-content');
      }

      // Clean up navigation type after use
      sessionStorage.removeItem(TAB_KEYS.NAV_TYPE_KEY);
      // Update previous tab for next navigation
      sessionStorage.setItem(TAB_KEYS.PREVIOUS_TAB_KEY, tabName);
    } catch (error) {
      // Ignore storage errors
      console.error('SessionStorage not available:', error);
    }
  }, [tabName]);

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

      // Mark navigation as tab-click for focus management
      setNavigationType(NAV_TYPES.TAB_CLICK);

      router.push(
        `/${locale}/${tabId}?sessionId=${sessionId}&stepsEnabled=${enabledTabCount}`,
      );
    }
  };

  const handleContinueClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    submitForm();
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitForm();
  };

  const submitForm = async () => {
    const error = await saveDataToRedis(
      formRef.current,
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
    delete queries['navType']; // Prevent navType from leaking into subsequent navigations

    const nextStep = findNextStepName(navTabsData, tabName);
    const currentTabIndex = findTabIndex(navTabsData, nextStep) + 1;

    const newStepsEnabled = Math.max(
      Number(initialEnabledTabCount),
      currentTabIndex,
    );

    // Mark navigation as continue for focus management
    setNavigationType(NAV_TYPES.CONTINUE);

    router.push({
      pathname: `/${locale}/${nextStep}`,
      query: {
        ...queries,
        sessionId: sessionIdFromContext,
        stepsEnabled: newStepsEnabled,
      },
    });
  };

  const handleSaveAndComeBack = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const formEl = e.currentTarget.form;
    await handleIncomeOrEssentials(formEl);
    // Any server-side issues will be handled on the Save page.

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

  const handleBackClick = () => {
    // Mark navigation as back for focus management
    setNavigationType(NAV_TYPES.BACK);
  };

  const backLinkQuery = new URLSearchParams({
    ...(isEmbedded && { isEmbedded: isEmbedded.toString() }),
    sessionId: sessionId ?? sessionIdFromContext,
    stepsEnabled: enabledTabCount.toString(),
    navType: NAV_TYPES.BACK,
  });

  /**
   * Get the back link:
   * - If we are on the about-you page and the tool IS embedded, go to the React landing page
   * - If we are on the about-you page and the tool IS NOT embedded (i.e. we are on the MoneyHelper site), go to the MoneyHelper AEM landing page
   * - Otherwise, if we are on any other page, go back to the page of the previous step
   */
  const backLinkHref =
    !isEmbedded && tabName === PAGES_NAMES.ABOUTYOU
      ? getCanonicalUrl(locale)
      : `/${locale}/${previousTabName}?${backLinkQuery.toString()}`;

  return (
    <RetirementPlannerWrapper
      isEmbedded={isEmbedded}
      pageTitle={pageTitleFull}
      title={t('pageTitle')}
      tabName={tabName}
      analyticsErrors={analyticsErrors}
    >
      <Container>
        <div className="space-y-8">
          {/* Back button */}
          <BackLink href={backLinkHref} onClick={handleBackClick}>
            {t('backButton')}
          </BackLink>

          {/* Form */}
          <FormContextProvider
            handleSaveAndComeBack={handleSaveAndComeBack}
            enabledTabCount={enabledTabCount}
          >
            <form
              ref={formRef}
              action="/api/submit"
              method="POST"
              onSubmit={handleFormSubmit}
              data-testid="retirement-planner-form"
            >
              {/*
                Hidden submit button to allow form submission via keyboard. Must
                be the first button in the form, but is hidden both visually and
                from assistive technologies as it is purely functional and not
                intended to be interacted with directly.
                See bug ticket [#47657](https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_workitems/edit/47657)
              */}
              <button
                type="submit"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />

              {/* Hidden fields */}
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

              {/* Tabs and content */}
              <TabContainer
                tabs={navTabsData}
                activeTabId={activeTabId}
                enabledTabCount={enabledTabCount}
                headerClassNames="max-w-[840px]"
                handleTabClick={handleTabClick}
                navType={navTypeFromQuery}
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

              {/* Form action buttons */}
              <VisibleSection visible={tabName !== PAGES_NAMES.SUMMARY}>
                <div className="flex flex-col justify-start gap-4 mt-4 md:flex-row">
                  <Button
                    variant="primary"
                    formAction="/api/submit"
                    onClick={handleContinueClick}
                    className="mt-5"
                  >
                    {t('continueButton')}
                  </Button>
                  <VisibleSection visible={tabName !== PAGES_NAMES.ABOUTYOU}>
                    <Button
                      variant="link"
                      formAction="/api/submit?save=true"
                      onClick={handleSaveAndComeBack}
                      className="items-center mt-5"
                    >
                      <Icon type={IconType.BOOKMARK} />
                      <span>{t('saveAndComeBackButton')}</span>
                    </Button>
                  </VisibleSection>
                </div>
              </VisibleSection>
            </form>
          </FormContextProvider>
        </div>
      </Container>

      {/* Informizely feedback scripts */}
      {useInformizely && (
        <>
          <InformizelyGetToolName />
          <InformizelyDevScript
            siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
          />
        </>
      )}
    </RetirementPlannerWrapper>
  );
};
