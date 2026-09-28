import { BenefitType, MatchType, PensionType } from '../../constants';
import { PaymentSummary, PensionArrangement } from '../../types';

const getSummaryPayments = (
  standardPayment?: PaymentSummary,
  legacyPayment?: PaymentSummary,
  alternativePayment?: PaymentSummary,
) => [
  ...(standardPayment ? [standardPayment] : []),
  ...(legacyPayment && alternativePayment
    ? [legacyPayment, alternativePayment]
    : []),
];

export const hasAvailableSummaryValue = (data: PensionArrangement) => {
  const isSysOrNewMatch =
    data.matchType === MatchType.SYS || data.matchType === MatchType.NEW;

  if (isSysOrNewMatch) {
    return false;
  }

  const { standardPayment, legacyPayment, alternativePayment } =
    data.detailData || {};

  const hasMonthlyAmount = getSummaryPayments(
    standardPayment,
    legacyPayment,
    alternativePayment,
  ).some((payment) => payment.monthlyAmount && payment.monthlyAmount > 0);

  const isCashBalanceLump =
    data.pensionType === PensionType.CB &&
    standardPayment?.benefitType === BenefitType.CBL &&
    !!standardPayment?.lumpSumAmount &&
    standardPayment.lumpSumAmount > 0;

  return hasMonthlyAmount || isCashBalanceLump;
};
