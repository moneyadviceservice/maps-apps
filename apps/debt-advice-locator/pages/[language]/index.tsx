import { GetServerSideProps } from 'next';

import { getPageTitle } from 'data/pageTitles';
import { ParsedUrlQuery } from 'querystring';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

type Props = {
  children: JSX.Element;
  step: number | string;
  isEmbed: boolean;
};

export type DebtAdviceLocatorIndex =
  | 1
  | 2
  | 3
  | 4
  | 'business'
  | 'face'
  | 'online'
  | 'telephone';

export const DebtAdviceLocator = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const pageStepTitle = getPageTitle(z)[step];

  const title = z({
    en: 'Find free debt advice',
    cy: 'Dod o hyd i gyngor ar ddyledion am ddim',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>
      <div className="pb-4 t-cls-heading">{children}</div>
    </EmbedPageLayout>
  ) : (
    <ToolPageLayout
      pageTitle={`${title} - ${pageStepTitle}`}
      title={title}
      headingLevel={'h4'}
      noMargin={true}
      mainClassName="my-8"
      className="pt-8 pb-0 mb-4"
    >
      {children}
    </ToolPageLayout>
  );
};

export default DebtAdviceLocator;

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
  const filter = pageFilter(
    query,
    '/',
    isEmbed,
    `https://www.moneyhelper.org.uk/${lang}/money-troubles/dealing-with-debt/debt-advice-locator`,
  );
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
