import { GetServerSideProps } from 'next';

import { FrequencyType } from 'components/ResultsTable/ResultsTable';
import { SalaryCalculator } from 'components/SalaryCalculator/SalaryCalculator';
import { StudentLoans } from 'types';
import { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { getPensionContribution } from 'utils/helpers/getPensionContribution';
import { getSalaryTrackingData } from 'utils/helpers/getSalaryTrackingData';
import { getTaxCodeAndScottishStatus } from 'utils/helpers/getTaxCodeAndScottishStatus';
import { Country } from 'utils/rates';
import { FieldError } from 'utils/validation';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type SalaryData = {
  grossIncome: string;
  grossIncomeFrequency: PayFrequency;
  hoursPerWeek: string;
  daysPerWeek: string;
  taxCode: string;
  isScottishResident: boolean;
  country: Country;
  pensionType: PensionContributionType;
  pensionValue: number;
  studentLoans: StudentLoans;
  isBlindPerson: boolean | null;
  isOverStatePensionAge: boolean | null;
  calculated: boolean;
};

type Props = {
  calculationType: 'single' | 'joint';
  salary1: SalaryData;
  salary2?: SalaryData | null;
  errors?: string | null;
  isEmbed?: boolean;
  resultsFrequency: FrequencyType;
  recalculated?: boolean;
};

export const SalaryCalculatorPage = ({
  calculationType,
  salary1,
  salary2,
  errors,
  isEmbed,
  resultsFrequency,
  recalculated,
}: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();
  const title = z({ en: 'Salary calculator', cy: 'Cyfrifiannell cyflog' });

  const hasResults =
    salary1.calculated || (calculationType === 'joint' && salary2?.calculated);

  const trackingData = getSalaryTrackingData({
    salary1,
    salary2,
    calculationType,
    hasResults: !!hasResults,
    recalculated,
    title,
  });

  addPage([{ ...trackingData, event: 'pageLoadReact' }]);

  const children = (
    <SalaryCalculator
      calculationType={calculationType}
      salary1={salary1}
      salary2={salary2 ?? undefined}
      errors={errors}
      isEmbed={isEmbed}
      resultsFrequency={resultsFrequency}
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={[]}
      titleTag="span"
      layout="grid"
      noMargin={true}
    >
      {children}
    </ToolPageLayout>
  );
};

export default SalaryCalculatorPage;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context;

  // Parse calculationType from query params
  const calculationType =
    query['calculationType'] === 'joint' ? 'joint' : 'single';

  // Parse errors
  const parseQueryErrors = (key: string) => {
    if (!(key in query)) return [];

    try {
      return JSON.parse(String(query[key])) as FieldError[];
    } catch (e) {
      console.warn(`Failed to parse ${key}`, e);
      return [];
    }
  };

  const salary1Errors = parseQueryErrors('errors');
  const salary2Errors = parseQueryErrors('salary2_errors');

  const errors =
    salary1Errors.length || salary2Errors.length
      ? JSON.stringify([...salary1Errors, ...salary2Errors])
      : null;

  const isEmbed = query['isEmbedded'] === 'true';

  const recalculated = query['recalculated'] === 'true';

  // Reusable helper to parse salary data with optional prefix
  const parseSalaryData = (prefix = ''): SalaryData => {
    const prefixKey = (key: string) => (prefix ? `${prefix}${key}` : key);

    const grossIncome = query[prefixKey('grossIncome')]
      ? String(query[prefixKey('grossIncome')]).replaceAll(',', '')
      : '';

    const grossIncomeFrequency =
      query[prefixKey('grossIncomeFrequency')] ?? 'annual';

    const hoursPerWeek = String(query[prefixKey('hoursPerWeek')] ?? '');
    const daysPerWeek = String(query[prefixKey('daysPerWeek')] ?? '');

    const rawTaxCode =
      typeof query[prefixKey('taxCode')] === 'string'
        ? String(query[prefixKey('taxCode')]).trim()
        : '';

    const isScottishResidentInput =
      query[prefixKey('isScottishResident')] === 'true';

    const isBlindPerson =
      typeof query[prefixKey('isBlindPerson')] === 'string'
        ? query[prefixKey('isBlindPerson')] === 'true'
        : null;

    const isOverStatePensionAge =
      typeof query[prefixKey('isOverStatePensionAge')] === 'string'
        ? query[prefixKey('isOverStatePensionAge')] === 'true'
        : null;

    // Business logic helpers
    const { taxCode, isScottishTaxCode, isScottishResident } =
      getTaxCodeAndScottishStatus(rawTaxCode, isScottishResidentInput);

    const country: Country =
      isScottishTaxCode || isScottishResident ? 'Scotland' : 'England/NI/Wales';

    const calculated =
      !errors &&
      typeof query[prefixKey('grossIncome')] === 'string' &&
      String(query[prefixKey('grossIncome')]).trim() !== '';

    // Create prefixed query subset for getPensionContribution
    const prefixedQuery = prefix
      ? Object.fromEntries(
          Object.entries(query)
            .filter(([key]) => key.startsWith(prefix))
            .map(([key, value]) => [key.replace(prefix, ''), value]),
        )
      : query;

    const { pensionType, pensionValue } = getPensionContribution(prefixedQuery);

    const studentLoans: StudentLoans = {
      plan1: query[prefixKey('plan1')] === 'true',
      plan2: query[prefixKey('plan2')] === 'true',
      plan4: query[prefixKey('plan4')] === 'true',
      plan5: query[prefixKey('plan5')] === 'true',
      planPostGrad: query[prefixKey('planPostGrad')] === 'true',
    };

    return {
      grossIncome,
      grossIncomeFrequency: grossIncomeFrequency as PayFrequency,
      hoursPerWeek,
      daysPerWeek,
      taxCode,
      country,
      isScottishResident,
      pensionType,
      pensionValue: pensionValue ?? 0,
      studentLoans,
      isBlindPerson,
      isOverStatePensionAge,
      calculated,
    };
  };

  // Parse salary1 (no prefix)
  const salary1 = parseSalaryData('');

  // Parse salary2 (with 'salary2_' prefix) - preserve it even in single mode for mode switching
  const hasSalary2Data = query['salary2_grossIncome'] !== undefined;
  const salary2 = hasSalary2Data ? parseSalaryData('salary2_') : null;

  const resultsFrequency =
    typeof query.resultsFrequency === 'string'
      ? (query.resultsFrequency as FrequencyType)
      : 'monthly';

  return {
    props: {
      calculationType,
      salary1,
      salary2,
      errors,
      isEmbed,
      resultsFrequency,
      recalculated,
    },
  };
};
