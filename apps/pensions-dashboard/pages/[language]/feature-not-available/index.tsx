import { GetServerSideProps, NextPage } from 'next';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  Cookies,
  getMhpdSessionConfig,
  withAuth,
} from '../../../lib/utils/system';

const TEST_SURVEY_URL = 'https://survey.informizely.com/f692vTra1Pra';
const PRODUCTION_SURVEY_URL = 'https://survey.informizely.com/f692yYzdLYgB';

type PageProps = {
  backLink: string;
  surveyUrl: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  backLink,
  surveyUrl,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.feature-not-available.title';
  const title = t(titleKey);

  useMHPDAnalytics({
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      isOffset={false}
      homeLink
      showToolFeedBack={false}
      toTopLink={false}
    >
      <div className="xl:grid xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-8">
          <ToolIntro className="mb-6 md:mb-7 md:text-2xl">
            {t('pages.feature-not-available.intro')}
          </ToolIntro>

          <Paragraph className="mb-6">
            <Markdown
              disableParagraphs
              content={t('pages.feature-not-available.survey', {
                surveyUrl,
              })}
            />
          </Paragraph>

          <Paragraph>{t('pages.feature-not-available.provider')}</Paragraph>
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth(
  async ({ req, res }) => {
    const cookies = new Cookies(req, res);
    const { currentUrl } = getMhpdSessionConfig(cookies);

    return {
      props: {
        backLink: currentUrl || '/your-pension-search-results',
        surveyUrl:
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
            ? PRODUCTION_SURVEY_URL
            : TEST_SURVEY_URL,
      },
    };
  },
);
