import { useEffect, useMemo, useState } from 'react';

import {
  AFFORDABILITY_EXPENSE_FIELDS,
  MAC_DEFAULT_INTEREST,
  MAC_DEFAULT_REPAYMENT_TERM,
  MAC_MAX_INPUT_VALUE,
  MAC_REPAYMENT_TERM_MAX,
  MAC_REPAYMENT_TERM_MIN,
} from 'data/mortgage-affordability/CONSTANTS';
import {
  ResultFieldKeys,
  resultPrefix,
  resultsContent,
} from 'data/mortgage-affordability/results';
import {
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import { Errors as ErrorType } from 'pages/[language]/';
import { twMerge } from 'tailwind-merge';
import {
  calculateMonthlyPayment,
  calculateRiskPercentage,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { PercentInput } from '@maps-react/form/components/PercentInput';
import { Select } from '@maps-react/form/components/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addUnitToAriaLabel } from '@maps-react/pension-tools/utils/addUnitToAriaLabel';
import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';
import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';
import { replacePlaceholder } from '@maps-react/pension-tools/utils/replacePlaceholder';

const keyPrefix = resultPrefix;

export type ResultData = Record<ResultFieldKeys, string>;

type Props = {
  formData: Record<string, string>;
  resultData: ResultData;
  lowerBorrowBound: number;
  upperBorrowBound: number;
  pageErrors: ErrorType;
};

export const ResultsForm = ({
  formData,
  resultData,
  lowerBorrowBound,
  upperBorrowBound,
  pageErrors,
}: Props) => {
  const { z } = useTranslation();
  const d = resultsContent(z);

  const [hasHydrated, setHasHydrated] = useState(false);

  const borrowAmount =
    convertStringToNumber(resultData[ResultFieldKeys.BORROW_AMOUNT]) ||
    (lowerBorrowBound + upperBorrowBound) / 2;
  const term = Math.min(
    MAC_REPAYMENT_TERM_MAX,
    Math.max(
      MAC_REPAYMENT_TERM_MIN,
      Math.round(
        convertStringToNumber(resultData?.[ResultFieldKeys.TERM]) ||
          MAC_DEFAULT_REPAYMENT_TERM,
      ),
    ),
  );
  const interestRate =
    convertStringToNumber(resultData?.[ResultFieldKeys.INTEREST]) ||
    MAC_DEFAULT_INTEREST;

  const borrowError =
    pageErrors?.[`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`] ?? [];
  const termError = pageErrors?.[`${keyPrefix}${ResultFieldKeys.TERM}`] ?? [];
  const interestError =
    pageErrors?.[`${keyPrefix}${ResultFieldKeys.INTEREST}`] ?? [];

  useEffect(() => setHasHydrated(true), []);

  const transformPageErrorForInput = (pageError: string) => {
    return pageError?.split(' - ')[1];
  };

  const termOptions = Array.from(
    { length: MAC_REPAYMENT_TERM_MAX - MAC_REPAYMENT_TERM_MIN + 1 },
    (_, i) => MAC_REPAYMENT_TERM_MIN + i,
  ).map((year) => ({
    text: `${year} ${
      year === 1
        ? z({ en: 'year', cy: 'flwyddyn' })
        : z({ en: 'years', cy: 'blynedd' })
    }`,
    value: String(year),
  }));

  const amountHint = useMemo(() => {
    const withLower = replacePlaceholder(
      'lowerBound',
      formatCurrency(lowerBorrowBound, 0),
      d.fieldHints.amount,
    );
    return replacePlaceholder(
      'upperBound',
      formatCurrency(upperBorrowBound, 0),
      withLower,
    );
  }, [d.fieldHints.amount, lowerBorrowBound, upperBorrowBound]);

  const monthlyPayment = useMemo(
    () => calculateMonthlyPayment(borrowAmount, interestRate, term),
    [borrowAmount, interestRate, term],
  );

  const riskPercentage = useMemo(() => {
    const incomeFields = [IncomeFieldKeys.TAKE_HOME];
    if (formData[OtherFieldKeys.SECOND_APPLICANT] === 'yes') {
      incomeFields.push(IncomeFieldKeys.SEC_TAKE_HOME);
    }

    return calculateRiskPercentage(
      AFFORDABILITY_EXPENSE_FIELDS,
      incomeFields,
      monthlyPayment,
      formData,
    );
  }, [monthlyPayment, formData]);

  const inputBgColor = useMemo(() => {
    if (hasHydrated) {
      return '';
    } else if (riskPercentage < 40) return 'bg-green-200';
    else if (riskPercentage > 60) return 'bg-red-100';
    return 'bg-yellow-100';
  }, [riskPercentage, hasHydrated]);

  return (
    <div className={`flex flex-wrap lg:flex-nowrap mb-8`}>
      <div className={`w-full lg:w-6/12 lg:pr-4`}>
        <Paragraph className="mb-6">{d.updateTheseFigures}</Paragraph>
        <div className="mb-4 max-w-md">
          <Errors errors={borrowError}>
            {borrowError.length > 0 && (
              <p
                data-testid="borrow-error"
                className="mb-1 text-red-700"
                aria-describedby={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              >
                {transformPageErrorForInput(borrowError[0])}
              </p>
            )}
            <label
              htmlFor={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              className={`block text-2xl mb-1`}
            >
              {d.fields.amountToBorrow}
            </label>
            <span
              id={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}-description`}
              className="block text-lg text-gray-650 mb-2"
            >
              {amountHint}
            </span>
            <MoneyInput
              name={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              defaultValue={borrowAmount}
              decimalScale={2}
              allowNegative={false}
              allowedDecimalSeparators={['.']}
              inputMode="decimal"
              id={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              inputClassName={twMerge(
                'w-full',
                borrowError[0] && 'border border-red-700',
              )}
              inputBackground={`${inputBgColor}`}
              dataTestId={ResultFieldKeys.BORROW_AMOUNT}
              aria-describedby={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}-description`}
              aria-label={addUnitToAriaLabel(
                d.fields.amountToBorrow,
                'pounds',
                z,
              )}
            />
          </Errors>
        </div>
        <div className="pt-4 mb-4 max-w-md">
          <Errors errors={termError}>
            {termError.length > 0 && (
              <p
                data-testid="term-error"
                className="mb-1 text-red-700"
                aria-describedby={`${keyPrefix}${ResultFieldKeys.TERM}`}
              >
                {transformPageErrorForInput(termError[0])}
              </p>
            )}
            <label
              htmlFor={`${keyPrefix}${ResultFieldKeys.TERM}`}
              className={`block text-2xl mb-1`}
            >
              {d.fields.basedOnTerm}
            </label>
            <span
              id={`${keyPrefix}${ResultFieldKeys.TERM}-description`}
              className="block text-lg text-gray-650 mb-2"
            >
              {d.fieldHints.term}
            </span>
            <Select
              id={`${keyPrefix}${ResultFieldKeys.TERM}`}
              name={`${keyPrefix}${ResultFieldKeys.TERM}`}
              options={termOptions}
              defaultValue={String(term)}
              hideEmptyItem
              hasError={termError.length > 0}
              selectClassName={inputBgColor}
              aria-description={d.fieldHints.term}
              aria-label={addUnitToAriaLabel(d.fields.basedOnTerm, 'years', z)}
            />
          </Errors>
        </div>
        <div className="pt-4 max-w-md">
          <Errors errors={interestError}>
            {interestError.length > 0 && (
              <p
                data-testid="interest-error"
                className="mb-1 text-red-700"
                aria-describedby={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              >
                {transformPageErrorForInput(interestError[0])}
              </p>
            )}
            <label
              htmlFor={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              className={`block text-2xl mb-1`}
            >
              {d.fields.interestRate}
            </label>
            <span
              id={`${keyPrefix}${ResultFieldKeys.INTEREST}-description`}
              className="block text-lg text-gray-650 mb-2"
            >
              {d.fieldHints.interest}
            </span>
            <PercentInput
              name={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              defaultValue={interestRate}
              decimalScale={2}
              allowNegative={false}
              allowedDecimalSeparators={['.']}
              isAllowed={({ floatValue }) =>
                floatValue === undefined ||
                (floatValue >= 0 && floatValue <= MAC_MAX_INPUT_VALUE)
              }
              id={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              inputClassName={twMerge(
                'w-full',
                interestError[0] && 'border rounded border-red-700',
              )}
              inputBackground={`${inputBgColor}`}
              dataTestId={ResultFieldKeys.INTEREST}
              aria-describedby={`${keyPrefix}${ResultFieldKeys.INTEREST}-description`}
              aria-label={addUnitToAriaLabel(
                d.fields.interestRate,
                'percent',
                z,
              )}
            />
          </Errors>
        </div>
        <Button
          className="w-full mt-8 md:w-auto"
          variant="primary"
          type="submit"
          name="action"
          value="recalculate"
          form="mortgage-affordability-calculator"
          data-testid="mac-update-results"
        >
          {d.updateMyResults}
        </Button>
      </div>
    </div>
  );
};
