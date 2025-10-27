import { GetServerSideProps } from 'next';

import { PensionPotGuaranteedIncomeResults } from 'components/PensionPotGuaranteedIncomeResults/PensionPotGuaranteedIncomeResults';
import { guaranteedIncomeEstimatorAnalytics } from 'data/analytics/guaranteed-income-estimator';
import { guaranteedIncomeEstimatorQuestions } from 'data/form-content/questions';
import { guaranteedIncomeEstimatorText } from 'data/form-content/text/guaranteedIncomeEstimator';

import { Level } from '@maps-react/common/components/Heading';
import { ErrorObject } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionPotCalculator } from '@maps-react/pension-tools/components/PensionPotCalculator/PensionPotCaclulator';
import { getErrorRequiredOrInvalid } from '@maps-react/pension-tools/utils/getErrorRequiredOrInvalid';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
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
  const { z: enTranslation } = useTranslation('en');

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

  const content = guaranteedIncomeEstimatorText(z);

  const children = (
    <PensionPotCalculator
      action="guaranteed-income-estimator#results"
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...guaranteedIncomeEstimatorAnalytics,
        pageTitle: page.title,
      }}
      fields={guaranteedIncomeEstimatorQuestions(z)}
      fieldsEn={guaranteedIncomeEstimatorQuestions(enTranslation)}
      data={content}
      results={PensionPotGuaranteedIncomeResults}
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

type GuaranteedIncomeEstimatorInputs = {
  pot: string;
  age: string;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isEmbed = !!query?.isEmbedded;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const errors = (): ErrorObject => {
    const pot = getValue(query['pot']);
    const age = getValue(query['age']);
    const errors = getErrorRequiredOrInvalid({
      pot: pot,
      age: age,
    } as GuaranteedIncomeEstimatorInputs);

    if ((age && Number(age) < 55) || Number(age) > 75) {
      errors.age = {
        field: 'age',
        type: 'max',
      };
    }
    return errors;
  };

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors(),
      queryData: query,
    },
  };
};
