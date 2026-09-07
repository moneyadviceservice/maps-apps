import { type ReactNode } from 'react';

import { GetServerSideProps } from 'next';

import { TradingNamesSection } from 'components/Account/TradingNamesSection';
import { AnalyticsTrigger } from 'components/Analytics/AnalyticsTrigger';
import { getSelfServeConfig } from 'data/analytics/selfServe/config';
import { getAnalyticsStepData } from 'data/analytics/selfServe/data';
import { FirmLayout, type FirmLayoutProps } from 'layouts/FirmLayout';
import { TravelInsuranceDirectoryPageLayout } from 'layouts/TravelInsuranceDirectoryPageLayout';
import { buildAccountFirmLayoutProps } from 'lib/account/buildAccountFirmLayoutProps';
import {
  type AccountIndexPageProps,
  loadAccountIndexProps,
} from 'lib/account/loadAccountIndexProps';
import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import { accountSignOutUrl } from 'lib/auth/routes';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';
import { firstQueryStringParam } from 'utils/query/queryHelpers';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const FIRM_NOT_FOUND_MESSAGE =
  "We couldn't find your firm details. Please contact support.";

const heading = 'Register your firm';
const analyticsData = getAnalyticsStepData('selfServe', 'landing', 1, heading);
const analyticsConfig = getSelfServeConfig('landing');

function AccountPageShell({
  lang,
  children,
}: Readonly<{
  lang: 'en' | 'cy';
  children: ReactNode;
}>) {
  const { z } = useTranslation();

  const title = appTitle(z);

  return (
    <AnalyticsTrigger
      analyticsData={analyticsData}
      currentStep={analyticsData.tool?.toolStep}
      error={[]}
      trackEvents={analyticsConfig?.trackEvents}
    >
      <TravelInsuranceDirectoryPageLayout
        pageTitle={pageTitle(`Self Service - ${heading}`, z)}
        title={title}
        titleTag={'span'}
        noMargin={true}
        showLanguageSwitcher={false}
        headerEndSlot={
          <a
            href={accountSignOutUrl()}
            className="text-sm text-white underline visited:text-white hover:text-white"
            data-testid="account-header-sign-out"
          >
            {z({ en: 'Sign out', cy: 'Allgofnodi' })}
          </a>
        }
        mainClassName="my-8 text-gray-800"
        className="pt-8 mb-4"
      >
        <Container data-lang={lang}>{children}</Container>
      </TravelInsuranceDirectoryPageLayout>
    </AnalyticsTrigger>
  );
}

const Page = (props: AccountIndexPageProps) => {
  if (props.firmNotFound) {
    return (
      <AccountPageShell lang={props.lang}>
        <Callout
          variant={CalloutVariant.WARNING}
          testId="account-firm-not-found"
          className="max-w-3xl"
        >
          {FIRM_NOT_FOUND_MESSAGE}
        </Callout>
      </AccountPageShell>
    );
  }

  const {
    lang,
    firm,
    tradingFirms,
    showRegistrationResumeCallout,
    registrationIncomplete,
    resumeRegistrationHref,
    showReregistrationBanner,
    hasRenewalDraft,
    reregistrationExpirationLabel,
    reregistrationCtaHref,
    availableTradingNames,
    initialAvailableTradingNameSearch,
  } = props;

  const firmLayoutProps: FirmLayoutProps = buildAccountFirmLayoutProps({
    firm,
    showReregistrationBanner,
    showRegistrationResumeCallout,
    registrationIncomplete,
    resumeRegistrationHref,
    hasRenewalDraft,
    reregistrationExpirationLabel,
    reregistrationCtaHref,
  });

  return (
    <AccountPageShell lang={lang}>
      <FirmLayout {...firmLayoutProps} />
      <TradingNamesSection
        firm={firm}
        tradingFirms={tradingFirms}
        availableTradingNames={availableTradingNames}
        initialAvailableTradingNameSearch={
          initialAvailableTradingNameSearch ?? undefined
        }
      />
    </AccountPageShell>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getAccountSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
      props: {},
    };
  }

  const { params, query } = context;
  const initialAvailableTradingNameSearch =
    firstQueryStringParam(query.availableTradingNameSearch) || undefined;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const props = await loadAccountIndexProps({
    session,
    lang: lang === 'cy' ? 'cy' : 'en',
    initialAvailableTradingNameSearch,
  });

  return { props };
};
