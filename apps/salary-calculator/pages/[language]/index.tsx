import { GetServerSideProps } from 'next';

import { SalaryCalculator } from 'components/SalaryCalculator/SalaryCalculator';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';

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
  isBlindPerson: boolean;
  calculated?: boolean;
};

export const SalaryCalculatorPage = ({
  grossIncome,
  grossIncomeFrequency,
  hoursPerWeek,
  daysPerWeek,
  taxCode,
  isScottishResident,
  isBlindPerson,
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

  // Example user input (these will later come from query params / props)
  const taxYear = '2025/26';
  const country = isScottishResident ? 'Scotland' : 'England/NI/Wales';
  const pensionType: 'percentage' | 'fixed' = 'fixed';
  const pensionValue = 0; // can be percentage or fixed amount based on pensionType
  const isOverStatePensionAge = false;

  const children = (
    <SalaryCalculator
      grossIncome={grossIncome}
      grossIncomeFrequency={grossIncomeFrequency}
      hoursPerWeek={hoursPerWeek}
      daysPerWeek={daysPerWeek}
      isScottishResident={isScottishResident}
      taxCode={taxCode}
      isBlindPerson={isBlindPerson}
      pensionType={pensionType}
      pensionValue={pensionValue}
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

  const grossIncome = query['grossIncome']
    ? String(query['grossIncome']).replaceAll(',', '')
    : '';
  const grossIncomeFrequency = query['grossIncomeFrequency'] ?? 'annual'; // default to "annual"
  const hoursPerWeek = String(query['hoursPerWeek'] ?? '');
  const daysPerWeek = String(query['daysPerWeek'] ?? '5'); // default to 5 days per week
  const formSubmitted = Object.keys(query).length > 0;
  // taxcode field blank on pageLoad and populated once form submitted, will validate later
  const taxCode =
    typeof query['taxCode'] === 'string'
      ? query['taxCode'].trim() || (formSubmitted ? '1257L' : '')
      : '';

  const isScottishResident = Boolean(query['isScottishResident'] ?? false); // default to false
  const isBlindPerson = Boolean(query['isBlindPerson'] ?? false); // default to false

  const calculated =
    typeof query['grossIncome'] === 'string' &&
    query['grossIncome'].trim() !== '';

  return {
    props: {
      grossIncome,
      grossIncomeFrequency,
      hoursPerWeek,
      daysPerWeek,
      taxCode,
      isScottishResident,
      isBlindPerson,
      calculated,
    },
  };
};
