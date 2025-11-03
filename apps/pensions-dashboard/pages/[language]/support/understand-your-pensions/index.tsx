import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SupportCallout } from '../../../../components/SupportCallout/SupportCallout';
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
import {
  getMhpdSessionConfig,
  storeCurrentUrl,
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
  const { t, tList, locale } = useTranslation();
  const title = t('pages.support.understand-your-pensions.title');

  const items = tList(
    'pages.support.understand-your-pensions.further-guidance.links',
  );

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      backText={t('pages.support.back-text')}
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

        <Heading level="h2" className="mt-8 md:mt-[100px] mb-4 md:text-5xl">
          {t('pages.support.understand-your-pensions.further-guidance.title')}
        </Heading>

        <Paragraph>
          {t(
            'pages.support.understand-your-pensions.further-guidance.description',
          )}
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12 md:gap-8 md:grid-cols-3">
        {items.map((item: { title: string; text: string; href: string }) => (
          <TeaserCard
            key={item.title}
            title={item.title}
            description={item.text}
            href={item.href}
            hrefTarget="_blank"
          />
        ))}
      </div>

      <div className="md:max-w-4xl">
        <SupportCallout showUnderstandLink={false} />
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
    const { categories } = await getSupportChannel('understand-your-pensions');

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
};
