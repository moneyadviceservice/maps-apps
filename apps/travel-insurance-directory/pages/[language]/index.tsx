import { GetServerSideProps } from 'next';

import { AnalyticsWrapper } from 'components/Analytics/AnalyticsWrapper';
import { SafeLink } from 'components/SafeLink';
import { page } from 'data/pages/landing';
import { appTitle } from 'utils/helper/core/appTitle';
import { pageTitle } from 'utils/helper/core/pageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { TravelInsuranceDirectoryPageLayout } from 'layouts/TravelInsuranceDirectoryPageLayout';

type BaseProps = {
  lang: 'en' | 'cy';
  hiddenRoutes: string[];
};

const Page = ({ lang, hiddenRoutes }: BaseProps) => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <AnalyticsWrapper variant="viewFirms" currentStep={1}>
      <TravelInsuranceDirectoryPageLayout
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
              <SafeLink
                href={`/register`}
                hiddenRoutes={hiddenRoutes}
                fallbackHref="https://radsignup.moneyhelper.org.uk/travel_insurance_registrations/new"
                withTextAfter={`${page.singles.or(z)} `}
              >
                {page.registerLink(z)}
              </SafeLink>
              <SafeLink
                href={`/account/login`}
                hiddenRoutes={hiddenRoutes}
                fallbackHref="https://radsignup.moneyhelper.org.uk/users/sign_in"
                withTextAfter={page.singles.asFirm(z)}
              >
                {page.loginLink(z)}
              </SafeLink>
            </div>
          </div>
        </Container>
      </TravelInsuranceDirectoryPageLayout>
    </AnalyticsWrapper>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const hiddenRoutes =
    process.env.HIDDEN_ROUTES?.split(',')
      ?.map((route) => route.trim())
      .filter((route) => route.length) || [];

  return {
    props: {
      lang: lang === 'cy' ? 'cy' : 'en',
      hiddenRoutes,
    },
  };
};
