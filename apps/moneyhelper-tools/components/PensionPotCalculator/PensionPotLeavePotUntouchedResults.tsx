import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';

import { useRouter } from 'next/router';

import { getText } from 'data/form-content/text/pension-pot-calculator';
import { leavePotUntouchedCalculator } from 'utils/PensionPotCalculator/leavePotUntouchedCalculator';
import { formatQuery } from 'utils/PensionPotCalculator/pensionPotValidationInputs';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Question } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { Inputs } from './PensionPotCalculator';

export const PensionPotLeavePotUntouchedResults = ({
  queryData,
  data,
  fields,
  onChange,
}: {
  queryData: DataFromQuery;
  data: ReturnType<typeof getText>;
  fields: Question[];
  onChange: (e: ChangeEvent<HTMLInputElement>, field: Question) => void;
}) => {
  const { z } = useTranslation();
  const [jsEnabled, setJSEnabled] = useState(false);
  const router = useRouter();
  const field = fields.filter((f) => f.type === 'updateMonth');

  useEffect(() => {
    setJSEnabled(true);
  }, []);

  const results = leavePotUntouchedCalculator(
    formatQuery(queryData.pot),
    formatQuery(queryData.month),
  );

  const updateMonth = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      router.push(
        {
          pathname: router.route,
          query: {
            ...router.query,
            month: value,
            updateMonth: value,
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
      <H2 className="text-blue-800 mb-6 md:mb-8">{data.resultTitle}</H2>
      <p>
        {z({
          en: 'Your pot could be worth this much over the next 5 years:',
          cy: 'Gallai eich cronfa fod werth gymaint a hyn dros y 5 years nesaf:',
        })}
      </p>
      {results && (
        <table className="table-auto w-full mb-6 my-4">
          <caption className="invisible h-0">
            {z({
              en: 'Estimated pot growth',
              cy: 'Tyfiant potiau amcangyfrifedig',
            })}
          </caption>
          <thead>
            <tr className="border-t border-slate-400">
              <th className="text-left py-2">
                {z({
                  en: 'Years left untouched',
                  cy: 'Blynyddoedd sydd heb eu cyffwrdd',
                })}
              </th>
              <th className="text-left py-2">
                {z({
                  en: 'Amount in your pot',
                  cy: 'Y swm yn eich cronfa',
                })}
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className="border-t border-slate-400 last:border-b"
              >
                <td className="font-semibold py-2">{index + 1}</td>
                <td className="font-semibold py-2">
                  <NumericFormat
                    value={result}
                    prefix="£"
                    thousandSeparator=","
                    displayType="text"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Inputs
        fields={field}
        queryData={queryData}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateMonth(e);
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
