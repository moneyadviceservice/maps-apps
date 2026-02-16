import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';

import { useRouter } from 'next/router';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionToolsInputs } from '@maps-react/pension-tools/components/PensionToolsInputs/PensionToolsInputs';
import { PensionPotCalculatorResults } from '@maps-react/pension-tools/types';
import { filterQueryData } from '@maps-react/pension-tools/utils/filterQueryData';
import { formatQuery } from '@maps-react/pension-tools/utils/formatQuery';
import { isInputAllowedDefault } from '@maps-react/pension-tools/utils/inputValidation';

import { adjustableIncomeCalculator } from '../../utils/adjustableIncomeCalculator';

export const AdjustableIncomeResults = ({
  queryData,
  data,
  fields,
  onChange,
}: PensionPotCalculatorResults) => {
  const { z } = useTranslation();
  const router = useRouter();
  const field = fields?.filter((f) => f.type === 'updateMonth');
  const [jsEnabled, setJSEnabled] = useState(false);

  useEffect(() => {
    setJSEnabled(true);
  }, []);

  const num = formatQuery(queryData.updateMonth);

  const results = adjustableIncomeCalculator(
    formatQuery(queryData.pot),
    formatQuery(queryData.age),
    Math.max(0, !isNaN(num) ? num : 0) ?? 0,
  );

  const updateMonth = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      router.push(
        {
          pathname: router.route,
          query: {
            ...router.query,
            updateMonth: value || '0',
          },
        },
        undefined,
        { scroll: false },
      );
    },
    [router],
  );

  return (
    <div id="results" aria-live="polite">
      <H2 className="text-blue-700 mb-6 md:mb-8">{data.resultTitle}</H2>
      {results && (
        <dl>
          <SharedResultsHeading
            pot={queryData.pot}
            taxFreeLumpSum={results.taxFreeLumpSum}
            text={z({
              en: 'pension pot to take an adjustable income, you could get:',
              cy: 'i gymryd incwm addasiadwy, gallech gael:',
            })}
          />
          <dt className="mb-2 font-medium">
            {z({
              en: 'and',
              cy: 'ac',
            })}
          </dt>
          <dd className="mb-4 text-4xl font-bold">
            {z({
              en: 'a monthly income of',
              cy: 'incwm misol o',
            })}{' '}
            <NumericFormat
              value={results.monthlyDrawdownAmount}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'until you’re',
              cy: 'hyd nes rydych yn',
            })}{' '}
            <NumericFormat
              value={results.desiredIncomeWithPotGrowthLastsUntil}
              displayType="text"
            />
          </dd>
        </dl>
      )}
      {field?.map((f) => {
        return (
          <PensionToolsInputs
            key={f.type}
            field={f}
            queryData={filterQueryData(
              queryData,
              'Month',
              String(results.monthlyDrawdownAmount),
            )}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              updateMonth(e);
              onChange && onChange(e, field[0]);
            }}
            errors={{}}
            isAllowed={({ floatValue }) =>
              isInputAllowedDefault({ floatValue })
            }
            value={
              isNaN(queryData[f.type])
                ? String(results.monthlyDrawdownAmount)
                : Number(queryData[f.type]) > 0
                ? queryData[f.type]
                : ''
            }
          />
        );
      })}
      {!jsEnabled && (
        <Button
          className="my-4"
          variant="primary"
          id="submit"
          name="reSubmit"
          value="true"
        >
          {data.resultsButtonText}
        </Button>
      )}

      <div className="mt-8">
        <ul className="list-disc pl-6">
          <li className="mb-2">
            {z({
              en: `Average life expectancy for those aged 55 is mid-to-late 80s. A monthly income of £${results.monthlyIncomeUntilLifeExpectancy} could last until you’re 85, though you could live longer.`,
              cy: `Y disgwyliad oes ar gyfartaledd i'r rhai sy'n 55 oed yw canol i ddiwedd eu 80au. Gallai incwm misol o £${results.monthlyIncomeUntilLifeExpectancy} barhau tan rydych yn 85 oed, er y gallech fyw'n hirach.`,
            })}
          </li>
          {data.calloutMessageResults}
        </ul>
      </div>
    </div>
  );
};

export const SharedResultsHeading = ({
  pot,
  taxFreeLumpSum,
  text,
}: {
  pot: number;
  taxFreeLumpSum: number;
  text: string;
}) => {
  const { z } = useTranslation();
  return (
    <>
      <dt className="mb-2 font-medium">
        {z({
          en: 'Based on what you’ve told us, if you use your',
          cy: `Yn seiliedig ar beth rydych wedi'i ddweud wrthym, os byddwch yn defnyddio eich cronfa bensiwn`,
        })}{' '}
        <NumericFormat
          value={pot}
          prefix="£"
          thousandSeparator=","
          displayType="text"
        />{' '}
        {text}
      </dt>
      <dd className="mb-4 text-4xl font-bold">
        <NumericFormat
          value={taxFreeLumpSum}
          prefix="£"
          thousandSeparator=","
          displayType="text"
        />{' '}
        {z({
          en: 'tax free',
          cy: 'yn ddi-dreth',
        })}
      </dd>
    </>
  );
};
