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
  ...pageData
}) => {
  const {
    route: { query },
  } = pageData;

  return (
    <PensionwisePageLayout {...pageData}>
      <PensionOption data={data} query={query} />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchPensionOption(PensionOptionPage.LUMP_SUMS, query);
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
            en: `${process.env.PWD_EMBEDDED_TOOLS_URL}/en/cic-calculator?isEmbedded=true`,
            cy: `${process.env.PWD_EMBEDDED_TOOLS_URL}/cy/cic-calculator?isEmbedded=true`,
          },
          api: `${process.env.PWD_EMBEDDED_TOOLS_URL}/api/embed`,
          id: 'cic-calculator',
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
    },
  };
};
