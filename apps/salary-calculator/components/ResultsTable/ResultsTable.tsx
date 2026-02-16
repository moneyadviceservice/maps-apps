import React, { useState } from 'react';

import { SalaryBreakdownOutput } from 'utils/calculations/getSalaryBreakdown/getSalaryBreakdown';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { expandableContentMap } from './config/expandableContentMap';

export type FrequencyType = 'yearly' | 'monthly' | 'weekly' | 'daily';

export interface FrequencyAmount {
  yearly: number;
  monthly: number;
  weekly: number;
  daily: number;
}

export interface ResultsTableRow {
  key: string;
  label: { en: string; cy: string };
  getValue: (
    frequency?: FrequencyType,
    breakdown?: SalaryBreakdownOutput,
  ) => number;
  isBold?: boolean;
  className?: string;
  labelClassName?: string;
  expandableKey?: string;
}

export interface ResultsTableColumn {
  header?: { en: string; cy: string };
  getValue: (row: ResultsTableRow, frequency: FrequencyType) => string | number;
  className?: string;
  headerClassName?: string;
}

export interface ResultsTableProps {
  rows: ResultsTableRow[];
  columns: ResultsTableColumn[];
  frequency: FrequencyType;
  className?: string;
  tableClassName?: string;
}

export const ResultsTable = ({
  rows,
  columns,
  frequency,
  className = '',
  tableClassName = '',
}: ResultsTableProps) => {
  const { z } = useTranslation();

  const [moreInfoExpanded, setMoreInfoExpanded] = useState<
    Record<string, boolean>
  >({});

  const toggleMoreInfo = (key: string) => {
    setMoreInfoExpanded((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const showHeaders = columns.some((col) => col.header);

  return (
    <div className={`w-full pt-4 lg:pt-6 ${className}`}>
      <table
        className={`w-full border-collapse ${tableClassName}`}
        role="table"
      >
        {showHeaders && (
          <thead>
            <tr>
              {/* Empty TH for sticky label column */}
              <th
                className="sticky left-0 z-20 py-3 text-base font-bold text-left text-gray-800 bg-white border-r border-gray-200"
                scope="col"
                aria-label={z({
                  en: 'Salary breakdown row labels',
                  cy: 'Labeli rhesi dadansoddiad cyflog',
                })}
              >
                <span className="sr-only">Row labels</span>
              </th>

              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`pr-2 lg:pr-4 py-3 text-base font-bold text-right text-gray-800 lg:w-32 lg:min-w-32 ${
                    col.headerClassName ?? ''
                  }`}
                >
                  {col.header ? z(col.header) : ''}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {rows.map((row, rowIdx) => (
            <React.Fragment key={rowIdx}>
              {/* ROW 1 — normal data */}
              <tr className={row.className || ''}>
                <td
                  className={`
                    sticky left-0
                    bg-white
                  
                    pt-1 pr-1 align-top md:w-auto mb-4
                    ${row.labelClassName ?? ''}
                 `}
                >
                  <span className={`${row.isBold ? 'font-bold' : ''}`}>
                    {z(row.label)}
                  </span>
                </td>

                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`py-1 align-top pr-2 lg:pr-4 lg:w-32 lg:min-w-32 text-right ${
                      row.isBold ? 'font-bold' : ''
                    } ${col.className ?? ''}`}
                  >
                    {col.getValue(row, frequency)}
                  </td>
                ))}
              </tr>

              {/* ROW 2 — expandable, FULL WIDTH MORE INFO */}
              {row.expandableKey && expandableContentMap[row.expandableKey] && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="relative z-20 w-2/3"
                  >
                    <ExpandableSection
                      testClassName="py-0 ml-[6px] -mt-[4px] mr-[6px]"
                      variant="hyperlink"
                      open={!!moreInfoExpanded[row.expandableKey]}
                      onClick={() => {
                        if (row.expandableKey)
                          toggleMoreInfo(row.expandableKey);
                      }}
                      title={
                        <span className="text-[12px] font-normal leading-[140%] tracking-[0.12px] relative z-20">
                          {z({ en: 'More info', cy: 'Mwy o wybodaeth' })}
                        </span>
                      }
                      closedTitle={
                        <span className="text-[12px] font-normal leading-[140%] tracking-[0.12px] relative z-20">
                          {z({ en: 'Less info', cy: 'Llai o wybodaeth' })}
                        </span>
                      }
                    >
                      <div className="px-2 text-gray-800 font-normal leading-[140%] tracking-[0.12px]">
                        {expandableContentMap[row.expandableKey](z)}
                      </div>
                    </ExpandableSection>
                  </td>
                </tr>
              )}
              {/* Add full-width border AFTER the expandable section */}
              {(row.key === 'grossIncome' || row.key === 'totalDeductions') && (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="w-full border-b-2 border-gray-800" />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
