import { GetServerSideProps, NextPage } from 'next';

import { QuestionForm } from '@maps-react/pwd/components/QuestionForm';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
  QuestionPageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';

import { fetchQuestion, fetchShared, Question } from '../../../../utils';

const Page: NextPage<PensionWisePageProps & QuestionPageProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  const {
    route: { query },
  } = pageProps;

  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce}>
      <QuestionForm
        testId="age-questions"
        data={data}
        query={query}
        formAction="/api/submit-answer"
      />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const data = await fetchQuestion(Question.AGE, query);
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
        back: '/start',
        query,
        app: process.env.appUrl,
      },
      nonce: (req?.headers['x-nonce'] as string) || '',
    },
  };
};
