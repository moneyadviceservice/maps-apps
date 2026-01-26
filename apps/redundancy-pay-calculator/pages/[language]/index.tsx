import { GetServerSideProps } from 'next';

import { ParsedUrlQuery } from 'node:querystring';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

import { getPageTitle } from '../../data/pageTitles';

type Props = {
  children: JSX.Element;
  step: RedundancyPayCalculatorIndex;
  isEmbed: boolean;
};

export type RedundancyPayCalculatorIndex =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 'changeOptions'
  | 'results';

export const RedundancyPayCalculator = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const pageStepTitle = getPageTitle(z)[step];

  const title = z({
    en: 'Redundancy pay calculator',
    cy: 'Cyfrifiannell tâl dileu swydd',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      pageTitle={`${title} - ${pageStepTitle}`}
      title={title}
      titleTag={'span'}
      headingLevel={'h4'}
      noMargin={true}
      mainClassName="my-8"
      className="pt-8 pb-0 mb-4"
      layout="grid"
    >
      {children}
    </ToolPageLayout>
  );
};

export default RedundancyPayCalculator;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => getServerSidePropsData(params, query);

export async function getServerSidePropsData(
  params: ParsedUrlQuery | undefined,
  query: ParsedUrlQuery,
) {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const filter = pageFilter(query, '/', isEmbed);
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = getToolLinks(saveddata, filter, currentStep);

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      dataPath: '/',
      lang: lang,
      links: links,
      isEmbed: isEmbed,
    },
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.params?.language || 'en';

  return {
    redirect: {
      destination: `/${lang}/question-1`,
      permanent: true,
    },
  };
};
