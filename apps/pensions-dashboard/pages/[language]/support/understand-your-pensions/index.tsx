import { GetServerSideProps, NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { OnwardJourneyBanner } from '../../../../components/OnwardJourneyBanner';
import { SupportCallout } from '../../../../components/SupportCallout';
import {
  SupportCategory,
  SupportFaq,
  SupportFaqList,
} from '../../../../components/SupportFaqList';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { getSupportChannel } from '../../../../lib/api/aem';
import { useMHPDAnalytics } from '../../../../lib/hooks';
import {
  Cookies,
  getMhpdSessionConfig,
  storeCurrentUrl,
  withAuth,
} from '../../../../lib/utils/system';

type PageProps = {
  faqs: SupportFaq[];
  categories: SupportCategory[];
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  categories,

  backLink,
}) => {
  const { t, locale } = useTranslation();
  const { t: tEn } = useTranslation('en');
  const titleKey = 'support/understand-your-pensions.title';
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
      backText={t('support/back-text')}
      isOffset={false}
      showSupportHomeLink={true}
    >
      <div className="md:max-w-4xl">
        {categories.map(
          ({ title, description, cy_title, cy_description, faqs }) => (
            <div key={title} className="mb-4">
              <Heading level="h2" className="mb-4 md:text-5xl">
                {locale === 'cy' ? cy_title : title}
              </Heading>
              <Paragraph>
                {locale === 'cy' ? cy_description : description}
              </Paragraph>
              <SupportFaqList
                faqs={faqs}
                locale={locale}
                className="mt-6 mb-10"
              />
            </div>
          ),
        )}

        <OnwardJourneyBanner className="mt-0 md:mt-16" />

        <SupportCallout
          showUnderstandLink={false}
          className="mt-10 mb-4 md:mb-12 md:mt-20"
        />
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

    try {
      const { categories } = await getSupportChannel(
        'understand-your-pensions',
      );

      if (!categories) {
        return { notFound: true };
      }

      return {
        props: {
          categories,
          backLink,
        },
      };
    } catch (error) {
      console.error(
        'Error fetching understand the pensions dashboard AEM content:',
        error,
      );
      return { notFound: true };
    }
  },
);
