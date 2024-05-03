import { GetServerSideProps, NextPage } from 'next';
import { fetchQuestion, Question, fetchShared } from '../../../../utils';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
  QuestionForm,
  QuestionModel,
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
        data={data}
        query={query}
        formAction="/api/submit-helping-you-plan"
        saveReturnLink
      />
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const data = await fetchQuestion(Question.STATE_PENSION, query);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data: {
        ...data,
        id: 2,
        taskId: query?.['task'],
      } as QuestionModel,
      sharedContent,
      pageTitle: data.browserPageTitle,
      route: {
        back: '/income-savings/retirement-budget',
        query,
        app: process.env.appUrl,
      },
    },
  };
};