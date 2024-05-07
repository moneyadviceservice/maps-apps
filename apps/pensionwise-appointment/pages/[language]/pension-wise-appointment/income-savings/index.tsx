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
      <RichSection {...data} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchDetail(Detail.INCOME_AND_SAVINGS, query);
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
        back: '/',
        section: 'helping',
        next: '/income-savings/retirement-budget',
        saveReturnLink: true,
        query,
        app: process.env.appUrl,
      },
    },
  };
};
