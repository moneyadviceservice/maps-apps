import { useMemo } from 'react';

import { MACAnalytics } from 'components/Analytics';
import { ResultsCallout, ResultsForm } from 'components/mortgageAffordability';
import { CanYouAffordThisCard } from 'components/mortgageAffordability/CanYouAffordThisCard';
import { CompareHousingCostsCard } from 'components/mortgageAffordability/CompareHousingCostsCard';
import { ResultsLivingCostsForm } from 'components/mortgageAffordability/ResultsLivingCostsForm';
import { WhatIfInterestRatesRiseCard } from 'components/mortgageAffordability/WhatIfInterestRatesRiseCard';
import {
  AFFORDABILITY_EXPENSE_FIELDS,
  LOWER_PROFIT_MULTIPLIER,
  MAC_DEFAULT_INTEREST,
  MAC_DEFAULT_REPAYMENT_TERM,
  UPPER_PROFIT_MULTIPLIER,
} from 'data/mortgage-affordability/CONSTANTS';
import { errorMessages } from 'data/mortgage-affordability/errors';
import {
  ResultFieldKeys,
  resultsContent,
} from 'data/mortgage-affordability/results';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import { ParsedUrlQuery } from 'querystring';
import { getBound } from 'utils/MortgageAffordabilityCalculator';
import {
  calculateLeftOver,
  calculateMonthlyPayment,
  calculateTotalFormValues,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';

import { BackLink } from '@maps-react/common/components/BackLink';
import { H1, H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { convertQueryToUrlSearchParams } from '@maps-react/pension-tools/utils/convertQueryToUrlSearchParams';
import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';
import { replacePlaceholder } from '@maps-react/pension-tools/utils/replacePlaceholder';
import { AcdlFieldError } from '@maps-react/pension-tools/utils/TabToolUtils/generateFieldData/generateFieldData';
import { getErrors } from '@maps-react/pension-tools/utils/TabToolUtils/getErrors';

import {
  getServerSidePropsDefault,
  HiddenFields,
  MortgageAffordability,
} from '.';
import { getRiskLevel } from 'utils/MortgageAffordabilityCalculator/getRiskLevel';
import { NextSteps } from 'components/mortgageAffordability/NextSteps/NextSteps';

export interface ChildFormData {
  [ResultFieldKeys.BORROW_AMOUNT]: number;
  [ResultFieldKeys.TERM]: number;
  [ResultFieldKeys.INTEREST]: number;
  [ResultFieldKeys.LIVING_COSTS]?: number;
}

type Props = {
  lang: 'en' | 'cy';
  isEmbed: boolean;
  formData: Record<string, string>;
  resultData: Record<ResultFieldKeys, string>;
  errors: Record<ResultFieldKeys, string>;
  query: ParsedUrlQuery;
};

const Results = ({
  lang,
  isEmbed,
  formData,
  resultData,
  errors,
  query,
}: Props) => {
  const { z } = useTranslation();
  const { z: enTranslation } = useTranslation('en');
  const searchQuery = convertQueryToUrlSearchParams(query).toString();
  const d = resultsContent(z, searchQuery);
  const en_d = resultsContent(enTranslation);
  const borrowBounds = useMemo(() => {
    const getBorrowBound = (multiplier: number) => {
      const incomeFields = [
        IncomeFieldKeys.ANNUAL_INCOME,
        IncomeFieldKeys.OTHER_INCOME,
      ];
      if (formData[OtherFieldKeys.SECOND_APPLICANT] === 'yes') {
        incomeFields.push(IncomeFieldKeys.SEC_ANNUAL_INCOME);
        incomeFields.push(IncomeFieldKeys.SEC_OTHER_INCOME);
      }

      const expenseFields = [
        ExpenseFieldKeys.CARD_AND_LOAN,
        ExpenseFieldKeys.CHILD_SPOUSAL,
      ];

      return getBound(formData, incomeFields, expenseFields, multiplier);
    };

    return {
      lower: getBorrowBound(LOWER_PROFIT_MULTIPLIER),
      upper: getBorrowBound(UPPER_PROFIT_MULTIPLIER),
    };
  }, [formData]);

  const errorObj = useMemo(
    () => getErrors(errors, z, errorMessages),
    [errors, z],
  );

  const fixedAndCommittedFields = [
    ExpenseFieldKeys.CARD_AND_LOAN,
    ExpenseFieldKeys.CARE_SCHOOL,
    ExpenseFieldKeys.CHILD_SPOUSAL,
    ExpenseFieldKeys.TRAVEL,
    ExpenseFieldKeys.BILLS_INSURANCE,
  ];
  const fixedAndCommittedCosts = calculateTotalFormValues(
    fixedAndCommittedFields,
    formData,
  );

  const livingCostsFields = [
    ExpenseFieldKeys.LEISURE,
    ExpenseFieldKeys.HOLIDAYS,
    ExpenseFieldKeys.GROCERIES,
  ];
  const livingCosts = calculateTotalFormValues(livingCostsFields, formData);

  const resultDataDefault: ChildFormData = {
    [ResultFieldKeys.BORROW_AMOUNT]:
      convertStringToNumber(resultData?.[ResultFieldKeys.BORROW_AMOUNT]) ||
      (borrowBounds.lower + borrowBounds.upper) / 2,
    [ResultFieldKeys.TERM]:
      convertStringToNumber(resultData?.[ResultFieldKeys.TERM]) ||
      MAC_DEFAULT_REPAYMENT_TERM,
    [ResultFieldKeys.INTEREST]:
      convertStringToNumber(resultData?.[ResultFieldKeys.INTEREST]) ||
      MAC_DEFAULT_INTEREST,
    [ResultFieldKeys.LIVING_COSTS]:
      convertStringToNumber(resultData?.[ResultFieldKeys.LIVING_COSTS]) ||
      livingCosts ||
      0,
  };

  const lowerBorrowBound = borrowBounds.lower;
  const upperBorrowBound = borrowBounds.upper;

  const validation = {
    bounds: {
      lower: lowerBorrowBound,
      upper: upperBorrowBound,
    },
  };

  const monthlyIncomeFields = [IncomeFieldKeys.TAKE_HOME];
  if (formData[OtherFieldKeys.SECOND_APPLICANT] === 'yes') {
    monthlyIncomeFields.push(IncomeFieldKeys.SEC_TAKE_HOME);
  }
  const monthlyIncome = calculateTotalFormValues(monthlyIncomeFields, formData);

  const monthlyPayment = calculateMonthlyPayment(
    resultDataDefault[ResultFieldKeys.BORROW_AMOUNT],
    resultDataDefault[ResultFieldKeys.INTEREST],
    resultDataDefault[ResultFieldKeys.TERM],
  );

  const leftOver = calculateLeftOver(
    monthlyIncome,
    fixedAndCommittedCosts,
    livingCosts,
    monthlyPayment,
  );

  const resultDataAsStrings = {
    [ResultFieldKeys.BORROW_AMOUNT]: String(
      resultDataDefault[ResultFieldKeys.BORROW_AMOUNT],
    ),
    [ResultFieldKeys.TERM]: String(resultDataDefault[ResultFieldKeys.TERM]),
    [ResultFieldKeys.INTEREST]: String(
      resultDataDefault[ResultFieldKeys.INTEREST],
    ),
    [ResultFieldKeys.LIVING_COSTS]: String(
      resultDataDefault[ResultFieldKeys.LIVING_COSTS] || 0,
    ),
  };

  const riskLevel = getRiskLevel(
    resultDataAsStrings as Record<ResultFieldKeys, string>,
    AFFORDABILITY_EXPENSE_FIELDS,
    monthlyIncomeFields,
    formData,
  );

  const step = 3;

  const acdlErrors = useMemo(
    () =>
      errorObj.acdlErrors &&
      Object.keys(errorObj.acdlErrors).reduce<AcdlFieldError>((acc, error) => {
        switch (error) {
          case `${ResultFieldKeys.BORROW_AMOUNT}`: {
            let errorMessage = replacePlaceholder(
              'lowerBound',
              formatCurrency(lowerBorrowBound, 0),
              errorObj.acdlErrors?.[ResultFieldKeys.BORROW_AMOUNT][0],
            );
            errorMessage = replacePlaceholder(
              'upperBound',
              formatCurrency(upperBorrowBound, 0),
              errorMessage,
            );
            acc[error] = {
              error: {
                label: en_d?.fields.amountToBorrow,
                message: errorMessage,
              },
            };
            errorObj.pageErrors[error] = [errorMessage];
            break;
          }
          case `${ResultFieldKeys.INTEREST}`: {
            acc[error] = {
              error: {
                label: en_d?.fields.interestRate,
                message: errorObj.acdlErrors?.[ResultFieldKeys.INTEREST][0],
              },
            };
            break;
          }
          case `${ResultFieldKeys.TERM}`: {
            acc[error] = {
              error: {
                label: en_d.fields.basedOnTerm,
                message: errorObj.acdlErrors?.[ResultFieldKeys.TERM][0],
              },
            };
            break;
          }
          default:
            break;
        }
        return acc;
      }, {}),
    [
      errorObj.acdlErrors,
      errorObj.pageErrors,
      en_d.fields.amountToBorrow,
      en_d.fields.basedOnTerm,
      en_d.fields.interestRate,
      lowerBorrowBound,
      upperBorrowBound,
    ],
  );

  const currentRentMortgage = convertStringToNumber(
    formData[ExpenseFieldKeys.RENT_MORTGAGE],
  );
  const newMortgage = calculateMonthlyPayment(
    resultDataDefault[ResultFieldKeys.BORROW_AMOUNT],
    resultDataDefault[ResultFieldKeys.INTEREST],
    resultDataDefault[ResultFieldKeys.TERM],
  );

  return (
    <MortgageAffordability isEmbed={isEmbed} step={step}>
      <MACAnalytics
        currentStep={step}
        formData={formData}
        acdlErrors={acdlErrors}
      >
        <GridContainer>
          <div
            data-testid="tab-container-div"
            className="grid-cols-12 col-span-12 lg:col-span-10 xl:col-span-8"
          >
            <form
              action={'/api/mortgage-affordability-calculator/submit-results'}
              method="POST"
              id="mortgage-affordability-calculator"
            >
              <HiddenFields
                isEmbed={isEmbed}
                lang={lang}
                toolBaseUrl={`/${lang}/`}
                nextStep={'results'}
                formData={formData}
                resultData={resultData}
                currentStep={'results'}
                validation={validation}
              />
              <div className="mb-8 -mt-4">
                <BackLink href={`/${lang}/household-costs?${searchQuery}`}>
                  {z({ en: 'Back', cy: 'Yn ôl' })}
                </BackLink>
              </div>
              {errorObj.pageErrors && (
                <ErrorSummary
                  title={z({
                    en: 'There is a problem',
                    cy: 'Mae yna broblem',
                  })}
                  errors={errorObj.pageErrors}
                  errorKeyPrefix="r-"
                  classNames="lg:max-w-4xl"
                  containerClassNames="mb-6"
                />
              )}
              <H1 className="mb-8">{d.resultHeading}</H1>
              <Paragraph className="mb-4">{d.youMightBeOffered}</Paragraph>
              <H2 className="mb-8  md:text-[38px] leading-tight">
                {formatCurrency(lowerBorrowBound, 0)}{' '}
                {z({
                  en: 'and',
                  cy: 'a',
                })}{' '}
                {formatCurrency(upperBorrowBound, 0)}
              </H2>
              <ResultsCallout
                borrowAmount={
                  resultDataDefault?.[ResultFieldKeys.BORROW_AMOUNT]
                }
                term={resultDataDefault?.[ResultFieldKeys.TERM]}
                interest={resultDataDefault?.[ResultFieldKeys.INTEREST]}
                monthlyIncome={monthlyIncome}
                fixedAndCommittedCosts={fixedAndCommittedCosts}
                livingCosts={convertStringToNumber(
                  resultData[ResultFieldKeys.LIVING_COSTS],
                )}
                formData={formData}
              />
              <H2 className="mb-8 md:text-[38px] text-blue-700 pt-8 border-t border-slate-400">
                {d.changeYourResults}
              </H2>
              <ResultsForm
                formData={formData}
                resultData={resultData}
                lowerBorrowBound={lowerBorrowBound}
                upperBorrowBound={upperBorrowBound}
                pageErrors={errorObj.pageErrors}
              />
              <div className="space-y-6 lg:space-y-8 mb-4">
                <div>
                  <CompareHousingCostsCard
                    currentPaymentPerMonth={currentRentMortgage}
                    newPaymentPerMonth={newMortgage}
                  />
                </div>

                <div>
                  <CanYouAffordThisCard
                    monthlyIncome={monthlyIncome}
                    monthlyPayment={monthlyPayment}
                    fixedAndCommittedCosts={fixedAndCommittedCosts}
                    leftOver={leftOver}
                  />
                </div>

                <WhatIfInterestRatesRiseCard
                  borrowAmount={
                    resultDataDefault[ResultFieldKeys.BORROW_AMOUNT]
                  }
                  interest={resultDataDefault[ResultFieldKeys.INTEREST]}
                  term={resultDataDefault[ResultFieldKeys.TERM]}
                  monthlyIncome={monthlyIncome}
                  fixedAndCommittedCosts={fixedAndCommittedCosts}
                  livingCosts={convertStringToNumber(
                    resultData[ResultFieldKeys.LIVING_COSTS],
                  )}
                />
              </div>

              <div>
                <NextSteps riskLevel={riskLevel} />
              </div>

              <Paragraph className="mb-8">{d.changingTheTerm}</Paragraph>
              <H2 className="mb-8 md:text-[38px] text-blue-700 pt-8 border-t border-slate-400">
                {d.canYouAfford}
              </H2>
              {fixedAndCommittedCosts === 0 && (
                <Paragraph className="mb-8">{d.youHaventEntered}</Paragraph>
              )}
              <Paragraph className="mb-8">{d.yourEstimatedSpend}</Paragraph>
              <Paragraph className="mb-8 font-bold text-[32px]">
                {formatCurrency(fixedAndCommittedCosts)}
              </Paragraph>
              <Paragraph className="mb-8">{d.yourTotalTakeHome}</Paragraph>
              <Paragraph className="mb-8 font-bold text-[32px]">
                {formatCurrency(monthlyIncome)}
              </Paragraph>
              <ResultsLivingCostsForm
                resultData={resultDataDefault}
                livingCosts={livingCosts}
                monthlyIncome={monthlyIncome}
                fixedAndCommittedCosts={fixedAndCommittedCosts}
                searchQuery={searchQuery}
              />
              <Paragraph className="pt-8 mb-8 border-t border-slate-400">
                {d.thisIsAnEstimate}
              </Paragraph>

              <ToolFeedback />
              <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
                <SocialShareTool
                  url={`https://www.moneyhelper.org.uk/${lang}/homes/buying-a-home/mortgage-affordability-calculator`}
                  title={z({
                    en: 'Share this tool',
                    cy: 'Rhannwch yr offeryn hwn',
                  })}
                  subject={z({
                    en: 'Mortgage calculator - How much could you borrow?',
                    cy: 'Cyfrifiannell morgais - Faint allech chi ei fenthyg?',
                  })}
                  xTitle={z({
                    en: 'Mortgage calculator - How much could you borrow?',
                    cy: 'Cyfrifiannell morgais - Faint allech chi ei fenthyg?',
                  })}
                />
              </div>
            </form>
          </div>
        </GridContainer>
      </MACAnalytics>
    </MortgageAffordability>
  );
};

export default Results;

export const getServerSideProps = getServerSidePropsDefault;
