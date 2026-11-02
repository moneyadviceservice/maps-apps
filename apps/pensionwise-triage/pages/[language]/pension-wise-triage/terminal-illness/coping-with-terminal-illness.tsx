import { GetServerSideProps, NextPage } from 'next';

import {
  DetailPageProps,
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import { RichSection } from '@maps-react/vendor/components/RichSection';

import { Detail, fetchDetail, fetchShared } from '../../../../utils';

const Page: NextPage<PensionWisePageProps & DetailPageProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <RichSection testId="terminal-illness" {...data} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const data = await fetchDetail(Detail.TERMINAL_ILLNESS, query);
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
        back: '/terminal-illness',
        query,
        app: process.env.appUrl,
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
