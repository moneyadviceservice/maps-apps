import { GetServerSideProps, NextPage } from 'next';
import { fetchQuestion, Question, fetchShared } from '../../../../utils';
import { QuestionForm } from '@maps-react/pwd/components/QuestionForm';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
  QuestionPageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';

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
        testId="lifetime-annuity-questions"
        data={data}
        query={query}
        formAction="/api/submit-answer"
      />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchQuestion(Question.LIFETIME_ANNUITY, query);
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
