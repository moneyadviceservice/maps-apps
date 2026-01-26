import { IllustrationType, NO_DATA } from '../../constants';
import { PensionArrangement } from '../../types';
import { formatDate } from '../ui/date';
import { getLatestIllustration } from './getLatestIllustration';

/**
 * Get the payable date from the earliest payable ERI illustration from the most recent benefit illustration if one exists;
 * otherwise return the pension’s retirement date;
 * otherwise return NO_DATA
 * @param data
 * @returns a string representing a date or NO_DATA
 * @usage
 * const retirementDate = getRetirementDate(data)
 */
export const getRetirementDate = (data: PensionArrangement) => {
  const benefitIllustration = getLatestIllustration(IllustrationType.ERI, data);
  const dateToUse =
    benefitIllustration?.payableDetails?.payableDate ?? data.retirementDate;
  const retirementDate = dateToUse ? formatDate(dateToUse) : NO_DATA;

  return retirementDate;
};
