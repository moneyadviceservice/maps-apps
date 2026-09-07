/**
 * @jest-environment node
 */

import { NextApiRequest, NextApiResponse } from 'next/types';

import Cookies from 'cookies';
import { FormFlowType } from 'data/form-data/org_signup';
import * as notify from 'lib/notify/sfs-organisation-created';
import * as createOrg from 'lib/organisations/createOrganisation';
import * as store from 'utils/store';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

import handler from './user-sign-up';

jest.mock('cookies');
jest.mock('@maps-react/entra-id/entraIdService');
jest.mock('lib/organisations');
jest.mock('lib/organisations/createOrganisation');
jest.mock('lib/organisations/updateOrganisation');
jest.mock('lib/notify/sfs-organisation-created');
jest.mock('utils/store');

const newOrgUserBody = {
  emailAddress: 'user@example.com',
  formFlowType: FormFlowType.NEW_ORG,
};

describe('/api/user-sign-up', () => {
  let req: NextApiRequest;
  let res: NextApiResponse;
  let mockCookies: jest.Mocked<Cookies>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockCookies = {
      get: jest.fn().mockReturnValue('session123'),
      set: jest.fn(),
    } as unknown as jest.Mocked<Cookies>;
    (Cookies as unknown as jest.Mock).mockImplementation(() => mockCookies);

    req = {
      method: 'POST',
      body: {},
      headers: {},
    } as unknown as NextApiRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;
  });

  // ---------- INITIAL SIGN-UP FLOW ----------

  it('returns 400 if startSignUp fails', async () => {
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: { data: { flow: FormFlowType.NEW_ORG } },
      store: { setJSON: jest.fn() },
    });
    (entraIdService.startSignUp as jest.Mock).mockResolvedValue({
      success: false,
      error: 'invalid_email',
    });

    req.body = newOrgUserBody;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      name: 'emailAddress',
      error: 'invalid_email',
    });
  });

  it('returns 200 and otpSent true on success', async () => {
    const mockSetJSON = jest.fn();
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: { data: { flow: FormFlowType.NEW_ORG } },
      store: { setJSON: mockSetJSON },
    });
    (entraIdService.startSignUp as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 'abc123',
    });
    (entraIdService.getChallenge as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 'challenge123',
    });

    req.body = newOrgUserBody;

    await handler(req, res);

    expect(entraIdService.startSignUp).toHaveBeenCalledWith('user@example.com');
    expect(mockSetJSON).toHaveBeenCalledWith('session123', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ otpSent: true });
  });

  it('returns 500 if getChallenge fails', async () => {
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: { data: { flow: FormFlowType.NEW_ORG } },
      store: { setJSON: jest.fn() },
    });
    (entraIdService.startSignUp as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 'abc123',
    });
    (entraIdService.getChallenge as jest.Mock).mockResolvedValue({
      success: false,
    });

    req.body = newOrgUserBody;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get challenge' });
  });

  // ---------- OTP VERIFICATION FLOW ----------

  it('returns 400 if no session', async () => {
    mockCookies.get.mockReturnValue(undefined);
    req.body = { otp: '123456' };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Session not found.' });
  });

  it('returns 400 if missing continuation token', async () => {
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: { data: { flow: FormFlowType.NEW_ORG } },
    });
    req.body = { otp: '123456' };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Continuation token missing. Please try again.',
    });
  });

  it('returns 400 on invalid OTP', async () => {
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {
        continuation_token: 'abc',
        data: { flow: FormFlowType.NEW_ORG },
      },
    });
    (entraIdService.submitOtp as jest.Mock).mockResolvedValue({
      success: false,
      error: 'invalid_otp',
    });

    req.body = {
      otp: '999999',
      emailAddress: 'user@example.com',
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      name: 'otp',
      error: 'invalid_otp',
    });
  });

  it('returns 400 if password banned', async () => {
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {
        continuation_token: 'otp123',
        data: { flow: FormFlowType.NEW_ORG },
      },
    });
    (entraIdService.submitOtp as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 't1',
    });
    (entraIdService.submitAttributes as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 't2',
    });
    (entraIdService.submitPassword as jest.Mock).mockResolvedValue({
      success: false,
      suberror: 'password_banned',
    });

    req.body = {
      otp: '123456',
      emailAddress: 'user@email.com',
      password: 'badpass',
      firstName: 'John',
      lastName: 'Doe',
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      name: 'password',
      error: 'password_banned',
    });
  });

  it('completes OTP flow successfully for new org user', async () => {
    (store.getStoreEntry as jest.Mock).mockResolvedValue({
      entry: {
        continuation_token: 'otp123',
        data: { flow: FormFlowType.NEW_ORG },
      },
    });
    (entraIdService.submitOtp as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 't1',
    });
    (entraIdService.submitAttributes as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 't2',
    });
    (entraIdService.submitPassword as jest.Mock).mockResolvedValue({
      success: true,
      continuation_token: 't3',
    });
    (entraIdService.getToken as jest.Mock).mockResolvedValue({
      id_token: 'id.jwt.token',
    });
    (createOrg.createOrganisation as jest.Mock).mockResolvedValue({
      response: { name: 'Test Org', licence_number: 'L123' },
    });

    req.body = {
      otp: '123456',
      emailAddress: 'user@abcde.com',
      password: 'GoodPass!23',
      firstName: 'Jane',
      lastName: 'Smith',
      jobTitle: 'Admin',
      tel: '123456',
      organisationName: 'Test Org',
    };

    await handler(req, res);

    expect(createOrg.createOrganisation).toHaveBeenCalled();
    expect(notify.sfsSignUp).toHaveBeenCalled();
    expect(store.deleteStoreEntry).toHaveBeenCalled();
    expect(mockCookies.set).toHaveBeenCalledWith('fsid', '', { maxAge: 0 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        organisationName: 'Test Org',
        id_token: 'id.jwt.token',
      }),
    );
  });
});
