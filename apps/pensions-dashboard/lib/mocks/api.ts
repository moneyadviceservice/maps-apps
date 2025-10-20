import {
  MatchType,
  PensionsCategory,
  PensionsRetrievalStatus,
  PensionType,
} from '../constants';
import { PensionArrangement, UserSession } from '../types';
import {
  PensionsByCategory,
  PensionsStatus,
  PensionsSummary,
} from '../types/api-responses';

export const baseUserSession: UserSession = {
  userSessionId: 'test-session-id',
  authorizationCode: 'test-auth-code',
};

export const fullUserSession: UserSession = {
  userSessionId: 'test-session-id',
  authorizationCode: 'test-auth-code',
  sessionStart: '1000000000',
};

export const mockPensionsStatus: PensionsStatus = {
  predictedTotalDataRetrievalTime: 10,
  predictedRemainingDataRetrievalTime: 10,
  pensionsDataRetrievalComplete: true,
};

export const mockPensionsSummary: PensionsSummary = {
  isPensionRetrievalComplete: true,
  pensions: [
    {
      pei: 'pension1',
      schemeName: 'Scheme 1',
      category: PensionsCategory.CONFIRMED,
      pensionType: PensionType.DC,
      hasIncome: false,
      administratorName: 'Admin 1',
      retrievalStatus: PensionsRetrievalStatus.COMPLETED,
    },
    {
      pei: 'pension2',
      schemeName: 'Scheme 2',
      category: PensionsCategory.PENDING,
      pensionType: PensionType.DB,
      hasIncome: false,
      administratorName: 'Admin 2',
      retrievalStatus: PensionsRetrievalStatus.COMPLETED,
    },
    {
      pei: 'pension3',
      schemeName: 'Scheme 3',
      category: PensionsCategory.CONFIRMED,
      pensionType: PensionType.SP,
      hasIncome: true,
      administratorName: 'Admin 3',
      retrievalStatus: PensionsRetrievalStatus.COMPLETED,
    },
    {
      pei: 'pension4',
      schemeName: 'Scheme 4',
      category: PensionsCategory.UNSUPPORTED,
      pensionType: PensionType.AVC,
      hasIncome: false,
      administratorName: 'Admin 4',
      retrievalStatus: PensionsRetrievalStatus.COMPLETED,
    },
    {
      pei: 'pension5',
      schemeName: 'Scheme 5',
      category: PensionsCategory.ERROR,
      pensionType: PensionType.DB,
      hasIncome: false,
      administratorName: 'Admin 5',
      retrievalStatus: PensionsRetrievalStatus.COMPLETED,
    },
  ],
};

export const mockPensionDetailById: PensionArrangement = {
  externalPensionPolicyId: 'pension1',
  externalAssetId: 'asset1',
  matchType: MatchType.DEFN,
  schemeName: 'Scheme 1',
  contactReference: 'Contact-1',
  pensionType: PensionType.DB,
  pensionAdministrator: {
    name: 'Admin 1',
    contactMethods: [
      {
        preferred: true,
        contactMethodDetails: {
          email: 'admin1@example.com',
        },
      },
    ],
  },
  contributionsFromMultipleEmployers: false,
};

export const mockPensionsByCategory: PensionsByCategory = {
  totalContactPensions: 1,
  isPensionRetrievalComplete: true,
  arrangements: [[mockPensionDetailById]],
};
