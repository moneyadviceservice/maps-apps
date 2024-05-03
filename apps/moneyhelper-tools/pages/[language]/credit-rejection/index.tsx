import getConfig from 'next/config';
import CreditRejectionLanding from './credit-rejection-landing';
import { EmbedPageLayout, ToolPageLayout } from '@maps-digital/shared/ui';
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

export const CreditRejection = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const pageTitle = {
    1: z({
      en: 'Were you declined credit question',
      cy: 'Cwestiwn cael eich gwrthod am gredyd',
    }),
    2: z({
      en: 'Credit report for errors question',
      cy: 'Cwestiwn gwallau adroddiad credyd',
    }),
    3: z({
      en: 'Accounts in your name question',
      cy: 'Cwestiwn cyfrifon yn eich enw',
    }),
    4: z({
      en: 'Accounts with old details question',
      cy: 'Cwestiwn cyfrifon gyda hen fanylion',
    }),
    5: z({
      en: 'Paying back borrowing question',
      cy: 'Cwestiwn ad-dalu benthyciadau',
    }),
    6: z({
      en: 'Pay your bills on time question',
      cy: 'Cwestiwn talu eich biliau ar amser',
    }),
    7: z({
      en: 'Registered to vote question',
      cy: 'Cwestiwn cofrestru i bleidleisio',
    }),
    8: z({ en: 'Joint finances question', cy: 'Cwestiwn cyllid ar y cyd' }),
    change: z({
      en: 'Check your answers',
      cy: 'Edrychwch dros eich atebion',
    }),
    result: z({
      en: 'Personalised action plan',
      cy: 'Cynllun gweithredu personol',
    }),
    error: z({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    }),
    landing: z({
      en: "What to do when you've been refused credit",
      cy: "Beth i'w wneud os ydych wedi cael eich gwrthod am gredyd",
    }),
  }[step];

  const title = z({
    en: "What to do when you've been refused credit",
    cy: "Beth i'w wneud os ydych wedi cael eich gwrthod am gredyd",
  });

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
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <CreditRejection step={'landing'} isEmbed={isEmbed}>
    <CreditRejectionLanding lang={lang} isEmbed={isEmbed} />
  </CreditRejection>
);

export default Landing;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = getToolPath(DataPath.CreditRejection);
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
      dataPath: DataPath.CreditRejection,
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
    const isEmbed = !!context.query?.isEmbedded;

    return {
      redirect: {
        destination: isEmbed
          ? 'credit-rejection/question-1'
          : `https://www.moneyhelper.org.uk/${lang}/everyday-money/credit/when-youve-been-refused-credit`,
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};