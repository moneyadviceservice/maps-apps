import { baseCompleteState, baseState } from 'lib/ci/selfServeE2eConstants';

import {
  getE2eFirmUpdateObject,
  MockRequestTypes,
} from './getE2eFirmUpdateObject';

jest.mock('lib/ci/selfServeE2eConstants', () => ({
  baseState: { id: 'base-state' },
  baseCompleteState: { id: 'complete-state' },
}));

describe('getE2eFirmUpdateObject', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.spyOn(console, 'error').mockImplementation(() => {
      /** No empty */
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns unauthorized error when process.env.CI is not "true"', async () => {
    process.env.CI = 'false';

    const result = await getE2eFirmUpdateObject(
      MockRequestTypes.SET_EMPTY_SELF_SERVE_STATE,
    );

    expect(result).toEqual({ error: 'Unauthorized', success: false });
  });

  it('returns baseState for SET_EMPTY_SELF_SERVE_STATE', async () => {
    process.env.CI = 'true';

    const result = await getE2eFirmUpdateObject(
      MockRequestTypes.SET_EMPTY_SELF_SERVE_STATE,
    );

    expect(result).toEqual({ data: baseState, success: true });
  });

  it('returns hidden state for SET_COMPLETED_HIDDEN_SELF_SERVE_STATE', async () => {
    process.env.CI = 'true';

    const result = await getE2eFirmUpdateObject(
      MockRequestTypes.SET_COMPLETED_HIDDEN_SELF_SERVE_STATE,
    );

    expect(result).toEqual({
      data: { ...baseCompleteState, status: 'hidden' },
      success: true,
    });
  });

  it('returns active state for SET_COMPLETED_ACTIVE_SELF_SERVE_STATE', async () => {
    process.env.CI = 'true';

    const result = await getE2eFirmUpdateObject(
      MockRequestTypes.SET_COMPLETED_ACTIVE_SELF_SERVE_STATE,
    );

    expect(result).toEqual({
      data: {
        ...baseCompleteState,
        status: 'active',
        cover_service_confirmed_at: '2026-06-10T08:35:11.321Z',
        customer_contact_confirmed_at: '2026-06-10T08:35:11.321Z',
      },
      success: true,
    });
  });

  it('returns hidden Invalid_FCA state for SET_FCA_UNAUTHORISED_SELF_SERVE_STATE', async () => {
    process.env.CI = 'true';

    const result = await getE2eFirmUpdateObject(
      MockRequestTypes.SET_FCA_UNAUTHORISED_SELF_SERVE_STATE,
    );

    expect(result).toEqual({
      data: {
        ...baseState,
        status: 'hidden',
        hidden_reason: 'Invalid_FCA',
      },
      success: true,
    });
  });

  it('returns baseState for SET_INVALID_TRADING_NAME_SELF_SERVE_STATE', async () => {
    process.env.CI = 'true';

    const result = await getE2eFirmUpdateObject(
      MockRequestTypes.SET_INVALID_TRADING_NAME_SELF_SERVE_STATE,
    );

    expect(result).toEqual({ data: baseState, success: true });
  });
});
