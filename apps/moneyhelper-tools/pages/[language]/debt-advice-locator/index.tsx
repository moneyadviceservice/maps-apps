import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

import { getPageTitle } from 'data/debt-advice-locator/pageTitles';
import { DataPath } from 'types';
import { getToolLinks } from 'utils/getToolLinks';
import { getToolPath } from 'utils/getToolPath';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { pageFilter } from '@maps-react/utils/pageFilter';

type Props = {
  children: JSX.Element;
  step: number;
  isEmbed: boolean;
};

export const DebtAdviceLocator = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const pageStepTitle = getPageTitle(z)[step];

  const title = z({
    en: 'Find free debt advice',
    cy: 'Dod o hyd i gyngor ar ddyledion am ddim',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      pageTitle={`${title} - ${pageStepTitle}`}
      title={title}
      headingLevel={'h4'}
      noMargin={true}
      mainClassName="my-8"
      className="pb-0 pt-8 mb-4"
    >
      {children}
    </ToolPageLayout>
  );
};

export default DebtAdviceLocator;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = getToolPath(DataPath.DebtAdviceLocator);
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
      dataPath: DataPath.DebtAdviceLocator,
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
  const lang = context.params?.language || 'en';

  if (ENVIRONMENT === 'production') {
    return {
      redirect: {
        destination: `https://www.moneyhelper.org.uk/${lang}/money-troubles/dealing-with-debt/debt-advice-locator`,
        permanent: true,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/${lang}/tools-index`,
        permanent: true,
      },
    };
  }
};
