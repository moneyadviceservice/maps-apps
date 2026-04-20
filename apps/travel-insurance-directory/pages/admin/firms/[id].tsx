import { GetServerSideProps } from 'next';

import { FirmDetail } from 'components/FirmDetail';
import { AdminLayout } from 'layouts/AdminLayout';
import { getAdminSession } from 'lib/auth/sessionManagement';
import { fetchFirm } from 'lib/firms/fetchFirm';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

type Props = {
  userName?: string;
  userEmail?: string;
  firm: TravelInsuranceFirmDocument;
};

const FirmDetailPage = ({ userName, userEmail, firm }: Props) => (
  <AdminLayout userName={userName} userEmail={userEmail}>
    <FirmDetail firm={firm} />
  </AdminLayout>
);

export default FirmDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getAdminSession(context, true);

  if ('redirect' in session) {
    return session;
  }

  const id = context.params?.id;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  const result = await fetchFirm(id);

  if (!result.success || !result.response) {
    return { notFound: true };
  }

  return {
    props: {
      userName: session.name ?? null,
      userEmail: session.username ?? null,
      firm: structuredClone(result.response),
    },
  };
};
