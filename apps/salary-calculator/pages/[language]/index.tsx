import { NumberFormatValues } from 'react-number-format';

import { GetServerSideProps } from 'next';

import { getSalaryBreakdown } from 'utils/calculations/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';

import { Button } from '@maps-react/common/components/Button';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { Select } from '@maps-react/form/components/Select';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  grossIncome: string;
  grossIncomeFrequency: PayFrequency;
  hoursPerWeek: string;
  daysPerWeek: string;
  isBlindPerson: boolean;
};

function displayAmount(title: string, amount: number) {
  return [
    `${title}: £`,
    amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  ].join('');
}

const SalaryCalculatorPage = ({
  grossIncome,
  grossIncomeFrequency,
  hoursPerWeek,
  daysPerWeek,
  isBlindPerson,
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
  const country = 'England/NI/Wales';
  const pensionType: 'percentage' | 'fixed' = 'fixed';
  const pensionValue = 0; // can be percentage or fixed amount based on pensionType
  const isOverStatePensionAge = false;

  const iDaysPerWeek = Number.parseInt(daysPerWeek);
  const iHoursPerWeek = Number.parseInt(hoursPerWeek);

  const {
    annualSalary,
    employeePensionContributions,
    incomeTax,
    nationalInsurance,
    netSalary,
  } = getSalaryBreakdown({
    amount: Number.parseFloat(grossIncome),
    frequency: grossIncomeFrequency ?? 'annual',
    daysPerWeek: iDaysPerWeek,
    hoursPerWeek: iHoursPerWeek,
    pensionType,
    pensionValue,
    country,
    taxYear,
    isOverStatePensionAge,
    isBlindPerson,
  });

  return (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={[]}
      titleTag="span"
      layout="grid"
    >
      <GridContainer>
        <div className="col-span-12 space-y-1 lg:col-span-10 xl:col-span-8">
          <form
            id="calculator"
            method="get"
            action="#calculate"
            className="lg:max-w-4xl mb-6"
          >
            <label
              className="block text-lg font-bold"
              htmlFor="inputGrossIncome"
            >
              Gross income
            </label>
            <p className="text-base">
              This is the amount your are paid before any deductions
            </p>
            <MoneyInput
              id="inputGrossIncome"
              name="grossIncome"
              aria-label="Gross income"
              placeholder=""
              defaultValue={grossIncome}
              inputClassName="w-full"
              containerClassName="mt-4"
            />
            <Select
              id="selectGrossIncomeFrequency"
              name="grossIncomeFrequency"
              options={[
                { text: 'Annual', value: 'annual' },
                { text: 'Monthly', value: 'monthly' },
                { text: 'Weekly', value: 'weekly' },
                { text: 'Daily', value: 'daily' },
                { text: 'Hourly', value: 'hourly' },
              ]}
              hideEmptyItem={true}
              defaultValue={grossIncomeFrequency}
              selectClassName="mt-4"
            />

            <label className="block text-base mt-6" htmlFor="inputHoursPerWeek">
              How many hours a week do you usually work?
            </label>
            <NumberInput
              id="inputHoursPerWeek"
              name="hoursPerWeek"
              placeholder="e.g. 40"
              aria-label="Hours per week"
              defaultValue={hoursPerWeek}
              min={1}
              max={168}
              isAllowed={({ floatValue, value }: NumberFormatValues) => {
                if (!floatValue) {
                  return true;
                }
                return (
                  floatValue === undefined ||
                  (value.length <= 3 && floatValue >= 0 && floatValue <= 168)
                );
              }}
              className="border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700"
            />

            <label className="block text-base mt-6" htmlFor="inputDaysPerWeek">
              How many days a week do you usually work?
            </label>
            <NumberInput
              id="inputDaysPerWeek"
              name="daysPerWeek"
              placeholder="e.g. 5"
              aria-label="Days per week"
              defaultValue={daysPerWeek}
              min={1}
              max={7}
              isAllowed={({ floatValue, value }: NumberFormatValues) => {
                if (!floatValue) {
                  return true;
                }
                return (
                  floatValue === undefined ||
                  (value.length <= 1 && floatValue >= 0 && floatValue <= 7)
                );
              }}
              className="border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700"
            />

            <Checkbox
              id="checkboxIsBlindPerson"
              name="isBlindPerson"
              value="true"
              defaultChecked={isBlindPerson}
              className="mt-6"
            >
              Is blind person?
            </Checkbox>

            <Button
              className="my-6"
              variant="primary"
              id="calculate"
              type="submit"
              name="calculate"
            >
              Calculate
            </Button>
          </form>

          <h1 className="text-lg font-bold">Example Calculation</h1>
          <p>Annual salary: £{annualSalary.toLocaleString()}</p>
          <p>Country: England</p>
          <p>Tax Code: 1257L</p>

          <h2 className="pt-4 font-bold">Annual Breakdown</h2>
          <p>{displayAmount('Income tax', incomeTax.yearly)}</p>
          <p>{displayAmount('National insurance', nationalInsurance.yearly)}</p>
          <p>
            {displayAmount(
              'Pension contributions',
              employeePensionContributions.yearly,
            )}
          </p>
          <p>{displayAmount('Net salary', netSalary.yearly)}</p>

          <h2 className="pt-4 font-bold">Monthly Breakdown</h2>
          <p>{displayAmount('Income tax', incomeTax.monthly)}</p>
          <p>
            {displayAmount('National insurance', nationalInsurance.monthly)}
          </p>
          <p>
            {displayAmount(
              'Pension contributions',
              employeePensionContributions.monthly,
            )}
          </p>
          <p>{displayAmount('Net salary', netSalary.monthly)}</p>

          <h2 className="pt-4 font-bold">Weekly Breakdown</h2>
          <p>{displayAmount('Income tax', incomeTax.weekly)}</p>
          <p>{displayAmount('National insurance', nationalInsurance.weekly)}</p>
          <p>
            {displayAmount(
              'Pension contributions',
              employeePensionContributions.weekly,
            )}
          </p>
          <p>{displayAmount('Net salary', netSalary.weekly)}</p>

          <h2 className="pt-4 font-bold">Daily Breakdown</h2>
          <p>{displayAmount('Income tax', incomeTax.daily)}</p>
          <p>{displayAmount('National insurance', nationalInsurance.daily)}</p>
          <p>
            {displayAmount(
              'Pension contributions',
              employeePensionContributions.daily,
            )}
          </p>
          <p>{displayAmount('Net salary', netSalary.daily)}</p>
        </div>
      </GridContainer>
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
  const isBlindPerson = Boolean(query['isBlindPerson'] ?? false); // default to false

  return {
    // Get user input values from query and perform calculations, and return props
    props: {
      grossIncome,
      grossIncomeFrequency,
      hoursPerWeek,
      daysPerWeek,
      isBlindPerson,
    },
  };
};
