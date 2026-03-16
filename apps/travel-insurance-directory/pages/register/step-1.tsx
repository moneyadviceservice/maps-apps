import { GetServerSideProps } from 'next';

import { FcaLookup } from 'components/FcaLookup';
import { page } from 'data/pages/register';
import { getIronSession, IronSessionData } from 'iron-session';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import TravelInsuranceDirectory from 'pages';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  fcaNumber: string | null;
  hasError: boolean;
  errorType?: 'required' | 'invalid' | 'notFound' | 'apiError' | 'unknown';
};

const Page = ({ fcaNumber, hasError, errorType }: Props) => {
  const { z } = useTranslation();

  const pageErrors = page.fcaPage.inputs.frn[0].errors ?? '';

  const errors = hasError
    ? {
        frn: [pageErrors[errorType ?? 'unknown']],
      }
    : null;

  return (
    <TravelInsuranceDirectory
      browserTitle={page.fcaPage.browserTitle}
      backLink="/register"
      heading={page.fcaPage.heading}
      showLanguageSwitcher={false}
      topInfoSection={
        errors && (
          <ErrorSummary
            title={z({
              en: 'There is a problem',
              cy: 'Mae yna broblem',
            })}
            errors={errors}
          />
        )
      }
    >
      <FcaLookup initialFcaNumber={fcaNumber} hasError={hasError} />
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

  const fcaNumber = session.fcaData?.frnNumber ?? null;

  return {
    props: { fcaNumber, hasError, errorType },
  };
};
