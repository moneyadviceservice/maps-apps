import { GetServerSideProps, NextPage } from 'next';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { Timeline } from '../../../components/Timeline';
import { TimelineKey } from '../../../components/TimelineKey';
import { TimelineToggle } from '../../../components/TimelineToggle';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionsTimeline } from '../../../lib/api/pension-data-service';
import { useMHPDAnalytics } from '../../../lib/hooks';
import {
  TimelineKey as TimelineKeyType,
  TimelineYear,
} from '../../../lib/types';
import {
  ChannelType,
  Cookies,
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';
import { tooltipScreenReaderText } from '../../../lib/utils/ui';

type PageProps = {
  timelineKey: TimelineKeyType[];
  incomeType: string | null;
  timelineYears: TimelineYear[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  timelineKey,
  timelineYears,
  incomeType,
}) => {
  const { t, tList, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const seoTitle = t('pages.your-pensions-timeline.page-title');
  const titleKey = 'pages.your-pensions-timeline.title';
  const title = t(titleKey);
  const accordionItems = tList('pages.your-pensions-timeline.accordion.items');

  const showToggle = incomeType === 'legacy' || incomeType === 'alternative';

  // Track analytics for this page
  useMHPDAnalytics({
    eventName: 'pensionSearchResults',
    pageTitle: tEn(titleKey),
    pageName: tEn(titleKey),
  });

  return (
    <PensionsDashboardLayout
      seoTitle={seoTitle}
      title={title}
      back={`/${locale}/your-pension-breakdown`}
      helpAndSupport
      showDownloadLink
      isOffset={false}
      homeLink
    >
      <Heading level="h2" className="mt-6 mb-5 md:text-5xl">
        {t('pages.your-pensions-timeline.heading')}
      </Heading>

      <div className="lg:grid lg:grid-cols-12 xl:gap-4">
        <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
          <Paragraph className="mb-6">
            {t('pages.your-pensions-timeline.intro')}{' '}
            <Markdown
              disableParagraphs
              content={t('tooltips.retirement-date')}
              tooltipProps={{
                accessibilityLabelOpen: tooltipScreenReaderText(
                  t('tooltips.sr-text.retirement-date'),
                  t,
                ),
              }}
            />
            {'. '}
            {t('pages.your-pensions-timeline.intro-2')}
          </Paragraph>
          <Paragraph className="mb-6">
            {t('pages.your-pensions-timeline.intro-3')}
          </Paragraph>
        </div>
        <div className="lg:col-span-12">
          <TimelineKey data={timelineKey} />
          {showToggle && <TimelineToggle selectedOption={incomeType} />}
        </div>
        <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
          <Timeline data={timelineYears} />

          <ExpandableSection
            title={t('pages.your-pensions-timeline.accordion-title')}
            contentTestClassName="leading-[1.6]"
          >
            {accordionItems.map((item: string, index: number) => (
              <Markdown
                className="mb-7"
                key={'accordion-' + index}
                content={item}
              />
            ))}
          </ExpandableSection>
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
    const incomeType = context.query.income as string;
    const channel = ('TIMELINE' +
      (incomeType === 'legacy' || incomeType === 'alternative'
        ? `_${incomeType.toUpperCase()}`
        : '')) as ChannelType;

    storeCurrentUrl(context, channel, false);

    try {
      const data = await getPensionsTimeline({
        userSession,
        type: incomeType,
      });

      // If there is no timeline data, return 404 page
      if (!data?.years || data.years.length === 0) {
        return { notFound: true };
      }

      return {
        props: {
          timelineKey: data.keys,
          incomeType: incomeType ?? null,
          timelineYears: data.years,
        },
      };
    } catch (error) {
      return handlePageError(error, language, 'Error fetching timeline data:');
    }
  },
);
