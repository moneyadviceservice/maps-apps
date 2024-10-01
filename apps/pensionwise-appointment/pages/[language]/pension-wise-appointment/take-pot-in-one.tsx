import { GetServerSideProps, NextPage } from 'next';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import {
  PensionOptionProps,
  PensionOption,
} from '../../../components/PensionOption';
import {
  fetchPensionOption,
  PensionOptionPage,
  fetchShared,
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
            en: 'https://embedded-journeys.moneyhelper.org.uk/en/take-whole-pot',
            cy: 'https://embedded-journeys.moneyhelper.org.uk/cy/take-whole-pot',
          },
          id: 'take-whole-pot',
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
