import { GetServerSideProps } from 'next';

import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  lang: 'en' | 'cy';
};

const Page = ({ lang }: Props) => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <ToolPageLayout
      pageTitle={pageTitle(
        'Register - What is your FCA Firm Reference Number?',
        z,
      )}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          <BackLink href={`/${lang}/register/step-1`}>Back</BackLink>
          <Heading level="h1">What is your FCA Firm Reference Number?</Heading>
          <Paragraph>Page not yet completed.</Paragraph>
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  return {
    props: { lang },
  };
};
