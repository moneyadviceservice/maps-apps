import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SupportCallout } from '../../../../components/SupportCallout/SupportCallout';
import {
  SupportCategory,
  SupportFaqList,
} from '../../../../components/SupportFaqList';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { getSupportChannel } from '../../../../lib/fetch/get-support-channel';
import { getMhpdSessionConfig, storeCurrentUrl } from '../../../../lib/utils';

type PageProps = {
  categories: SupportCategory[];
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  categories,
  backLink,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.support.explore-the-pensions-dashboard.title');

  return (
    <PensionsDashboardLayout
      back={`/${locale}${backLink}`}
      backText={t('pages.support.back-text')}
      title={title}
      isOffset={false}
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
      </div>
      <div className="md:max-w-4xl">
        <SupportCallout showExploreLink={false} />
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

  try {
    const { categories } = await getSupportChannel(
      'explore-the-pensions-dashboard',
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
      'Error fetching explore the pensions dashboard AEM content:',
      error,
    );
    return { notFound: true };
  }
};
