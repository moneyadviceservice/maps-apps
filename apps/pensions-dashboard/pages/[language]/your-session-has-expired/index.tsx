import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import {
  BACKEND_TIMEOUT_SECONDS,
  MODAL_TIMEOUT_SECONDS,
  TIMEOUT_SECONDS,
} from '../../../lib/constants';
import {
  getUserSessionFromCookies,
  isSessionExpired,
  logoutUser,
} from '../../../lib/utils';

type PageProps = PensionsDashboardLayoutProps & {
  timeoutMinutes: number;
};

const Page: NextPage<PageProps> = ({ timeoutMinutes }) => {
  const { t, locale } = useTranslation();
  const title = t('timeout.session-expired');

  // Use the timeout minutes passed from server side
  const expiryMessage = t('timeout.automatic-expiry', {
    totalTimeout: timeoutMinutes.toString(),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isLoggedInPage={false}
      isOffset={false}
    >
      <div className="pb-6 md:py-8 md:max-w-4xl">
        <Paragraph className="mb-6">{expiryMessage}</Paragraph>
        <Paragraph>{t('timeout.sign-in-again')}</Paragraph>
      </div>
      <Link
        className="block w-full my-3 text-center md:w-auto md:inline-flex md:text-left"
        asButtonVariant="primary"
        href={`/${locale}`}
      >
        {t('timeout.return-to-start')}
      </Link>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  try {
    await logoutUser(req, res);
  } catch (error) {
    // If DELETE failed (5XX error), show 404 error page
    console.error('Logout failed due to DELETE error:', error);
    return {
      notFound: true,
    };
  }

  // Check if this was a backend timeout by examining the session
  const cookies = new Cookies(req, res);
  const userSession = getUserSessionFromCookies(cookies);
  const isBackendTimeout =
    userSession?.sessionStart &&
    (await isSessionExpired(userSession.sessionStart));

  // Calculate timeout based on the type of expiry
  const timeoutSeconds = isBackendTimeout
    ? BACKEND_TIMEOUT_SECONDS
    : TIMEOUT_SECONDS + MODAL_TIMEOUT_SECONDS;

  const timeoutMinutes = Math.round(timeoutSeconds / 60);

  return {
    props: {
      timeoutMinutes,
    },
  };
};
