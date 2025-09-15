import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';

import { AddPartner } from 'components/AboutYou/AddPartner';
import { PartnerInfo } from 'components/AboutYou/PartnerInfo';
import { VisibleSection } from 'components/VisibleSection';
import { RetirementPlannerLayout } from 'layout/RetirementPlannerLayout';
import { Partner } from 'lib/types/aboutYou';
import {
  NavigationDataProps,
  RetirementBudgetPlannerPageProps,
} from 'lib/types/page.type';
import {
  filterFirstPartner,
  findPartnerById,
  PARTNER2,
  partners,
} from 'lib/util/about-you';
import { getPartnersFromRedis } from 'pages/api/get-partner-details';
import { updatePartnerInformation } from 'services/about-you';

import { getServerSideDefaultProps } from '.';
type AboutUsPageProps = RetirementBudgetPlannerPageProps &
  NavigationDataProps & { partners: Partner[]; editId: number | null };

const AboutUsPage = ({
  title,
  pageTitle,
  tabName,
  navTabsData,
  initialActiveTabId,
  initialEnabledTabCount,
  isEmbedded = false,
  partners,
  editId,
}: AboutUsPageProps) => {
  const [partnerDetails, setPartnerDetails] = useState<Partner[]>(partners);
  useEffect(() => {
    const getPartners = async () => {
      try {
        const response = await fetch('/api/get-partners');
        const data = await response.json();
        setPartnerDetails(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    getPartners();
  }, [partners]);
  const partner1 = findPartnerById(partnerDetails, 1);
  const partner2 = findPartnerById(partnerDetails, 2);
  const handleRemove = async () => {
    const updatedPartners = filterFirstPartner(partnerDetails, 2);

    await updatePartnerInformation(updatedPartners);
  };
  const handleAdd = async () => {
    const updatedPartners = [...partnerDetails, PARTNER2];
    await updatePartnerInformation(updatedPartners);
  };

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
      {partner1 && (
        <PartnerInfo
          partners={partnerDetails}
          partnerInfo={partner1}
          isEditing={editId === partner1.id}
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
          onRemove={handleRemove}
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
  const sessionId = context.req.cookies?.session_id;
  let rawPartners = null;
  if (sessionId) rawPartners = await getPartnersFromRedis(sessionId);

  let p = partners;

  if (rawPartners && Array.isArray(rawPartners)) {
    p = rawPartners;
  }
  const resolvedDefaultProps = await defaultProps;
  return {
    props: {
      ...resolvedDefaultProps.props,
      partners: p,
      editId,
    },
  };
};
