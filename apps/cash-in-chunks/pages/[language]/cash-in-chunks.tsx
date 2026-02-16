import { useMemo } from 'react';

import { GetServerSideProps } from 'next';

import { CashInChunksResults } from 'components/CashInChunksResults/CashInChunksResults';
import { cashInChunksAnalytics } from 'data/analytics';
import { chunkInput, updateChunkInput } from 'data/formContent';
import { cashInChunksCalculatorErrors } from 'utils/cicInputValidation';

import { Level } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionPotCalculator } from '@maps-react/pension-tools/components/PensionPotCalculator/PensionPotCaclulator';
import { pensionToolsContent } from '@maps-react/pension-tools/data/pensionToolsContent';
import {
  incomeInput,
  potInput,
} from '@maps-react/pension-tools/data/pensionToolsFormContent';
import { ErrorObject } from '@maps-react/pension-tools/types';
import { queryStringFormat } from '@maps-react/pension-tools/utils/formatQuery';
import { getErrorRequiredOrInvalid } from '@maps-react/pension-tools/utils/getErrorRequiredOrInvalid';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type CashInChunksInputs = {
  income: string;
  pot: string;
  chunk: string;
  updateChunk: string;
};

type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
  lang: string;
};

const CashInChunks = ({
  isEmbed,
  lang,
  errors,
  headingLevel,
  queryData,
}: Props) => {
  const { z } = useTranslation();

  const page = {
    title: z({
      en: 'Take cash in chunks | Pension Wise',
      cy: 'Cymryd arian allan fesul tipyn | Pension Wise',
    }),
    description: z({
      en: 'You can leave money in your pension pot and take lump sums from it when you need to. Discover how this option works and the tax you will pay.',
      cy: 'Gallwch adael arian yn eich cronfa bensiwn a chymryd cyfandaliadau ohono pan fyddwch angen. Darganfyddwch sut mae&#39;r opsiwn hwn yn gweithio a&#39;r dreth y byddwch yn ei thalu.',
    }),
  };

  const questions = useMemo(
    () => [
      incomeInput(1, z),
      potInput(2, z),
      chunkInput(3, z),
      updateChunkInput(4, z),
    ],
    [z],
  );

  const { z: enTranslation } = useTranslation('en');

  const questionsEn = useMemo(() => {
    return [
      incomeInput(1, enTranslation),
      potInput(2, enTranslation),
      chunkInput(3, enTranslation),
      updateChunkInput(4, enTranslation),
    ];
  }, [enTranslation]);

  const children = (
    <PensionPotCalculator
      action="cash-in-chunks#results"
      lang={lang}
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...cashInChunksAnalytics,
        pageTitle: page.title,
      }}
      fields={questions}
      fieldsEn={questionsEn}
      data={pensionToolsContent(z)}
      results={CashInChunksResults}
      updateInputs={['updateChunk']}
    ></PensionPotCalculator>
  );

  return isEmbed ? (
    <EmbedPageLayout>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      className="lg:container-auto pt-4 pb-1.5 lg:max-w-[960px] hidden"
      headingClassName="lg:max-w-[960px]"
      title={page.title}
      showContactUs={true}
      headingLevel={headingLevel ?? 'h1'}
    >
      {children}
    </ToolPageLayout>
  );
};

export default CashInChunks;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isEmbed = !!query?.isEmbedded;
  const lang = query?.language;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const chunk = getValue(query['chunk']);
  const updateChunk = getValue(query['updateChunk']);
  const income = getValue(query['income']);
  const pot = getValue(query['pot']);

  const err = getErrorRequiredOrInvalid({
    income: income,
    pot: pot,
    chunk: chunk,
    updateChunk: updateChunk,
  } as CashInChunksInputs);

  const errors = cashInChunksCalculatorErrors(err, {
    income: income,
    pot: pot,
    chunk: chunk,
    updateChunk: updateChunk,
  });

  if (updateChunk !== undefined && updateChunk !== chunk) {
    if (getValue(query['submit'])) {
      query['updateChunk'] = query['chunk'];
    }

    if (getValue(query['reSubmit'])) {
      query['chunk'] = query['updateChunk'];
    }

    return {
      redirect: {
        destination: `/${query.language}/cash-in-chunks?${queryStringFormat(
          query as Record<string, string>,
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      lang: lang,
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
