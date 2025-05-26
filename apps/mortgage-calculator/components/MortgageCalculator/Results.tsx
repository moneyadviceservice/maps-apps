import { useEffect, useRef } from 'react';

import { useRouter } from 'next/router';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H3 } from '@maps-react/common/components/Heading';
import NumberFormat from '@maps-react/common/components/NumberFormat';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CalculationResult } from '../../pages/[language]/index';

type ResultsProps = {
  calculationResult: CalculationResult;
  analyticsData: AnalyticsData;
};

let completionEventFired = false;

export const Results = ({ calculationResult, analyticsData }: ResultsProps) => {
  const { z } = useTranslation();
  const resultRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addEvent } = useAnalytics();
  const getMortgageType = () => {
    const urlParams = new URLSearchParams(router.asPath.split('?')[1]);
    const type = urlParams.get('calculationType');

    if (type === 'repayment') {
      return 'Repayment';
    } else if (type === 'interestonly') {
      return 'Interest-only';
    }
    return type;
  };

  const calculationType = getMortgageType();

  const fireToolCompletionEvent = () => {
    addEvent({
      ...analyticsData,
      page: {
        ...analyticsData.page,
        lang: router.query.language === 'cy' ? 'cy' : 'en',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: router.query.isEmbedded === 'true' ? 'embedded' : 'direct',
      },
      tool: {
        ...analyticsData.tool,
        mortgageType: calculationType ?? undefined,
        toolCategory: '',
      },
      event: 'toolCompletion',
    });
    completionEventFired = true;
  };

  useEffect(() => {
    if (resultRef?.current) {
      resultRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!completionEventFired) {
      fireToolCompletionEvent();
    }
  }, [completionEventFired]);

  return (
    <div id="results">
      <UrgentCallout variant="mortgage" className="text-gray-800">
        <div className="space-y-4">
          <H3 className="text-[32px]">
            {z({ en: 'Your results', cy: 'Eich canlyniadau' })}
          </H3>
          <p className="text-lg">
            {z({
              en: 'To adjust the results, edit your answers.',
              cy: " addasu'r canlyniadau, newidiwch eich atebion.",
            })}
          </p>
          <p className="text-xl">
            {z({ en: 'Your monthly payment will be:', cy: 'Taliad misol:' })}
          </p>
          <p className="text-[38px] font-bold text-right t-result-monthly-payment">
            {calculationResult.monthlyPayment < 0 ? (
              <NumberFormat prefix="£" value={0} id="monthlyPayment" />
            ) : (
              <NumberFormat
                id="monthlyPayment"
                prefix="£"
                value={calculationResult.monthlyPayment}
              />
            )}
          </p>
          <hr className="h-px bg-gray-400 border-0"></hr>
          <p className="text-xl">
            {z({
              en: "Total you'll repay over the term:",
              cy: 'Cyfanswm y byddwch yn ad-dalu dros y cyfnod:',
            })}
          </p>
          <p className="text-[38px] font-bold text-right t-result-total-payable">
            {calculationResult.totalAmount < 0 ? (
              <NumberFormat prefix="£" value={0} id="totalAmount" />
            ) : (
              <NumberFormat
                id="totalAmount"
                prefix="£"
                value={calculationResult.totalAmount}
              />
            )}
          </p>
          <p className="text-xl">
            {z({ en: 'made up of:', cy: "wedi'i wneud o:" })}
          </p>
          <ul className="list-disc pl-5 !mt-1">
            <li>
              {calculationResult.capitalSplit < 0 ? (
                <NumberFormat id="capitalAmount" prefix="£" value={0} />
              ) : (
                <NumberFormat
                  id="capitalAmount"
                  prefix="£"
                  value={calculationResult.capitalSplit}
                />
              )}{' '}
              {z({ en: 'capital, and', cy: 'cyfalaf a' })}
            </li>
            <li>
              {calculationResult.interestSplit < 0 ? (
                <NumberFormat id="interestAmount" prefix="£" value={0} />
              ) : (
                <NumberFormat
                  id="interestAmount"
                  prefix="£"
                  value={calculationResult.interestSplit}
                />
              )}{' '}
              {z({ en: 'interest', cy: 'llog' })}
            </li>
          </ul>
          <ExpandableSection
            title={z({
              en: 'See breakdown of costs',
              cy: 'Gweld manylion y costau',
            })}
            variant="hyperlink"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-400">
                  <th className="w-1/2 pl-2 text-left">
                    {z({ en: 'Year', cy: 'Blwyddyn' })}
                  </th>
                  <th className="w-1/2 pl-5 text-left">
                    {z({ en: 'Remaining Debt', cy: "Dyled sy'n weddill" })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {calculationResult.balanceBreakdown.map((item) => (
                  <tr className="border-b border-slate-400" key={item.year}>
                    <td className="pl-2 text-left">{`${z({
                      en: 'Year',
                      cy: 'Blwyddyn',
                    })} ${item.year}`}</td>
                    <td className="py-2 pl-5 text-left">
                      {item.presentValue < 0 ? (
                        <NumberFormat
                          key={item.year}
                          prefix="£"
                          decimalScale={0}
                          value={0}
                        />
                      ) : (
                        <NumberFormat
                          key={item.year}
                          prefix="£"
                          decimalScale={0}
                          value={item.presentValue}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ExpandableSection>
          <Callout
            variant={CalloutVariant.INFORMATION}
            className="py-4 pr-4 t-urgent-callout pl-7"
          >
            <H3 className="text-[25px]" level="h3">
              {z({
                en: 'Make sure you can afford it!',
                cy: 'Sicrhewch y gallwch ei fforddio!',
              })}
            </H3>
            <p>
              {z({
                en: 'For example, if your interest rate goes up by 3%, your payment will be:',
                cy: 'Er enghraifft, os yw eich cyfradd llog yn cynyddu 3% bydd eich taliad yn:',
              })}
            </p>
            <p className="text-[20px] font-bold text-right">
              {calculationResult.changedPayment < 0 ? (
                <NumberFormat prefix="£" value={0} />
              ) : (
                <NumberFormat
                  prefix="£"
                  value={calculationResult.changedPayment}
                />
              )}
            </p>
          </Callout>
        </div>
      </UrgentCallout>
    </div>
  );
};
