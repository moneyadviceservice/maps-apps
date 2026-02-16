import useTranslation from '@maps-react/hooks/useTranslation';

import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { currencyAmount, formatDate } from '../../lib/utils/ui';
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

  const illustration = data.detailData?.incomeAndValues?.find(
    (item) => item.bar,
  )?.bar;

  const createDetails = (type: 'eri' | 'ap') => {
    const illustrationToUse = illustration?.[type];
    const monthly =
      illustrationToUse?.monthlyAmount === undefined
        ? NO_DATA
        : `${currencyAmount(illustrationToUse.monthlyAmount)} ${t(
            'common.a-month',
          )}`;

    const annual =
      illustrationToUse?.annualAmount === undefined
        ? NO_DATA
        : `${currencyAmount(illustrationToUse.annualAmount)} ${t(
            'common.a-year',
          )}`;

    const payableDate = illustrationToUse?.payableDate
      ? formatDate(illustrationToUse.payableDate)
      : data.retirementDate
      ? formatDate(data.retirementDate)
      : NO_DATA;
    return {
      monthly: monthly,
      annual: annual,
      payableDate: payableDate,
    };
  };

  const current = createDetails('ap');
  const retirement = createDetails('eri');

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
