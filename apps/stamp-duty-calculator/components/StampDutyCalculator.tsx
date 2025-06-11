import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import {
  stampDutyCalculatorConfig,
  StampDutyInput,
} from '../data/sdlt/stampDutyCalculatorConfig';
import { BaseCalculator } from './BaseCalculator';

type Props = {
  propertyPrice: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
};

export const StampDutyCalculator = ({
  propertyPrice,
  buyerType,
  calculated,
  analyticsData,
  isEmbedded,
}: Props) => {
  const initialValues: Partial<StampDutyInput> = {
    buyerType: buyerType ?? '',
    price: propertyPrice ?? '',
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
