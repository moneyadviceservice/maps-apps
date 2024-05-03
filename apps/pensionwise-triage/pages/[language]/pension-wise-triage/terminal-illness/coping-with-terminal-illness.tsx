import { GetServerSideProps, NextPage } from 'next';
import { fetchDetail, Detail, fetchShared } from '../../../../utils';
import {
  DetailPageProps,
  PensionwisePageLayout,
  PensionWisePageProps,
  RichSection,
} from '@maps-digital/shared/ui';

const Page: NextPage<PensionWisePageProps & DetailPageProps> = ({
  data,
  ...pageProps
}) => {
  return (
    <PensionwisePageLayout {...pageProps}>
      <RichSection testId="terminal-illness" {...data} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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
    },
  };
};
