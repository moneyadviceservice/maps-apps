import { ReactNode } from 'react';

import { GetServerSideProps } from 'next';

import { RetirementGuidanceIndex } from 'lib/types';
import { BETA_FEEDBACK_LINKS } from 'lib/constants';
import { getSingleQueryParam } from 'lib/util';
import { IncomingMessage } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';

import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

type Props = {
  children: ReactNode;
  step: RetirementGuidanceIndex;
  isEmbed: boolean;
};

export const RetirementGuidance = ({ children, step, isEmbed }: Props) => {
  const { t, locale } = useTranslation();

  return isEmbed ? (
    <EmbedPageLayout title={t('heading')}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={t('heading')}
      titleTag={'span'}
      headingLevel={'h4'}
      noMargin={true}
      mainClassName="my-8"
      className="pt-8 pb-0 mb-4"
      layout="grid"
      phase={PhaseType.BETA}
      phaseFeedbackLink={
        locale === 'cy' ? BETA_FEEDBACK_LINKS.cy : BETA_FEEDBACK_LINKS.en
      }
    >
      {children}
    </ToolPageLayout>
  );
};

export default RetirementGuidance;

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
  const { isEmbedded } = query;
  const isEmbed = isEmbedded === 'true';

  const lang = params?.language;
  const urlPath = '/';
  const filter = pageFilter(query, urlPath, isEmbed);
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = getSingleQueryParam(query.question);
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = getToolLinks(saveddata, filter, currentStep);

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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.params?.language || 'en';

  return {
    redirect: {
      destination: `/${lang}/landing`,
      permanent: true,
    },
  };
};
