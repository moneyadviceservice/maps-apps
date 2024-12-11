import { GetServerSideProps, NextPage } from 'next';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { logoutUser } from '../../../lib/utils';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t, locale } = useTranslation();
  const title = t('timeout.exited-the-dashboard');

  return (
    <PensionsDashboardLayout
      title={title}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <div>
        <Paragraph className="mb-8">
          {t('timeout.to-return-to-dashboard')}
        </Paragraph>
        <Link asButtonVariant="primary" href={`/${locale}`}>
          {t('timeout.return-to-start')}
        </Link>
        <div className="mt-14">
          <Link asInlineText href={t('site.feedback-link')} target="_blank">
            {t('timeout.what-did-you-think')}
          </Link>{' '}
          {t('timeout.takes-2-mins')}
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  logoutUser(req, res);

  return {
    props: {},
  };
};
