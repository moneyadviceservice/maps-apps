import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SupportCallout } from '../../../../components/SupportCallout/SupportCallout';
import {
  SupportFaq,
  SupportFaqList,
} from '../../../../components/SupportFaqList';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import { getSupportChannel } from '../../../../lib/fetch/get-support-channel';
import { storeCurrentUrl } from '../../../../lib/utils';

type PageProps = {
  faqs: SupportFaq[];
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  faqs,
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
    >
      <div className="py-8 md:max-w-4xl">
        <Heading level="h2" className="mb-4 md:text-5xl">
          {t('pages.support.understand-your-pensions.heading')}
        </Heading>

        <Paragraph>
          {t('pages.support.understand-your-pensions.description')}
        </Paragraph>

        <SupportFaqList faqs={faqs} locale={locale} className="my-8" />

        <Link
          href={`/${locale}/support/suggest-another-question`}
          className="mt-8"
          data-testid="suggest-another-question"
        >
          {t('pages.support.suggest-another-question.title')}
        </Link>

        <Heading level="h2" className="mt-20 mb-4 md:text-5xl">
          {t('pages.support.understand-your-pensions.further-guidance.title')}
        </Heading>

        <Paragraph>
          {t(
            'pages.support.understand-your-pensions.further-guidance.description',
          )}
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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

      <SupportCallout showUnderstandLink={false} />
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const backLink = cookies.get('currentUrl') ?? null;
  storeCurrentUrl(context, true);

  try {
    const { faqs } = await getSupportChannel('understand-your-pensions');

    if (!faqs) {
      return { notFound: true };
    }

    return {
      props: {
        faqs,
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
