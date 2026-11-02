import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import {
  landBuildingsTransactionTaxConfig,
  LandTransactionTaxInput,
} from '../data/lbtt/landBuildingsTransactionTaxConfig';
import { constructPurchaseDate } from '../utils/dateUtils';
import { BaseCalculator } from './BaseCalculator';

type Props = {
  propertyPrice: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
  day?: string;
  month?: string;
  year?: string;
};

export const LandBuildingsTransactionTaxCalculator = ({
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
      config={landBuildingsTransactionTaxConfig}
      initialValues={initialValues}
      calculated={calculated}
      analyticsData={analyticsData}
      isEmbedded={isEmbedded}
    />
  );
};
