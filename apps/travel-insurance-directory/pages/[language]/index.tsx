import { GetServerSideProps } from 'next';

import { page } from 'data/pages/landing';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type BaseProps = {
  lang: 'en' | 'cy';
};

const Page = ({ lang }: BaseProps) => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <ToolPageLayout
      pageTitle={pageTitle(title, z)}
      title={title}
      titleTag={'span'}
      noMargin={true}
      mainClassName="my-8 text-gray-800"
      className="pt-8 mb-4"
    >
      <Container>
        <div className="lg:max-w-[980px] space-y-8">
          <BackLink
            href={`https://www.moneyhelper.org.uk/${lang}/everyday-money/insurance/travel-insurance-directory`}
          >
            {page.singles.back(z)}
          </BackLink>
          <Heading level="h1" className="text-blue-700">
            {page.heading(z)}
          </Heading>
          <Paragraph className="text-lg">
            <strong>{page.intro.lead(z)}</strong>
            {' - '}
            {page.intro.body(z)}
          </Paragraph>
          <div>
            <Button as={'a'} href={`${lang}/listings`}>
              {page.buttonLabel(z)}
            </Button>
          </div>
          <div>
            <Link href={`/register`}>{page.registerLink(z)}</Link>{' '}
            {page.singles.or(z)}{' '}
            <Link href={`${lang}/login`}>{page.loginLink(z)}</Link>{' '}
            {page.singles.asFirm(z)}
          </div>
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
