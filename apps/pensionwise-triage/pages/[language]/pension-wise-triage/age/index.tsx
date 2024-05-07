import { GetServerSideProps, NextPage } from 'next';
import { fetchQuestion, Question, fetchShared } from '../../../../utils';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
  QuestionForm,
  QuestionPageProps,
} from '@maps-digital/shared/ui';

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
        testId="age-questions"
        data={data}
        query={query}
        formAction="/api/submit-answer"
      />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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
    },
  };
};
