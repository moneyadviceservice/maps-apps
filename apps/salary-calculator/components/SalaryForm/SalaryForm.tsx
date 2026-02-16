import { useEffect, useState } from 'react';

import { OptionalInfoFieldset } from 'components/OptionalInfoFieldset/OptionalInfoFieldset';
import { StudentLoans } from 'types';
import type { PensionContributionType } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';
import { PayFrequency } from 'utils/helpers/convertToAnnualSalary/convertToAnnualSalary';
import { Country } from 'utils/rates';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { PercentInput } from '@maps-react/form/components/PercentInput';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

import { AdditionalInfoButton } from '../AdditionalInfoButton';

export type SalaryFormData = {
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

export type SalaryFormProps = {
  formData: SalaryFormData;
  prefix?: string;
  formNumber?: 1 | 2;
  calculationType: 'single' | 'joint';
  hideButton?: boolean;
  isNestedForm?: boolean;
  errors?: string | null;
};

// Helper: Get test ID suffix
const getTestIdSuffix = (formNumber: number) => (formNumber === 2 ? '-2' : '');

// Helper: Render frequency select options
const getFrequencyOptions = (z: ReturnType<typeof useTranslation>['z']) => [
  { text: z({ en: 'Annually', cy: 'Blynyddol' }), value: 'annual' },
  { text: z({ en: 'Monthly', cy: 'Misol' }), value: 'monthly' },
  { text: z({ en: 'Weekly', cy: 'Wythnosol' }), value: 'weekly' },
  { text: z({ en: 'Daily', cy: 'Dyddiol' }), value: 'daily' },
  { text: z({ en: 'Hourly', cy: 'Bob awr' }), value: 'hourly' },
];

// Component: Student loan plan checkbox
const StudentLoanPlanCheckbox = ({
  plan,
  prefixField,
  formNumber,
  studentLoans,
  z,
}: {
  plan: keyof StudentLoans;
  prefixField: (name: string) => string;
  formNumber: number;
  studentLoans: StudentLoans;
  z: ReturnType<typeof useTranslation>['z'];
}) => {
  const planLabels = {
    plan1: {
      title: z({ en: 'Plan 1:', cy: 'Cynllun 1:' }),
      desc: z({
        en: 'England, Wales or Northern Ireland - before 2012; or all Northern Ireland postgraduate loans.',
        cy: 'Cymru, Lloegr neu Ogledd Iwerddon - cyn 2012; neu holl fenthyciadau ôl-raddedig Gogledd Iwerddon.',
      }),
    },
    plan2: {
      title: z({ en: 'Plan 2:', cy: 'Cynllun 2:' }),
      desc: z({
        en: 'England - 2012-2023 or Wales - after 2012.',
        cy: 'Lloegr - 2012-2023 neu Gymru - ar ôl 2012.',
      }),
    },
    plan4: {
      title: z({ en: 'Plan 4:', cy: 'Cynllun 4:' }),
      desc: z({
        en: 'Scotland - after 1998; and all Scottish postgraduate loans.',
        cy: 'Yr Alban - ar ôl 1998; a holl fenthyciadau ôl-raddedig yn yr Alban.',
      }),
    },
    plan5: {
      title: z({ en: 'Plan 5:', cy: 'Cynllun 5:' }),
      desc: z({
        en: 'England - after 2023.',
        cy: 'Lloegr - ar ôl 2023.',
      }),
    },
    planPostGrad: {
      title: z({
        en: 'Postgraduate loan:',
        cy: 'Benthyciad ôl-raddedig:',
      }),
      desc: z({
        en: 'England or Wales.',
        cy: 'Cymru neu Loegr.',
      }),
    },
  };

  const label = planLabels[plan];
  const testId = plan.replaceAll(/([A-Z])/g, '-$1').toLowerCase();

  return (
    <div className="flex items-start gap-3 mb-6">
      <Checkbox
        id={prefixField(`checkbox${plan}`)}
        name={prefixField(plan)}
        value="true"
        defaultChecked={studentLoans?.[plan]}
        className="mt-3"
        data-testid={`checkbox-${testId}${getTestIdSuffix(formNumber)}`}
        aria-describedby={prefixField('student-loan-info')}
      >
        <span className="text-gray-900">
          <strong>{label.title}</strong> {label.desc}
        </span>
      </Checkbox>
    </div>
  );
};

export const SalaryForm = ({
  formData,
  prefix = '',
  formNumber = 1,
  calculationType,
  hideButton = false,
  isNestedForm = false,
  errors,
}: SalaryFormProps) => {
  const { z, locale } = useTranslation();

  const prefixField = (name: string) => (prefix ? `${prefix}${name}` : name);

  const getPensionValue = (type: PensionContributionType) =>
    formData.pensionType === type &&
    formData.pensionValue &&
    formData.pensionValue > 0
      ? String(formData.pensionValue)
      : '';

  const hasPensionErrors = (errors: string | null | undefined): boolean => {
    if (!errors) return false;

    try {
      const parsed = JSON.parse(errors) as { field?: string }[];
      if (!Array.isArray(parsed)) return false;

      return parsed.some(
        (err) =>
          err.field === 'pensionFixed' ||
          err.field === 'pensionPercent' ||
          err.field === 'salary2_pensionFixed' ||
          err.field === 'salary2_pensionPercent',
      );
    } catch {
      return false;
    }
  };

  const hasAdditionalInfo =
    formData.calculated &&
    (formData.pensionValue > 0 ||
      Object.values(formData.studentLoans).some(Boolean) ||
      formData.isBlindPerson === true ||
      formData.isOverStatePensionAge === true);

  const [expanded, setExpanded] = useState(hasAdditionalInfo);

  const pensionPercent = getPensionValue('percentage');
  const pensionFixed = getPensionValue('fixed');

  const [pensionPercentInput, setPensionPercentInput] =
    useState(pensionPercent);
  const [pensionFixedInput, setPensionFixedInput] = useState(pensionFixed);
  const [payFrequency, setPayFrequency] = useState(
    formData.grossIncomeFrequency,
  );

  const [isJsEnabled, setIsJsEnabled] = useState(false);

  useEffect(() => {
    setIsJsEnabled(true);
  }, []);

  const testIdSuffix = getTestIdSuffix(formNumber);

  const studentLoanPlans: (keyof StudentLoans)[] = [
    'plan1',
    'plan2',
    'plan4',
    'plan5',
    'planPostGrad',
  ];

  const DescriptionText = {
    grossIncome: z({
      en: 'This is your pay before tax and other deductions.',
      cy: "Dyma'ch cyflog cyn treth a didyniadau eraill.",
    }),

    grossIncomeFrequency: z({
      en: 'Select how often you are paid.',
      cy: 'Dewiswch pa mor aml rydych yn cael eich talu.',
    }),

    hoursPerWeek: z({
      en: 'How many hours a week do you usually work?',
      cy: "Sawl awr yr wythnos ydych chi'n gweithio fel arfer?",
    }),

    daysPerWeek: z({
      en: 'How many days a week do you usually work?',
      cy: "Sawl diwrnod yr wythnos ydych chi'n gweithio fel arfer?",
    }),
    scottishResident: z({
      en: 'Scotland has separate income tax bands.',
      cy: 'Mae gan yr Alban fandiau treth incwm ar wahân.',
    }),
    taxCode: z({
      en: 'Adding your tax code will give you more accurate results. Find your tax code on your payslip or letters from HMRC. Gov.uk has',
      cy: "Bydd ychwanegu eich cod treth yn rhoi canlyniadau mwy cywir i chi. Dewch o hyd i'ch cod treth ar eich slip cyflog neu lythyrau gan CThEF. Mae gan Gov.uk",
    }),

    additionalInfo: z({
      en: 'Adding extra information about your pension or student loan will give you a more accurate calculation.',
      cy: 'Bydd ychwanegu gwybodaeth ychwanegol am eich pensiwn neu fenthyciad myfyriwr yn rhoi cyfrifiad mwy cywir i chi.',
    }),

    pensionContributions: z({
      en: "For pension contributions we will assume your contributions come out of your pre-tax salary. This is called a 'net pay arrangement'. Not sure? You can check by: looking at your payslip, contacting your pension provider.",
      cy: "Ar gyfer cyfraniadau pensiwn, byddwn yn tybio bod eich cyfraniadau'n dod allan o'ch cyflog cyn treth. Gelwir hyn yn 'drefniant cyflog net'. Ddim yn siŵr? Gallwch wirio drwy: edrych ar eich slip cyflog, cysylltu â'ch darparwr pensiwn.",
    }),
    studentLoan: z({
      en: 'Your repayments depend on: where you are from, when you started your course.',
      cy: 'Mae eich ad-daliadau yn dibynnu ar: o ble rydych chi, pryd gwnaethoch chi ddechrau eich cwrs.',
    }),
    statePensionAge: z({
      en: "Are you over State Pension Age?  If you are over State Pension age you usually stop paying National Insurance contributions, so this affects your result. If you leave this blank, we'll assume you still pay NI contributions.",
      cy: 'Ydych chi dros Oedran Pensiwn y Wladwriaeth? Os ydych dros oedran Pensiwn y Wladwriaeth, rydych fel arfer yn stopio talu cyfraniadau Yswiriant Gwladol, felly mae hyn yn effeithio ar eich canlyniad. Os gadewch hwn yn wag, byddwn yn cymryd eich bod yn dal i dalu cyfraniadau Yswiriant Gwladol.',
    }),
    blindPersonAllowance: z({
      en: "Do you get Blind Person's Allowance? Blind Person’s Allowance is an extra amount some visually impaired people can earn before paying tax. Find out more about claiming this on Gov.uk. ",
      cy: "Ydych chi'n cael Lwfans y Person Dall? Mae Lwfans Person Dall yn swm ychwanegol y gall rhai pobl â nam ar eu golwg ei ennill cyn talu treth. Darganfyddwch fwy am hawlio hyn ar Gov.uk.",
    }),
  };

  return (
    <div
      key={formNumber}
      className={`mb-6 lg:max-w-4xl ${
        formNumber === 1 ? 'bg-gray-100' : 'bg-yellow-50'
      }`}
    >
      {!isNestedForm && (
        <input type="hidden" name="calculationType" value={calculationType} />
      )}

      <div className="px-4 py-4 lg:px-6 lg:py-8">
        <div
          className={`mb-4 ${
            payFrequency === 'hourly' || payFrequency === 'daily'
              ? 'mb-0'
              : 'mb-6 lg:mb-8'
          }`}
        >
          <label
            className="block text-lg font-bold"
            htmlFor={prefixField('inputGrossIncome')}
          >
            <H2 variant="secondary" className="mb-4">
              {calculationType === 'joint'
                ? z({
                    en: `Gross salary ${formNumber}`,
                    cy: `Cyflog gros ${formNumber}`,
                  })
                : z({ en: 'Gross salary', cy: 'Cyflog gros' })}
            </H2>
          </label>

          <Paragraph className="py-2 mb-2 text-base">
            {z({
              en: 'This is your pay before tax and other deductions.',
              cy: "Dyma'ch tâl cyn treth a didyniadau eraill.",
            })}
          </Paragraph>

          <MoneyInput
            id={prefixField('inputGrossIncome')}
            name={prefixField('grossIncome')}
            placeholder=""
            defaultValue={formData.grossIncome}
            inputClassName="w-full"
            containerClassName="mt-4 lg:w-3/4"
            data-testid={`gross-income${testIdSuffix}`}
            aria-label={
              z({
                en: 'Gross salary in pounds',
                cy: 'Cyflog gros mewn punnoedd',
              }) +
              '. ' +
              DescriptionText.grossIncome
            }
          />

          <div className="lg:w-3/4">
            <Select
              id={prefixField('selectGrossIncomeFrequency')}
              name={prefixField('grossIncomeFrequency')}
              options={getFrequencyOptions(z)}
              onChange={(e) => setPayFrequency(e.target.value as PayFrequency)}
              aria-label={DescriptionText.grossIncomeFrequency}
              hideEmptyItem={true}
              defaultValue={formData.grossIncomeFrequency}
              selectClassName="mt-6 h-12"
              data-testid={`gross-income-frequency${testIdSuffix}`}
            />
          </div>
        </div>

        {payFrequency === 'daily' && (
          <div className="pb-6 lg:pb-8">
            <label
              className="block text-base"
              htmlFor={prefixField('inputDaysPerWeek')}
            >
              {z({
                en: 'How many days a week do you usually work?',
                cy: "Sawl diwrnod yr wythnos ydych chi'n gweithio fel arfer?",
              })}
            </label>
            <NumberInput
              id={prefixField('inputDaysPerWeek')}
              name={prefixField('daysPerWeek')}
              aria-label={DescriptionText.daysPerWeek}
              defaultValue={formData.daysPerWeek}
              className="border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 lg:w-3/4"
              data-testid={`days-per-week${testIdSuffix}`}
            />
          </div>
        )}

        {payFrequency === 'hourly' && (
          <div className="pb-6 lg:pb-8">
            <label
              className="block mt-0 text-base"
              htmlFor={prefixField('inputHoursPerWeek')}
            >
              {z({
                en: 'How many hours a week do you usually work?',
                cy: "Sawl awr yr wythnos ydych chi'n gweithio fel arfer?",
              })}
            </label>
            <NumberInput
              id={prefixField('inputHoursPerWeek')}
              name={prefixField('hoursPerWeek')}
              aria-label={DescriptionText.hoursPerWeek}
              defaultValue={formData.hoursPerWeek}
              className="border-gray-400 p-[8px] mt-4 border rounded focus:border-blue-700 lg:w-3/4"
              data-testid={`hours-per-week${testIdSuffix}`}
            />
          </div>
        )}

        <hr className="border-slate-400" />
        <div className="flex mt-6 lg:mt-8">
          <Checkbox
            id={prefixField('checkboxIsScottish')}
            name={prefixField('isScottishResident')}
            value="true"
            defaultChecked={formData.isScottishResident}
            aria-label={
              z({
                en: 'Do you live in Scotland?',
                cy: "Ydych chi'n byw yn yr Alban?",
              }) +
              ' ' +
              DescriptionText.scottishResident
            }
            data-testid={`checkbox-scotland${testIdSuffix}`}
          >
            <span className="text-gray-800 mt-1 mb-0 text-[24px]">
              {z({
                en: 'Do you live in Scotland?',
                cy: "Ydych chi'n byw yn yr Alban?",
              })}
            </span>
          </Checkbox>
        </div>

        <div className="pt-2 pb-2 lg:pb-4">
          <Paragraph id={prefixField('descIsScottishResident')}>
            {z({
              en: 'Scotland has separate income tax bands.',
              cy: 'Mae gan yr Alban fandiau treth incwm ar wahân.',
            })}
          </Paragraph>
        </div>

        <hr className="border-slate-400" />

        <div className="flex flex-col mt-6 lg:mt-8">
          <H2 variant="secondary" className="mb-4">
            {z({ en: 'Your tax code', cy: 'Eich cod treth' })}
            <span className="ml-2 text-base font-normal text-blue-700">
              {z({ en: '(optional)', cy: '(dewisol)' })}
            </span>
          </H2>

          {/* Invisible label for screen readers */}
          <label htmlFor={prefixField('inputTaxCode')} className="sr-only">
            {z({
              en: 'Your tax code (optional)',
              cy: 'Eich cod treth (dewisol)',
            })}
          </label>

          <Paragraph id="taxcode-help" className="py-2 mb-2">
            {DescriptionText.taxCode}{' '}
            <Link
              href={
                locale === 'cy'
                  ? 'https://www.gov.uk/codau-treth'
                  : 'https://www.gov.uk/tax-codes'
              }
              target="_blank"
              asInlineText
              withIcon={false}
            >
              {z({ en: 'help on tax codes', cy: 'gymorth ar godau treth' })}
            </Link>
            .
          </Paragraph>
        </div>

        <TextInput
          id={prefixField('inputTaxCode')}
          name={prefixField('taxCode')}
          aria-label={
            z({ en: 'Your tax code. ', cy: 'Eich cod treth. ' }) +
            DescriptionText.taxCode
          }
          defaultValue={formData.taxCode || ''}
          className="w-full h-12 p-2 mt-2 mb-6 border border-gray-400 rounded lg:mb-8 focus:border-blue-700 lg:w-3/4"
          data-testid={`tax-code${testIdSuffix}`}
        />

        <hr className="border-slate-400" />

        <div className="mt-6 mb-6 lg:mt-8 lg:mb-8">
          <Paragraph
            id="additional-info-help"
            className="font-bold text-gray-800 text-md lg:text-lg lg:mt-8"
          >
            {DescriptionText.additionalInfo}
          </Paragraph>
        </div>

        {isJsEnabled && (
          <AdditionalInfoButton
            expanded={expanded}
            setExpanded={setExpanded}
            describedBy="additional-info-help"
            z={z}
          />
        )}

        {/* Keep additional fields expanded if we have error on pensionFixed and pensionPercent inputs
        So when user clicks on Error message it will focus on the relevant input */}
        <div
          className={`${
            (!isJsEnabled && !formData.calculated) ||
            expanded ||
            hasPensionErrors(errors)
              ? 'block'
              : 'hidden'
          }`}
          id="additional-info-section"
          data-testid="additional-info-section"
        >
          <div className="pt-0 space-y-6 lg:space-y-8">
            <OptionalInfoFieldset
              title={{
                en: 'Monthly pension contributions',
                cy: 'Cyfraniadau pensiwn misol',
              }}
              description={{
                en: "For pension contributions we will assume your contributions come out of your pre-tax salary. This is called a 'net pay arrangement'.",
                cy: "Ar gyfer cyfraniadau pensiwn, byddwn yn tybio bod eich cyfraniadau'n dod allan o'ch cyflog cyn treth. Gelwir hyn yn 'drefniant cyflog net'.",
              }}
              paragraph={{
                en: 'Not sure? You can check by:',
                cy: 'Ddim yn siŵr? Gallwch wirio drwy:',
              }}
              listItems={[
                {
                  en: 'looking at your payslip',
                  cy: 'edrych ar eich slip cyflog',
                },
                {
                  en: 'contacting your pension provider.',
                  cy: "cysylltu â'ch darparwr pensiwn.",
                },
              ]}
            >
              <div className="flex flex-col mt-4 lg:flex-row lg:gap-x-6 lg:items-center">
                <PercentInput
                  id={prefixField('pensionPercent')}
                  name={prefixField('pensionPercent')}
                  value={pensionPercentInput}
                  inputClassName="w-full"
                  containerClassName="mt-4 lg:w-3/4"
                  data-testid={`pension-percent${testIdSuffix}`}
                  aria-label={
                    z({
                      en: 'Monthly pension contributions percentage',
                      cy: 'Canran cyfraniadau pensiwn misol',
                    }) +
                    '. ' +
                    DescriptionText.pensionContributions
                  }
                  onChange={(e) => {
                    setPensionPercentInput(e.target.value);
                    if (e.target.value) setPensionFixedInput('');
                  }}
                />

                <span className="mt-2 font-normal">
                  {z({ en: 'or', cy: 'neu' })}
                </span>

                <MoneyInput
                  id={prefixField('pensionFixed')}
                  name={prefixField('pensionFixed')}
                  value={pensionFixedInput}
                  inputClassName="w-full"
                  containerClassName="mt-4 lg:w-3/4"
                  decimalScale={2}
                  data-testid={`pension-fixed${testIdSuffix}`}
                  aria-label={
                    z({
                      en: 'Monthly pension contributions fixed amount',
                      cy: 'Swm sefydlog cyfraniadau pensiwn misol',
                    }) +
                    '. ' +
                    DescriptionText.pensionContributions
                  }
                  onChange={(e) => {
                    setPensionFixedInput(e.target.value);
                    if (e.target.value) setPensionPercentInput('');
                  }}
                />
              </div>
            </OptionalInfoFieldset>

            <hr className="border-slate-400" />
            <OptionalInfoFieldset
              title={{
                en: 'Student loan repayments',
                cy: 'Ad-daliadau benthyciadau myfyrwyr',
              }}
              paragraph={{
                en: 'Your repayments depend on:',
                cy: 'Mae eich ad-daliadau yn dibynnu ar:',
              }}
              listItems={[
                { en: 'where you are from', cy: "o ble rydych chi'n dod" },
                {
                  en: 'when you started your course.',
                  cy: 'pryd wnaethoch chi ddechrau eich cwrs.',
                },
              ]}
            >
              <div id={prefixField('student-loan-info')} className="sr-only">
                {z({
                  en: `Your repayments depend on: where you are from, when you started your course.`,
                  cy: `Mae eich ad-daliadau yn dibynnu ar: o ble rydych chi'n dod, pryd wnaethoch chi ddechrau eich cwrs.`,
                })}
              </div>

              <div className="mt-8 text-[18px] font-normal leading-7 tracking-tight text-gray-650">
                <span>
                  {z({
                    en: 'Tick the right one for you',
                    cy: 'Ticiwch yr un iawn i chi',
                  })}
                </span>
              </div>

              <div className="flex flex-col mt-2">
                {studentLoanPlans.map((plan) => (
                  <StudentLoanPlanCheckbox
                    key={plan}
                    plan={plan}
                    prefixField={prefixField}
                    formNumber={formNumber}
                    studentLoans={formData.studentLoans}
                    z={z}
                  />
                ))}
              </div>
            </OptionalInfoFieldset>

            <hr className="border-slate-400" />

            <OptionalInfoFieldset
              title={{
                en: 'Are you over State Pension Age?',
                cy: 'Ydych chi dros oedran Pensiwn y Wladwriaeth?',
              }}
            >
              <Paragraph className="mt-4 mb-2">
                {z({
                  en: "If you are over State Pension age you usually stop paying National Insurance contributions, so this affects your result. If you leave this blank, we'll assume you still pay NI contributions.",
                  cy: "Os ydych chi dros oedran Pensiwn y Wladwriaeth, fel arfer byddwch chi'n rhoi'r gorau i dalu cyfraniadau Yswiriant Gwladol, felly mae hyn yn effeithio ar eich canlyniad. Os byddwch chi'n gadael hwn yn wag, byddwn yn tybio eich bod chi'n dal i dalu cyfraniadau Yswiriant Gwladol.",
                })}{' '}
                <Link
                  href="https://www.gov.uk/state-pension-age"
                  target="_blank"
                  asInlineText
                  withIcon={false}
                >
                  {z({
                    en: 'Check your State Pension age (opens in new tab)',
                    cy: 'Gwiriwch eich oedran Pensiwn y Wladwriaeth (yn agor mewn tab newydd)',
                  })}
                </Link>{' '}
                {z({
                  en: 'if you are not sure.',
                  cy: "os nad ydych chi'n siŵr.",
                })}{' '}
              </Paragraph>

              <div className="flex items-center mt-6 gap-x-8">
                <RadioButton
                  id={prefixField('state-pension-yes')}
                  name={prefixField('isOverStatePensionAge')}
                  data-testid={`state-pension-yes${testIdSuffix}`}
                  value="true"
                  classNameLabel="before:bg-white"
                  defaultChecked={formData.isOverStatePensionAge === true}
                  aria-label={z({
                    en: 'Yes. ' + DescriptionText.statePensionAge,
                    cy: 'Ydw. ' + DescriptionText.statePensionAge,
                  })}
                >
                  {z({ en: 'Yes', cy: 'Ydw' })}
                </RadioButton>

                <RadioButton
                  id={prefixField('state-pension-no')}
                  name={prefixField('isOverStatePensionAge')}
                  data-testid={`state-pension-no${testIdSuffix}`}
                  value="false"
                  classNameLabel="before:bg-white"
                  defaultChecked={formData.isOverStatePensionAge === false}
                  aria-label={z({
                    en: 'No. ' + DescriptionText.statePensionAge,
                    cy: 'Na. ' + DescriptionText.statePensionAge,
                  })}
                >
                  {z({ en: 'No', cy: 'Na' })}
                </RadioButton>
              </div>
            </OptionalInfoFieldset>

            <hr className="border-slate-400" />

            <OptionalInfoFieldset
              title={{
                en: "Do you get Blind Person's Allowance?",
                cy: "Ydych chi'n cael Lwfans y Person Dall?",
              }}
            >
              <Paragraph
                className="mt-4 mb-2"
                id={prefixField('blindPersonDescription')}
              >
                {z({
                  en: 'Blind Person’s Allowance is an extra amount some visually impaired people can earn before paying tax. Find out more about claiming this on',
                  cy: 'Mae Lwfans Person Dall yn swm ychwanegol y gall rhai pobl â nam ar eu golwg ei ennill cyn talu treth. Darganfyddwch fwy am hawlio hyn ar',
                })}{' '}
                <Link
                  href={`https://www.gov.uk/blind-persons-allowance${
                    locale === 'cy' ? '?lang=cy' : ''
                  }`}
                  target="_blank"
                  asInlineText
                  withIcon={false}
                  data-testid="bpa-gov-link"
                >
                  {z({
                    en: 'Gov.uk',
                    cy: 'Gov.uk',
                  })}
                </Link>
                .
              </Paragraph>

              <div className="flex items-center mt-6 gap-x-8">
                <RadioButton
                  id={prefixField('blind-persons-yes')}
                  name={prefixField('isBlindPerson')}
                  data-testid={`blind-persons-yes${testIdSuffix}`}
                  value="true"
                  classNameLabel="before:bg-white"
                  defaultChecked={formData.isBlindPerson === true}
                  aria-label={z({
                    en: 'Yes. ' + DescriptionText.blindPersonAllowance,
                    cy: 'Ydw. ' + DescriptionText.blindPersonAllowance,
                  })}
                >
                  {z({ en: 'Yes', cy: 'Ydw' })}
                </RadioButton>

                <RadioButton
                  id={prefixField('blind-persons-no')}
                  name={prefixField('isBlindPerson')}
                  data-testid={`blind-persons-no${testIdSuffix}`}
                  value="false"
                  classNameLabel="before:bg-white"
                  defaultChecked={formData.isBlindPerson === false}
                  aria-label={z({
                    en: 'No. ' + DescriptionText.blindPersonAllowance,
                    cy: 'Na. ' + DescriptionText.blindPersonAllowance,
                  })}
                >
                  {z({ en: 'No', cy: 'Na' })}
                </RadioButton>
              </div>
            </OptionalInfoFieldset>
          </div>
        </div>

        {!hideButton && (
          <Button
            className="hidden my-6 lg:mt-8 lg:mb-2 lg:block"
            variant="primary"
            type="submit"
            name="calculate"
            data-testid={`${
              formData.calculated ? 'recalculate' : 'calculate'
            }-button-${calculationType === 'joint' ? 'joint' : 'single'}`}
          >
            {formData.calculated
              ? z({ en: 'Recalculate', cy: 'Ailgyfrifo' })
              : z({ en: 'Calculate', cy: 'Cyfrifo' })}
          </Button>
        )}
      </div>
    </div>
  );
};
