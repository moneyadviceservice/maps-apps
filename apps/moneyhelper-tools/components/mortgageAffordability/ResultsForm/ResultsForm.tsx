import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { ResultsCallout } from 'components/mortgageAffordability';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { PercentInput } from 'components/PercentInput';
import { Errors } from '@maps-react/common/components/Errors';
import { Button } from '@maps-react/common/components/Button';
import { RangeSlider } from 'components/RangeSlider';
import { JsOnly } from 'components/JsOnly';
import { convertStringToNumber } from 'utils/convertStringToNumber';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import {
  ResultFieldKeys,
  resultPrefix,
  resultsContent,
} from 'data/mortgage-affordability/results';
import {
  MAC_DEFAULT_REPAYMENT_TERM,
  MAC_REPAYMENT_TERM_MIN,
  MAC_REPAYMENT_TERM_MAX,
  MAC_DEFAULT_INTEREST,
  MAC_MIN_INTEREST,
  MAC_MAX_INTEREST,
} from 'data/mortgage-affordability/CONSTANTS';
import { validationFunctions } from 'utils/MortgageAffordabilityCalculator/validation';
import { Errors as ErrorType } from 'pages/[language]/mortgage-affordability-calculator';
import { twMerge } from 'tailwind-merge';
import {
  calculateMonthlyPayment,
  calculateRiskPercentage,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { addUnitToAriaLabel } from 'utils/addUnitToAriaLabel';

const keyPrefix = resultPrefix;

export type ResultData = Record<ResultFieldKeys, string>;

type Props = {
  formData: Record<string, string>;
  resultData: ResultData;
  lowerBorrowBound: number;
  upperBorrowBound: number;
  lang: 'en' | 'cy';
  pageErrors: ErrorType;
  updateChildFormData: (num: number, key: ResultFieldKeys) => void;
};

export const ResultsForm = ({
  formData,
  resultData,
  lowerBorrowBound,
  upperBorrowBound,
  lang,
  pageErrors,
  updateChildFormData,
}: Props) => {
  const { z } = useTranslation();
  const d = resultsContent(z);

  const [hasHydrated, setHasHydrated] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState<number>(
    convertStringToNumber(resultData[ResultFieldKeys.BORROW_AMOUNT]) ||
      (lowerBorrowBound + upperBorrowBound) / 2,
  );
  const [term, setTerm] = useState<number>(
    convertStringToNumber(resultData?.[ResultFieldKeys.TERM]) ||
      MAC_DEFAULT_REPAYMENT_TERM,
  );
  const [interestRate, setInterestRate] = useState<number>(
    convertStringToNumber(resultData?.[ResultFieldKeys.INTEREST]) ||
      MAC_DEFAULT_INTEREST,
  );
  const [borrowError, setBorrowError] = useState<string[]>(
    pageErrors?.[`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`]
      ? pageErrors[`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`]
      : [],
  );
  const [termError, setTermError] = useState<string[]>(
    pageErrors?.[`${keyPrefix}${ResultFieldKeys.TERM}`]
      ? pageErrors[`${keyPrefix}${ResultFieldKeys.TERM}`]
      : [],
  );
  const [interestError, setInterestError] = useState<string[]>(
    pageErrors?.[`${keyPrefix}${ResultFieldKeys.INTEREST}`]
      ? pageErrors[`${keyPrefix}${ResultFieldKeys.INTEREST}`]
      : [],
  );

  useEffect(() => setHasHydrated(true), []);
  const isServer = typeof window === 'undefined';

  const handleBorrowChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = convertStringToNumber(event.target.value);
    if (val !== undefined) {
      setBorrowAmount(val);
      updateChildFormData(val, ResultFieldKeys.BORROW_AMOUNT);
    }
  };

  const handleTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = convertStringToNumber(event.target.value);
    if (val !== undefined) {
      setTerm(val);
      updateChildFormData(val, ResultFieldKeys.TERM);
    }
  };

  const handleInterestChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = convertStringToNumber(event.target.value);
    if (val !== undefined) {
      setInterestRate(val);
      updateChildFormData(val, ResultFieldKeys.INTEREST);
    }
  };

  const transformPageErrorForInput = (pageError: string) => {
    return pageError?.split(' - ')[1];
  };

  useEffect(() => {
    const bounds = { lower: lowerBorrowBound, upper: upperBorrowBound };
    const hasError = validationFunctions[ResultFieldKeys.BORROW_AMOUNT](
      borrowAmount,
      ResultFieldKeys.BORROW_AMOUNT,
      lang,
      bounds,
    );
    if (hasError) {
      setBorrowError([hasError]);
    } else {
      setBorrowError([]);
    }
  }, [borrowAmount, lang, lowerBorrowBound, upperBorrowBound]);

  useEffect(() => {
    const hasError = validationFunctions[ResultFieldKeys.TERM](
      term,
      ResultFieldKeys.TERM,
      lang,
    );
    if (hasError) {
      setTermError([hasError]);
    } else {
      setTermError([]);
    }
  }, [term, lang]);

  useEffect(() => {
    const hasError = validationFunctions[ResultFieldKeys.INTEREST](
      interestRate,
      ResultFieldKeys.INTEREST,
      lang,
    );
    if (hasError) {
      setInterestError([hasError]);
    } else {
      setInterestError([]);
    }
  }, [interestRate, lang]);

  const monthlyPayment = useMemo(
    () => calculateMonthlyPayment(borrowAmount, interestRate, term),
    [borrowAmount, interestRate, term],
  );

  const riskPercentage = useMemo(() => {
    const incomeFields = [IncomeFieldKeys.TAKE_HOME];
    if (formData[OtherFieldKeys.SECOND_APPLICANT] === 'yes') {
      incomeFields.push(IncomeFieldKeys.SEC_TAKE_HOME);
    }

    const expenseFields = [
      ExpenseFieldKeys.CARD_AND_LOAN,
      ExpenseFieldKeys.CARE_SCHOOL,
      ExpenseFieldKeys.CHILD_SPOUSAL,
      ExpenseFieldKeys.TRAVEL,
      ExpenseFieldKeys.BILLS_INSURANCE,
    ];

    return calculateRiskPercentage(
      expenseFields,
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
        <div className="mb-4">
          <Errors errors={borrowError}>
            {borrowError && (
              <p
                data-testid="borrow-error"
                className="text-red-700 mb-1"
                aria-describedby={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              >
                {transformPageErrorForInput(borrowError[0])}
              </p>
            )}
            <label
              htmlFor={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              className={`block text-2xl mb-2`}
            >
              {d.fields.amountToBorrow}
            </label>
            <MoneyInput
              name={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              value={borrowAmount}
              onChange={handleBorrowChange}
              decimalScale={2}
              id={`${keyPrefix}${ResultFieldKeys.BORROW_AMOUNT}`}
              inputClassName={borrowError[0] ? `border border-red-700` : ''}
              inputBackground={`${inputBgColor}`}
              dataTestId={ResultFieldKeys.BORROW_AMOUNT}
              aria-label={addUnitToAriaLabel(
                d.fields.amountToBorrow,
                'pounds',
                z,
              )}
            />
            <JsOnly>
              <RangeSlider
                name={`s-${ResultFieldKeys.BORROW_AMOUNT}`}
                divClasses="mt-8 sr"
                onChange={handleBorrowChange}
                min={lowerBorrowBound}
                max={upperBorrowBound}
                value={borrowAmount}
                aria-hidden="true"
                tab-index="-1"
              />
            </JsOnly>
          </Errors>
        </div>
        <div className="mb-4 pt-4">
          <Errors errors={termError}>
            {termError && (
              <p
                data-testid="term-error"
                className="text-red-700 mb-1"
                aria-describedby={`${keyPrefix}${ResultFieldKeys.TERM}`}
              >
                {transformPageErrorForInput(termError[0])}
              </p>
            )}
            <label
              htmlFor={`${keyPrefix}${ResultFieldKeys.TERM}`}
              className={`block text-2xl mb-2`}
            >
              {d.fields.basedOnTerm}
            </label>
            <div
              className={twMerge(
                'flex border rounded',
                termError[0] ? 'border-red-700 border-2' : 'border-gray-400',
              )}
            >
              <NumberInput
                name={`${keyPrefix}${ResultFieldKeys.TERM}`}
                className={`border-0 rounded-l ${inputBgColor}`}
                value={term}
                onChange={handleTermChange}
                id={`${keyPrefix}${ResultFieldKeys.TERM}`}
                dataTestId={ResultFieldKeys.TERM}
                aria-label={addUnitToAriaLabel(
                  d.fields.basedOnTerm,
                  'years',
                  z,
                )}
              />
              <span
                aria-hidden
                className="bg-gray-100 py-2 px-3 border-l rounded-r border-gray-400 text-nowrap"
              >
                years
              </span>
            </div>
            <JsOnly>
              <RangeSlider
                name={`s-${ResultFieldKeys.TERM}`}
                divClasses="mt-8"
                onChange={handleTermChange}
                value={term}
                min={MAC_REPAYMENT_TERM_MIN}
                max={MAC_REPAYMENT_TERM_MAX}
                unit="years"
                aria-hidden="true"
                tab-index="-1"
              />
            </JsOnly>
          </Errors>
        </div>
        <div className="pt-4">
          <Errors errors={interestError}>
            {interestError && (
              <p
                data-testid="interest-error"
                className="text-red-700 mb-1"
                aria-describedby={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              >
                {transformPageErrorForInput(interestError[0])}
              </p>
            )}
            <label
              htmlFor={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              className={`block text-2xl mb-2`}
            >
              {d.fields.interestRate}
            </label>
            <PercentInput
              name={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              value={interestRate}
              onChange={handleInterestChange}
              id={`${keyPrefix}${ResultFieldKeys.INTEREST}`}
              inputClassName={
                interestError[0] ? 'border rounded border-red-700' : ''
              }
              inputBackground={`${inputBgColor}`}
              dataTestId={ResultFieldKeys.INTEREST}
              aria-label={addUnitToAriaLabel(
                d.fields.interestRate,
                'percent',
                z,
              )}
            />
            <JsOnly>
              <RangeSlider
                name={`s-${ResultFieldKeys.INTEREST}`}
                divClasses="mt-8"
                onChange={handleInterestChange}
                value={interestRate}
                min={MAC_MIN_INTEREST}
                max={MAC_MAX_INTEREST}
                unit="percentage"
                aria-hidden="true"
                tab-index="-1"
              />
            </JsOnly>
          </Errors>
        </div>
        {(!hasHydrated || isServer) && (
          <div className="flex flex-col">
            <Button
              className="place-self-start mb-8 mt-16"
              variant="secondary"
              type="submit"
              name="action"
              value="recalculate"
              form="mortgage-affordability-calculator"
              data-testid="mac-recalculate-nojs"
            >
              {z({
                en: 'Recalculate',
                cy: 'Ailgyfrifwch',
              })}
            </Button>
          </div>
        )}
      </div>
      <div className={`w-full lg:w-6/12 pl-8 h-fit`}>
        <ResultsCallout
          copy={d}
          borrowAmount={borrowAmount}
          term={term}
          interestRate={interestRate}
          formData={formData}
          isSummary={false}
        />
      </div>
    </div>
  );
};
