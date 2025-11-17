import { useState } from 'react';
import { NumberFormatValues } from 'react-number-format';

import { StudentLoans } from 'types';
import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { Country } from 'utils/rates';
import { TaxYear } from 'utils/rates/types';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { PercentInput } from '@maps-react/form/components/PercentInput';
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
  pensionValue: number | null;
  studentLoans?: StudentLoans;
  country: Country;
  taxYear: TaxYear;
  isOverStatePensionAge: boolean;
  calculated?: boolean;
};

export const isHoursAllowed = ({ floatValue, value }: NumberFormatValues) => {
  if (value === '' || value === '.' || value.endsWith('.')) {
    return true;
  }
  if (floatValue !== undefined) {
    const decimalPlaces = value.includes('.') ? value.split('.')[1].length : 0;
    return (
      value.length <= 6 &&
      floatValue >= 0 &&
      floatValue <= 168 &&
      decimalPlaces <= 2
    );
  }
  return false;
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

export const defaultStudentLoans: StudentLoans = {
  plan1: false,
  plan2: false,
  plan4: false,
  plan5: false,
  planPostGrad: false,
};

export const SalaryCalculator = ({
  grossIncome,
  grossIncomeFrequency,
  hoursPerWeek,
  daysPerWeek,
  taxCode,
  isScottishResident,
  pensionType,
  pensionValue,
  studentLoans,
  isBlindPerson,
  country,
  taxYear,
  isOverStatePensionAge,
  calculated,
}: SalaryCalculatorProps) => {
  const { z, locale } = useTranslation();

  const pensionPercent =
    pensionType === 'percentage' && pensionValue !== null
      ? String(pensionValue)
      : '';
  const pensionFixed =
    pensionType === 'fixed' && pensionValue !== null
      ? String(pensionValue)
      : '';
  const [pensionPercentInput, setPensionPercentInput] =
    useState(pensionPercent);
  const [pensionFixedInput, setPensionFixedInput] = useState(pensionFixed);
  const [payFrequency, setPayFrequency] = useState(grossIncomeFrequency);

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
            <Paragraph className="text-base">
              This is your pay before tax and other deductions.
            </Paragraph>
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
                onChange={(e) =>
                  setPayFrequency(e.target.value as PayFrequency)
                }
                aria-label="Gross income frequency"
                hideEmptyItem={true}
                defaultValue={grossIncomeFrequency}
                selectClassName="mt-6 h-12"
              />
            </div>
            {/* Hours per week */}
            <label
              className={`block mt-6 text-base ${
                payFrequency === 'hourly' ? '' : 'hidden'
              }`}
              htmlFor="inputHoursPerWeek"
            >
              How many hours a week do you usually work?
            </label>
            <NumberInput
              id="inputHoursPerWeek"
              name="hoursPerWeek"
              aria-label="Hours per week"
              defaultValue={hoursPerWeek}
              min={1}
              max={168}
              isAllowed={isHoursAllowed}
              className={`border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 lg:w-3/4 ${
                payFrequency === 'hourly' ? '' : 'hidden'
              }`}
            />
            {/* Days per week */}
            <label
              className={`block mt-6 text-base ${
                payFrequency === 'daily' ? '' : 'hidden'
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
                payFrequency === 'daily' ? '' : 'hidden'
              }`}
              disabled={payFrequency !== 'daily'}
            />
            <div className="mt-6 lg:mt-8">
              <hr className="border-slate-400" />
            </div>
            {/* Do you live in Scotland */}
            <div className="flex items-center mt-6 lg:mt-8">
              <Checkbox
                id="checkboxIsScottish"
                name="isScottishResident"
                value="true"
                defaultChecked={isScottishResident}
                aria-labelledby="labelIsScottishResident"
              />
              <label
                id="labelIsScottishResident"
                htmlFor="checkboxIsScottish"
                className="text-[#000B3B] mb-0 text-xl font-bold"
              >
                {z({
                  en: 'Do you live in Scotland?',
                  cy: 'Ydych chi’n byw yn yr Alban?',
                })}
              </label>
            </div>
            <div className="pt-2">
              <Paragraph>
                {z({
                  en: 'Scotland has separate income tax bands.',
                  cy: 'Mae gan yr Alban fandiau treth incwm ar wahân.',
                })}
              </Paragraph>
            </div>

            <div className="mt-6 lg:mt-8">
              <hr className="border-slate-400" />
            </div>

            <div className="flex flex-col mt-6 lg:mt-8 xl:items-center xl:flex-row xl:gap-x-4">
              <label
                className="block text-base text-blue-700"
                htmlFor="inputTaxCode"
              >
                <H2 className="text-blue-700 xl:pb-4">Your tax code</H2>
              </label>
              <span className="text-lg text-blue-700">(optional)</span>
            </div>
            <Paragraph>
              Adding your tax code will give you more accurate results. Find
              your tax code on your payslip or letters from HMRC. Gov.uk has{' '}
              <Link
                href="https://www.gov.uk/tax-codes"
                target="_blank"
                asInlineText
              >
                help on tax codes
              </Link>
              .
            </Paragraph>

            <TextInput
              id="inputTaxCode"
              name="taxCode"
              aria-label="Tax code"
              defaultValue={taxCode || ''}
              className="border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 w-full lg:w-3/4 h-12"
            />

            <div className="mt-6 lg:mt-8">
              <hr className="border-slate-400" />
            </div>

            <div className="mt-6 mb-2">
              <h2 className=" text-md lg:text-lg font-bold lg:mt-8 text-[#000B3B]">
                Extra details will give you a more accurate calculation.
              </h2>
            </div>

            {/* Add more information section */}

            <ExpandableSection
              title={z({
                en: 'Add more information',
                cy: 'Ychwanegwch fwy o wybodaeth',
              })}
              variant="hyperlink"
            >
              <div className="pt-2 space-y-6">
                {/* Monthly pension contributions */}
                <fieldset className="p-0 m-0 mt-6 border-0 lg:mt-8">
                  <legend className="text-base text-blue-700">
                    <H2 className="inline text-blue-700">
                      {z({
                        en: 'Monthly pension contributions',
                        cy: 'Cyfraniadau pensiwn misol',
                      })}
                    </H2>
                    <span className="block mt-1 text-lg text-blue-700 align-baseline xl:inline xl:mt-0 xl:ml-2">
                      {z({ en: '(optional)', cy: '(dewisol)' })}
                    </span>
                  </legend>

                  <div className="mt-4 text-base">
                    <Paragraph>
                      Not sure? You can check if your pension is ‘net pay’ by:
                    </Paragraph>
                  </div>

                  <ListElement
                    variant="unordered"
                    color="dark"
                    className="pt-4 pb-3 pl-4 text-sm list-inside"
                    items={[
                      z({
                        en: 'looking at your payslip',
                        cy: 'welsh',
                      }),
                      z({
                        en: 'contacting your pension provider',
                        cy: 'Defnyddiwch "arbed a dychwelyd" eto os oes angen i chi oedi a dod yn ôl',
                      }),
                    ]}
                  />

                  <div className="flex flex-col mt-4 lg:flex-row lg:gap-x-4 lg:items-center">
                    <PercentInput
                      id="pensionPercent"
                      name="pensionPercent"
                      aria-label={z({
                        en: 'Pension contributions percentage',
                        cy: 'Canran cyfraniadau pensiwn',
                      })}
                      placeholder=""
                      value={pensionPercentInput}
                      inputClassName="w-full"
                      containerClassName="mt-4 lg:w-3/4"
                      onChange={(e) => {
                        setPensionPercentInput(e.target.value);
                        if (e.target.value) setPensionFixedInput('');
                      }}
                    />
                    <span className="mt-2 lg:mt-0">
                      {z({ en: 'or', cy: 'neu' })}
                    </span>
                    <MoneyInput
                      id="pensionFixed"
                      name="pensionFixed"
                      aria-label={z({
                        en: 'Pension contributions fixed amount',
                        cy: 'Swm sefydlog cyfraniadau pensiwn',
                      })}
                      placeholder=""
                      value={pensionFixedInput}
                      inputClassName="w-full"
                      containerClassName="mt-4 lg:w-3/4"
                      onChange={(e) => {
                        setPensionFixedInput(e.target.value);
                        if (e.target.value) setPensionPercentInput('');
                      }}
                      decimalScale={2}
                    />
                  </div>
                </fieldset>

                <div className="mt-6 lg:mt-8">
                  <hr className="border-slate-400" />
                </div>

                {/* Student loan repayments */}
                <fieldset className="p-0 m-0 mt-6 border-0 lg:mt-8">
                  <legend className="text-base text-blue-700">
                    <H2 className="inline text-blue-700">
                      {z({
                        en: 'Student loan repayments',
                        cy: '',
                      })}
                    </H2>
                    <span className="block mt-1 text-lg text-blue-700 align-baseline xl:inline xl:mt-0 xl:ml-2">
                      {z({ en: '(optional)', cy: '(dewisol)' })}
                    </span>
                  </legend>
                  <div className="mt-4 text-base">
                    <Paragraph>
                      {z({
                        en: 'Your repayments depend on:',
                        cy: '',
                      })}
                    </Paragraph>
                  </div>
                  <ListElement
                    variant="unordered"
                    color="dark"
                    className="pt-4 pb-3 pl-4 text-sm list-inside"
                    items={[
                      z({
                        en: 'where you are from',
                        cy: 'welsh',
                      }),
                      z({
                        en: 'when you started your course',
                        cy: 'Defnyddiwch "arbed a dychwelyd" eto os oes angen i chi oedi a dod yn ôl',
                      }),
                    ]}
                  />
                  {/* Check with design team regarding this text colour as its not in our
                  globals TW */}
                  <div className="mt-2 text-lg font-normal leading-7 tracking-tight text-[#60637E]">
                    <span>Tick the right one for you</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <div className="flex items-start gap-3 mb-6">
                      <Checkbox
                        id="checkboxPlan1"
                        name="plan1"
                        value="true"
                        defaultChecked={studentLoans?.plan1}
                        className="mt-3"
                      >
                        <span className="text-gray-900">
                          <strong>
                            {z({ en: 'Plan 1:', cy: 'Cynllun 1:' })}
                          </strong>{' '}
                          {z({
                            en: 'England, Wales or Northern Ireland - before 2012; or all Northern Ireland postgraduate loans.',
                            cy: 'Lloegr, Cymru neu Ogledd Iwerddon - cyn 2012; neu bob benthyciad ôl-raddedig yng Ngogledd Iwerddon.',
                          })}
                        </span>
                      </Checkbox>
                    </div>

                    <div className="flex items-start gap-3 mb-6">
                      <Checkbox
                        id="checkboxPlan2"
                        name="plan2"
                        value="true"
                        defaultChecked={studentLoans?.plan2}
                        className="mt-3"
                      >
                        <span className="text-gray-900">
                          <strong>
                            {z({ en: 'Plan 2:', cy: 'Cynllun 2:' })}
                          </strong>{' '}
                          {z({
                            en: 'England - 2012-2023 or Wales - after 2012.',
                            cy: 'Lloegr, Cymru neu Ogledd Iwerddon.',
                          })}
                        </span>
                      </Checkbox>
                    </div>

                    <div className="flex items-start gap-3 mb-6">
                      <Checkbox
                        id="checkboxPlan4"
                        name="plan4"
                        value="true"
                        defaultChecked={studentLoans?.plan4}
                        className="mt-3"
                      >
                        <span className="text-gray-900">
                          <strong>
                            {z({ en: 'Plan 4:', cy: 'Cynllun 4:' })}
                          </strong>{' '}
                          {z({
                            en: 'Scotland - after 1998; and all Scottish postgraduate loans.',
                            cy: 'Lloegr, Cymru neu Ogledd Iwerddon.',
                          })}
                        </span>
                      </Checkbox>
                    </div>

                    <div className="flex items-start gap-3 mb-6">
                      <Checkbox
                        id="checkboxPlan5"
                        name="plan5"
                        value="true"
                        defaultChecked={studentLoans?.plan5}
                        className="mt-3"
                      >
                        <span className="text-gray-900">
                          <strong>
                            {z({ en: 'Plan 5:', cy: 'Cynllun 5:' })}
                          </strong>{' '}
                          {z({
                            en: 'England - after 2023.',
                            cy: 'Lloegr.',
                          })}
                        </span>
                      </Checkbox>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="checkboxPlanPostGrad"
                        name="planPostGrad"
                        value="true"
                        defaultChecked={studentLoans?.planPostGrad}
                      >
                        <span className="text-gray-900">
                          <strong>
                            {z({
                              en: 'Postgraduate loan:',
                              cy: 'Benthyciad ôl-raddedig:',
                            })}
                          </strong>{' '}
                          {z({
                            en: 'England or Wales.',
                            cy: 'Lloegr neu Gymru.',
                          })}
                        </span>
                      </Checkbox>
                    </div>
                  </div>
                </fieldset>

                <div className="mt-6 lg:mt-8">
                  <hr className="border-slate-400" />
                </div>

                {/* Are you over State Pension Age */}
                <fieldset className="p-0 m-0 mt-6 border-0 lg:mt-8">
                  <legend className="text-base text-blue-700">
                    <H2 className="inline text-blue-700">
                      {z({
                        en: 'Are you over State Pension Age',
                        cy: 'Cyfraniadau pensiwn misol',
                      })}
                    </H2>
                    <span className="block mt-1 text-lg text-blue-700 align-baseline xl:inline xl:mt-0 xl:ml-2">
                      {z({ en: '(optional)', cy: '(dewisol)' })}
                    </span>
                  </legend>

                  <div className="mt-4 text-base">
                    <Paragraph>
                      If you are over State Pension age you usually stop paying
                      National Insurance contributions, so this affects your
                      result. If you leave this blank, we’ll assume you still
                      pay NI contributions.{' '}
                      <Link
                        href="https://www.gov.uk/state-pension-age"
                        target="_blank"
                        asInlineText
                      >
                        Check your State Pension age (opens in new tab)
                      </Link>{' '}
                      if you are not sure.
                    </Paragraph>
                  </div>

                  <div className="flex items-center mt-6 gap-x-8">
                    <RadioButton
                      id="state-pension-yes"
                      name="isOverStatePensionAge"
                      data-testid="state-pension-yes"
                      value="true"
                      classNameLabel="before:bg-white"
                      defaultChecked={isOverStatePensionAge === true}
                    >
                      Yes
                    </RadioButton>
                    <RadioButton
                      id="state-pension-no"
                      name="isOverStatePensionAge"
                      data-testid="state-pension-no"
                      value="false"
                      classNameLabel="before:bg-white"
                      defaultChecked={isOverStatePensionAge === false}
                    >
                      No
                    </RadioButton>
                  </div>
                </fieldset>

                <div className="mt-6 lg:mt-8">
                  <hr className="border-slate-400" />
                </div>

                {/* Blind persons alowance */}
                <fieldset className="p-0 m-0 mt-6 border-0 lg:mt-8">
                  <legend className="text-base text-blue-700">
                    <H2 className="inline text-blue-700">
                      {z({
                        en: 'Do you get the Blind Person‘s Allowance?',
                        cy: 'Cyfraniadau pensiwn misol',
                      })}
                    </H2>
                    <span className="block mt-1 text-lg text-blue-700 align-baseline xl:inline xl:mt-0 xl:ml-2">
                      {z({ en: '(optional)', cy: '(dewisol)' })}
                    </span>
                  </legend>

                  <div className="mt-4 text-base">
                    <Paragraph>
                      Blind Person’s Allowance is an extra amount some visually
                      impaired people can earn before paying tax. Find out more
                      about claiming this on{' '}
                      <Link
                        href="https://www.gov.uk/blind-persons-allowance/how-to-claim"
                        target="_blank"
                        asInlineText
                      >
                        Gov.uk
                      </Link>{' '}
                    </Paragraph>
                  </div>

                  <div className="flex items-center mt-6 gap-x-8">
                    <RadioButton
                      id="blind-person-yes"
                      name="isBlindPerson"
                      data-testid="blind-person-yes"
                      value="true"
                      classNameLabel="before:bg-white"
                      defaultChecked={isBlindPerson === true}
                    >
                      Yes
                    </RadioButton>
                    <RadioButton
                      id="blind-person-no"
                      name="isBlindPerson"
                      data-testid="blind-person-no"
                      value="false"
                      classNameLabel="before:bg-white"
                      defaultChecked={isBlindPerson === false}
                    >
                      No
                    </RadioButton>
                  </div>
                </fieldset>
              </div>
            </ExpandableSection>

            <div className="mt-6 lg:mt-8">
              <hr className="border-slate-400" />
            </div>

            <div className="block lg:hidden">
              <fieldset className="p-0 m-0 mt-6 border-0 lg:mt-8">
                <legend className="text-base text-blue-700">
                  <H2 className="inline text-blue-700">
                    {z({
                      en: 'Compare with another salary',
                      cy: 'Cyfraniadau pensiwn misol',
                    })}
                  </H2>
                </legend>

                <div className="flex items-center mt-6 gap-x-8">
                  <RadioButton
                    id="single"
                    name="calculationType"
                    data-testid="single-radio"
                    value="single"
                    defaultChecked={true}
                  >
                    Yes
                  </RadioButton>
                  <RadioButton
                    id="joint"
                    name="calculationType"
                    data-testid="joint-radio"
                    value="joint"
                    defaultChecked={false}
                  >
                    No
                  </RadioButton>
                </div>
              </fieldset>
            </div>

            <div className="block mt-6 lg:hidden lg:mt-8">
              <hr className="border-slate-400" />
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
              pensionValue={pensionValue ?? 0}
              studentLoans={studentLoans ?? defaultStudentLoans}
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
