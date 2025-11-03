import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import {
  landTransactionTaxConfig,
  LandTransactionTaxInput,
} from '../data/ltt/landTransactionTaxConfig';
import { constructPurchaseDate } from '../utils/dateUtils';
import { BaseCalculator } from './BaseCalculator';

type Props = {
  propertyPrice: string;
  buyerType: 'firstOrNextHome' | 'additionalHome';
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
  day?: string;
  month?: string;
  year?: string;
};

export const LandTransactionTaxCalculator = ({
  propertyPrice,
  buyerType,
  calculated,
  analyticsData,
  isEmbedded,
  day,
  month,
  year,
}: Props) => {
  const initialValues: Partial<LandTransactionTaxInput> = {
    buyerType: buyerType ?? '',
    price: propertyPrice ?? '',
    purchaseDate: constructPurchaseDate(day, month, year),
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
