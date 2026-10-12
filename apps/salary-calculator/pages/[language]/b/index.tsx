import { JSX } from 'react';

import { GetServerSideProps } from 'next';

import { IncomingMessage } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { pageFilter } from '@maps-react/utils/pageFilter';

export type SalaryCalculatorStep = 1;

type Props = {
  children: JSX.Element;
  step: SalaryCalculatorStep;
  isEmbed: boolean;
};

export const SalaryCalculator = ({ children, step, isEmbed }: Props) => {
  const { z } = useTranslation();

  const title = z({ en: 'Salary calculator', cy: 'Cyfrifiannell cyflog' });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      pageTitle={`${title} - ${'pageStepTitle'}`}
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

export default SalaryCalculator;

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
  const storedData = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );

  // Default to single calculation type
  if (!storedData['q-1']) {
    storedData['q-1'] = 'single';
  }

  return {
    props: {
      storedData,
      data: JSON.stringify(storedData) || '',
      currentStep: currentStep,
      dataPath: '/',
      lang: lang,
      isEmbed: isEmbed,
    },
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.params?.language || 'en';

  return {
    redirect: {
      destination: `/${lang}/b/question-1`,
      permanent: true,
    },
  };
};
