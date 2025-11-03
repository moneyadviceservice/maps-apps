import { NumericFormat } from 'react-number-format';

import { H2 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionPotCalculatorResults } from '@maps-react/pension-tools/types';
import { formatQuery } from '@maps-react/pension-tools/utils/formatQuery';

import { SharedResultsHeading } from '../../data/form-content/text/guaranteedIncomeEstimator';
import { guaranteedIncomeCalculator } from '../../utils/guaranteedIncomeCalculator';

export const PensionPotGuaranteedIncomeResults = ({
  queryData,
  data,
}: Omit<PensionPotCalculatorResults, 'fields, onChange'>) => {
  const { z } = useTranslation();

  const results = guaranteedIncomeCalculator(
    formatQuery(queryData.pot),
    formatQuery(queryData.age),
  );

  return (
    <div id="results">
      <H2 className="text-blue-700 mb-6 md:mb-8">{data.resultTitle}</H2>
      {results && (
        <dl>
          <SharedResultsHeading
            pot={queryData.pot}
            taxFreeLumpSum={results.taxFreeLumpSum}
            text={z({
              en: 'pot in one go, you could get:',
              cy: 'i brynu blwydd-dal, gallech gael:',
            })}
          />
          <dt className="mb-2 font-medium">
            {z({
              en: 'and get:',
              cy: 'a chael:',
            })}
          </dt>
          <dd className="mb-4 text-4xl font-bold">
            <NumericFormat
              value={results.income}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'guaranteed annual taxable income, for the rest of your life',
              cy: 'o incwm trethadwy blynyddol gwarantedig, am weddill eich oes',
            })}
          </dd>
        </dl>
      )}
      <div className="mt-8 text-base">{data.calloutMessageResults}</div>
    </div>
  );
};
