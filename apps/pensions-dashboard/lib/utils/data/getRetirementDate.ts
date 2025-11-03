import { IllustrationType, NO_DATA } from '../../constants';
import { PensionArrangement } from '../../types';
import { formatDate } from '../ui/date';
import { getLatestIllustration } from './getLatestIllustration';

export const getRetirementDate = (data: PensionArrangement) => {
  const benefitIllustration = getLatestIllustration(IllustrationType.ERI, data);
  const dateToUse =
    benefitIllustration?.payableDetails?.payableDate ?? data.retirementDate;
  const retirementDate = dateToUse ? formatDate(dateToUse) : NO_DATA;

  return retirementDate;
};
