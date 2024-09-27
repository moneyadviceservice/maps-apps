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
      <RichSection testId="75-and-over" {...data} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchDetail(Detail.OVER_75, query);
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
        query,
        app: process.env.appUrl,
      },
    },
  };
};
