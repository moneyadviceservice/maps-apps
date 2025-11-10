import { useState } from 'react';
import { NumberFormatValues } from 'react-number-format';

import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { Country } from 'utils/rates';
import { TaxYear } from 'utils/rates/types';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

import { SalaryCalculatorResults as Results } from '../Results/Results';

export type SalaryCalculatorProps = {
  grossIncome: string;
  grossIncomeFrequency: PayFrequency;
  hoursPerWeek: string;
  daysPerWeek: string;
  taxCode: string;
  isScottishResident: boolean;
  isBlindPerson: boolean;
  pensionType: PensionContributionType;
  pensionValue: number;
  country: Country;
  taxYear: TaxYear;
  isOverStatePensionAge: boolean;
  calculated?: boolean;
};

export const isHoursAllowed = ({ floatValue, value }: NumberFormatValues) => {
  if (!floatValue) {
    return true;
  }
  return (
    floatValue === undefined ||
    (value.length <= 3 && floatValue >= 0 && floatValue <= 168)
  );
};

export const isDaysAllowed = ({ floatValue, value }: NumberFormatValues) => {
  if (!floatValue) {
    return true;
  }
  return (
    floatValue === undefined ||
    (value.length <= 1 && floatValue >= 0 && floatValue <= 7)
  );
};

export const SalaryCalculator = ({
  grossIncome,
  grossIncomeFrequency,
  hoursPerWeek,
  daysPerWeek,
  taxCode,
  isScottishResident,
  isBlindPerson,
  pensionType,
  pensionValue,
  country,
  taxYear,
  isOverStatePensionAge,
  calculated,
}: SalaryCalculatorProps) => {
  const { z, locale } = useTranslation();

  const [frequency, setFrequency] = useState(grossIncomeFrequency);

  return (
    <div>
      {' '}
      <GridContainer>
        <div className="col-span-12 mb-8">
          <div className="flex items-center pb-3 mt-1 text-magenta-500 group">
            <BackLink
              href={`https://www.moneyhelper.org.uk/${locale}/work/employment/salary-calculator`}
            >
              {z({ en: 'Back', cy: 'Yn ôl' })}
            </BackLink>
          </div>

          <Heading
            level="h1"
            className="py-6 md:py-8  text-blue-700 text-[34px] md:text-[56px]"
          >
            {z({
              en: 'How much is my take home pay?',
              cy: 'Cyfrifiannell Cyflog',
            })}
          </Heading>
        </div>
      </GridContainer>
      <div className="hidden lg:block">
        <GridContainer>
          <div className="col-span-12 mb-12">
            <div className="flex items-center gap-x-8">
              <RadioButton
                id="single"
                name="calculationType"
                data-testid="single-radio"
                value="single"
                defaultChecked={true}
              >
                Single calculation
              </RadioButton>
              <RadioButton
                id="joint"
                name="calculationType"
                data-testid="joint-radio"
                value="joint"
                defaultChecked={false}
              >
                Joint calculation
              </RadioButton>
            </div>
          </div>
        </GridContainer>
      </div>
      <GridContainer>
        <div className="col-span-12 px-4 py-4 space-y-1 bg-gray-100 md:px-6 md:py-8 lg:col-span-5 xl:col-span-5">
          <form
            id="calculator"
            method="get"
            action="#calculate"
            className="mb-6 lg:max-w-4xl"
          >
            <label
              className="block text-lg font-bold"
              htmlFor="inputGrossIncome"
            >
              <H2 className="mb-6 text-blue-700 md:mb-8">Gross salary</H2>
            </label>
            <p className="text-base">
              This is your pay before tax and other deductions.
            </p>
            <MoneyInput
              id="inputGrossIncome"
              name="grossIncome"
              aria-label="Gross income"
              placeholder=""
              defaultValue={grossIncome}
              inputClassName="w-full"
              containerClassName="mt-4 lg:w-3/4"
            />
            <div className="lg:w-3/4">
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
                onChange={(e) => setFrequency(e.target.value as PayFrequency)}
                aria-label="Gross income frequency"
                hideEmptyItem={true}
                defaultValue={grossIncomeFrequency}
                selectClassName="mt-6 h-12"
              />
            </div>
            {/* Hours per week */}
            <label
              className={`block mt-6 text-base ${
                frequency === 'hourly' ? '' : 'hidden'
              }`}
              htmlFor="inputHoursPerWeek"
            >
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
              isAllowed={isHoursAllowed}
              className={`border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 lg:w-3/4 ${
                frequency === 'hourly' ? '' : 'hidden'
              }`}
            />
            {/* Days per week */}
            <label
              className={`block mt-6 text-base ${
                frequency === 'daily' ? '' : 'hidden'
              }`}
              htmlFor="inputDaysPerWeek"
            >
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
              isAllowed={isDaysAllowed}
              className={`border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 lg:w-3/4 ${
                frequency === 'daily' ? '' : 'hidden'
              }`}
            />
            <hr className="hidden mt-8 lg:block border-slate-400" />
            {/* Do you live in Scotland */}
            <div className="flex items-center mt-6">
              <Checkbox
                id="checkboxIsScottish"
                name="isScottishResident"
                value="true"
                defaultChecked={isScottishResident}
                className="mr-0"
              />
              <h2 className="text-[#000B3B] mb-0 text-xl font-bold">
                Do you live in Scotland?
              </h2>
            </div>
            <div className="pt-2">
              {' '}
              <p>Scotland has separate income tax bands.</p>
            </div>

            <hr className="hidden mt-8 lg:block border-slate-400" />

            <label className="block mt-6 text-base" htmlFor="inputDaysPerWeek">
              Your tax code
            </label>
            <TextInput
              id="inputTaxCode"
              name="taxCode"
              aria-label="Tax code"
              defaultValue={taxCode || ''}
              className="border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 w-full lg:w-3/4 h-12"
            />
            {/* Will unhide this etc later when I do the Add more information accordion */}
            <div className="hidden">
              <Checkbox
                id="checkboxIsBlindPerson"
                name="isBlindPerson"
                value="true"
                defaultChecked={isBlindPerson}
                className="mt-6"
              >
                {z({ en: 'Is blind person?', cy: 'Person ddall?' })}
              </Checkbox>
              {/* Add any extra content here */}
              <div className="mt-4">
                {z({
                  en: 'If you are registered blind, you may be eligible for extra tax allowances.',
                  cy: 'Os ydych wedi’ch cofrestru’n ddall, efallai y byddwch yn gymwys i gael lwfansau treth ychwanegol.',
                })}
              </div>
            </div>
            <Button
              className="my-6"
              variant="primary"
              id="calculateButton"
              type="submit"
              name="calculate"
            >
              {calculated
                ? z({ en: 'Recalculate', cy: 'Ailgyfrifo' })
                : z({ en: 'Calculate', cy: 'Cyfrifo' })}
            </Button>
          </form>
        </div>
        {calculated && (
          <div
            className="col-span-12 p-4 space-y-1 border-8 border-teal-300 lg:col-span-5 xl:col-span-5"
            id="calculate"
          >
            <Results
              grossIncome={grossIncome}
              grossIncomeFrequency={grossIncomeFrequency}
              hoursPerWeek={hoursPerWeek}
              daysPerWeek={daysPerWeek}
              taxCode={taxCode}
              isBlindPerson={isBlindPerson}
              pensionType={pensionType}
              pensionValue={pensionValue}
              country={country}
              taxYear={taxYear}
              isOverStatePensionAge={isOverStatePensionAge}
            />
          </div>
        )}
      </GridContainer>
    </div>
  );
};
