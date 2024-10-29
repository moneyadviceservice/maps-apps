import { GetServerSideProps } from 'next';
import {
  PensionPotCalculator,
  ErrorObject,
} from 'components/PensionPotCalculator/PensionPotCalculator';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Level } from '@maps-digital/shared/ui';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { DataPath } from 'types';
import { pensionPotValidateInputs } from 'utils/PensionPotCalculator/pensionPotValidationInputs';
import { queryStringFormat } from 'pages/api/pensions-calculator';
import { cashInChunksAnalytics } from 'data/form-content/analytics/cic-calculator';

type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
  lang: string;
};

export const CashInChunks = ({
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

  const children = (
    <PensionPotCalculator
      action="cic-calculator#results"
      dataPath={DataPath.CashInChunksCalculator}
      lang={lang}
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...cashInChunksAnalytics,
        pageTitle: page.title,
      }}
    />
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
  const updatChunk = getValue(query['updateChunk']);

  const errors = pensionPotValidateInputs({
    inputs: {
      income: getValue(query['income']),
      pot: getValue(query['pot']),
      chunk: chunk,
      updateChunk: updatChunk,
    },
    dataPath: DataPath.CashInChunksCalculator,
  });

  if (updatChunk !== undefined && updatChunk !== chunk) {
    if (getValue(query['submit'])) {
      query['updateChunk'] = query['chunk'];
    }

    if (getValue(query['reSubmit'])) {
      query['chunk'] = query['updateChunk'];
    }

    return {
      redirect: {
        destination: `/${query.language}/cic-calculator?${queryStringFormat(
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
