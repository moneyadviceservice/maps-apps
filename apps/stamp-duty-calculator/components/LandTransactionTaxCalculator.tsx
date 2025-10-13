import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import {
  landTransactionTaxConfig,
  LandTransactionTaxInput,
} from '../data/ltt/landTransactionTaxConfig';
import { BaseCalculator } from './BaseCalculator';

type Props = {
  propertyPrice: string;
  buyerType: 'firstOrNextHome' | 'additionalHome';
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
};

export const LandTransactionTaxCalculator = ({
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
      config={landTransactionTaxConfig}
      initialValues={initialValues}
      calculated={calculated}
      analyticsData={analyticsData}
      isEmbedded={isEmbedded}
    />
  );
};
