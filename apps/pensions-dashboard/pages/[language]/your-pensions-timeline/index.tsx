import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { Timeline } from '../../../components/Timeline';
import { TimelineKey } from '../../../components/TimelineKey';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getPensionsTimeline } from '../../../lib/api/pension-data-service';
import {
  TimelineKey as TimelineKeyType,
  TimelineYear,
} from '../../../lib/types';
import {
  getUserSessionFromCookies,
  handlePageError,
  storeCurrentUrl,
  withAuth,
} from '../../../lib/utils/system';

type PageProps = {
  timelineKey: TimelineKeyType[];
  timelineYears: TimelineYear[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  timelineKey,
  timelineYears,
}) => {
  const { t, tList, locale } = useTranslation();
  const seoTitle = t('pages.your-pensions-timeline.page-title');
  const title = t('pages.your-pensions-timeline.title');
  const accordionItems = tList('pages.your-pensions-timeline.accordion.items');

  return (
    <PensionsDashboardLayout
      seoTitle={seoTitle}
      title={title}
      back={`/${locale}/your-pension-breakdown`}
      helpAndSupport
      isOffset={false}
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

    storeCurrentUrl(context, 'TIMELINE');

    try {
      const data = await getPensionsTimeline({
        userSession,
      });

      // If there is no timeline data, return 404 page
      if (!data?.years || data.years.length === 0) {
        return { notFound: true };
      }

      return {
        props: {
          timelineKey: data.keys,
          timelineYears: data.years,
        },
      };
    } catch (error) {
      return handlePageError(error, language, 'Error fetching timeline data:');
    }
  },
);
