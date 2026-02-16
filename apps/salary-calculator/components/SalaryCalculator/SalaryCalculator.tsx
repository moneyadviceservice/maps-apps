import { useEffect, useMemo, useState } from 'react';

import { BackToTop } from 'components/BackToTop';
import { CalculationTypeSelector } from 'components/CalculationTypeSelector';
import { NextSteps } from 'components/NextSteps/NextSteps';
import { FrequencyType } from 'components/ResultsTable/ResultsTable';
import { Salary2Data } from 'components/Salary2Data';
import { SalaryForm, SalaryFormData } from 'components/SalaryForm';
import { SalaryResults } from 'components/SalaryResults';
import { StudentLoans } from 'types';
import { parseErrors } from 'utils/errors/utils';
import { TaxYear } from 'utils/rates/types';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { H2, Heading } from '@maps-react/common/components/Heading';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer/TeaserCardContainer';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { salaryCalculatorAdditionalData } from '../../data/salary-calculator';
import { MobileModeSelector } from '../MobileModeSelector';
import { NoScriptSwitcher } from '../NoScriptSwitcher';

export type SalaryCalculatorProps = {
  calculationType: 'single' | 'joint';
  salary1: SalaryFormData;
  salary2?: SalaryFormData;
  errors?: string | null;
  isEmbed?: boolean;
  resultsFrequency: FrequencyType;
};

type CalculationType = 'single' | 'joint';

export const defaultStudentLoans: StudentLoans = {
  plan1: false,
  plan2: false,
  plan4: false,
  plan5: false,
  planPostGrad: false,
};

export const SalaryCalculator = ({
  calculationType: initialCalculationType,
  salary1,
  salary2,
  errors,
  isEmbed,
  resultsFrequency,
}: SalaryCalculatorProps) => {
  const { z, locale } = useTranslation();
  const language = useLanguage();

  const [calculationType, setCalculationType] = useState<CalculationType>(
    initialCalculationType,
  );
  const [showRadioButtons, setShowRadioButtons] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const [hasEverCalculated, setHasEverCalculated] = useState(false);

  const { otherTools } = useMemo(
    () => salaryCalculatorAdditionalData(z, isEmbed ?? false),
    [z, isEmbed],
  );

  useEffect(() => {
    const calculated =
      calculationType === 'joint'
        ? Boolean(salary1.calculated && salary2?.calculated)
        : Boolean(salary1.calculated);

    setIsCalculated(calculated);
  }, [calculationType, salary1.calculated, salary2?.calculated]);

  useEffect(() => {
    if (salary1.calculated || salary2?.calculated) {
      setHasEverCalculated(true);
    }
  }, [salary1.calculated, salary2?.calculated]);

  useEffect(() => {
    setShowRadioButtons(true);
  }, []);

  useEffect(() => {
    setCalculationType(initialCalculationType);
  }, [initialCalculationType]);

  const handleCalculationTypeChange = (type: CalculationType) => {
    setCalculationType(type);

    if (type === 'joint') {
      const element = document.getElementById('results-comparison');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const taxYear: TaxYear = '2025/26';

  const buttonText = hasEverCalculated
    ? z({ en: 'Recalculate', cy: 'Ailgyfrifo' })
    : z({ en: 'Calculate', cy: 'Cyfrifo' });

  const dataTestId = `${
    hasEverCalculated ? 'recalculate' : 'calculate'
  }-button-${calculationType}`;

  const backToTopLabel = {
    en: 'Back to top',
    cy: "Nôl i'r brig",
  };

  const defaultSalary2: SalaryFormData = {
    grossIncome: '',
    grossIncomeFrequency: 'annual',
    hoursPerWeek: '',
    daysPerWeek: '',
    taxCode: '',
    isScottishResident: false,
    country: 'England/NI/Wales',
    pensionType: 'percentage',
    pensionValue: 0,
    studentLoans: defaultStudentLoans,
    isBlindPerson: null,
    isOverStatePensionAge: null,
    calculated: false,
  };

  const salary2Data = salary2 ?? defaultSalary2;

  const mobileProps = {
    showRadioButtons,
    calculationType,
    handleCalculationTypeChange,
    z,
  };

  const showAdditionalInfo =
    (calculationType === 'single' && salary1.calculated) ||
    (calculationType === 'joint' && salary1.calculated && salary2?.calculated);

  const normalizeSalary = (salary: SalaryFormData) => ({
    grossIncome: salary.grossIncome ?? '',
    grossIncomeFrequency: salary.grossIncomeFrequency ?? 'annual',
    hoursPerWeek: salary.hoursPerWeek ?? '',
    daysPerWeek: salary.daysPerWeek ?? '',
    taxCode: salary.taxCode ?? '',
    pensionType: salary.pensionType ?? 'percentage',
    pensionValue: salary.pensionValue ?? 0,
    studentLoans: salary.studentLoans ?? defaultStudentLoans,
    country: salary.country ?? 'England/NI/Wales',
    isBlindPerson: salary.isBlindPerson ?? false,
    isOverStatePensionAge: salary.isOverStatePensionAge ?? false,
  });
  const parsedErrors = parseErrors(errors, z, salary1, salary2);

  return (
    <div>
      <GridContainer>
        <div className="col-span-12 pt-6 lg:pt-8">
          {!isEmbed && (
            <div className="flex items-center text-magenta-500 group">
              <BackLink
                href={`https://www.moneyhelper.org.uk/${locale}/work/employment/salary-calculator`}
                data-testid="back-link"
              >
                {z({ en: 'Back', cy: 'Nôl' })}
              </BackLink>
            </div>
          )}

          <Heading level="h1" className="py-6 text-blue-700 md:py-8">
            {z({
              en: 'How much is my take home pay?',
              cy: 'Faint yw fy nghyflog mynd adref?',
            })}
          </Heading>
        </div>

        <NoScriptSwitcher
          calculationType={calculationType}
          salary1={salary1}
          salary2={salary2}
          locale={locale}
          z={z}
        />
      </GridContainer>

      <GridContainer>
        <div className="col-span-12 lg:block">
          {errors && (
            <ErrorSummary
              title={z({
                en: 'There is a problem',
                cy: 'Mae yna broblem',
              })}
              errors={parsedErrors}
              classNames="lg:max-w-4xl mb-4"
              containerClassNames=""
            />
          )}
        </div>
        <CalculationTypeSelector
          calculationType={calculationType}
          setCalculationType={setCalculationType}
          showRadioButtons={showRadioButtons}
          errors={errors}
          z={z}
        />

        <form
          method="post"
          action={`/api/calculate#results${
            calculationType === 'joint' ? '-comparison' : ''
          }`}
          className="contents"
        >
          <input type="hidden" name="calculationType" value={calculationType} />
          <input type="hidden" name="isEmbed" value={`${isEmbed}`} />
          <input type="hidden" name="language" value={language} />
          <input
            type="hidden"
            name="recalculated"
            value={isCalculated ? 'true' : 'false'}
          />

          {/* Preserve salary 2 values when switching back to single */}
          {calculationType === 'single' && salary2Data && (
            <Salary2Data salary2Data={salary2Data} />
          )}

          {calculationType === 'joint' ? (
            <>
              <div className="col-span-12 lg:col-span-6 xl:col-span-5">
                <SalaryForm
                  formData={salary1}
                  formNumber={1}
                  calculationType={calculationType}
                  hideButton={true}
                  isNestedForm={true}
                  errors={errors}
                />
              </div>

              <MobileModeSelector {...mobileProps} />

              <div className="col-span-12 mt-0 lg:col-span-6 xl:col-span-5">
                <SalaryForm
                  formData={salary2Data}
                  prefix="salary2_"
                  formNumber={2}
                  calculationType={calculationType}
                  hideButton={true}
                  isNestedForm={true}
                  errors={errors}
                />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-12 lg:col-span-6 xl:col-span-5">
                <SalaryForm
                  formData={salary1}
                  formNumber={1}
                  calculationType={calculationType}
                  hideButton={false}
                  isNestedForm={true}
                  errors={errors}
                />
              </div>

              <MobileModeSelector {...mobileProps} />
            </>
          )}

          {/* Mobile BackToTop - above calculate button */}
          <div className="col-span-12 mt-4 lg:hidden">
            <BackToTop />
          </div>

          {/* Calculate button - mobile and joint desktop */}
          <div
            className={`col-span-12 ${
              calculationType === 'single' ? 'lg:hidden' : ''
            }`}
          >
            <Button
              className="w-full my-8 lg:my-8 lg:w-auto lg:self-start"
              variant="primary"
              type="submit"
              name="calculate"
              data-testid={dataTestId}
            >
              {buttonText}
            </Button>
          </div>
        </form>

        {/* Salary Result */}
        <SalaryResults
          calculationType={calculationType}
          salary1={salary1}
          salary2={salary2Data}
          taxYear={taxYear}
          resultsFrequency={resultsFrequency}
          normalizeSalary={normalizeSalary}
        />

        {/* Desktop BackToTop - only for desktop after results, single or joint */}
        <div className="hidden col-span-12 mt-2 lg:block lg:col-span-10">
          <BackToTop label={backToTopLabel} />
        </div>
      </GridContainer>

      {/* Mobile BackToTop - after results (if calculated) */}
      {isCalculated && (
        <GridContainer>
          <div className="col-span-12 mt-4 lg:hidden">
            <BackToTop label={backToTopLabel} />
          </div>
        </GridContainer>
      )}

      {showAdditionalInfo && (
        <>
          <NextSteps
            salary1={normalizeSalary(salary1)}
            salary2={salary2 ? normalizeSalary(salary2) : undefined}
          />
          <GridContainer>
            <div className="col-span-12 mt-6 lg:col-span-12 xl:col-span-10 lg:mt-8">
              <Heading level="h1" className="mb-6 text-blue-700 md:mb-8">
                {otherTools.heading}
              </Heading>

              <TeaserCardContainer gridCols={2}>
                {otherTools.items.map((item) => (
                  <TeaserCard
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    image={item.image}
                    description={item.description}
                    imageClassName={item.imageClassName}
                    headingLevel="h5"
                    headingComponent={H2}
                  />
                ))}
              </TeaserCardContainer>
            </div>
          </GridContainer>

          <GridContainer>
            <div className="col-span-12 mt-6 lg:col-span-12 xl:col-span-10 lg:mt-8">
              <ToolFeedback />
              <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
                <SocialShareTool
                  url={`https://www.moneyhelper.org.uk/${language}/work/employment/salary-calculator`}
                  title={z({
                    en: 'Share this tool',
                    cy: 'Rhannwch yr offeryn hwn',
                  })}
                  subject={z({
                    en: 'Salary calculator – work out your take home pay in two minutes',
                    cy: 'Cyfrifiannell gyflog – cyfrifwch eich tâl net mewn dwy funud',
                  })}
                  xTitle={z({
                    en: 'Salary calculator – work out your take home pay in two minutes',
                    cy: 'Cyfrifiannell gyflog – cyfrifwch eich tâl net mewn dwy funud',
                  })}
                />
              </div>
            </div>
          </GridContainer>
        </>
      )}

      {isCalculated && (
        <GridContainer>
          <div className="col-span-12 mt-4 lg:mt-8 lg:col-span-12 xl:col-span-10">
            <BackToTop />
          </div>
        </GridContainer>
      )}
    </div>
  );
};
