import { GetServerSideProps } from 'next';

import { getErrors } from 'utils/getErrors';

import { Level } from '@maps-react/common/components/Heading';
import { ErrorObject } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionPotCalculator } from '@maps-react/pension-tools/components/PensionPotCalculator/PensionPotCaclulator';
import { queryStringFormat } from '@maps-react/pension-tools/utils/formatQuery';
import { getErrorRequiredOrInvalid } from '@maps-react/pension-tools/utils/getErrorRequiredOrInvalid';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { AdjustableIncomeResults } from '../../components/AdjustableIncomeResults';
import {
  getAdjustableIncomeContent,
  getAjustableIncomeText,
} from '../../data/adjustableIncomeText';
import { adjustableIncomeCalculatorAnalytics } from '../../data/analytics';

type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
};

export const AdjustableIncomeCalculator = ({
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

  const { z: enTranslation } = useTranslation('en');

  const children = (
    <PensionPotCalculator
      action="adjustable-income-calculator#results"
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...adjustableIncomeCalculatorAnalytics,
        pageTitle: page.title,
      }}
      data={getAjustableIncomeText(z)}
      fields={getAdjustableIncomeContent(z)}
      fieldsEn={getAdjustableIncomeContent(enTranslation)}
      updateInputs={['updateMonth']}
      results={AdjustableIncomeResults}
      handleErrors={getErrors}
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

export default AdjustableIncomeCalculator;

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
        }/adjustable-income-calculator?${queryStringFormat(
          query as Record<string, string>,
        )}`,
        permanent: false,
      },
    };
  }

  const values = {
    pot: getValue(query['pot']),
    age: getValue(query['age']),
  };

  let errors = getErrorRequiredOrInvalid(values);

  errors = getErrors(errors, values);

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
