import { DataFromQuery } from 'utils/pageFilter';
import { formatQuery } from 'utils/PensionPotCalculator/pensionPotValidationInputs';
import {
  getSavingDuration,
  SavingsCalculatorFrequency,
  savingsCalculatorResults,
  SavingsCalculatorResultsData,
  SavingsResults,
} from 'utils/SavingsCalculator/savingsCalculatorResults';
import { SavingsCalculatorType } from './SavingsCalculator';
import { NumericFormat } from 'react-number-format';
import { getMonthOptions } from 'data/form-content/questions/savings-calculator';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { H2, H3 } from '@maps-digital/shared/ui';
import { durationMessage } from 'utils/SavingsCalculator/savingsCalculatorDurationMessage';

export const SavingsCalculatorResults = ({
  queryData,
  calculatorType,
}: {
  queryData: DataFromQuery;
  calculatorType: SavingsCalculatorType;
}) => {
  const { z } = useTranslation();

  const query = {
    savingGoal: formatQuery(queryData.savingGoal),
    regularDeposit: formatQuery(queryData.amount),
    regularDepositFrequency: formatQuery(
      queryData.amountDuration,
    ) as unknown as SavingsCalculatorFrequency,
    initialDeposit: formatQuery(queryData.saved),
    annualRate: formatQuery(queryData.interest),
  } as SavingsCalculatorResultsData;

  if (calculatorType === SavingsCalculatorType.HOW_MUCH) {
    const date = new Date();
    date.setMonth(Number(queryData.durationMonth));
    date.setFullYear(Number(queryData.durationYear));
    query.savingDate = date;
  }

  const results = savingsCalculatorResults(query);

  const hasDifference = (results: SavingsResults) => {
    return (
      results.altMonthsToGoal.difference.years > 0 ||
      results.altMonthsToGoal.difference.months > 0
    );
  };

  return (
    <div className="basis-1/2 lg:ml-12 mb-12 lg:mb-0" id="results">
      <div className="border-[16px] rounded-bl-[36px] border-teal-300 p-4">
        <H2 className="mb-4">
          {z({
            en: 'Your results',
            cy: 'Eich canlyniadau',
          })}
        </H2>
        <p>
          {z({
            en: 'To adjust the results, edit your answers.',
            cy: 'I addasu’r canlyniadau, golygwch eich atebion',
          })}
        </p>

        {calculatorType === SavingsCalculatorType.HOW_MUCH && (
          <SavingsResultsHowMuch queryData={queryData} results={results} />
        )}

        {calculatorType === SavingsCalculatorType.HOW_LONG && (
          <SavingsResultsHowLong results={results} />
        )}

        {hasDifference(results) && (
          <SavingsCalculatorNotice
            results={results}
            queryData={queryData}
            calculatorType={calculatorType}
          />
        )}
      </div>
    </div>
  );
};

const SavingsResultsHowMuch = ({
  queryData,
  results,
}: {
  queryData: DataFromQuery;
  results: SavingsResults;
}) => {
  const { z } = useTranslation();

  return (
    <dl>
      <dt className="pt-4 text-lg">
        {z({
          en: 'You will need to save:',
          cy: 'Bydd yn cymryd tan:',
        })}
      </dt>
      <dd className="text-4xl text-right font-bold border-b-1 border-gray-400 pb-2 pt-4">
        <NumericFormat
          prefix="£"
          value={results.monthsToGoal.regularDeposit}
          thousandSeparator=","
          displayType="text"
        />{' '}
        {z({
          en: 'per month',
          cy: 'y mis',
        })}
      </dd>
      <dt className="pt-4 text-lg">
        {z({
          en: 'To meet your target of:',
          cy: 'I gyrraedd eich targed o:',
        })}
      </dt>
      <dd className="text-4xl text-right font-bold border-b-1 border-gray-400 pb-2 pt-4">
        {getMonthOptions(z)[queryData.durationMonth].text}{' '}
        {queryData.durationYear}
      </dd>
      <dt className="pt-4 text-lg">
        {z({
          en: 'Total you will save by this date:',
          cy: 'Cyfanswm byddwch yn ei arbed erbyn y dyddiad hwn:',
        })}
      </dt>
      <dd className="text-4xl text-right font-bold pb-4">
        <NumericFormat
          prefix="£"
          value={results.monthsToGoal.totalSaved}
          thousandSeparator=","
          displayType="text"
        />
      </dd>
    </dl>
  );
};

const SavingsResultsHowLong = ({ results }: { results: SavingsResults }) => {
  const { z } = useTranslation();

  const formatDate = ({ years, months }: { years: number; months: number }) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);
    const month = getMonthOptions(z)[date.getMonth()].text;
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const months = results.monthsToGoal.duration.months;
  const years = results.monthsToGoal.duration.years;

  return (
    <dl>
      <dt className="pt-4 text-lg">
        {z({
          en: 'It will take until:',
          cy: 'Bydd yn cymryd tan:',
        })}
      </dt>
      <dd className="text-4xl font-bold border-b-1 border-gray-400 pb-2 pt-4 flex flex-wrap justify-end">
        <div className="ml-auto">
          {formatDate(results.monthsToGoal.duration)}
        </div>
        {years > 0 && months > 0 && (
          <div className={twMerge(['ml-2', 'text-right'])}>
            (
            {years > 0
              ? `${years} ${z({
                  en: years === 1 ? 'year' : 'years',
                  cy: years === 1 ? 'blwyddyn' : 'mlynedd',
                })}`
              : ''}
            {years > 0 && months > 0 ? ' ' : ''}
            {months > 0
              ? `${months} ${z({
                  en: months === 1 ? 'month' : 'months',
                  cy: months === 1 ? 'mis' : 'misoedd',
                })}`
              : ''}
            )
          </div>
        )}
      </dd>
      <dt className="pt-4 text-lg">
        {z({
          en: 'To hit your goal of:',
          cy: 'I gyrraedd eich nod o:',
        })}
      </dt>
      <dd className="text-4xl text-right font-bold border-b-1 border-gray-400 pb-2 pt-4">
        <NumericFormat
          prefix="£"
          value={results.savingGoal}
          thousandSeparator=","
          displayType="text"
        />
      </dd>
      <dt className="pt-4 text-lg">
        {z({
          en: 'If you save:',
          cy: 'Os byddwch yn arbed:',
        })}
      </dt>
      <dd className="text-4xl text-right font-bold pb-4">
        <NumericFormat
          prefix="£"
          value={results.monthsToGoal.regularDeposit}
          thousandSeparator=","
          displayType="text"
        />{' '}
        {z({
          en: 'a',
          cy: 'y',
        })}{' '}
        {getSavingDuration(z, results.regularDepositFrequency)}
      </dd>
    </dl>
  );
};

const SavingsCalculatorNotice = ({
  results,
  calculatorType,
  queryData,
}: {
  results: SavingsResults;
  calculatorType: SavingsCalculatorType;
  queryData: DataFromQuery;
}) => {
  const { z } = useTranslation();

  return (
    <div className="bg-blue-50 px-6 py-8 rounded-bl-[24px]">
      <H3 className="mb-4 text-2xl leading-9">
        {z({
          en: 'Reach your goal sooner',
          cy: 'Cyrraedd eich nod yn gynt',
        })}
      </H3>
      <p>
        {z({
          en: 'You could reach your goal',
          cy: 'Gallech gyrraedd eich nod',
        })}{' '}
        <span className="font-bold">
          {durationMessage(z, results.altMonthsToGoal.difference)}{' '}
        </span>
        {z({
          en: 'by increasing your saving amount to',
          cy: 'Trwy gynyddu eich swm cynilo i',
        })}{' '}
        <span className="font-bold">
          <NumericFormat
            prefix="£"
            value={results.altMonthsToGoal.regularDeposit}
            thousandSeparator=","
            displayType="text"
          />
        </span>{' '}
        (
        {z({
          en: 'an increase of',
          cy: 'cynnydd o',
        })}{' '}
        <NumericFormat
          prefix="£"
          value={results.altMonthsToGoal.regularDepositIncrease}
          thousandSeparator=","
          displayType="text"
        />{' '}
        {calculatorType === SavingsCalculatorType.HOW_LONG && (
          <>
            {z({
              en: 'per',
              cy: 'y',
            })}{' '}
            {getSavingDuration(z, queryData.amountDuration)}
          </>
        )}
        {calculatorType === SavingsCalculatorType.HOW_MUCH && (
          <>
            {z({
              en: 'per month',
              cy: 'y mis',
            })}
          </>
        )}
        ).
      </p>
    </div>
  );
};
