import { GetServerSideProps, NextPage } from 'next';

import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';

import { ApptSaveProps, fetchSave, fetchShared } from '../../../utils';
import SaveAndReturn from '../../../components/SaveAndReturn/SaveAndReturn';
import { SAVE_PAGE_OPTIONS } from '../../../utils/saveConstants';

const Page: NextPage<PensionWisePageProps & ApptSaveProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  const { route } = pageProps;

  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <SaveAndReturn data={data} nonce={nonce} pageProps={route} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const data = await fetchSave(query, SAVE_PAGE_OPTIONS.GET_NEXT_STEPS);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data?.browserPageTitle ?? '',
      route: {
        query,
        back: '/summary',
        app: process.env.appUrl ?? '',
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
