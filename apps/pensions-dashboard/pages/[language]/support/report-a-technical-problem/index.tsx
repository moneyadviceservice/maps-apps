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
import { storeCurrentUrl } from '../../../../lib/utils';

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
    >
      <div className="py-8 md:max-w-4xl">
        <ToolIntro className="mb-8 md:text-2xl">
          {t('pages.support.report-a-technical-problem.intro')}
        </ToolIntro>

        <Paragraph>
          {t('pages.support.report-a-technical-problem.content')}
        </Paragraph>

        <Paragraph>
          {t('pages.support.report-a-technical-problem.thanks')}
        </Paragraph>

        <EmbedMSForm
          src={t(`pages.support.report-a-technical-problem.form.src`)}
          title={t(`pages.support.report-a-technical-problem.form.title`)}
          id="report-problem-form"
          testId="report-problem-form"
          classNames="mt-10 h-[670px] sm:h-[610px] md:h-[590px] lg:h-[700px]"
        />

        <SupportCallout showReportLink={false} />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const backLink = cookies.get('currentUrl') ?? null;
  storeCurrentUrl(context, true);

  return {
    props: {
      backLink,
    },
  };
};
