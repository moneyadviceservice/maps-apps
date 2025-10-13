import {
  PensionsCategory,
  PensionsRetrievalStatus,
  PensionType,
} from '../constants';

export type PensionsStatus = {
  predictedTotalDataRetrievalTime: number;
  predictedRemainingDataRetrievalTime: number;
  pensionsDataRetrievalComplete: boolean;
};

export type PensionsSummaryArrangement = {
  pei: string;
  schemeName: string;
  category: PensionsCategory;
  retrievalStatus: PensionsRetrievalStatus;
  pensionType: PensionType;
  hasIncome: boolean;
  administratorName: string;
};

export type PensionsSummary = {
  isPensionRetrievalComplete: boolean;
  pensions: PensionsSummaryArrangement[];
};
