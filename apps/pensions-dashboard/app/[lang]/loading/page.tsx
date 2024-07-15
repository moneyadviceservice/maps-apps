import { Metadata, NextPage } from 'next';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { SITE_TITLE } from '../../../utils/constants';
import { Paragraph } from '@maps-digital/ui/components/Paragraph';
import { Link } from '@maps-digital/ui/components/Link';

const title = 'Pensions found';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `${title} | ${SITE_TITLE}`,
  };
};

const Page: NextPage = async () => {
  // (1) CDA FIND - 25781
  // > check if data load has at least started, if not complete
  // - use GET not found
  // - or store a cookie when POST has started

  // if NO

  // - create userSessionId UUID
  // - SET cookie
  //   - `userSessionId`
  // - POST to `/api/redirect-details` with
  //   - redirectPurpose = "FIND",
  //   - userSessionId,
  //   - iss = "MHPD-75b68255-444e-4d5f-bbfe-249c26d69963"} (react app env var)
  // - SET cookie, from response
  //   - `codeVerifier`
  // - redirect to CDA emulator
  //   -redirectTargetUrl
  //   - query params from (spread data)
  //   - `redirect_uri` with return URL to React app
  //   - `{redirectTargetUrl}?redirect_uri=http://localhost:4100`

  return (
    <PensionsDashboardLayout title={title}>
      <>
        <Paragraph>Loading...</Paragraph>
        <Link href="/en/overview">Overview</Link>
      </>
    </PensionsDashboardLayout>
  );
};

export default Page;
