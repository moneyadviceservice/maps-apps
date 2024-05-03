import getConfig from 'next/config';
import LandingPage from './landing';
import { pageTitles, landingText } from 'data/pension-type';
import {
  EmbedPageLayout,
  ToolPageLayout,
  Container,
} from '@maps-digital/shared/ui';
import { PensionTypeBottomContent } from 'layouts/PensionTypeBottomContent';
import { useTranslation } from '@maps-digital/shared/hooks';
import { GetServerSideProps } from 'next';
import { pageFilter } from 'utils/pageFilter';
import { DataPath } from 'types';
import { getToolPath } from 'utils/getToolPath';
import { getToolLinks } from 'utils/getToolLinks';

type Props = {
  children: JSX.Element;
  step: string | number;
  isEmbed: boolean;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const PensionType = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const pageTitle = pageTitles(z)[step];
  const title = landingText(z).pageHeading;

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      breadcrumbs={[]}
      headingLevel={step === 'landing' ? 'h1' : 'h4'}
      noMargin={true}
    >
      {children}
      <Container>
        <PensionTypeBottomContent />
      </Container>
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <PensionType step={'landing'} isEmbed={isEmbed}>
    <LandingPage lang={lang} isEmbed={isEmbed} />
  </PensionType>
);

export default Landing;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = getToolPath(DataPath.PensionType);
  const filter = pageFilter(query, urlPath, isEmbed);
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = getToolLinks(saveddata, filter, currentStep, false);

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      dataPath: DataPath.PensionType,
      lang: lang,
      links: links,
      isEmbed: isEmbed,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    publicRuntimeConfig: { ENVIRONMENT },
  } = getConfig();

  if (ENVIRONMENT === 'production') {
    const lang = context.params?.language || 'en';
    return {
      redirect: {
        destination: `https://www.moneyhelper.org.uk/${lang}/pensions-and-retirement/pension-wise/find-out-your-pension-type`,
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};
