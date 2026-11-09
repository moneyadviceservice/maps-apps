import { GetServerSideProps } from 'next';

import { parseAdminE2eFirmQuery } from 'lib/ci/adminE2eFirmConstants';
import {
  setAdminE2eFirmState,
  setAdminE2eFirmsState,
} from 'lib/ci/setAdminE2eFirmState';

const ADMIN_DASHBOARD_REDIRECT = {
  redirect: { destination: '/admin/dashboard', permanent: false },
  props: {},
};

const Page = () => <>Blank page</>;
export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (process.env.CI !== 'true') {
    return { notFound: true };
  }

  const firmQuery = parseAdminE2eFirmQuery(context.query.firm);
  if (!firmQuery) {
    return ADMIN_DASHBOARD_REDIRECT;
  }

  if (firmQuery === 'all') {
    const seeded = await setAdminE2eFirmsState('all');
    if (!seeded.success) {
      return ADMIN_DASHBOARD_REDIRECT;
    }
    return ADMIN_DASHBOARD_REDIRECT;
  }

  const seeded = await setAdminE2eFirmState(firmQuery);
  if (!seeded.success || !seeded.firmId) {
    return ADMIN_DASHBOARD_REDIRECT;
  }

  return {
    redirect: {
      destination: `/admin/firms/${seeded.firmId}`,
      permanent: false,
    },
    props: {},
  };
};
