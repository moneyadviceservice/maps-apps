import { GetServerSideProps } from 'next';

import { SalaryCalculator } from 'components/SalaryCalculator/SalaryCalculator';
import { StudentLoans } from 'types';
import { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { getPensionContribution } from 'utils/helpers/getPensionContribution';
import { getTaxCodeAndScottishStatus } from 'utils/helpers/getTaxCodeAndScottishStatus';
import { Country } from 'utils/rates';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
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
  isBlindPerson: boolean;
  isOverStatePensionAge: boolean;
  calculated?: boolean;
};

export const SalaryCalculatorPage = ({
  grossIncome,
  grossIncomeFrequency,
  hoursPerWeek,
  daysPerWeek,
  taxCode,
  isScottishResident,
  country,
  pensionType,
  pensionValue,
  studentLoans,
  isBlindPerson,
  isOverStatePensionAge,
  calculated,
}: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();
  const title = z({ en: 'Salary calculator', cy: 'Cyfrifiannell cyflog' });

  const initialPageData = {
    page: {
      pageName: 'salary-calculator',
      pageTitle: title,
    },
    tool: {
      toolName: 'Salary Calculator',
      toolStep: 1,
      stepName: 'Calculate',
    },
  };

  addPage([{ ...initialPageData, event: 'pageLoadReact' }]);

  const taxYear = '2025/26';

  const children = (
    <SalaryCalculator
      grossIncome={grossIncome}
      grossIncomeFrequency={grossIncomeFrequency}
      hoursPerWeek={hoursPerWeek}
      daysPerWeek={daysPerWeek}
      isScottishResident={isScottishResident}
      pensionType={pensionType}
      pensionValue={pensionValue}
      taxCode={taxCode}
      studentLoans={studentLoans}
      isBlindPerson={isBlindPerson}
      country={country}
      taxYear={taxYear}
      isOverStatePensionAge={isOverStatePensionAge}
      calculated={calculated}
    />
  );

  return (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={[]}
      titleTag="span"
      layout="grid"
    >
      {children}
    </ToolPageLayout>
  );
};

export default SalaryCalculatorPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  // Parse query params
  const grossIncome = query['grossIncome']
    ? String(query['grossIncome']).replaceAll(',', '')
    : '';
  const grossIncomeFrequency = query['grossIncomeFrequency'] ?? 'annual';
  const hoursPerWeek = String(query['hoursPerWeek'] ?? '');
  const daysPerWeek = String(query['daysPerWeek'] ?? '5');
  const formSubmitted = Object.keys(query).length > 0;
  const rawTaxCode =
    typeof query['taxCode'] === 'string'
      ? query['taxCode'].trim() || (formSubmitted ? '1257L' : '')
      : '';
  const isScottishResidentInput = Boolean(query['isScottishResident'] ?? false);

  const isBlindPerson =
    typeof query['isBlindPerson'] === 'string'
      ? query['isBlindPerson'] === 'true'
      : null;

  const isOverStatePensionAge =
    typeof query['isOverStatePensionAge'] === 'string'
      ? query['isOverStatePensionAge'] === 'true'
      : null;

  // Business logic helpers
  const { taxCode, isScottishTaxCode, isScottishResident } =
    getTaxCodeAndScottishStatus(rawTaxCode, isScottishResidentInput);

  const country =
    isScottishTaxCode || isScottishResident ? 'Scotland' : 'England/NI/Wales';

  const calculated =
    typeof query['grossIncome'] === 'string' &&
    query['grossIncome'].trim() !== '';

  const { pensionType, pensionValue } = getPensionContribution(query);

  const studentLoans = Object.fromEntries(
    Object.entries(query)
      .filter(([key]) => key.startsWith('plan'))
      .map(([key, value]) => [key, value === 'true']),
  );

  return {
    props: {
      grossIncome,
      grossIncomeFrequency,
      hoursPerWeek,
      daysPerWeek,
      taxCode,
      country,
      isScottishResident,
      pensionType,
      pensionValue,
      studentLoans,
      isBlindPerson,
      isOverStatePensionAge,
      calculated,
    },
  };
};
