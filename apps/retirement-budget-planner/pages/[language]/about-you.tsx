import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';

import { PartnerInfo } from 'components/AboutYou/PartnerInfo';
import { useSessionId } from 'context/SessionContextProvider';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { Partner } from 'lib/types/aboutYou';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import { partner } from 'lib/util/about-you';
import { getErrors } from 'lib/util/aboutYou/aboutYou';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis/aboutYouCache';
import { returningCache } from 'lib/util/cacheToRedis/returningCache';
import { validatePartner } from 'lib/validation/partner';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';
type AboutUsPageProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps & {
    partnerInfo: Partner;
    errorExist: boolean;
  };

const AboutUsPage = ({
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  partnerInfo,
  sessionId,
  errorExist,
}: AboutUsPageProps) => {
  const [partnerDetails, setPartnerDetails] = useState<Partner>(partnerInfo);
  const sessionIdFromContext = useSessionId();
  const [formErrors, setFormErrors] = useState<
    (Record<string, string> | undefined) | null
  >(null);
  const { t } = useTranslation();
  let errors: (Record<string, string> | undefined) | null = null;
  useEffect(() => {
    const getPartner = async () => {
      try {
        const response = await fetch(
          `/api/get-partner-details?sessionId=${sessionIdFromContext}`,
        );
        const data = await response.json();
        setPartnerDetails(data);
      } catch (error) {
        console.error('Error fetching partner:', error);
      }
    };

    getPartner();
  }, [sessionIdFromContext]);

  if (errorExist) {
    const validationErrors = validatePartner(partnerInfo);
    if (validationErrors) {
      errors = validationErrors;
    }
  }

  const handleContinueClick = async (partnersDetails: Partner) => {
    const validationErrors = validatePartner(partnersDetails);

    if (validationErrors) {
      setFormErrors(validationErrors);
      return true;
    }

    return false;
  };

  const aboutYouErrors = getErrors(formErrors ?? errors);

  return (
    <RetirementPlannerLayout
      title={t('aboutYou.title')}
      pageTitle={pageTitle}
      tabName={tabName}
      initialActiveTabId={initialActiveTabId}
      initialEnabledTabCount={initialEnabledTabCount}
      navTabsData={navTabsData}
      isEmbedded={isEmbedded}
      sessionId={sessionId}
      onContinueClick={handleContinueClick}
      errorDetails={aboutYouErrors}
    >
      <PartnerInfo
        partnerInfo={partnerDetails}
        formErrors={formErrors ?? errors}
      />
    </RetirementPlannerLayout>
  );
};

export default AboutUsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const defaultProps = await getServerSideDefaultProps(context);

  if ('redirect' in defaultProps || 'notFound' in defaultProps) {
    return defaultProps;
  }

  const { query } = context;
  const sessionId = query.sessionId as string | undefined;
  const errorExist = query.error === 'true';

  let rawPartner = null;

  // when returning back to page after save-and-return
  // get data from database, save to Redis and
  // return the data for about you tab
  if (
    'props' in defaultProps &&
    defaultProps.props &&
    'tabName' in defaultProps.props
  ) {
    rawPartner =
      (await returningCache(
        Boolean(query.returning),
        sessionId,
        defaultProps.props?.tabName,
      )) ?? null;
  }

  if (sessionId && rawPartner === null)
    rawPartner = await getPartnersFromRedis(sessionId);

  let p = partner;

  if (rawPartner) {
    p = rawPartner;
  }

  const resolvedDefaultProps = (await defaultProps) ?? { props: {} };
  return {
    props: {
      ...resolvedDefaultProps.props,
      partnerInfo: p,
      sessionId: sessionId || null,
      errorExist,
    },
  };
};
