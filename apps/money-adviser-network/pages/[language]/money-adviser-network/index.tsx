import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { Button } from '@maps-react/common/components/Button';
import { Container } from '@maps-react/core/components/Container';
import { twMerge } from 'tailwind-merge';
import { pageTitles } from 'data/pageTitles';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { GetServerSideProps } from 'next';
import { pageFilter } from '@maps-react/utils/pageFilter';
import { generateToolLinks } from 'utils/generateToolLinks';
import { TOOL_PATH } from 'CONSTANTS';
import { H2, Paragraph } from '@maps-digital/shared/ui';
import { generatePageTitle } from 'utils/generatePageTitle';

type Props = {
  step: string | number;
  isEmbed?: boolean;
  children: JSX.Element;
};

export const MoneyAdviserNetwork = ({
  isEmbed,
  step,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const pageStepTitle = pageTitles(z)[step];
  const pageTitle = generatePageTitle(pageStepTitle, z);
  const title = z({
    en: 'Debt Advice Referral',
    cy: 'Atgyfeiriad am gyngor ar ddyledion',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      titleTag={step === 'landing' ? 'default' : 'span'}
      title={title}
      pageTitle={pageTitle}
      showContactUs={false}
    >
      {children}
    </ToolPageLayout>
  );
};

const LandingPage = () => (
  <MoneyAdviserNetwork step="landing">
    <Container className="pb-16">
      <div className={twMerge('lg:max-w-[840px] space-y-8')}>
        <H2>Money Adviser Network</H2>

        <Paragraph>Login form here...</Paragraph>
        <div className="space-y-4">
          <Button
            variant="primary"
            type="button"
            as="a"
            href={`${TOOL_PATH}/1`}
            data-testid="landing-page-button"
            data-cy="landing-page-button"
            className="w-full sm:w-auto"
          >
            Start tool
          </Button>
        </div>
      </div>
    </Container>
  </MoneyAdviserNetwork>
);

export default LandingPage;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  req,
  params,
  query,
}) => {
  const lang = params?.language;
  if (!req.cookies.accessToken) {
    return {
      redirect: {
        destination: `/${lang}`,
        permanent: false,
      },
    };
  }

  const isEmbed = !!query?.isEmbedded;
  const filter = pageFilter(query, `/${TOOL_PATH}/`, isEmbed, undefined, 'q');
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = generateToolLinks(saveddata, filter, currentStep, false);

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      lang: lang,
      links: links,
      isEmbed: isEmbed,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsDefault(context);
};
