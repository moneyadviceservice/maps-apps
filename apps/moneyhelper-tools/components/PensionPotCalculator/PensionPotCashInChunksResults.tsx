import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { DataFromQuery } from 'utils/pageFilter';
import { NumericFormat } from 'react-number-format';
import { useRouter } from 'next/router';
import { Inputs } from './PensionPotCalculator';
import { Question } from 'types';
import { getText } from 'data/form-content/text/pension-pot-calculator';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { pensionPotChunkTax } from 'utils/PensionPotCalculator/pensionPotChunkTax';
import {
  formatQuery,
  getQueryData,
} from 'utils/PensionPotCalculator/pensionPotValidationInputs';
import { Button, H2 } from '@maps-digital/shared/ui';

export const PensionPotCashInChunksResults = ({
  queryData,
  fields,
  data,
  onChange,
}: {
  queryData: DataFromQuery;
  fields: Question[];
  data: ReturnType<typeof getText>;
  onChange: (e: ChangeEvent<HTMLInputElement>, field: Question) => void;
}) => {
  const { z } = useTranslation();
  const router = useRouter();
  const [jsEnabled, setJSEnabled] = useState(false);
  const field = fields.filter((f) => f.type === 'updateChunk');

  useEffect(() => {
    setJSEnabled(true);
  }, []);

  const results = pensionPotChunkTax(
    formatQuery(queryData.income),
    formatQuery(queryData.pot),
    formatQuery(
      queryData.updateChunk ? queryData.updateChunk : queryData.chunk,
    ),
  );

  const updateCashChunk = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      router.push(
        {
          pathname: router.route,
          query: {
            ...router.query,
            chunk: value || '0',
            updateChunk: value || '0',
          },
        },
        undefined,
        { scroll: false },
      );
    },
    [router],
  );

  return (
    <div id="results">
      <H2 className="text-blue-800 mb-6 md:mb-8">{data.resultTitle}</H2>
      {results && (
        <dl>
          <dt className="mb-2 font-medium">
            {z({
              en: 'If you take',
              cy: 'Os byddwch chi’n cymryd',
            })}{' '}
            <NumericFormat
              value={queryData.chunk}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'from your',
              cy: 'o’ch',
            })}{' '}
            <NumericFormat
              value={queryData.pot}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'pot, you could get:',
              cy: 'cronfa, gallech gael:',
            })}
          </dt>
          <dd className="mb-4">
            <NumericFormat
              value={results.amount}
              prefix="£"
              className="text-4xl font-bold"
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
              className=" inline"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'in tax',
              cy: 'mewn treth',
            })}
          </dd>
          <dt className="mb-2 font-medium">
            {z({
              en: 'Leaving:',
              cy: 'Yn gadael:',
            })}
          </dt>
          <dd className="mb-4 text-4xl font-bold">
            <NumericFormat
              value={results.remainingPot}
              prefix="£"
              thousandSeparator=","
              displayType="text"
            />{' '}
            {z({
              en: 'in your pot',
              cy: 'yn eich cronfa',
            })}
          </dd>
        </dl>
      )}
      <Inputs
        fields={field}
        queryData={getQueryData(queryData, 'Chunk')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateCashChunk(e);
          onChange(e, field[0]);
        }}
        errors={{}}
      />
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
      <div className="mt-8 text-base">{data.calloutMessageResults}</div>
    </div>
  );
};
