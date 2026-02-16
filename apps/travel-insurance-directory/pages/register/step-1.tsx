import { GetServerSideProps } from 'next';

import { FcaLookup } from 'components/FcaLookup';
import { page } from 'data/pages/register';
import { getIronSession, IronSessionData } from 'iron-session';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  fcaNumber: string | null;
  hasError: boolean;
  errorType?: 'required' | 'invalid' | 'notFound' | 'apiError' | 'unknown';
};

const Page = ({ fcaNumber, hasError, errorType }: Props) => {
  const { z } = useTranslation();

  const title = appTitle(z);

  const pageErrors = page.inputs(z).frn.errors ?? '';

  const errors = hasError
    ? {
        frn: [pageErrors[errorType ?? 'unknown']],
      }
    : null;

  return (
    <ToolPageLayout
      pageTitle={pageTitle(page.browserTitle(z), z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
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
      showLanguageSwitcher={false}
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          <BackLink href={`/register`}>{page.singles.back(z)}</BackLink>
          <Heading level="h1">{page.heading(z)}</Heading>

          <FcaLookup initialFcaNumber={fcaNumber} hasError={hasError} />
        </div>
      </Container>
    </ToolPageLayout>
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
