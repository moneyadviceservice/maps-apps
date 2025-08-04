import { useEffect, useState } from 'react';

import { ParsedUrlQuery } from 'querystring';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Heading, Level } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { SummaryCalc } from '../../types/forms';
import { formatCurrency } from '../../utils/formatCurrency';

export type SummaryItem = {
  label: string;
  value: number;
  unit: string;
  calc?: SummaryCalc;
  hasUserData?: boolean;
};

type Props = {
  title: string;
  items: SummaryItem[];
  buttonFormId?: string;
  headingLevel?: Level;
  headingComponent?: React.ElementType;
  restartUrl?: string;
  displayDefaults?: boolean;
  containerClass?: string;
  saveUrl?: string;
  saveQuery?: ParsedUrlQuery;
};

export const TabSummaryWidget = ({
  title,
  items,
  buttonFormId,
  headingLevel,
  headingComponent,
  restartUrl,
  displayDefaults,
  containerClass,
  saveUrl,
  saveQuery,
}: Props) => {
  const { z } = useTranslation();

  const [hasHydrated, setHasHydrated] = useState(false);

  const isServer = typeof window === 'undefined';

  useEffect(() => setHasHydrated(true), []);

  const monthText = (value: number) => {
    return z({
      en: `month${value === 1 ? '' : 's'}`,
      cy: `${value === 2 ? 'fis' : 'mis'}`,
    });
  };

  const formattedValue = (value: number, unit: string) => {
    switch (unit) {
      case 'pounds': {
        return formatCurrency(value);
      }
      case 'months': {
        return `${value} ${monthText(value)}`;
      }
      default: {
        return value;
      }
    }
  };

  const hasDataToDisplay = (items: SummaryItem[]): boolean => {
    return items.some((item) => item.hasUserData);
  };

  if (!displayDefaults && !hasDataToDisplay(items)) {
    return <></>;
  }

  return (
    <div
      className={twMerge(
        'flex flex-col justify-between border border-slate-400 rounded',
        containerClass,
      )}
    >
      <div className="pt-2 pb-4 text-center px-7">
        <Heading
          level={headingLevel ?? 'h4'}
          component={headingComponent ?? 'h3'}
          data-testid="summary-heading"
        >
          {title}
        </Heading>
      </div>
      <table className="flex flex-col mx-2 text-xl">
        <tbody className="">
          {items.map(({ label, value, unit, calc, hasUserData }) => {
            const success = calc === 'result' && value >= 0;
            const error = calc === 'result' && value < 0;

            if (displayDefaults || hasUserData) {
              return (
                <tr
                  key={label.replace(' ', '-')}
                  className={twMerge(
                    'bg-gray-100 rounded-bl-lg flex justify-between rounded-[4px] mb-2 p-4',
                    success && ['bg-green-700 text-white'],
                    error && ['bg-red-700 text-white'],
                  )}
                  aria-live="polite"
                >
                  <td className="">{label}</td>
                  <td className="font-bold whitespace-nowrap">
                    {formattedValue(value, unit)}
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      {(!hasHydrated || isServer) && !restartUrl && (
        <div className="flex flex-col">
          <Button
            className="mx-2 my-2 w-44 place-self-end"
            variant="primary"
            type="submit"
            form={buttonFormId}
            name="action"
            value="refreshScreen"
          >
            {z({
              en: 'Apply changes',
              cy: 'Gwneud newidiadau',
            })}
          </Button>
        </div>
      )}
      {restartUrl && (
        <div className="flex flex-row justify-end gap-2 mb-2">
          <Button
            className="mx-2 my-2"
            variant="secondary"
            formAction={restartUrl}
          >
            {z({
              en: 'Reset calculator',
              cy: 'Ailosod y gyfrifiannell',
            })}
          </Button>
          {saveUrl && (
            <Link
              asButtonVariant="primary"
              className="mx-2 my-2"
              href={{
                pathname: saveUrl,
                query: saveQuery,
              }}
              type="button"
            >
              {z({
                en: 'Save',
                cy: 'Arbed',
              })}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
