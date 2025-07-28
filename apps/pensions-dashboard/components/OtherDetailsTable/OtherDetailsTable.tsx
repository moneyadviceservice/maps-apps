import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationType, NO_DATA } from '../../lib/constants';
import { PensionArrangement, RecurringIncomeDetails } from '../../lib/types';
import { formatDate, getLatestIllustration } from '../../lib/utils';
import { DetailRow } from '../PensionDetailRow';
import { TableSection } from '../TableSection';

const cellClasses =
  'pb-3 md:pt-[14px] md:pb-4 text-left align-top max-md:block';

type OtherDetailsTableProps = {
  data: PensionArrangement;
};
export const OtherDetailsTable = ({ data }: OtherDetailsTableProps) => {
  const { t } = useTranslation();

  const eriIllustration = getLatestIllustration(IllustrationType.ERI, data);
  const apIllustration = getLatestIllustration(IllustrationType.AP, data);

  const eriPayableDetails =
    eriIllustration?.payableDetails as RecurringIncomeDetails;

  const apPayableDetails =
    apIllustration?.payableDetails as RecurringIncomeDetails;

  const eriType = ' (ERI)';
  const apType = ' (AP)';

  const yesNo = (value: boolean) => (value ? t('common.yes') : t('common.no'));

  return (
    <TableSection heading={t('pages.pension-details.headings.other-details')}>
      <tbody className="max-md:block">
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.calculation-method`) +
            eriType
          }
        >
          <td className={cellClasses} data-testid="calculation-method-eri">
            {eriIllustration?.calculationMethod
              ? t(
                  `data.pensions.calculation-method.${eriIllustration.calculationMethod}`,
                )
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.calculation-method`) + apType
          }
        >
          <td className={cellClasses} data-testid="calculation-method-ap">
            {apIllustration?.calculationMethod
              ? t(
                  `data.pensions.calculation-method.${apIllustration.calculationMethod}`,
                )
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.amount-type`) + eriType
          }
        >
          <td className={cellClasses} data-testid="amount-type-eri">
            {eriPayableDetails?.amountType
              ? t(`data.pensions.amount-type.${eriPayableDetails.amountType}`)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.amount-type`) + apType
          }
        >
          <td className={cellClasses} data-testid="amount-type-ap">
            {apPayableDetails?.amountType
              ? t(`data.pensions.amount-type.${apPayableDetails.amountType}`)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.last-payment-date`) + eriType
          }
        >
          <td className={cellClasses} data-testid="last-payment-eri">
            {eriPayableDetails?.lastPaymentDate
              ? formatDate(eriPayableDetails.lastPaymentDate)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.last-payment-date`) + apType
          }
        >
          <td className={cellClasses} data-testid="last-payment-ap">
            {apPayableDetails?.lastPaymentDate
              ? formatDate(apPayableDetails.lastPaymentDate)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t(`pages.pension-details.other-details.increase`) + eriType}
        >
          <td className={cellClasses} data-testid="increasing-eri">
            {eriPayableDetails ? yesNo(eriPayableDetails.increasing) : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={t(`pages.pension-details.other-details.increase`) + apType}
        >
          <td className={cellClasses} data-testid="increasing-ap">
            {apPayableDetails ? yesNo(apPayableDetails.increasing) : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.survivor-benefit`) + eriType
          }
        >
          <td className={cellClasses} data-testid="survivor-benefit-eri">
            {eriIllustration?.survivorBenefit !== undefined
              ? yesNo(eriIllustration.survivorBenefit)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.survivor-benefit`) + apType
          }
        >
          <td className={cellClasses} data-testid="survivor-benefit-ap">
            {apIllustration?.survivorBenefit !== undefined
              ? yesNo(apIllustration.survivorBenefit)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.safeguarded-benefit`) +
            eriType
          }
        >
          <td className={cellClasses} data-testid="safeguarded-benefit-eri">
            {eriIllustration?.safeguardedBenefit !== undefined
              ? yesNo(eriIllustration.safeguardedBenefit)
              : NO_DATA}
          </td>
        </DetailRow>
        <DetailRow
          heading={
            t(`pages.pension-details.other-details.safeguarded-benefit`) +
            apType
          }
        >
          <td className={cellClasses} data-testid="safeguarded-benefit-ap">
            {apIllustration?.safeguardedBenefit !== undefined
              ? yesNo(apIllustration.safeguardedBenefit)
              : NO_DATA}
          </td>
        </DetailRow>

        <DetailRow
          heading={t(`pages.pension-details.other-details.warning`) + eriType}
        >
          <td className={cellClasses} data-testid="warning-eri">
            {eriIllustration?.illustrationWarnings !== undefined
              ? eriIllustration.illustrationWarnings.join(', ')
              : NO_DATA}
          </td>
        </DetailRow>

        <DetailRow
          heading={t(`pages.pension-details.other-details.warning`) + apType}
        >
          <td className={cellClasses} data-testid="warning-ap">
            {apIllustration?.illustrationWarnings !== undefined
              ? apIllustration.illustrationWarnings.join(', ')
              : NO_DATA}
          </td>
        </DetailRow>
      </tbody>
    </TableSection>
  );
};
