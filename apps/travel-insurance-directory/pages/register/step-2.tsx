import { Suspense } from 'react';

import { GetServerSideProps } from 'next';

import { Register } from 'components/Register';
import { getIronSession, IronSessionData } from 'iron-session';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const Page = () => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <ToolPageLayout
      pageTitle={pageTitle('Register - Create your account', z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
      showLanguageSwitcher={false}
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          <BackLink href={`/register/step-1`}>Back</BackLink>
          <Heading level="h1">Create your account</Heading>
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const errorType = (query?.error as string) ?? null;

  const hasError = !!errorType;

  const session = await getIronSession<IronSessionData>(
    req,
    res,
    registerSessionOptions,
  );

  const fcaNumber = session.fcaData?.frnNumber ?? null;

  return {
    props: { fcaNumber, hasError, errorType },
  };
};
