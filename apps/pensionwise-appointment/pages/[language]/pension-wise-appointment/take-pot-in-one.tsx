import { GetServerSideProps, NextPage } from 'next';

import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';

import {
  PensionOption,
  PensionOptionProps,
} from '../../../components/PensionOption';
import {
  fetchPensionOption,
  fetchShared,
  PensionOptionPage,
} from '../../../utils';

const Page: NextPage<PensionWisePageProps & PensionOptionProps> = ({
  data,
  nonce,
  ...pageData
}) => {
  const {
    route: { query },
  } = pageData;

  return (
    <PensionwisePageLayout {...pageData} nonce={nonce}>
      <PensionOption data={data} query={query} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const data = await fetchPensionOption(PensionOptionPage.POT_IN_ONE_GO, query);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data: {
        ...data,
        question: {
          ...data.question,
          id: '1',
        },
        embeddedTool: {
          url: {
            en: `${process.env.PWD_EMBEDDED_TAKE_WHOLE_POT_TOOL_URL}/en/take-whole-pot?isEmbedded=true`,
            cy: `${process.env.PWD_EMBEDDED_TAKE_WHOLE_POT_TOOL_URL}/cy/take-whole-pot?isEmbedded=true`,
          },
          api: `${process.env.PWD_EMBEDDED_TAKE_WHOLE_POT_TOOL_URL}/api/embed`,
          id: 'take-whole-pot-calculator',
        },
      },
      sharedContent,
      pageTitle: data.browserPageTitle,
      route: {
        back: '/',
        section: 'options',
        query,
        app: process.env.appUrl,
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
