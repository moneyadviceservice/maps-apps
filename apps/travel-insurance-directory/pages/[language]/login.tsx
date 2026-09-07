import { GetServerSideProps } from 'next';

import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { TravelInsuranceDirectoryPageLayout } from 'layouts/TravelInsuranceDirectoryPageLayout';

const Page = () => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <TravelInsuranceDirectoryPageLayout
      pageTitle={pageTitle('Login', z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          <Heading level="h1" className="text-blue-700">
            Login
          </Heading>
          <Paragraph className="text-lg">
            This is where the user would see the login form.
          </Paragraph>
        </div>
      </Container>
    </TravelInsuranceDirectoryPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirectTo =
    context.resolvedUrl ?? `/${context.params?.language ?? 'en'}/login`;
  return {
    redirect: {
      destination: `/api/auth/signin?redirectTo=${encodeURIComponent(
        redirectTo,
      )}`,
      permanent: false,
    },
  };
};
