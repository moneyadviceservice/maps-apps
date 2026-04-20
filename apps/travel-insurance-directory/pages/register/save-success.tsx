import { GetServerSideProps } from 'next';

import { ContentFactory } from 'components/ContentFactory';
import { page } from 'data/pages/register/save';
import { getIronSession, IronSessionData } from 'iron-session';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import TravelInsuranceDirectory from 'pages';

import { Button } from '@maps-react/common/components/Button';

type Props = {
  email: string | null;
  savedProgressLink: string | null;
};

const Page = ({ email, savedProgressLink }: Props) => {
  return (
    <TravelInsuranceDirectory
      browserTitle={page.saved.browserTitle}
      heading={page.saved.heading}
      showLanguageSwitcher={false}
    >
      <ContentFactory
        copy={page.saved.copy}
        copyPlaceholderValues={email ? { email } : undefined}
      />
      <div className="flex flex-col items-center justify-start md:gap-4 md:flex-row mt-6">
        <Button as={'a'} href={savedProgressLink ?? '/register'}>
          {page.saved.button.label}
        </Button>
        <Button
          className="mt-6 md:mt-0"
          as={'a'}
          variant={'secondary'}
          href="/api/register/save-progress"
          id="save-progress-button"
        >
          {page.saved.buttonRetry?.label}
        </Button>
      </div>
    </TravelInsuranceDirectory>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const errorType = (query?.error as string) ?? null;
  const hasError = !!errorType;

  const session = await getIronSession<IronSessionData>(
    context.req,
    context.res,
    registerSessionOptions,
  );
  const email = session.userData?.mail ?? null;
  const savedProgressLink = session.savedProgressLink ?? null;

  return {
    props: { email, savedProgressLink, hasError, errorType },
  };
};
