import React, { ReactNode, SyntheticEvent } from 'react';

import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { Icon, IconType } from '../Icon/Icon';
import PieChart, { Data as PieChartProps } from '../PieChart';

export type PieData = PieChartProps & {
  value: number;
  tabName?: string;
  hasTick?: boolean;
  isEstimate?: boolean;
  url: string;
};

export type Props = {
  data: PieData[];
  heading?: string;
  babyCostStyle?: boolean;
  children?: ReactNode;
  onEdit?: (e: SyntheticEvent, name: string) => void;
};

export const SummarySpendBreakdown = ({
  data,
  heading,
  babyCostStyle = false,
  children,
  onEdit,
}: Props) => {
  const { z } = useTranslation();

  return (
    <div className="pt-4 lg:pl-7 lg:pt-0 lg:pb-0">
      {heading && (
        <Heading level="h4" component="h5" className="px-4 lg:p-0">
          {heading}
        </Heading>
      )}
      <div
        className={twMerge(
          babyCostStyle
            ? 'grid grid-cols-12 gap-4'
            : 'flex items-center lg:flex-row flex-col',
        )}
      >
        <div
          className={twMerge(
            babyCostStyle
              ? 'col-span-12 lg:col-span-5 px-16 lg:px-0'
              : 'lg:w-4/12 print:hidden w-3/4 px-4 lg:p-0 flex justify-center',
          )}
        >
          <PieChart items={data} />
        </div>
        <div
          className={twMerge(
            babyCostStyle
              ? 'col-span-12 lg:col-span-7 h-full'
              : 'w-full lg:w-8/12',
          )}
        >
          {babyCostStyle ? (
            <>
              {data.map((row, index) => (
                <div
                  className="grid grid-cols-7 mb-4 lg:grid-cols-5"
                  key={index}
                >
                  <div className="col-span-1">
                    <div className="flex justify-center flex-grow">
                      <span
                        className="print:hidden rounded-full h-[30px] w-[30px] mt-1 lg:mt-0 flex-none"
                        style={{ backgroundColor: row.colour }}
                      ></span>
                    </div>
                  </div>
                  <div className="col-span-3">{row.name}</div>
                  <div className="hidden lg:block lg:col-span-1"></div>

                  <div className="hidden col-span-1 lg:block"></div>
                  <div className="hidden col-span-3 font-bold lg:block">
                    £{row.value.toFixed(2)}
                  </div>
                  <div className="inline-flex col-span-1">
                    <Button
                      variant="link"
                      formAction={row.url}
                      analyticsClassName="tool-nav-submit"
                      className="text-center lg:text-right"
                    >
                      {z({ en: 'Edit', cy: 'Golygu' })}
                      <span className="sr-only">{row.name}</span>
                    </Button>
                  </div>
                  <div className="block col-span-2 pr-4 font-bold text-right lg:hidden">
                    £{row.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <table className="w-full border-separate lg:text-lg border-spacing-2 lg:border-spacing-5 lg:ml-10">
              <thead>
                <tr>
                  <th className="lg:w-9/12">
                    <span className="sr-only">Category</span>
                  </th>
                  <th className="hidden lg:w-1/12">
                    <span className="sr-only">Percentage</span>
                  </th>
                  <th className="hidden lg:w-1/12">
                    <span className="sr-only">Info</span>
                  </th>
                  <th className="text-right lg:w-1/12">
                    <span className="sr-only">Cost</span>
                  </th>
                  <th className="lg:w-1/12 print:hidden">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="align-top">
                {data.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="align-middle">
                        <div className="flex items-start flex-grow">
                          <span
                            className="print:hidden rounded-full h-[18px] w-[18px] md:h-[30px] md:w-[30px] mt-1 md:mt-0 flex-none"
                            style={{ backgroundColor: row.colour }}
                          ></span>
                          <span className="ml-[8px]">{row.name}</span>
                        </div>
                      </td>

                      <td className="hidden text-right align-middle print:block">
                        {row.percentage}%
                      </td>
                      <td className="hidden text-center align-middle print:hidden xlg:table-cell">
                        <Icon type={IconType.INFO_ICON} />
                      </td>
                      <td className="flex justify-end font-bold text-right align-top items-top lg:table-cell">
                        <span
                          className={
                            row.isEstimate
                              ? 'text-right bg-gray-100 border-l-4 border-yellow-700 rounded px-2 py-2'
                              : 'pl-4 pr-2 md:px-4 py-2 lg:hidden'
                          }
                        >
                          £{row.value.toFixed(2)}
                        </span>
                        {row.hasTick ? (
                          <Icon
                            type={IconType.TICK}
                            fill="green"
                            className="w-[20px]"
                          />
                        ) : null}
                      </td>
                      <td className="text-right align-top print:hidden lg:hidden">
                        <div className="mt-[7px]">
                          <Button
                            variant="link"
                            formAction={row.url}
                            analyticsClassName="tool-nav-submit"
                            onClick={
                              onEdit && ((e) => onEdit(e, row?.tabName ?? ''))
                            }
                          >
                            {z({
                              en: 'Edit',
                              cy: 'Golygu',
                            })}
                            <span className="sr-only">{row.name}</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="hidden text-left pl-[24px] justify-start items-top align-top font-bold lg:table-cell">
                        <div className="mt-[-14px]">
                          <span className="py-10 pl-4 pr-2">
                            £{row.value.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="justify-end hidden text-right align-top items-top print:hidden lg:table-cell">
                        <div className="mt-[-17px] mb-2">
                          <Button
                            variant="link"
                            formAction={row.url}
                            analyticsClassName="tool-nav-submit"
                            onClick={
                              onEdit && ((e) => onEdit(e, row.tabName ?? ''))
                            }
                          >
                            {z({ en: 'Edit', cy: 'Golygu' })}
                            <span className="sr-only">{row.name}</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
