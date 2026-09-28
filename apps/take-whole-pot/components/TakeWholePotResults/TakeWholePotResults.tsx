import { NumericFormat } from 'react-number-format';

import { H2 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionPotCalculatorResults } from '@maps-react/pension-tools/types';
import { formatQuery } from '@maps-react/pension-tools/utils/formatQuery';
import { pensionPotChunkTax } from '@maps-react/pension-tools/utils/pensionPotChunkTax';

export const TakeWholePotResults = ({
  queryData,
  data,
}: PensionPotCalculatorResults) => {
  const { z } = useTranslation();

  const results = pensionPotChunkTax(
    formatQuery(queryData.income),
    formatQuery(queryData.pot),
    formatQuery(queryData.pot),
  );

  return (
    <div id="results">
      <H2 className="text-blue-700 mb-6 md:mb-8">{data.resultTitle}</H2>
      {results && (
        <dl>
          <dt className="mb-2 font-medium">
            {z({
              en: 'Taking a pension worth',
              cy: 'Bydd cymryd pensiwn gwerth',
            })}{' '}
            <NumericFormat
              value={queryData.pot}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'in one go could give you an estimated:',
              cy: 'mewn un tro yn rhoi amcangyfrif i chi o:',
            })}
          </dt>
          <dd className="mb-4 text-4xl font-bold">
            <NumericFormat
              value={results.amount}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />
          </dd>
          <dt className="mb-2 font-medium">
            {z({
              en: "We estimate you'll pay:",
              cy: 'Rydym yn amcangyfrif y byddwch yn talu:',
            })}
          </dt>
          <dd className="mb-4 text-4xl font-bold">
            <NumericFormat
              value={results.taxDue}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'in tax',
              cy: 'mewn treth',
            })}
          </dd>
        </dl>
      )}
      <div className="mt-8 text-base">{data.calloutMessageResults}</div>
    </div>
  );
};
