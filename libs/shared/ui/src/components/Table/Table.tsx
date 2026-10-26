import type { JSX } from 'react';

import { twMerge } from 'tailwind-merge';

import { H6 } from '../Heading';

export type TableProps = {
  className?: string;
  title?: string;
  layout?: 'auto' | 'fixed';
  columnHeadings?: string[];
  data: TableData;
  variant?: 'numeric';
};

type Cell = {
  isHeading?: boolean;
  className?: string;
  data: string | JSX.Element;
};

type Row = {
  cells: Cell[];
};

type Data = {
  rows: Row[];
};

export type TableData = (string | JSX.Element)[][] | Data;

function isData(obj: TableData): obj is Data {
  return typeof obj === 'object' && obj !== null && 'rows' in obj;
}

export const Table = ({
  title,
  layout = 'auto',
  columnHeadings,
  data,
  variant,
  className,
}: TableProps) => {
  const isNumericVariant = variant === 'numeric';
  return (
    <div className={twMerge(['py-6'], className)}>
      {title && <H6 className="text-left">{title}</H6>}
      <table className={`table-${layout} w-full ${title ? 'mt-2' : ''}`}>
        {columnHeadings && (
          <thead>
            <tr className="border-b border-slate-400">
              {columnHeadings?.map((heading, index) => (
                <th
                  key={index}
                  className={`py-2 pl-2 text-left ${
                    isNumericVariant && index === 1
                      ? 'pl-[105px] xl:pl-[115px]'
                      : ''
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {isData(data)
            ? data.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-400">
                  {row.cells.map((cell, cellIndex) => {
                    const Element = cell.isHeading ? 'th' : 'td';

                    return (
                      <Element
                        key={cellIndex}
                        className={twMerge(
                          ['text-left', 'py-2', 'pl-2'],
                          cell.className,
                        )}
                      >
                        {cell.data}
                      </Element>
                    );
                  })}
                </tr>
              ))
            : data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-400">
                  {row.map((column, columnIndex) => (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                      className={`py-2 pl-2 ${
                        isNumericVariant && columnIndex === 1
                          ? 'pl-[105px] xl:pl-[115px]'
                          : ''
                      }`}
                    >
                      {column}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
