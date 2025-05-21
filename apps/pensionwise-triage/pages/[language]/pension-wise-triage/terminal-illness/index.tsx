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
  ...pageProps
}) => {
  const {
    route: { query },
  } = pageProps;

  return (
    <PensionwisePageLayout {...pageProps}>
      <QuestionForm
        testId="terminal-illness-questions"
        data={data}
        query={query}
        formAction="/api/submit-answer"
      />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchQuestion(Question.TERMINAL_ILLNESS, query);
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
        back: '/pension-type',
        query,
        app: process.env.appUrl,
      },
    },
  };
};
