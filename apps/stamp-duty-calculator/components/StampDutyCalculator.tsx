import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import {
  stampDutyCalculatorConfig,
  StampDutyInput,
} from '../data/sdlt/stampDutyCalculatorConfig';
import { constructPurchaseDate } from '../utils/dateUtils';
import { BaseCalculator } from './BaseCalculator';

type Props = {
  propertyPrice: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
  day?: string | null;
  month?: string | null;
  year?: string | null;
};

export const StampDutyCalculator = ({
  propertyPrice,
  buyerType,
  calculated,
  analyticsData,
  isEmbedded,
  day,
  month,
  year,
}: Props) => {
  const initialValues: Partial<StampDutyInput> = {
    buyerType: buyerType ?? '',
    price: propertyPrice ?? '',
    purchaseDate: constructPurchaseDate(day, month, year),
  };

  return (
    <BaseCalculator
      config={stampDutyCalculatorConfig}
      initialValues={initialValues}
      calculated={calculated}
      analyticsData={analyticsData}
      isEmbedded={isEmbedded}
    />
  );
};
