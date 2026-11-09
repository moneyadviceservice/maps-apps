import { PensionType } from '../../constants';
import type { PensionArrangement } from '../../types';

export const isCashBalanceLumpSum = (data: PensionArrangement) => {
  const { pensionType, detailData } = data;

  return (
    pensionType === PensionType.CB &&
    !!detailData?.standardPayment?.lumpSumAmount &&
    detailData.standardPayment.lumpSumAmount > 0
  );
};
