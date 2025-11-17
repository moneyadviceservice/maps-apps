import useTranslation from '@maps-react/hooks/useTranslation';

import { IllustrationType, NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  getAnnualAmount,
  getLatestIllustration,
  getMonthlyAmount,
  getPayableDate,
} from '../../lib/utils/data';
import { formatDate } from '../../lib/utils/ui';
import { TableDesktop } from './TableDesktop';
import { TableMobile } from './TableMobile';
import { Row } from './types';

type PensionDetailMoreInfoProps = {
  data: PensionArrangement;
};

export const PensionDetailStatePensionTable = ({
  data,
}: PensionDetailMoreInfoProps) => {
  const { t } = useTranslation();

  if (!data.benefitIllustrations) {
    return null;
  }

  const createDetails = (type: IllustrationType) => {
    const latest = getLatestIllustration(type, data);

    return {
      monthly: getMonthlyAmount(latest)
        ? `${getMonthlyAmount(latest)} ${t('common.a-month')}`
        : NO_DATA,
      annual: getAnnualAmount(latest)
        ? `${getAnnualAmount(latest)} ${t('common.a-year')}`
        : NO_DATA,
      payableDate:
        getPayableDate(latest) ??
        (data.retirementDate ? formatDate(data.retirementDate) : NO_DATA),
    };
  };

  const current = createDetails(IllustrationType.AP);
  const retirement = createDetails(IllustrationType.ERI);

  const rows = [
    {
      title: 'estimate-today',
      monthlyAmount: current.monthly,
      yearlyAmount: current.annual,
      payableDate: current.payableDate,
    },
    {
      title: 'forecast',
      monthlyAmount: retirement.monthly,
      yearlyAmount: retirement.annual,
      payableDate: retirement.payableDate,
    },
  ].filter(Boolean) as Row[];

  return (
    <div className="mt-10 md:mt-16">
      <TableDesktop data={rows} />
      <TableMobile data={rows} />
    </div>
  );
};
