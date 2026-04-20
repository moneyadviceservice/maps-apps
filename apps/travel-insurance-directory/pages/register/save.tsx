import { GetServerSideProps } from 'next';

import { ContentFactory } from 'components/ContentFactory';
import { page } from 'data/pages/register/save';
import { getIronSession, IronSessionData } from 'iron-session';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import TravelInsuranceDirectory from 'pages';

import { Button } from '@maps-react/common/components/Button';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';

type Props = {
  email: string | null;
  hasError: boolean;
};

const Page = ({ email, hasError }: Props) => {
  const errors = hasError
    ? { 'save-progress-button': [page.save.errors?.apiError] }
    : null;

  return (
    <TravelInsuranceDirectory
      browserTitle={page.save.browserTitle}
      heading={page.save.heading}
      showLanguageSwitcher={false}
      errorSummarySection={
        errors && <ErrorSummary title={'There is a problem'} errors={errors} />
      }
    >
      <ContentFactory copy={page.save.copy}>{email}</ContentFactory>
      <div>
        <Button
          as={'a'}
          href="/api/register/save-progress"
          id="save-progress-button"
        >
          {page.save.button.label}
        </Button>
      </div>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const error = (query?.error as string) ?? null;

  const hasError = !!error;

  const session = await getIronSession<IronSessionData>(
    context.req,
    context.res,
    registerSessionOptions,
  );

  const email = session.userData?.mail ?? null;

  return {
    props: { email, hasError },
  };
};
