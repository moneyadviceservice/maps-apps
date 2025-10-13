import {
  PensionsCategory,
  PensionsRetrievalStatus,
  PensionType,
} from '../constants';
import { UserSession } from '../types';
import { PensionsStatus, PensionsSummary } from '../types/api-responses';

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
