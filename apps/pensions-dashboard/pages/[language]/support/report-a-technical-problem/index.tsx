import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { EmbedMSForm } from '../../../../components/EmbedMSForm';
import { SupportCallout } from '../../../../components/SupportCallout/SupportCallout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { getMhpdSessionConfig, storeCurrentUrl } from '../../../../lib/utils';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.support.report-a-technical-problem.title');

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

        <Paragraph className="md:mb-6">
          {t('pages.support.report-a-technical-problem.content')}
        </Paragraph>

        {process.env.NEXT_PUBLIC_USE_SUPPORT_FORM === 'true' && (
          <EmbedMSForm
            src={`${process.env.NEXT_PUBLIC_SUPPORT_FORM_URL}&lang=${locale}`}
            title={t(
              'pages.support.report-a-technical-problem.embeded-form-title',
            )}
            minHeight={600}
            classNames="mb-6 md:mb-8"
          />
        )}

        <SupportCallout showReportLink={false} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const { currentUrl } = getMhpdSessionConfig(cookies);
  const backLink = currentUrl ?? null;
  storeCurrentUrl(context, undefined, true);

  return {
    props: {
      backLink,
    },
  };
};
