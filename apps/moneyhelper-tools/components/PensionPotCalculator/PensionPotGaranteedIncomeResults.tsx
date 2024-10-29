import React from 'react';
import { DataFromQuery } from '@maps-react/utils/pageFilter';
import { NumericFormat } from 'react-number-format';
import { getText } from 'data/form-content/text/pension-pot-calculator';
import { guaranteedIncomeCalculator } from 'utils/PensionPotCalculator/guaranteedIncomeCalculator';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { formatQuery } from 'utils/PensionPotCalculator/pensionPotValidationInputs';
import { H2 } from '@maps-digital/shared/ui';
import { SharedResultsHeading } from './PensionPotAdjustableIcomeResults';

export const PensionPotGaranteedIncomeResults = ({
  queryData,
  data,
}: {
  queryData: DataFromQuery;
  data: ReturnType<typeof getText>;
}) => {
  const { z } = useTranslation();

  const results = guaranteedIncomeCalculator(
    formatQuery(queryData.pot),
    formatQuery(queryData.age),
  );

  return (
    <div id="results">
      <H2 className="text-blue-800 mb-6 md:mb-8">{data.resultTitle}</H2>
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
