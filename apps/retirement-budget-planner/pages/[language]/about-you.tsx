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
  updatePartners,
} from 'lib/util/about-you';

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
  const partner1 = findPartnerById(partners, 1);
  const partner2 = findPartnerById(partners, 2);
  const handleRemove = () => {
    const updatedPartners = filterFirstPartner(partners, 2);
    updatePartners(updatedPartners);
  };
  const handleAdd = () => {
    const updatedPartners = [...partners, PARTNER2];
    updatePartners(updatedPartners);
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
          partners={partners}
          partnerInfo={partner1}
          isEditing={editId === partner1.id}
        />
      )}
      <VisibleSection visible={!partner2}>
        <AddPartner onAdd={handleAdd} />
      </VisibleSection>

      {partner2 && (
        <PartnerInfo
          partners={partners}
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

  const rawPartners = query.partners;
  let p = partners;

  if (typeof rawPartners === 'string') {
    try {
      const decoded = decodeURIComponent(rawPartners);
      p = JSON.parse(decoded);
    } catch (error) {
      console.error('Error parsing partners:', error);
    }
  } else {
    console.warn(
      'Expected partners to be a string, but got:',
      typeof rawPartners,
    );
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
