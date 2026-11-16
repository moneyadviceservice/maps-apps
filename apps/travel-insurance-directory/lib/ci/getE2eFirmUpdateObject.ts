import { baseCompleteState, baseState } from 'lib/ci/selfServeE2eConstants';
import { HIDDEN_DUE_TO_FCA } from 'lib/firms/fcaVisibility';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export enum MockRequestTypes {
  SET_EMPTY_SELF_SERVE_STATE = 'setEmptySelfServeState',
  SET_COMPLETED_HIDDEN_SELF_SERVE_STATE = 'setCompletedHiddenSelfServeState',
  SET_COMPLETED_ACTIVE_SELF_SERVE_STATE = 'setCompletedActiveSelfServeState',
  SET_FCA_UNAUTHORISED_SELF_SERVE_STATE = 'setFcaUnauthorisedSelfServeState',
  SET_INVALID_TRADING_NAME_SELF_SERVE_STATE = 'setInvalidTradingNameSelfServeState',
}

export const getE2eFirmUpdateObject = async (
  accountMockRequest: MockRequestTypes,
): Promise<
  | { data: Partial<TravelInsuranceFirmDocument>; success: true }
  | { error: string; success: false }
> => {
  if (process.env.CI !== 'true') {
    console.error('Unauthorized attempt to reset ss data');
    return { error: 'Unauthorized', success: false };
  }

  switch (accountMockRequest) {
    case MockRequestTypes.SET_EMPTY_SELF_SERVE_STATE:
      return { data: baseState, success: true };
    case MockRequestTypes.SET_COMPLETED_HIDDEN_SELF_SERVE_STATE:
      return {
        data: { ...baseCompleteState, status: 'hidden' },
        success: true,
      };
    case MockRequestTypes.SET_COMPLETED_ACTIVE_SELF_SERVE_STATE:
      return {
        data: {
          ...baseCompleteState,
          status: 'active',
          cover_service_confirmed_at: '2026-06-10T08:35:11.321Z',
          customer_contact_confirmed_at: '2026-06-10T08:35:11.321Z',
        },
        success: true,
      };
    case MockRequestTypes.SET_FCA_UNAUTHORISED_SELF_SERVE_STATE:
      return {
        data: {
          ...baseState,
          status: 'hidden',
          hidden_reason: HIDDEN_DUE_TO_FCA,
        },
        success: true,
      };
    case MockRequestTypes.SET_INVALID_TRADING_NAME_SELF_SERVE_STATE:
      return { data: baseState, success: true };
    default:
      return { data: baseState, success: true };
  }
};
