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
import { validateForm } from 'lib/validation/partner';
import { getPartnersFromRedis } from 'pages/api/get-partner-details';
import { updatePartnerInformation } from 'services/about-you';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { getServerSideDefaultProps } from '.';
type AboutUsPageProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps & {
    partners: Partner[];
    editId: number | null;
    errorExist: boolean;
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
  errorExist = false,
}: AboutUsPageProps) => {
  const [partnerDetails, setPartnerDetails] = useState<Partner[]>(partners);
  const sessionIdFromContext = useSessionId();
  const [formErrors, setFormErrors] = useState<Record<
    keyof Partner,
    string
  > | null>(null);
  const { t } = useTranslation();
  let errors = null;
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
  if (errorExist && partner1) {
    const validationErrors = validateForm(partner1);
    if (validationErrors) {
      errors = validationErrors;
    }
  }
  const handleAdd = async () => {
    const updatedPartners = [...partnerDetails, PARTNER2];
    await updatePartnerInformation(updatedPartners, sessionIdFromContext);
    setPartnerDetails(updatedPartners);
  };

  const handleContinueClick = async (partnersDetails: Partner[]) => {
    const partner1 = findPartnerById(partnersDetails, 1);
    if (partner1) {
      const validationErrors = validateForm(partner1);
      if (validationErrors) {
        setFormErrors(validationErrors);
        return true;
      }
    }
    return false;
  };

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
    >
      {partner1 && (
        <PartnerInfo
          partners={partnerDetails}
          partnerInfo={partner1}
          isEditing={editId === partner1.id}
          onPartnerDetailsChange={setPartnerDetails}
          formErrors={formErrors ?? errors}
        />
      )}
      <VisibleSection visible={!partner2}>
        <AddPartner onAdd={handleAdd} />
      </VisibleSection>

      {partner2 && (
        <PartnerInfo
          partners={partnerDetails}
          partnerInfo={partner2}
          isEditing={editId === partner2.id}
          onPartnerDetailsChange={setPartnerDetails}
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
  const errorExist = query.error === 'true';

  let rawPartners = null;
  if (sessionId) rawPartners = await getPartnersFromRedis(sessionId);

  let p = partners;

  if (rawPartners && Array.isArray(rawPartners)) {
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
