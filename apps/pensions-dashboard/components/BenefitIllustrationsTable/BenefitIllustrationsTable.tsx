import { twMerge } from 'tailwind-merge';

import useTranslation from '@maps-react/hooks/useTranslation';

import { BenefitIllustration, RecurringIncomeDetails } from '../../lib/types';
import {
  formatDate,
  getAnnualAmount,
  getBenefitType,
  getMonthlyAmount,
} from '../../lib/utils';
import { PensionDCPotRow } from '../PensionDCPotRow';

const rowClasses = 'border-b-1 border-b-slate-400';
const cellClasses = 'py-3 text-left align-top';

type BenefitsIllustrationsTableProps = {
  data: BenefitIllustration[];
  hasPayableDetails?: boolean;
};

export const BenefitsIllustrationsTable = ({
  data,
  hasPayableDetails,
}: BenefitsIllustrationsTableProps) => {
  const { t } = useTranslation();

  return data?.length > 0 ? (
    <div className="relative mb-16 overflow-x-auto">
      <table className="w-[800px] md:w-full">
        <thead>
          <tr className={rowClasses}>
            <th className="w-1/4 md:w-1/2 border-b-1 border-b-slate-400"></th>
            {data.map((illustration) =>
              illustration.illustrationComponents.map((comp) => (
                <th className={cellClasses} key={comp.illustrationType}>
                  {comp.illustrationType}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody>
          <tr className={rowClasses}>
            <td className={twMerge(cellClasses, 'font-bold')}>
              {t('pages.pension-details.details.benefit-type')}
            </td>
            {data.map((illustration) =>
              illustration.illustrationComponents.map((comp) => {
                return (
                  <td className={cellClasses} key={comp.illustrationType}>
                    {getBenefitType[comp.benefitType]}
                  </td>
                );
              }),
            )}
          </tr>
          {hasPayableDetails && (
            <>
              <tr className={rowClasses}>
                <td className={twMerge(cellClasses, 'font-bold')}>
                  {t('pages.pension-details.details.annual-amount')}
                </td>

                {data.map((illustration) =>
                  illustration.illustrationComponents.map((component) => {
                    return (
                      <td
                        className={cellClasses}
                        key={component.illustrationType}
                      >
                        {getAnnualAmount(component)
                          ? getAnnualAmount(component)
                          : t('common.amount-unavailable')}{' '}
                        {t('common.a-year')}
                      </td>
                    );
                  }),
                )}
              </tr>

              <tr className={rowClasses}>
                <td className={twMerge(cellClasses, 'font-bold')}>
                  {t('pages.pension-details.details.monthly-amount')}
                </td>
                {data.map((illustration) =>
                  illustration.illustrationComponents.map((component) => {
                    return (
                      <td
                        className={cellClasses}
                        key={component.illustrationType}
                      >
                        {getMonthlyAmount(component)
                          ? getMonthlyAmount(component)
                          : t('common.amount-unavailable')}{' '}
                        {t('common.a-month')}
                      </td>
                    );
                  }),
                )}
              </tr>

              <tr className={rowClasses}>
                <td className={twMerge(cellClasses, 'font-bold')}>
                  {t('pages.pension-details.details.payable-date')}
                </td>
                {data.map(({ illustrationComponents }) =>
                  illustrationComponents.map((comp) => {
                    const payableDetails =
                      comp.payableDetails as RecurringIncomeDetails;
                    return (
                      <td className={cellClasses} key={comp.illustrationType}>
                        {payableDetails ? (
                          <>
                            {!payableDetails.lastPaymentDate && 'From '}
                            {formatDate(payableDetails.payableDate)}
                            {payableDetails.lastPaymentDate &&
                              ' - ' +
                                formatDate(payableDetails.lastPaymentDate)}
                          </>
                        ) : (
                          'date unavailable'
                        )}
                      </td>
                    );
                  }),
                )}
              </tr>
            </>
          )}

          <PensionDCPotRow data={data} />
        </tbody>
      </table>
    </div>
  ) : null;
};
