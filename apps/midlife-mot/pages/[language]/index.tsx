import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

import MidLifeMotLanding from './mid-life-mot-landing';

type Props = {
  children: JSX.Element;
  step: string | number;
  isEmbed: boolean;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};
export const pageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: t({
      en: 'Age question',
      cy: 'Cwestiwn oedran',
    }),
    2: t({
      en: 'Location question',
      cy: 'Cwestiwn lleoliad',
    }),
    3: t({
      en: 'Bills and current repayments question',
      cy: 'Cwestiwn ynghylch biliau ac ad-daliadau presenno',
    }),
    4: t({
      en: 'Approach to budgeting question',
      cy: 'Cwestiwn dull cyllidebu',
    }),
    5: t({
      en: 'Maximising your income question',
      cy: 'Cwestiwn cynyddu eich incwm',
    }),
    6: t({
      en: 'Reducing household bills question',
      cy: 'Cwestiwn lleihau biliau cartref',
    }),
    7: t({ en: 'Estate planning question', cy: 'Cwestiwn cynllunio ystad' }),
    8: t({ en: 'Emergency savings question', cy: 'Cwestiwn cynilion brys' }),
    9: t({ en: 'Income protection question', cy: 'Cwestiwn diogelu incwm' }),
    10: t({
      en: 'Unexpected costs question',
      cy: 'Cwestiwn costau annisgwyl',
    }),
    11: t({ en: 'Pension type question', cy: 'Cwestiwn math o bensiwn' }),
    12: t({
      en: 'Workplace pension type question',
      cy: 'Cwestiwn math o bensiwn gweithle',
    }),
    13: t({
      en: 'Pension management question',
      cy: 'Cwestiwn rheoli pensiwn',
    }),
    14: t({
      en: 'Retirement planning question',
      cy: 'Cwestiwn cynllunio ymddeoliad',
    }),
    15: t({ en: 'Your home question', cy: 'Cwestiwn eich cartref' }),
    16: t({ en: 'Savings goals question', cy: 'Cwestiwn nodau cynilo' }),
    17: t({
      en: 'Non-emergency savings question',
      cy: 'Cwestiwn cynilion nad ydynt yn rhai brys',
    }),
    18: t({
      en: 'Keeping your money safe question',
      cy: "Cwestiwn cadw'ch arian yn ddiogel",
    }),
    change: t({
      en: 'Check your answers',
      cy: 'Edrychwch dros eich atebion',
    }),
    summary: t({
      en: 'Summary',
      cy: 'Crynodeb',
    }),
    result: t({
      en: 'Personalised report',
      cy: 'Adroddiad personol',
    }),
    error: t({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    }),
    landing: t({
      en: 'Money Midlife MOT',
      cy: 'MOT Canol Oes Arian',
    }),
  };
};

export const MidLifeMot = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();
  const pageTitle = pageTitles(z)[step];

  const title = z({
    en: 'Money Midlife MOT',
    cy: 'MOT Canol Oes Arian',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      titleTag={step === 'landing' ? 'default' : 'span'}
    >
      {children}
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => {
  return (
    <MidLifeMot step={'landing'} isEmbed={isEmbed}>
      <MidLifeMotLanding isEmbed={isEmbed} lang={lang} />
    </MidLifeMot>
  );
};

export default Landing;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = '/';
  const filter = pageFilter(query, urlPath, isEmbed);
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = getToolLinks(saveddata, filter, currentStep, true);

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      lang,
      links,
      isEmbed,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    publicRuntimeConfig: { ENVIRONMENT },
  } = getConfig();

  if (ENVIRONMENT === 'production') {
    return {
      redirect: {
        destination: 'question-1',
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};
