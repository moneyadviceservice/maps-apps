import { GetServerSideProps } from 'next';

import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const Page = () => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <ToolPageLayout
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
    </ToolPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
