import { useMemo, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import {
  MortgageAffordability,
  getServerSidePropsDefault,
  HiddenFields,
} from '.';
import {
  resultsContent,
  ResultFieldKeys,
} from 'data/mortgage-affordability/results';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { H1, H2 } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { Button } from '@maps-react/common/components/Button';
import { BackLink } from '@maps-react/common/components/BackLink';
import { convertQueryToUrlSearchParams } from 'utils/convertQueryToUrlSearchParams';
import { ResultsForm, ResultsSummary } from 'components/mortgageAffordability';
import { formatCurrency } from 'utils/formatCurrency';
import {
  IncomeFieldKeys,
  ExpenseFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import { getBound } from 'utils/MortgageAffordabilityCalculator';
import {
  UPPER_PROFIT_MULTIPLIER,
  LOWER_PROFIT_MULTIPLIER,
  MAC_DEFAULT_REPAYMENT_TERM,
  MAC_DEFAULT_INTEREST,
} from 'data/mortgage-affordability/CONSTANTS';
import { convertStringToNumber } from 'utils/convertStringToNumber';
import { calculateTotalFormValues } from 'utils/MortgageAffordabilityCalculator/calculateResultValues';
import { ResultsLivingCostsForm } from 'components/mortgageAffordability/ResultsLivingCostsForm';
import { MACAnalytics } from 'components/Analytics';
import { replacePlaceholder } from 'utils/replacePlaceholder';
import { AcdlFieldError } from 'utils/TabToolUtils/generateFieldData/generateFieldData';
import { getErrors } from 'utils/TabToolUtils/getErrors';
import { errorMessages } from 'data/mortgage-affordability/errors';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface ChildFormData {
  [ResultFieldKeys.BORROW_AMOUNT]: number;
  [ResultFieldKeys.TERM]: number;
  [ResultFieldKeys.INTEREST]: number;
  [ResultFieldKeys.LIVING_COSTS]?: number;
}

type Props = {
  lang: 'en' | 'cy';
  urlPath: string;
  isEmbed: boolean;
  formData: Record<string, string>;
  resultData: Record<ResultFieldKeys, string>;
  errors: Record<ResultFieldKeys, string>;
  query: ParsedUrlQuery;
};

const Results = ({
  lang,
  urlPath,
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

  const errorObj = useMemo(() => getErrors(errors, z, errorMessages), [errors]);

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

  const resultDataDefault = {
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

  const [resultFormData, setResultFormData] =
    useState<ChildFormData>(resultDataDefault);

  const updateChildFormData = (num: number, key: ResultFieldKeys) => {
    setResultFormData({ ...resultFormData, [key]: num });
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

  return (
    <MortgageAffordability
      isEmbed={isEmbed}
      pageErrors={errorObj.pageErrors}
      errorKeyPrefix={'r-'}
      step={step}
    >
      <MACAnalytics
        currentStep={step}
        formData={formData}
        acdlErrors={acdlErrors}
      >
        <Container>
          <div className="max-w-[950px]" data-testid="tab-container-div">
            <form
              action={'/api/mortgage-affordability-calculator/submit-results'}
              method="POST"
              id="mortgage-affordability-calculator"
            >
              <HiddenFields
                isEmbed={isEmbed}
                lang={lang}
                toolBaseUrl={`/${lang}${urlPath}`}
                nextStep={'next-steps'}
                formData={formData}
                resultData={resultData}
                currentStep={'results'}
                validation={validation}
              />
              <div className="mb-8 -mt-4">
                <BackLink
                  href={`/${lang}${urlPath}household-costs?${searchQuery}`}
                >
                  {z({ en: 'Back', cy: 'Yn ôl' })}
                </BackLink>
              </div>
              <H1 className="mb-8 md:text-[48px]">{d.resultHeading}</H1>
              <Paragraph className="mb-4">{d.youMightBeOffered}</Paragraph>
              <Paragraph className="mb-8 font-bold text-[38px]">
                {formatCurrency(lowerBorrowBound, 0)}{' '}
                {z({
                  en: 'and',
                  cy: 'a',
                })}{' '}
                {formatCurrency(upperBorrowBound, 0)}
              </Paragraph>
              <ResultsForm
                formData={formData}
                resultData={resultData}
                lowerBorrowBound={lowerBorrowBound}
                upperBorrowBound={upperBorrowBound}
                lang={lang}
                pageErrors={errorObj.pageErrors}
                updateChildFormData={updateChildFormData}
              />
              <Paragraph className="mb-8">{d.changingTheTerm}</Paragraph>
              <H2 className="mb-8 md:text-[38px] text-blue-800 pt-8 border-t border-slate-400">
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
              <ResultsSummary
                formData={formData}
                resultFormData={resultFormData}
                searchQuery={searchQuery}
              />
              <ResultsLivingCostsForm
                resultData={resultFormData}
                livingCosts={livingCosts}
                monthlyIncome={monthlyIncome}
                fixedAndCommittedCosts={fixedAndCommittedCosts}
                searchQuery={searchQuery}
              />
              <Paragraph className="mb-8 pt-8 border-t border-slate-400">
                {d.thisIsAnEstimate}
              </Paragraph>
              <div className="flex justify-start flex-col lg:gap-4 md:flex-row my-8">
                <Button
                  className={'md:my-8'}
                  variant="primary"
                  id={'continue'}
                  type="submit"
                  form="mortgage-affordability-calculator"
                >
                  {d.nextSteps}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </MACAnalytics>
    </MortgageAffordability>
  );
};

export default Results;

export const getServerSideProps = getServerSidePropsDefault;
