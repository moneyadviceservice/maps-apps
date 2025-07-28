import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationType, NO_DATA, PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  formatDate,
  getAnnualAmount,
  getLatestIllustration,
  getMonthlyAmount,
  getPotValue,
  getTaxFreeLumpSum,
} from '../../lib/utils';
import { getPayableDate } from '../../lib/utils/getPayableDate';
import { DetailsDesktop } from './DetailsDesktop';
import { DetailsMobile } from './DetailsMobile';

export type Row = {
  title: string;
  currentValue: string;
  retirementValue: string;
};

type PensionDetailMoreInfoProps = {
  data: PensionArrangement;
};

export const PensionDetailsSection = ({ data }: PensionDetailMoreInfoProps) => {
  const { t } = useTranslation();

  if (!data.benefitIllustrations) {
    return null;
  }

  const createDetails = (type: IllustrationType) => {
    const latest = getLatestIllustration(type, data);
    const illustration = data.benefitIllustrations?.find((b) =>
      b.illustrationComponents.some((c) => c.illustrationType === type),
    );

    return {
      monthly: getMonthlyAmount(latest)
        ? `${getMonthlyAmount(latest)} ${t('common.a-month')}`
        : NO_DATA,
      annual: getAnnualAmount(latest)
        ? `${getAnnualAmount(latest)} ${t('common.a-year')}`
        : NO_DATA,
      potValue: getPotValue(illustration ?? null, type) ?? NO_DATA,
      taxFreeLumpSum: getTaxFreeLumpSum(latest) ?? NO_DATA,
      payableDate:
        getPayableDate(latest) ??
        (data.retirementDate ? formatDate(data.retirementDate) : NO_DATA),
    };
  };

  const current = createDetails(IllustrationType.AP);
  const retirement = createDetails(IllustrationType.ERI);

  const rows = [
    {
      title: 'annual-amount',
      currentValue: current.annual,
      retirementValue: retirement.annual,
    },
    {
      title: 'monthly-amount',
      currentValue: current.monthly,
      retirementValue: retirement.monthly,
    },
    data.pensionType === PensionType.DC && {
      title: 'pot-value',
      currentValue: current.potValue,
      retirementValue: retirement.potValue,
    },
    data.pensionType === PensionType.DB && {
      title: 'tax-free-lump-sum',
      currentValue: current.taxFreeLumpSum,
      retirementValue: retirement.taxFreeLumpSum,
    },
    data.pensionType === PensionType.SP && {
      title: 'payable-date',
      currentValue: current.payableDate,
      retirementValue: retirement.payableDate,
    },
  ].filter(Boolean) as Row[];

  return (
    <>
      <DetailsDesktop data={rows} type={data.pensionType} />
      <DetailsMobile data={rows} type={data.pensionType} />
    </>
  );
};
