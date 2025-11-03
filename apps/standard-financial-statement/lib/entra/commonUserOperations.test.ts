import { getIronSession } from 'iron-session';
import { getUsersInBulk } from 'lib/entra/getUsersInBulk';
import { NextApiRequest, NextApiResponse } from 'next';
import { IronSessionObject } from 'types/iron-session';

import { handleCommonUserLookup } from './commonUserOperations';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}));
jest.mock('lib/auth/sessionCookieConfig', () => ({
  sessionCookieConfig: {},
}));
jest.mock('lib/entra/getUsersInBulk', () => ({
  getUsersInBulk: jest.fn(),
}));

interface MockUserData {
  id: string;
  userPrincipalName: string;
}

describe('handleCommonUserLookup', () => {
  let mockReq: NextApiRequest;
  let mockRes: NextApiResponse;

  const mockGetIronSession = getIronSession as jest.MockedFunction<
    typeof getIronSession
  >;
  const mockGetUsersInBulk = getUsersInBulk as jest.MockedFunction<
    typeof getUsersInBulk
  >;

  beforeEach(() => {
    mockReq = {
      body: { users: [{ email: 'user1@example.com' }] },
    } as NextApiRequest;
    mockRes = {} as NextApiResponse;

    jest.clearAllMocks();

    mockGetIronSession.mockResolvedValue({
      userId: 'testUser',
      isAuthenticated: true,
      isAdmin: true,
    } as IronSessionObject);

    mockGetUsersInBulk.mockResolvedValue([
      { id: 'user1id', userPrincipalName: 'user1@example.com' } as MockUserData,
    ]);
  });

  it('should return Forbidden if user is not authenticated', async () => {
    mockGetIronSession.mockResolvedValue({
      isAuthenticated: false,
    } as IronSessionObject);

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({ status: 403, message: 'Forbidden' });
    expect(mockGetUsersInBulk).not.toHaveBeenCalled();
  });

  it('should return Forbidden if user is authenticated but not an admin', async () => {
    mockGetIronSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false,
    } as IronSessionObject);

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({ status: 403, message: 'Forbidden' });
    expect(mockGetUsersInBulk).not.toHaveBeenCalled();
  });

  it('should return 400 if "users" array is missing from body', async () => {
    mockReq.body = {};

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({
      status: 400,
      message:
        'Invalid request body: "users" must be a non-empty array of email addresses or IDs.',
    });
    expect(mockGetUsersInBulk).not.toHaveBeenCalled();
  });

  it('should return 400 if "users" is an empty array', async () => {
    mockReq.body = { users: [] };

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({
      status: 400,
      message:
        'Invalid request body: "users" must be a non-empty array of email addresses or IDs.',
    });
    expect(mockGetUsersInBulk).not.toHaveBeenCalled();
  });

  it('should return 400 if "users" is not an array', async () => {
    mockReq.body = { users: 'not-an-array' };

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({
      status: 400,
      message:
        'Invalid request body: "users" must be a non-empty array of email addresses or IDs.',
    });
    expect(mockGetUsersInBulk).not.toHaveBeenCalled();
  });

  it('should return valid users if lookup is successful for all', async () => {
    const mockUserData1: MockUserData = {
      id: 'user1id',
      userPrincipalName: 'test1@example.com',
    };
    const mockUserData2: MockUserData = {
      id: 'user2id',
      userPrincipalName: 'test2@example.com',
    };
    mockReq.body = {
      users: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
    };
    mockGetUsersInBulk.mockResolvedValue([mockUserData1, mockUserData2]);

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(mockGetUsersInBulk).toHaveBeenCalledWith([
      'test1@example.com',
      'test2@example.com',
    ]);
    expect(result.validUsers).toEqual([mockUserData1, mockUserData2]);
    expect(result.errorResponse).toBeUndefined();
  });

  it('should return 400 if any user lookup fails with an error', async () => {
    const mockUserData1: MockUserData = {
      id: 'user1id',
      userPrincipalName: 'test1@example.com',
    };
    const mockError = new Error('User not found: test2@example.com');
    mockReq.body = {
      users: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
    };
    mockGetUsersInBulk.mockResolvedValue([mockUserData1, mockError]);

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([
      { id: 'user1id', userPrincipalName: 'test1@example.com' },
    ]);
    expect(result.errorResponse).toEqual({
      status: 400,
      message: 'One or more user lookups failed.',
      details: ['User not found: test2@example.com'],
    });
  });

  it('should return 404 if no valid users are found after lookup', async () => {
    const mockError1 = new Error('User not found: test1@example.com');
    const mockError2 = new Error('User not found: test2@example.com');
    mockReq.body = {
      users: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }],
    };
    mockGetUsersInBulk.mockResolvedValue([mockError1, mockError2]);

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({
      details: [
        'User not found: test1@example.com',
        'User not found: test2@example.com',
      ],
      status: 404,
      message: 'No valid users found.',
    });
  });

  it('should handle unexpected errors during lookup', async () => {
    const unexpectedError = new Error('Network timeout');
    mockGetUsersInBulk.mockRejectedValue(unexpectedError);

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({
      status: 500,
      message: 'An unexpected server error occurred during the lookup process.',
      details: ['Network timeout'],
    });
  });

  it('should return 400 if request body is invalid JSON', async () => {
    Object.defineProperty(mockReq, 'body', {
      get() {
        throw new Error('Malformed JSON');
      },
    });

    const result = await handleCommonUserLookup(mockReq, mockRes);

    expect(result.validUsers).toEqual([]);
    expect(result.errorResponse).toEqual({
      status: 400,
      message: 'Invalid JSON body.',
    });
  });
});
