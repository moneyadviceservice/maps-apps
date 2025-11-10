import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';

import { AddPartner } from 'components/AboutYou/AddPartner';
import { PartnerInfo } from 'components/AboutYou/PartnerInfo';
import { VisibleSection } from 'components/VisibleSection';
import { useSessionId } from 'context/SessionContextProvider';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { Partner } from 'lib/types/aboutYou';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import { findPartnerById, PARTNER2, partners } from 'lib/util/about-you';
import { getErrors } from 'lib/util/aboutYou/aboutYou';
import { getPartnersFromRedis } from 'lib/util/cacheToRedis/aboutYouCache';
import { returningCache } from 'lib/util/cacheToRedis/returningCache';
import {
  findPartnerNameError,
  partnerError,
  updatePartnerErrors,
  validateForm,
} from 'lib/validation/partner';
import { updatePartnerInformation } from 'services/about-you';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';
type AboutUsPageProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps & {
    partners: Partner[];
    editId: number | null;
    errorExist: number;
  };

const AboutUsPage = ({
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  partners,
  editId,
  sessionId,
  errorExist,
}: AboutUsPageProps) => {
  const [partnerDetails, setPartnerDetails] = useState<Partner[]>(partners);
  const sessionIdFromContext = useSessionId();
  const [formErrors, setFormErrors] = useState<
    (Record<string, string> | undefined)[] | null
  >(null);
  const { t } = useTranslation();
  let errors: (Record<string, string> | undefined)[] | null = null;
  useEffect(() => {
    const getPartners = async () => {
      try {
        const response = await fetch(
          `/api/get-partner-details?sessionId=${sessionIdFromContext}`,
        );
        const data = await response.json();
        setPartnerDetails(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    getPartners();
  }, [partners, sessionIdFromContext]);

  const partner1 = findPartnerById(partnerDetails, 1);
  const partner2 = findPartnerById(partnerDetails, 2);
  if (errorExist === 1) {
    const validationErrors = validateForm(partnerDetails);
    if (validationErrors) {
      errors = validationErrors;
    }
  } else if (errorExist === 2) {
    const nameError = findPartnerNameError(partnerDetails);
    if (nameError) {
      errors = errors ? [...errors, ...nameError] : nameError;
    }
  }
  const handleAdd = async () => {
    const updatedPartners = [...partnerDetails, PARTNER2];
    await updatePartnerInformation(updatedPartners, sessionIdFromContext);
    setPartnerDetails(updatedPartners);
  };

  const handleContinueClick = async (partnersDetails: Partner[]) => {
    const validationErrors = validateForm(partnersDetails);

    if (validationErrors.length > 0) {
      setFormErrors(validationErrors);
      return true;
    }

    return false;
  };

  const handleError = (errs: Record<string, string>) => {
    const updatedErrors = updatePartnerErrors(formErrors, errs);
    setFormErrors(updatedErrors);
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
      {partner1 && (
        <PartnerInfo
          partners={partnerDetails}
          partnerInfo={partner1}
          isEditing={editId === partner1.id}
          onPartnerDetailsChange={setPartnerDetails}
          formErrors={partnerError(formErrors ?? errors, partner1.id)}
          onError={handleError}
        />
      )}
      <VisibleSection visible={!partner2}>
        <AddPartner
          onAdd={handleAdd}
          formErrors={partnerError(formErrors ?? errors, 1)}
        />
      </VisibleSection>

      {partner2 && (
        <PartnerInfo
          partners={partnerDetails}
          partnerInfo={partner2}
          isEditing={editId === partner2.id}
          onPartnerDetailsChange={setPartnerDetails}
          formErrors={partnerError(formErrors ?? errors, partner2.id)}
          onError={handleError}
        />
      )}
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
  const editId = query.edit ? Number(query.id) : null;
  const sessionId = query.sessionId as string | undefined;
  const errorExist =
    query.error === 'true' ? 1 : query.error === 'name' ? 2 : 0;

  let rawPartners = [];

  // when returning back to page after save-and-return
  // get data from database, save to Redis and
  // return the data for about you tab
  if (
    'props' in defaultProps &&
    defaultProps.props &&
    'tabName' in defaultProps.props
  ) {
    rawPartners =
      (await returningCache(
        Boolean(query.returning),
        sessionId,
        defaultProps.props?.tabName,
      )) ?? [];
  }

  if (sessionId && rawPartners.length === 0)
    rawPartners = await getPartnersFromRedis(sessionId);

  let p = partners;

  if (rawPartners && Array.isArray(rawPartners) && rawPartners.length > 0) {
    p = rawPartners;
  }

  const resolvedDefaultProps = (await defaultProps) ?? { props: {} };
  return {
    props: {
      ...resolvedDefaultProps.props,
      partners: p,
      editId,
      sessionId: sessionId || null,
      errorExist,
    },
  };
};
