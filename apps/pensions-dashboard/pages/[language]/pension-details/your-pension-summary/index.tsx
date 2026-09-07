import { GetServerSideProps, NextPage } from 'next';

import { H2 } from '@maps-react/common/components/Heading/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { PensionDetailHeader } from '../../../../components/PensionDetailHeader';
import { PensionDetailSummary } from '../../../../components/PensionDetailSummary';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { getPensionDetailById } from '../../../../lib/api/pension-data-service';
import { BACK_LINKS } from '../../../../lib/constants';
import {
  useFocusTargetByParams,
  useMHPDAnalytics,
} from '../../../../lib/hooks';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../../../lib/types';
import {
  Cookies,
  getDashboardChannel,
  getMhpdSessionConfig,
  getUserSessionFromCookies,
  handlePageError,
  logger,
  storeCurrentUrl,
  withAuth,
} from '../../../../lib/utils/system';

type PageProps = {
  backLink: string;
  data: PensionArrangement;
  component?: BenefitIllustrationComponent;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  backLink,
}) => {
  const { t, tList, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.pension-details.summary-page-title';
  const seoTitle = t(titleKey);
  const cards = tList('components.pension-detail-next-steps.cards');

  // Track analytics for this page
  useMHPDAnalytics({
    eventName: 'pensionSearchResults',
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  useFocusTargetByParams();

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      title={data.schemeName}
      showDownloadLink
      isOffset={false}
      seoTitle={seoTitle}
      showTabsNavigation={true}
      homeLink
    >
      <PensionDetailHeader data={data} />
      <PensionDetailSummary data={data} />
      <section className="mt-6 mb-6 md:mb-20" data-testid="next-steps-section">
        <H2 className="mb-10 md:mb-6" data-testid="next-steps-heading">
          {t('components.pension-detail-next-steps.heading')}
        </H2>

        <Markdown
          className="mb-6"
          testId="next-steps-intro"
          content={t('components.pension-detail-next-steps.intro')}
        />

        <Paragraph className="mb-6" data-testid="next-steps-intro-new-tab">
          {t('components.pension-detail-next-steps.intro-new-tab')}
        </Paragraph>

        <div className="grid grid-cols-1 gap-6 max-md:mt-12 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card: { title: string; text: string; link: string }) => (
            <TeaserCard
              key={card.title}
              title={card.title}
              description={card.text}
              href={card.link}
              headingComponent="h3"
              hrefTarget="_blank"
            />
          ))}
        </div>
      </section>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const cookies = new Cookies(context.req, context.res);
    const userSession = getUserSessionFromCookies(cookies);
    const language = context.query.language as string;

    // Get pension ID from session config instead of individual cookie
    const { pensionID: id } = getMhpdSessionConfig(cookies);

    if (!id) {
      logger.error({
        message:
          'Exiting to error page. No pension id found in session config cookie',
        url: `${language}/pension-details/your-pension-summary`,
        session: userSession,
        data: {
          pensionID: id,
        },
      });
      return { notFound: true };
    }

    storeCurrentUrl(context);
    const { channel } = getDashboardChannel(context);

    try {
      const data = await getPensionDetailById(id, { userSession });

      if (!data) {
        logger.error({
          message:
            'Exiting to error page. No pension detail data found from API',
          url: `${language}/pension-details/your-pension-summary`,
          session: userSession,
          data: {
            pensionID: id,
          },
        });
        return { notFound: true };
      }

      const isRedPension = data.group === 'red';
      const backLink = isRedPension
        ? `/pensions-that-need-action`
        : BACK_LINKS[channel ?? ''];

      return {
        props: {
          data,
          backLink,
        },
      };
    } catch (error) {
      return handlePageError(error, language, 'Error fetching pension detail:');
    }
  },
);
