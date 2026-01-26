import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Link } from '@maps-react/common/components/Link';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SupportCallout } from '../../../../components/SupportCallout/SupportCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { useMHPDAnalytics } from '../../../../lib/hooks';
import {
  getMhpdSessionConfig,
  storeCurrentUrl,
  withAuth,
} from '../../../../lib/utils/system';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.support.report-a-technical-problem.title';
  const title = t(titleKey);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      backText={t('pages.support.back-text')}
      isOffset={false}
    >
      <div className="pt-2 md:pt-6 md:max-w-4xl">
        <ToolIntro className="mb-6 md:mb-8 md:text-2xl">
          {t('pages.support.report-a-technical-problem.intro')}
        </ToolIntro>

        <Link
          data-testid="welcome-button"
          href={`/${locale}/contact-us-form`}
          asButtonVariant="primary"
        >
          {t('pages.support.report-a-technical-problem.contact-us')}
        </Link>

        <SupportCallout showReportLink={false} showContactLink={false} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const cookies = new Cookies(context.req, context.res);
    const { currentUrl } = getMhpdSessionConfig(cookies);
    const backLink = currentUrl ?? null;
    storeCurrentUrl(context, undefined, true);

    return {
      props: {
        backLink,
      },
    };
  },
);
