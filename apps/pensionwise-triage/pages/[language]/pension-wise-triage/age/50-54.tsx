import { GetServerSideProps, NextPage } from 'next';
import { fetchDetail, Detail, fetchShared } from '../../../../utils';
import { RichSection } from '@maps-react/vendor/components/RichSection';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
  DetailPageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';

const Page: NextPage<PensionWisePageProps & DetailPageProps> = ({
  data,
  ...pageProps
}) => {
  return (
    <PensionwisePageLayout {...pageProps}>
      <RichSection testId="50-54" {...data} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchDetail(Detail.BETWEEN_50_54, query);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data.browserPageTitle,
      route: {
        back: '/age',
        next: '/pension-type',
        query,
        app: process.env.appUrl,
      },
    },
  };
};
