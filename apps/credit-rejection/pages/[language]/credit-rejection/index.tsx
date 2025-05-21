import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

import { DATA_PATH } from 'CONSTANTS';

import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

type Props = {
  children: JSX.Element;
  step: string | number;
  isEmbed: boolean;
};

export const pageTitles = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    1: t({
      en: 'Were you declined credit question',
      cy: 'Cwestiwn cael eich gwrthod am gredyd',
    }),
    2: t({
      en: 'Credit report for errors question',
      cy: 'Cwestiwn gwallau adroddiad credyd',
    }),
    3: t({
      en: 'Accounts in your name question',
      cy: 'Cwestiwn cyfrifon yn eich enw',
    }),
    4: t({
      en: 'Accounts with old details question',
      cy: 'Cwestiwn cyfrifon gyda hen fanylion',
    }),
    5: t({
      en: 'Paying back borrowing question',
      cy: 'Cwestiwn ad-dalu benthyciadau',
    }),
    6: t({
      en: 'Pay your bills on time question',
      cy: 'Cwestiwn talu eich biliau ar amser',
    }),
    7: t({
      en: 'Registered to vote question',
      cy: 'Cwestiwn cofrestru i bleidleisio',
    }),
    8: t({
      en: 'Joint finances question',
      cy: 'Cwestiwn cyllid ar y cyd',
    }),
    change: t({
      en: 'Check your answers',
      cy: 'Edrychwch dros eich atebion',
    }),
    result: t({
      en: 'Personalised action plan',
      cy: 'Cynllun gweithredu personol',
    }),
    error: t({
      en: 'Error, please review your answer',
      cy: 'Gwall, adolygwch eich ateb',
    }),
    landing: t({
      en: "What to do when you've been refused credit",
      cy: "Beth i'w wneud os ydych wedi cael eich gwrthod am gredyd",
    }),
  };
};

export const CreditRejection = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();
  const pageTitle = pageTitles(z)[step];
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
      noMargin={true}
      headingLevel={step === 'landing' ? 'h1' : 'h4'}
    >
      {children}
    </ToolPageLayout>
  );
};

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = `/${DATA_PATH}/`;
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
    return {
      redirect: {
        destination: 'credit-rejection/question-1',
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};

export default CreditRejection;
