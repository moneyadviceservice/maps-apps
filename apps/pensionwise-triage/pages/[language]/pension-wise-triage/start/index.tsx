import { GetServerSideProps, NextPage } from 'next';
import { fetchDetail, Detail, fetchShared } from '../../../../utils';
import { RichSection } from '@maps-react/vendor/components/RichSection';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
  DetailPageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import { twMerge } from 'tailwind-merge';

const Page: NextPage<PensionWisePageProps & DetailPageProps> = ({
  data,
  ...pageProps
}) => {
  const richTextClasses = [
    '[&_h2]:text-3xl',
    '[&_h2]:md:text-4xl',
    'mb-8',
    'md:mb-12',
  ];

  return (
    <PensionwisePageLayout isToolNameH1={true} {...pageProps}>
      <RichSection
        richTextClasses={twMerge(richTextClasses)}
        testId="start"
        {...data}
      />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchDetail(Detail.START, query);
  const sharedContent = await fetchShared(query);
  const lang = query.language ?? 'en';

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data.browserPageTitle,
      route: {
        back: `https://www.moneyhelper.org.uk/${lang}/pensions-and-retirement/pension-wise/book-a-free-pension-wise-appointment`,
        next: '/age',
        nextText: lang === 'cy' ? 'Dechrau' : 'Start',
        query,
        app: process.env.appUrl,
      },
    },
  };
};
