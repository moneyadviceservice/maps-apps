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
import { guaranteedIncomeEstimatorAnalytics } from 'data/form-content/analytics/guaranteed-income-estimator';
type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
};

export const GuaranteedIncomeEstimator = ({
  isEmbed,
  errors,
  headingLevel,
  queryData,
}: Props) => {
  const { z } = useTranslation();

  const page = {
    title: z({
      en: 'Get a guaranteed income (annuity) | Pension Wise',
      cy: 'Cael incwm gwarantedig (blwydd-dal) | Pension Wise',
    }),
    description: z({
      en: 'Read an overview of the different types of annuity to ensure you make the right choice and include the right options in the annuity for your circumstances.',
      cy: 'Darllenwch drosolwg o&#39;r gwahanol fathau o flwydd-dal i sicrhau eich bod yn gwneud y dewis cywir a chynnwys yr opsiynau cywir yn y blwydd-dal ar gyfer eich amgylchiadau.',
    }),
  };

  const children = (
    <PensionPotCalculator
      action="guaranteed-income-estimator#results"
      dataPath={DataPath.GuaranteedIncomeEstimator}
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...guaranteedIncomeEstimatorAnalytics,
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

export default GuaranteedIncomeEstimator;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isEmbed = !!query?.isEmbedded;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const errors = pensionPotValidateInputs({
    inputs: {
      pot: getValue(query['pot']),
      age: getValue(query['age']),
    },
    dataPath: DataPath.GuaranteedIncomeEstimator,
  });

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
