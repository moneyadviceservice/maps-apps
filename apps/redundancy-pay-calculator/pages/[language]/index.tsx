import { GetServerSideProps } from 'next';

import { IncomingMessage } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';

import { EmergencyBanner } from '@maps-react/core/components/EmergencyBanner';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

import { getPageTitle } from '../../data/pageTitles';

type Props = {
  children: JSX.Element;
  step: RedundancyPayCalculatorIndex;
  isEmbed: boolean;
  emergencyBannerContent?: {
    en: string;
    cy: string;
  } | null;
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

export const RedundancyPayCalculator = ({
  children,
  step,
  isEmbed,
  emergencyBannerContent,
}: Props) => {
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
      topInfoSection={
        emergencyBannerContent && (
          <EmergencyBanner content={emergencyBannerContent} />
        )
      }
    >
      {children}
    </ToolPageLayout>
  );
};

export default RedundancyPayCalculator;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
  req,
}) => getServerSidePropsData(params, query, req);

export async function getServerSidePropsData(
  params: ParsedUrlQuery | undefined,
  query: ParsedUrlQuery,
  req: IncomingMessage,
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

  const appConfig = await getServerSideAppConfig(req);
  const emergencyBannerContent = parseEmergencyBanner(
    appConfig.getValue('emergency-banner'),
  );

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      dataPath: '/',
      lang: lang,
      links: links,
      isEmbed: isEmbed,
      emergencyBannerContent,
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
