import { NumericFormat } from 'react-number-format';
import { H2 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionPotCalculatorResults } from '@maps-react/pension-tools/types';
import { formatQuery } from '@maps-react/pension-tools/utils/formatQuery';

import {
  ResultsText,
  SharedResultsHeading,
} from '../../data/form-content/text/guaranteedIncomeEstimator';
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
              en: 'into a guaranteed income for life (an annuity) could give you an estimated: ',
              cy: 'yn incwm gwarantedig am oes (blwydd-dal) roi amcangyfrif i chi o: ',
            })}
          />
          <dt className="mb-2 font-medium">
            {z({
              en: 'and',
              cy: 'ac',
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
              en: 'as a fixed taxable income each year',
              cy: 'o incwm trethadwy sefydlog, pob flwyddyn',
            })}
          </dd>
        </dl>
      )}

      {data.calloutMessageResults}
      <ResultsText />
    </div>
  );
};
