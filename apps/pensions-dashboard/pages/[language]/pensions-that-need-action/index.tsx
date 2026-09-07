import { GetServerSideProps, NextPage } from 'next';

import { H2, H3 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangementCallout } from '../../../components/PensionArrangementCallout';
import { ScamWarning } from '../../../components/ScamWarning';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionsByCategory } from '../../../lib/api/pension-data-service';
import {
  BACK_LINKS,
  MatchType,
  PensionsCategory,
} from '../../../lib/constants';
import { useMHPDAnalytics } from '../../../lib/hooks';
import { PensionArrangement } from '../../../lib/types';
import { sortPensions } from '../../../lib/utils/data';
import {
  Cookies,
  getDashboardChannel,
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';

type PageProps = {
  data: PensionArrangement[];
  backLink: string;
};

const sectionClasses = {
  section: 'mt-6 md:mt-20',
  heading: 'mb-4 md:mb-6 font-semibold',
  description: 'mb-6 md:mb-12',
} as const;

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  backLink,
}) => {
  const { t, tList, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'pages.pensions-that-need-action.title';
  const title = t(titleKey);

  // Track analytics for this page
  useMHPDAnalytics({
    eventName: 'pensionRequiredActions',
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  const possMatchPensions = data.filter((p) => p.matchType === MatchType.POSS);
  const moreInfoPensions = data.filter((p) => p.matchType !== MatchType.POSS);
  const noBacklink = backLink === '/your-pension-search-results';

  return (
    <PensionsDashboardLayout
      title={title}
      back={noBacklink ? undefined : `/${locale}${backLink}`}
      helpAndSupport
      isOffset={false}
      homeLink
    >
      <div className="xl:grid xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-8">
          <ToolIntro>
            <Markdown
              className="py-4 leading-[1.5] md:py-0 md:text-2xl md:mt-4 md:mb-8"
              content={t('pages.pensions-that-need-action.tool-intro')}
            />
          </ToolIntro>

          <H2 className="mb-6 text-blue-700">
            {t('pages.pensions-that-need-action.what-you-can-do.heading')}
          </H2>

          <Paragraph className="text-2xl font-bold">
            {t('pages.pensions-that-need-action.what-you-can-do.lead')}
          </Paragraph>

          <Paragraph className="md:mb-6">
            {t('pages.pensions-that-need-action.what-you-can-do.body-before')}
          </Paragraph>

          <ListElement
            variant="unordered"
            color="dark"
            className="mb-6 ml-8"
            items={
              tList(
                'pages.pensions-that-need-action.what-you-can-do.list-items',
              ) as string[]
            }
          />

          <Paragraph className="mb-8 text-base leading-[1.6] text-gray-800 md:mb-12">
            {t('pages.pensions-that-need-action.what-you-can-do.body-after')}
          </Paragraph>

          {possMatchPensions.length > 0 && (
            <section className={sectionClasses.section}>
              <H3
                id="possible-match-heading"
                className={sectionClasses.heading}
                level="h3"
              >
                {t('pages.pensions-that-need-action.possible-match.heading')}
              </H3>
              <Paragraph className={sectionClasses.description}>
                {t(
                  'pages.pensions-that-need-action.possible-match.description',
                )}
              </Paragraph>
              {possMatchPensions.map((item) => (
                <PensionArrangementCallout
                  key={item.externalAssetId}
                  {...item}
                />
              ))}
            </section>
          )}

          {moreInfoPensions.length > 0 && (
            <section className={sectionClasses.section}>
              <H3
                id="more-information-heading"
                className={sectionClasses.heading}
              >
                {t('pages.pensions-that-need-action.more-information.heading')}
              </H3>
              <Paragraph className={sectionClasses.description}>
                {t(
                  'pages.pensions-that-need-action.more-information.description',
                )}
              </Paragraph>
              {moreInfoPensions.map((item) => (
                <PensionArrangementCallout
                  key={item.externalAssetId}
                  {...item}
                />
              ))}
            </section>
          )}

          <ScamWarning
            title={t('pages.pensions-that-need-action.scam-warning.heading')}
            className="mt-6 md:mt-12"
          >
            <Markdown
              content={t(
                'pages.pensions-that-need-action.scam-warning.description',
              )}
            />
          </ScamWarning>
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const cookies = new Cookies(context.req, context.res);
    const userSession = getUserSessionFromCookies(cookies);
    const language = context.query.language as string;

    storeCurrentUrl(context);
    const { channel } = getDashboardChannel(context);

    try {
      const data = await getPensionsByCategory(PensionsCategory.CONTACT, {
        userSession,
      });

      if (!data?.arrangements) {
        return { notFound: true };
      }

      const pensions = sortPensions(data.arrangements);

      return {
        props: {
          data: pensions,
          backLink: BACK_LINKS[channel ?? ''],
        },
      };
    } catch (error) {
      return handlePageError(
        error,
        language,
        'Error fetching unconfirmed pensions:',
      );
    }
  },
);
