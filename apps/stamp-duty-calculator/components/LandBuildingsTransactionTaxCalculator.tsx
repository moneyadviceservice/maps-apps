import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import {
  landBuildingsTransactionTaxConfig,
  LandTransactionTaxInput,
} from '../data/lbtt/landBuildingsTransactionTaxConfig';
import { BaseCalculator } from './BaseCalculator';

type Props = {
  propertyPrice: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
};

export const LandBuildingsTransactionTaxCalculator = ({
  propertyPrice,
  buyerType,
  calculated,
  analyticsData,
  isEmbedded,
}: Props) => {
  const initialValues: Partial<LandTransactionTaxInput> = {
    buyerType: buyerType ?? '',
    price: propertyPrice ?? '',
  };

  return (
    <BaseCalculator
      config={landBuildingsTransactionTaxConfig}
      initialValues={initialValues}
      calculated={calculated}
      analyticsData={analyticsData}
      isEmbedded={isEmbedded}
    />
  );
};
