import { GetServerSideProps } from 'next';
import {
  PensionPotCalculator,
  ErrorObject,
} from 'components/PensionPotCalculator/PensionPotCalculator';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { pensionPotValidateInputs } from 'utils/PensionPotCalculator/pensionPotValidationInputs';
import { queryStringFormat } from 'pages/api/pensions-calculator';
import { adjustableIncomeCalculatorAnalytics } from 'data/form-content/analytics/adjustable-income-calculator';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Level } from '@maps-digital/shared/ui';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { DataPath } from 'types';

type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
};

export const AjustableIncomeEstimator = ({
  isEmbed,
  errors,
  headingLevel,
  queryData,
}: Props) => {
  const { z } = useTranslation();

  const page = {
    title: z({
      en: 'Get an adjustable income | Pension Wise',
      cy: 'Cael incwm addasadwy | Pension Wise',
    }),
    description: z({
      en: 'Pension Wise is a free and impartial government service that helps you understand the options for your pension pot. Get free pension guidance today.',
      cy: 'Mae Pension Wise yn wasanaeth llywodraeth diduedd am ddim sy’n helpu i chi ddeall yr opsiynau ar gyfer eich cronfa pensiwn. Cael arweiniad pensiwn am ddim heddiw.',
    }),
  };

  const children = (
    <PensionPotCalculator
      action="adjustable-income-estimator#results"
      dataPath={DataPath.AjustableIncomeEstimator}
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...adjustableIncomeCalculatorAnalytics,
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

export default AjustableIncomeEstimator;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isEmbed = !!query?.isEmbedded;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  if (getValue(query['updateMonth']) && getValue(query['submit'])) {
    delete query['updateMonth'];
    return {
      redirect: {
        destination: `/${
          query.language
        }/adjustable-income-estimator?${queryStringFormat(
          query as Record<string, string>,
        )}`,
        permanent: false,
      },
    };
  }
  const errors = pensionPotValidateInputs({
    inputs: {
      pot: getValue(query['pot']),
      age: getValue(query['age']),
    },
    dataPath: DataPath.AjustableIncomeEstimator,
  });

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
