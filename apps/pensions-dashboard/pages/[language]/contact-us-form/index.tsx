import { GetServerSideProps, NextPage } from 'next';

import { Divider } from '@maps-react/common/components/Divider';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  Cookies,
  getMhpdSessionConfig,
  storeCurrentUrl,
} from '../../../lib/utils/system';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PageProps> = ({ backLink }) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.contact-us.title';
  const title = t(titleKey);

  // Track analytics for this page
  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      isOffset={false}
      toTopLink={false}
      back={backLink ? `/${locale}${backLink}` : undefined}
      backText={backLink ? t('pages.support.back-text') : undefined}
    >
      <div className="md:max-w-4xl">
        <ToolIntro className="mb-6 leading-7 md:mb-8 md:text-2xl">
          {t('pages.contact-us.intro')}
        </ToolIntro>

        <Paragraph className="mb-6">{t('pages.contact-us.content')}</Paragraph>

        <Link
          data-testid="contact-form-button"
          href={process.env.NEXT_PUBLIC_CONTACT_FORM_URL ?? ''}
          asButtonVariant="primary"
          target="_blank"
          className="justify-center block w-full my-4 md:w-auto md:inline-flex"
        >
          {t('pages.contact-us.webform-button')}
        </Link>

        <Divider />

        <Markdown content={t('pages.contact-us.complaint-link')} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const { currentUrl } = getMhpdSessionConfig(cookies);
  storeCurrentUrl(context, undefined, true);

  // Only show back button if currentUrl is a valid dashboard page
  const isDashboardPage =
    currentUrl && currentUrl !== '/' && currentUrl.length > 1;

  const backLink = isDashboardPage ? currentUrl : null;

  return {
    props: {
      backLink,
    },
  };
};
